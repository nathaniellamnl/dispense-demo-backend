const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    transactionDate: {
        type: String,
        required: true
    },
    drugs: [
        {
            type: String,
            required: true
        }
    ],
    quantities: [
        {
            type: Number,
            required: true
        }
    ],
    remark:
    {
        type: String,
    },
    amount:
    {
        type: Number,
        required: true
    },
    customerName:
    {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'PatientInfo' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);