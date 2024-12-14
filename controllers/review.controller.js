const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const Review = require('../models/Review')
const User = require('../models/User')

const createReview = async (req,res)=>{

    const userId = req.query.userId;
    const productId = req.query.productId;


    try {
        const user = await User.findOne({_id : userId})
        const reviewExistence = await Review.findOne({
            userId : userId,
            productId : productId
        })
        if(reviewExistence){
            res.status(200).send({
                message : "Already reviewed. Thanks for the review :)"
            })
            return;
        }

        const reviewCreation = await Review.create({
            userId ,
            productId,
            username : user.username,
            rating : req.body.rating,
            reviewDesc : req.body.reviewDesc
        });

        const reviews = await Review.find({productId : productId});

        res.status(200).send({
            message : "Thanks for giving feedback :)",
            data : reviewCreation,
            reviews
        })
    } catch (error) {
        res.status(400).send({
            message : error.message
        })
    }
}

const getAllReviews = async (req, res) => {
    try {
        const allReviews = await Review.find({});
        if(allReviews.length < 0) {
            res.status(200).send({
                message : "Not any review :("
            })
            return;
        }
        res.status(200).send(allReviews)
    } catch (error) {
        res.status(400).send({
            message : error.message
        })
    }
}


const getProductReview = async(req,res)=>{
    const id = req.params.id;
    try {
        const reviews = await Review.find({productId : id});
        if(reviews.length < 0) {
            res.status(200).send({
                message : "Be the first one to review ;)"
            })
            return;
        }
        res.status(200).send(reviews)
    } catch (error) {
        res.status(400).send({
            message : error.message
        });
    }
}

const updateReview = async (req, res) =>{

    const rId = req.params.rid;

    try{
        const updatedreview = await Review.findByIdAndUpdate(rId, req.body,{
            new : true,
            runValidators : true,
            useFindAndModify : false
        });

        const allreviews = await Review.find({productId : updatedreview.productId})

        res.status(200).send({
            message : 'Review updated successfully',
            updatedreview,
            allreviews
        })
    }catch(err){
        res.status(400).send({
            message : err.message
        })
    }
    

}

const deleteMyProductReview = async (req, res) => {
    const rId = req.params.rId;
    try {
        await Review.findOneAndDelete({_id : rId});
        res.status(200).send({
            message : "Review deleted successfully :)"
        })
    } catch (error) {
        res.status(400).send({
            message : "Error: " + error.message
        })
    }
}

module.exports = {
    createReview,
    getProductReview,
    deleteMyProductReview,
    getAllReviews,
    updateReview
}