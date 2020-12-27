const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
        }
    } catch (err) {
        throw err;
    }
}

const transform = ele => {
    //drug documents don't have createdAt or updatedAt
    if(ele._doc.createdAt) {
        return {
            ...ele._doc,
            _id: ele.id,
            createdAt: dateToString(ele._doc.createdAt),
            updatedAt: dateToString(ele._doc.updatedAt)
        }   
    } else {
        return {
            ...ele._doc,
            _id: ele.id,
        }
    }    
}

const transformTransactionQuery = transaction => {
    return {
        ...transaction._doc,
        _id: transaction.id,
        transactionDate:dateToString(transaction._doc.transactionDate),
        createdAt: dateToString(transaction._doc.createdAt),
        updatedAt: dateToString(transaction._doc.updatedAt)
    }
}

exports.transform = transform;
exports.transformTransactionQuery = transformTransactionQuery;
