const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// SCHEMA SETUP
let stepSchema = new mongoose.Schema({
    image1: String,
    image2: String,
    text: String,
    poster: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model('Step', stepSchema);