const authResolver = require('./auth');
const patientResolver =require('./patient');
const transactionResolver = require('./transaction');
const drugResolver = require('./drug');

const rootResolver = {
    ...authResolver,
    ...patientResolver,
    ...transactionResolver,
    ...drugResolver
}

module.exports = rootResolver;