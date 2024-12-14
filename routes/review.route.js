const express = require('express');
const reviewRouter = express.Router();
const controller = require('../controllers/review.controller')


reviewRouter.get('/', controller.getAllReviews);

// get product reviews to send as params /:productId
reviewRouter.get('/:id', controller.getProductReview); 

// post review on a prod. as a query userId=123412341234 & productId=987979879898
reviewRouter.post('/', controller.createReview);  


// update review on a prod. as a query
// reviewId=123412341234
reviewRouter.put("/:rid", controller.updateReview);

//  delete review by query userId="" &  productId=987979879898
reviewRouter.delete('/:rId', controller.deleteMyProductReview);

module.exports = reviewRouter;