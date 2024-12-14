const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const Product = require('../models/Products');
const cloudinary = require('cloudinary').v2;
const getDataUri = require('../utils/dataUri');


// for user if he wants to get all products
const getAllProducts = async (req, res, next) => {

    const min = Number(req.query.min);
    const max = Number(req.query.max);
    const sortedOrder = req.query.sortOrder
    const category = req.query.category;
    const searchText = req.query.searchText;

    try{
        let query = {};

        // search query for user search
        if(searchText){
            query.$or = [
                { name: { $regex: searchText, $options: 'i' } },
                { description: { $regex: searchText, $options: 'i' } },
                { category : { $regex: searchText, $options: 'i' }}
              ];
        }

        if(category){
            query.category = category;
        }

        if(min && max){
            query.price = {$gte: min, $lte: max}
        }else if(min){
            query.price = {$gte : min}
        }else if (max){
            query.price = {$lte : max}
        }

        let filteredResults = await Product.find(query);

        if(sortedOrder == "LtoH"){
            filteredResults = await Product.find(query).sort({ price: 1 }).exec();
        }else if (sortedOrder == "HtoL"){
            filteredResults = await Product.find(query).sort({ price: -1 }).exec();
        }else if(sortedOrder == "NF"){
            filteredResults = await Product.find(query).sort({ createdAt: -1 }).exec();
        }

        if(filteredResults.length < 1){
            res.status(400).send({
                message: "Products not found in database"
            })
            return;
        }
        res.status(200).send(filteredResults);
    }catch(e){
        res.status(500).send({
            Error : e.message
        })
    }
}

// for user when it clicks on a product
const getProductById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await Product.findOne({_id : id});
        if(product.length < 1){
            res.status(400).send({
                message: "Product not found in database"
            })
        }else{
            res.status(200).send(product);
        }
    } catch (error) {
        res.status(400).send({
            message : "Product not found",
        })
    }
}

const getProductsByCategory = async(req,res)=> {

    const category = req.params.category;   
    try {
        const filteredProducts = await Product.find({category: category})
        res.status(200).send(filteredProducts);
    } catch (error) {
        res.status(400).send({
            message : "Wrong category passed " + error.message
        })
    }
}

const customUploadfile = async (file) => {

    try {
        const result = await cloudinary.uploader.upload(file, { folder: 'Products' });
        return result;    
    } catch (error) {
        console.log("Error in customUploadfile : ", error.message);
    }
    
};

// for admin to insert a new product
const createProduct = async (req, res) => {

    const images = req.body.images;
    const imageUrls = [];
    try {
        await Promise.all(images.map(async (image) => {
            let result = await customUploadfile(image);
            let obj = {
                public_id: result.public_id,
                url: result.url
            };
            imageUrls.push(obj);
        }))
    } catch (error) {
        console.log("Error in adding images : ",error.message);
    };


    try {

        const product = await Product.create({
            name : req.body.name, 
            description : req.body.description, 
            price : req.body.price,
            stock : req.body.stock,
            category : req.body.category, 
            type : req.body.type,
            images : [...imageUrls]
        });
        res.status(200).send({
            message :"Product added successfully",
            product
        })
    } catch (error) {
        res.status(400).send({
            message : "Error: in creating a product " + error.message
        })
    }

}

// for admin to change the product stock inventory
const updateProduct = async (req, res, next) => {

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body,{
            new : true,
            runValidators : true,
            useFindAndModify : false
        })
        res.status(200).send({
            message : 'Product updated successfully',
            product
        })
    } catch (error) {
        res.status(400).send({
            message : "Product updation failed"
        })
    }

}

const deleteProduct = async (req, res, next) => {

    try {
        await Product.deleteOne({_id : req.params.id})
        res.status(200).send({
            message : "Product deleted successfully"
        })
    } catch (error) {
        res.status(400).send({
            message : "Product deletion failed"
        })
    }

}

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
}
