const mongoose = require('mongoose');
const Products = require('./Products')

const cartSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    items : [{
        productId : {
            type : mongoose.Schema.ObjectId,
            ref : "Products",
            required: true,
        },
        productName : String,
        productPrice : Number,
        imageLink : String,
        quantity : {
            type : Number,
            default : 1
        }
    },],
    totalItems : {
        type : Number,
        default : 0
    },
    totalPrice : {
        type : Number,
        default : 0
    },
    payment : {
        type : Boolean,
        default : false
    }
})

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart