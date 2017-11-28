import config from "/imports/config"

const ClassPricing = new Mongo.Collection(config.collections.classPricing);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassPricing.attachSchema(new SimpleSchema({
    packageName: {
        type: String,
        optional: true
    },
    cost: {
        type: Number,
        optional: true
    },
    classTypeId: {
        type: String,
        optional: true
    },
    noClasses: {
        type: String,
        optional: true
    },
    start: {
        type: String,
        optional: true
    },
    finish: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    }
}));

export default ClassPricing;