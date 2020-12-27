const Patient = require('../../models/patientInfo');

const { transform } = require('./merge');
const { dateToString } = require('../../helpers/date');


module.exports = {
    patients: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            let patientResult;
            if (args._id) {
                patientResult = await Patient.find({ _id: args._id });
            } else {
                patientResult = await Patient.find();
            }

            return patientResult.map(patient => {
                return transform(patient);
            });
        } catch (err) {
            throw err;
        }
    },
    createPatient: async ({ patientInfoInput }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const createdPatient = new Patient({ ...patientInfoInput, dateOfRegistration: dateUpdate(patientInfoInput.dateOfRegistration) });
        try {
            const result = await createdPatient.save();
        } catch (err) {
            throw err;
        }
        return createdPatient;
    },
    updatePatient: async ({ _id, patientInfoInput }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        patientInfoInput = dateUpdate(patientInfoInput);

        try {
            await Patient.updateOne({ _id: _id }, patientUpdate(patientInfoInput), (err, docs) => {
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
        return { ...patientInfoInput };

    }
}


const dateUpdate = (date) => {
    if (date) {
        if (date.length > 0) {
            date = dateToString(date);
        }
    } else {
        date = "";
    }
    return date;
}

const patientUpdate = (args) => {
    return {
        caseCode: args.caseCode,
        chineseName: args.chineseName,
        englishName: args.englishName,
        age: args.age,
        contactNumber: args.contactNumber,
        dateOfRegistration: args.dateOfRegistrationd,
        address: args.address,
        allergy: args.allergy,
        adverseDrugReaction: args.adverseDrugReaction,
        remark: args.remark
    }
}