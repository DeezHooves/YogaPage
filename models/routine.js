const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// SCHEMA SETUP
let routineSchema = new mongoose.Schema({
    name: String,
    image: String,
    author: String,
    steps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step"
        }
    ]
});

module.exports = mongoose.model('routine', routineSchema);