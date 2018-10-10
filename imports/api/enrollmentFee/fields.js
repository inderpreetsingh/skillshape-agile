import config from "/imports/config"
import ClassType from "/imports/api/classType/fields";

const EnrollmentFees = new Mongo.Collection(config.collections.enrollmentFees);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
EnrollmentFees.attachSchema(new SimpleSchema({
    name: {
        type: String,
    },
    cost: {
        type: Number,
        optional: true,
		decimal: true
    },
    classTypeId: {
        type: [String],
        optional: true
    },
    schoolId: {
        type: String,
    },
    includeAllClassTypes: {
		type: Boolean,
		optional: true
    },
    currency:{
        type: String
    },
	expDuration: {
		type: Number,
		optional: true
	},
	expPeriod: {
		type: String,
		optional: true
    },
	noExpiration: {
		type: Boolean,
		optional: true
	}
}));

EnrollmentFees.join(ClassType, "classTypeId", "selectedClassType", ["name"]);

export default EnrollmentFees;