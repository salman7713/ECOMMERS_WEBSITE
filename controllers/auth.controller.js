const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authSecretKey = require('../config/authConfig');
const app = express();
app.use(bodyParser.json());
const User = require("../models/User");
const Cart = require("../models/Cart");

const login = async(req,res)=>{

    const userBody = req.body;
    const userLogin = await User.findOne({
        email  : userBody.email
    });
    const token = jwt.sign({id : userLogin._id}, authSecretKey.secret_key, {
        expiresIn : 86400
    })
    if(userLogin){
        res.status(200).send({
            message : "User login successful",
            userId : userLogin._id,
            username : userLogin.username,
            email : userLogin.email,
            address : userLogin.address,
            token : token
        });
    }
}

const getUserInfo = async (req,res)=>{
    const userId = req.params.userId;
    try {
        const user = await User.findOne({_id : userId});
        res.status(200).send({
            user
        })
    } catch (error) {
        res.status(400).send({
            message : "Error  : " + error.message
        })
    }
}

const register = async(req,res)=>{
    const userBody = req.body;
    try { 
        const userCreated = await User.create({
            username : userBody.username,
            phone : userBody.phone,
            email : userBody.email,
            password : bcrypt.hashSync(userBody.password, 10),
            address : userBody.address
        })
        const userId = userCreated._id;
        await Cart.create({
            userId : userId,
            items : [],
        })
        res.status(200).send({
            message : "User registered successfully.",
            user : userCreated
        })
    } catch (error) {
        res.status(400).send({
            message : "Error  : " + error.message
        })
    }
}




module.exports = {
    register,
    login,
    getUserInfo
}