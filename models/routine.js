const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// SCHEMA SETUP
let routineSchema = new mongoose.Schema({
    name: String,
    image: String,
    author: String,
    style: String,
    level: String,
    length: Number,
    accessories: {
        type: String,
        possibleValues: ["belt", "strap", "both", "none"]
    },
    poster: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    steps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step"
        }
    ]

});

module.exports = mongoose.model('routine', routineSchema);