import config from "/imports/config"

const Transactions = new Mongo.Collection(config.collections.transactions);
Transactions.attachSchema(new SimpleSchema({
    userName: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    transactionDate: {
        type: Date,
        optional: true
    },
    transactionType: {
        type: String,
        optional: true
    },
    paymentMethod: {
        type: String,
        optional: true
    },
    amount: {
        type: Number,
        optional: true,
        decimal: true
    },
    currency: {
        type: String,
        optional: true
    },
    classTypeName: {
        type: String,
        optional: true
    },
    packageName: {
        type: String,
        optional: true
    },
    purchaseId: {
        type: String,
        optional: true
    },
    packageType: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    packageStatus: {
        type: String,
        optional: true
    },
    classId: {
        type: String,
        optional: true
    },
    schoolName: {
        type: String,
        optional: true
    }


}));

export default Transactions;