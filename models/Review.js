const mongoose = require('mongoose');
const User = require('./User')
const Product = require('./Products')

const reviewSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : "Product",
        required : true,
    },
    username : String,
    rating : Number,
    reviewDesc : String,
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

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;