import config from "/imports/config";
// import ClassType from "/imports/api/classType/fields";

export const PackageRequest = new Mongo.Collection(config.collections.PackageRequest);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
export const PackageRequestSchema = new SimpleSchema({
    packageName: {
        type: String,
        optional: true
    },
    classesId: {
        type: String,
        optional: true
    },
    packageId: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    notification: { // True indicates that package request is not approved
        type: Boolean,
        optional: true
    },
    valid:{
        type: Boolean,
        optional: true
    },
    userEmail:{
        type: String,
        optional: true
    },
    userName:{
        type: String,
        optional: true
    },
    className:{
        type: String,
        optional: true
    },
    schoolName:{
        type: String,
        optional: true
    },
    packageType:{
        type: String,
        optional: true
    }
});

PackageRequest.attachSchema(PackageRequestSchema);

export default PackageRequest;