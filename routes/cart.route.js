const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cart.controller')

// cart button handlers
cartRouter.get('/:id',cartController.getAddedProdcuts)

// add to cart
cartRouter.post('/addtocart',cartController.addToCart)
cartRouter.post('/removecart',cartController.removeCart)

// increase quantity of product in cart
cartRouter.post('/quantity',cartController.incDecQuantity);


module.exports = cartRouter