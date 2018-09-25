import config from "/imports/config"
import ClassType from "/imports/api/classType/fields";

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
		optional: true,
		decimal: true,
	},
	classTypeId: {
		type: [String],
		optional: true
	},
	noClasses: {
		type: Number,
		optional: true
	},
	expDuration: {
		type: String,
		optional: true
	},
	expPeriod: {
		type: String,
		optional: true
	},
	schoolId: {
		type: String,
		optional: true
	},
	noExpiration: {
		type: Boolean,
		optional: true
	},
	includeAllClassTypes: {
		type: Boolean,
		optional: true
	},
	currency:{
		type: String
	}
}));

ClassPricing.join(ClassType, "classTypeId", "selectedClassType", ["name"]);

export default ClassPricing;