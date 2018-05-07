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
        type: Date
    },
    notification: { // True indicates that package request is not approved
        type: Boolean
    },
});

PackageRequest.attachSchema(PackageRequestSchema);

export default PackageRequest;