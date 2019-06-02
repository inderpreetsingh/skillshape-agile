demand = 'Demand'; // avoid typos, this string occurs many times.
classDemand = 'ClassDemand';
//
Demand = new Mongo.Collection(demand);
ClassDemand = new Mongo.Collection(classDemand);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
Demand.attachSchema(new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  schoolId: {
    type: String,
    optional: true,
  },
  classTypeId: {
    type: String,
    optional: true,
  },
  dateOfJoin: {
    type: Date,
    optional: true,
  },
  classId: {
    type: String,
    optional: true,
  },
}));
ClassDemand.attachSchema(new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  schoolId: {
    type: String,
    optional: true,
  },
  classTypeId: {
    type: String,
    optional: true,
  },
  dateOfRequest: {
    type: Date,
    optional: true,
  },
  classId: {
    type: String,
    optional: true,
  },
}));
if (Meteor.isServer) {
  const userClassJoin = function (user, school, skillClass) {
    const fromEmail = 'admin@techmeetups.com';
    const toEmail = user.emails[0].address;
    Email.send({
      from: fromEmail,
      to: toEmail,
      replyTo: fromEmail,
      subject: 'skillshape Class Join Notification',
      text: `Hi ${  user.emails[0].address  },\nYou Join for ${  skillClass.className  } at ${  school.name 
          }\nFor more details please login ${  Meteor.absoluteUrl()  }\n\n` +
          `Thank you.\n` +
          `The skillshape Team.\n${  Meteor.absoluteUrl()  }\n`,
      // + "http://www.graphical.io/assets/img/Graphical-IO.png"
    });
    Email.send({
      from: fromEmail,
      to: fromEmail,
      replyTo: fromEmail,
      subject: 'skillshape Class Join Notification',
      text: `Hi,\n User email :  ${  user.emails[0].address  },\n is requested for join ${  skillClass.className  } at ${  school.name 
          }Thank you.\n` +
          `The skillshape Team.\n${  Meteor.absoluteUrl()  }\n`,
      // + "http://www.graphical.io/assets/img/Graphical-IO.png"
    });
  };

  Meteor.publish(demand, (user_id) => Demand.find({userId:user_id}));
  Meteor.publish('demandUser', (classId) => {
    demand = Demand.find({ classId }).fetch();
    user = demand.map((e) => { return e.userId});
    return [Meteor.users.find({ _id: { $in: user } }), Demand.find({ classId })];
  });

  Meteor.methods({
    addEmbadDemandWithUser(user,doc,school,skillClass){
      userId = Accounts.createUser(user);
      doc['userId'] = userId
      user_id = doc.userId
      var class_id = doc.classId
      user = Meteor.users.findOne({_id:user_id});
      classIds = [];
      if(user.profile){
        if(user.profile.classIds){
          classIds = user.profile.classIds
        }else{
          classIds = []
        }
      }
      if(!(classIds.indexOf(class_id) > -1)){
        Meteor.users.update({_id:user_id}, { $push: {"profile.classIds" : class_id }});
        doc['schoolId'] = school._id
        doc['dateOfJoin'] = new Date();
        user_id = doc.userId
        user = Meteor.users.findOne({_id:user_id});
        Demand.insert(doc);
        userClassJoin(user,school,skillClass)
        return true;
      }
        return false;
      
    },
    addEmbadDemand(doc,school,skillClass){
      user_id = doc.userId
      var class_id = doc.classId
      user = Meteor.users.findOne({_id:user_id});
      classIds = [];
      if(user.profile){
        if(user.profile.classIds){
          classIds = user.profile.classIds
        }else{
          classIds = []
        }
      }
      if(!(classIds.indexOf(class_id) > -1)){
        Meteor.users.update({_id:user_id}, { $push: {"profile.classIds" : class_id }});
        doc['schoolId'] = school._id
        doc['dateOfJoin'] = new Date();
        user_id = doc.userId
        user = Meteor.users.findOne({_id:user_id});
        Demand.insert(doc);
        userClassJoin(user,school,skillClass)
        return true;
      }
        return false;
      
    },
    addDemand(doc) {
      let {classTypeId} = doc;
      user_id = doc.userId;
      let class_id = doc.classId;
      Meteor.users.update({ _id: user_id }, { $push: { 'profile.classIds': class_id } });
      class_type = ClassType.findOne({ _id: classTypeId });
      doc.schoolId = class_type.schoolId;
      doc.dateOfJoin = new Date();
      return Demand.insert(doc);
    },
    RemoveFromUser(classId, userId) {
      Meteor.users.update({ _id: userId }, { $pull: { 'profile.classIds': classId } });
      return true;
    },
    addClassDemand(doc) {
      classDemand = ClassDemand.findOne({ classTypeId: doc.classTypeId, userId: doc.userId });
      if (classDemand) {
        ClassDemand.update({ _id: classDemand._id }, { $set: { dateOfRequest: new Date() } });
      } else{
        doc.dateOfRequest = new Date();
        ClassDemand.insert(doc);
      }
      return true;
    },
  });
}
