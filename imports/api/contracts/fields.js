import config from "/imports/config"

const Contracts = new Mongo.Collection(config.collections.contracts);
Contracts.attachSchema(new SimpleSchema({
    userName: {
        type: String,
        optional: true
    },
    userId:{
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    packageName: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    purchaseId:{
        type: String,
        optional: true
    },
    reason:{
        type: String,
        optional: true
    },
    status:{
        type: String,
        optional: true
    }

}));

export default Contracts;