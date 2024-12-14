const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateSignup = async (req,res,next)=>{

    if(!req.body.username || !req.body.email || !req.body.password){
        res.status(401).send({
            message :"Please provide all required information"
        });
        return ;
    }

    const isUserAlreadyExist = await User.findOne({email : req.body.email});
    if(isUserAlreadyExist){
        res.status(400).send({
            message : "User already exists"
        });
        return;
    }

    next();

}


const validateLogin = async (req,res,next) =>{

    const userBody = req.body;
    if(!userBody.email || !userBody.password){
        res.status(401).send({
            message :"Please provide all required information"
        });
        return ;
    }

    const userLogin = await User.findOne({
        email  : userBody.email
    });
    
    if(!userLogin){
        res.status(400).send({
            message : "Wrong email address provided"
        })
        return;
    }

    let validatePassword = bcrypt.compareSync(userBody.password, userLogin.password);
    if(!validatePassword){
        res.status(400).send({
            message : "Wrong password"
        })
        return;
    }
    next();

}

module.exports = {
    validateSignup,
    validateLogin
}