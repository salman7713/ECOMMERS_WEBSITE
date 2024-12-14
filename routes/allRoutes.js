const express = require('express');
const allrouter = express.Router();

const authRoute = require('./auth.route');
const productRouter = require('./product.route');
const cartRouter = require('./cart.route');
const reviewRouter = require('./review.route');

allrouter.use("/ecomm/api/v1/auth",authRoute);
allrouter.use('/ecomm/api/v1/products', productRouter);
allrouter.use('/ecomm/api/v1/cart', cartRouter);
allrouter.use('/ecomm/api/v1/review', reviewRouter);

allrouter.use("/ecomm/api/v1/", (req, res) => {
    res.send("Hello this is ecomm home");
})
module.exports = allrouter