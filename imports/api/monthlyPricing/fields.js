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
    schoolId: {
        type: String,
        optional: true
    },
    classTypeId: {
        type: [String],
        optional: true
    },
    pymtType: {
        type: Object,
        optional: true,
        blackbox: true
    },
    pymtMethod: {
        type: String,
        optional: true
    },
    pymtDetails: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    includeAllClassTypes: {
		type: Boolean,
		optional: true
    },
    noClasses:{
        type: Number,
        optional:true
    }
}));

MonthlyPricing.join(ClassType, "classTypeId", "selectedClassType", ["name"]);

export default MonthlyPricing;