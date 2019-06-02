import config from '/imports/config';

const Attendance = new Mongo.Collection(config.collections.attendance);
Attendance.attachSchema(new SimpleSchema({
  schoolId: {
    type: String,
    optional: true,
  },
  classTypeId: {
    type: String,
    optional: true,
  },
  classTimeId: {
    type: String,
    optional: true,
  },
  classId: {
    type: String,
    optional: true,
  },
  attendedTime: {
    type: new Date(),
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
}));

export default Attendance;
