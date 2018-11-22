import config from "/imports/config"

const Classes = new Mongo.Collection(config.collections.classes);
Classes.attachSchema(new SimpleSchema({
    schoolId: {
        type: String,
        optional: true
    },
    classTypeId:{
        type: String,
        optional: true
    }
    ,
    classTimeId:{
        type: String,
        optional: true
    },
    instructors:{
        type: [String],
        optional: true
    },
    scheduled_date:{
        type: Date,
        optional: true
    },
    students:{
        type: [Object],
        optional: true,
        blackbox: true
    }
}));

export default Classes;