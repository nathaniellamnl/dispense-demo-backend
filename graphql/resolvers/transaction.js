const Transaction = require('../../models/transaction');
const Drug = require('../../models/drugInfo');
const mongoose = require('mongoose');
const { dateToString } = require('../../helpers/date');
const { transformTransactionQuery } = require('./merge');

const PatientInfo = require('../../models/patientInfo');

module.exports = {
    transactions: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        try {
            let transactionResult;
            if (args._id) {
                transactionResult = await Transaction.find({ $or: [{ _id: args._id }, { customer: args._id }] })
                    .sort({ transactionDate: -1 });
            } else {
                transactionResult = await Transaction.find()
                    .sort({ transactionDate: -1 });
            }

            return transactionResult.map(transaction => {
                return transformTransactionQuery(transaction);
            });
        } catch (err) {
            throw err;
        }
    },
    createTransaction: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        } 

        const customer = await PatientInfo.findById(args.transactionInput.patientId);

        let customerInfo = {
            customerName: customer.englishName,
            customer: customer.id
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        
        let returnedTransaction;
        try {
            let createdTransaction = { ...transactionUpdate(args, customerInfo) };
            returnedTransaction = await Transaction.create([{ ...createdTransaction }], { session: session });

            for (const index in args.transactionInput.drugs) {
                await Drug.updateOne({ name: args.transactionInput.drugs[index] },
                    { $inc: { quantity: - parseInt(args.transactionInput.quantities[index], 10) } }).session(session);
            }

            await session.commitTransaction();
            session.endSession();
        } catch (err) {
            console.log("Error" + err);
            await session.abortTransaction();
            session.endSession();
        }

        return returnedTransaction[0]._id;
    },
    updateTransaction: async ({ _id, transactionInput }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const retrievedTransaction = await Transaction.findById(_id).exec();
        const session = await mongoose.startSession();

        console.log("Retrieved Transaction: " + retrievedTransaction);
        //for calculation
        let drugArray = [];
        let transactionDrugArray=[];

        //see if the two drug array overlaps. if so, calculate the difference
        //otherwise, deduct the quantity for input drug array and increase quantity for retrieved drug array 
        for (const drugItem of retrievedTransaction.drugs) {
            drugArray.push({
                name: drugItem,
                overlap: false
            })
        }

        for(const transactionDrug of transactionInput.drugs){
            transactionDrugArray.push({
                name:transactionDrug,
                overlap: false
            })
        }

        session.startTransaction();

        for (const outerIndex in transactionInput.drugs) {

            for (const innerIndex in drugArray) {
                if (drugArray[innerIndex] === transactionDrugArray[outerIndex] &&
                    !drugArray[innerIndex].overlap && !transactionDrugArray[outerIndex].overlap) {
                    drugArray[innerIndex].overlap = true;
                    transactionDrugArray[outerIndex].ovrelap=true;

                    await Drug.updateOne({ name: transactionInput.drugs[outerIndex] },
                        {
                            $inc: {
                                quantity: parseInt(retrievedTransaction.quantities[innerIndex]) -
                                    parseInt(transactionInput.quantities[outerIndex], 10)
                            }
                        }).session(session);

                } 
            }
        }

        for (const index in transactionDrugArray) {
            if (!transactionDrugArray[index].overlap) {
                await Drug.updateOne({ name: transactionDrugArray[index].name },
                    { $inc: { quantity: - parseInt(transactionInput.quantities[index]) } }).session(session);

            }
        }

        for (const index in drugArray) {
            if (!drugArray[index].overlap) {
                await Drug.updateOne({ name: drugArray[index].name },
                    { $inc: { quantity: parseInt(retrievedTransaction.quantities[index]) } }).session(session);

            }
        }

        try {
            await Transaction.updateOne({ _id: _id }, { ...transactionInput }, (err, docs) => {
                if (err) {
                    console.log(err)
                }

            }).session(session);

            await session.commitTransaction();
            session.endSession();

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }

        return { ...transactionInput, _id: _id };
    },
    deleteTransaction: async ({ _id }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const retrievedTransaction = await Transaction.findById(_id).exec();
        const session = await mongoose.startSession();

        session.startTransaction();
        try {
            for (const index in retrievedTransaction.drugs) {
                await Drug.updateOne({ name: retrievedTransaction.drugs[index] },
                    { $inc: { quantity: parseInt(retrievedTransaction.quantities[index]) } }).session(session);

            }

            const deletedTransaction = await Transaction.deleteOne({ _id: _id }, (err) => {
                if (err) {
                    throw err;
                }
            }).session(session);

            await session.commitTransaction();
            session.endSession();    

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
        }

        return _id;
    }
}


const transactionUpdate = (args, customerInfo) => {
    return {
        ...customerInfo,
        transactionDate: dateToString(args.transactionInput.transactionDate),
        drugs: args.transactionInput.drugs,
        quantities: args.transactionInput.quantities,
        remark: args.transactionInput.remark,
        amount: args.transactionInput.amount,
    }
}