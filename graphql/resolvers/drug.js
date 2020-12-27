const { transform } = require('./merge');
const Drug = require('../../models/drugInfo');

module.exports = {
    drugs: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            let drugResult;
            if (args._id) {
                drugResult = await Drug.find({ _id: args._id });
            } else {
                drugResult = await Drug.find();
            }

            return drugResult.map(drug => {
                return transform(drug);
            });
        } catch (err) {
            throw err;
        }
    },
    createDrug: async ({ drugInput }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const createdDrug = new Drug({ ...drugInput });
        let returnedDrug;
        try {
            const result = await createdDrug.save();
            returnedDrug = transform(result);
        } catch (err) {
            throw err;
        }
        return returnedDrug._id;
    },
    updateDrug: async ({ _id, drugInput }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        try {
            await Drug.updateOne({ _id: _id }, { ...drugInput }, (err, docs) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Updated Docs : ", docs);
                }
            })
        } catch (err) {
            throw err;
        }
        return { ...drugInput };

    },
    deleteDrug: async ({ _id }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const deletedDrug = await Drug.deleteOne({ _id: _id }, (err) => {
            if (err) {
                throw err;
            }
        });
        return _id;
    },
}
