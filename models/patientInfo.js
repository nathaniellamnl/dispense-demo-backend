const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    caseCode: {
        type: String,
        required:true
    },
    chineseName: {
        type: String
    },
    englishName : {
        type: String
    },
    age: {
        type: String,
        required:true
    },
    contactNumber: {
        type: String,
        required:true
    },
    dateOfRegistration: {
        type: String
    },
    address: {
        type: String
    },
    allergy: {
        type: String
    },
    adverseDrugReaction: {
        type: String
    },
    remark: {
        type: String
    },
},{timestamps: true});

module.exports = mongoose.model('PatientInfo', patientSchema);