const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const Cart = require('../models/Cart')
const Products = require('../models/Products');
const User = require('../models/User');



const getAddedProdcuts = async (req,res)=>{

    let userId = req.params.id;
    try{    
        const cart = await Cart.findOne({userId: userId});
        const cartItems = cart.items;
        const totalPrice = cart.totalPrice;
        const totalItems = cart.totalItems;
        const totalProducts = cartItems.length;

        for(let i = 0; i < totalProducts; i++){
            prod = cartItems[i].productId
            let product = await Products.findOne({_id : prod});
            if(totalPrice == 0 && totalItems == 0){
                totalPrice += (product.price * cartItems[i].quantity);
                totalItems += cartItems[i].quantity;
            }
        }


        res.status(200).send({
            items : cart.items,
            totalPrice : totalPrice,
            totalItems : totalItems
        })

    }catch(err){
        res.status(500).send({
            message : "Error: " + err.message
        });
    }
    
}


const addToCart = async (req, res) => {

    const userId = req.query.userId;
    const productId = req.query.productId

    try {   
        const cart = await Cart.findOne({userId : userId});
        const cartItems = cart.items;
        for(let i = 0; i < cart.items.length; i++){
            prod = cartItems[i].productId
            if(prod == productId){
                res.status(200).send({
                    message : "Product already exists in the cart",
                    exists : true
                });
                return;
            }
        }
        const product = await Products.findOne({_id : productId});
        cart.items.push({
            productId : product._id,
            productName : product.name,
            productPrice : product.price,
            imageLink : product.images[0].url
        })

        cart.totalPrice += product.price ;
        cart.totalItems += 1;

        await cart.save();
        res.status(200).send({
            message : "Product added to the cart."
        });

    } catch (error) {
        res.status(500).send({
            message : "Error : " + error
        })
    }
    
}

const removeCart = async (req, res) => {
    const prodId = req.query.prodId;
    const userId = req.query.userId;
    
    try {
        const cart = await Cart.findOne({userId : userId});
        const cartItems = cart.items;

        for(let i = 0; i < cartItems.length; i++){
            prod = cartItems[i].productId;
            if(prod == prodId){
                let product = await Products.findOne({_id : prod});
                cart.totalPrice -= (product.price * cartItems[i].quantity);
                cart.totalItems -= cartItems[i].quantity;
                cartItems.splice(i,1);
            }
        }

        if(cart.totalPrice < 0){
            cart.totalPrice = 0;
        } 
        if(cart.totalItems < 0){
            cart.totalItems = 0;
        }

        cart.items = [...cartItems];
        await cart.save();

        res.status(200).send({
            message : "Product removed from cart.",
            items : cart.items,
            totalPrice : cart.totalPrice ,
            totalItems : cart.totalItems
        });

    } catch (error) {
        res.status(500).send({
            message : "Error : " + error.message
        })
    }
}

const incDecQuantity = async(req,res)=>{    
    const prodId = req.query.prodId;
    const userId = req.query.userId;
    const change = req.query.change;


    try {
        const cart = await Cart.findOne({userId : userId});
        const cartItems = cart.items;

        for(let i = 0; i < cartItems.length; i++){
            prod = cartItems[i].productId
            if(prod == prodId){
                let product = await Products.findOne({_id : prod});
                if(change == 'true'){
                    // increase product quantity
                    cartItems[i].quantity += 1
                    cart.totalPrice += product.price;    
                    cart.totalItems += 1;
                    break;
                }else if(change == 'false' && cartItems[i].quantity > 1){
                    // decrease product quantity
                    cartItems[i].quantity -= 1
                    cart.totalPrice -= product.price;    
                    cart.totalItems -= 1;
                    break;
                }else{
                    cart.totalPrice -= product.price;    
                    cart.totalItems -= 1;
                    cartItems.splice(i,1);
                    break;
                }
            }
        }

        if(cart.totalPrice < 0){
            cart.totalPrice = 0;
        } 
        if(cart.totalItems < 0){
            cart.totalItems = 0;
        }

        cart.items = cartItems;
        await cart.save();
        res.status(200).send({
            items : cart.items,
            totalPrice : cart.totalPrice ,
            totalItems : cart.totalItems
        });

    } catch (error) {
        res.status(500).send({
            message : "Error : " + error.message
        })
    }

}


module.exports = {
    getAddedProdcuts,
    addToCart,
    incDecQuantity,
    removeCart
}