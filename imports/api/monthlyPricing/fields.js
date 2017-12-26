import config from "/imports/config"
import ClassType from "/imports/api/classType/fields";

const MonthlyPricing = new Mongo.Collection(config.collections.monthlyPricing);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
MonthlyPricing.attachSchema(new SimpleSchema({
    packageName: {
        type: String,
        optional: true
    },
    pymtType: {
        type: String,
        optional: true
    },
    classTypeId: {
        type: [String],
        optional: true
    },
    oneMonCost: {
        type: Number,
        optional: true
    },
    threeMonCost: {
        type: Number,
        optional: true
    },
    sixMonCost: {
        type: Number,
        optional: true
    },
    annualCost: {
        type: Number,
        optional: true
    },
    lifetimeCost: {
        type: Number,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    }
}));

MonthlyPricing.join(ClassType, "classTypeId", "selectedClassType", ["name"]);

export default MonthlyPricing;