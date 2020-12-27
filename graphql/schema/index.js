const { buildSchema } = require('graphql');



module.exports = buildSchema(`
         type User {
             _id: ID!
             email: String!
             password: String
         }

         type PatientInfo {
             _id:ID!
            caseCode: String!
            chineseName: String
            englishName: String
            age: String
            contactNumber: String
            dateOfRegistration: String
            address: String
            allergy: String
            adverseDrugReaction: String
            remark: String
            createdAt: String!
            updatedAt: String!
        }

         type AuthData {
             userId: ID!
             token: String!
             tokenExpiration: Int!
         }

         type Transaction {
             _id: ID!
             transactionDate: String!
             drugs: [String!]!
             quantities:[Int!]!
             remark: String
             amount: Float!
             customerName: String!
             customer: PatientInfo!
         }

         type Drug {
            _id: ID!
             name: String!
             price: Float!
             packSize: Int!
             quantity: Int!
             manufacturer: String!
         }

         input UserInput {
             email: String!
             password: String!
         }

         input PatientInfoInput {
             caseCode: String !
             chineseName: String
             englishName: String
             age: String !
             contactNumber: String !
             dateOfRegistration: String
             address: String
             allergy: String
             adverseDrugReaction: String
             remark: String
         }

         input TransactionInput {
            transactionDate: String!
            drugs: [String!]!
            quantities:[Int!]!
            remark: String
            amount: Float!
            patientId: ID!
        }

        input DrugInput {
            name: String!
            price: Float!
            packSize:Int!
            quantity: Int!
            manufacturer: String!
        }

         type RootQuery {
             login(email: String! , password: String!): AuthData!
             patients(_id:ID): [PatientInfo!]!
             transactions(_id:ID):[Transaction]!
             drugs(_id:ID): [Drug!]!
         }
         type RootMutation {
             createUser(userInput: UserInput): User 
             createPatient(patientInfoInput: PatientInfoInput): PatientInfo
             updatePatient(_id: ID! , patientInfoInput: PatientInfoInput): PatientInfo
             createTransaction(transactionInput:TransactionInput):ID
             updateTransaction(_id:ID!,transactionInput:TransactionInput):Transaction 
             deleteTransaction(_id:ID!):ID
             createDrug(drugInput: DrugInput):ID
             updateDrug(_id: ID!, drugInput: DrugInput):Drug
             deleteDrug(_id:ID!):ID
         }
         schema {
             query: RootQuery
             mutation: RootMutation
         }
    `)



