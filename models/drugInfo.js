const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const drugInfoSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required:true
    },
    packSize:{
        type: Number,
        required: true
    },
    quantity : {
        type: Number,
        required: true
    },
    manufacturer : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DrugInfo', drugInfoSchema);