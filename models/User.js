const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    phone : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true
    },
    password : String,
    address : String,
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

const User = mongoose.model("User", userSchema);
module.exports = User;