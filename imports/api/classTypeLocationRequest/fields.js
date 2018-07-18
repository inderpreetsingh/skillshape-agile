import config from "/imports/config"

const ClassTypeLocationRequest = new Mongo.Collection(config.collections.classTypeLocationRequest);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */

 // Once it's fully operational we will make some of the optional fields back to false.
// This Collection will manage both school locations/class type location requests.
export const ClassTypeLocationRequestSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  schoolId: {
    type: String,
  },
  classTypeId: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true,
  },
  existingUser: {
    type: String,
    optional: true
  },
  notification: {
    type: Boolean,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  classTypeName: {
    type: String,
    optional:true
  }
})

ClassTypeLocationRequest.attachSchema(ClassTypeLocationRequestSchema);

export default ClassTypeLocationRequest;
