const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : String,
    description : String,
    price : Number,
    images : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],
    stock : {
        type : Number,
        default : 1
    },
    category : {
        type : String,
        required : true
    },
    type : String,
    createdAt : {
        type : Date,
        immutable : true,
        default : ()=> Date.now()
    },
    updatedAt : {
        type : Date,
        default : ()=> Date.now()
    } 
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;