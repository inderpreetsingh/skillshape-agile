import SLocation from "../../imports/api/sLocation/fields";
import School from "../../imports/api/school/fields";

skill_class  = "SkillClass";  // avoid typos, this string occurs many times.

SkillClass = new Mongo.Collection(skill_class);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */

 Schema = {};
 Schema.ModuleLink = new SimpleSchema({
   moduleId: {
      optional: true,
      type: String,
    },startTime: {
       optional: true,
       type: Date,
     },endTime: {
        optional: true,
        type: Date,
      }
});
Schema.InstructorLink = new SimpleSchema({
  instructorId: {
     optional: true,
     type: String,
   },joinedDt: {
      optional: true,
      type: Date,
    }
});
Schema.AssistantLink = new SimpleSchema({
  assistantId: {
     optional: true,
     type: String,
   },joinedDt: {
      optional: true,
      type: Date,
    }
});
Schema.StudentsLink = new SimpleSchema({
  signedupStudentId: {
     optional: true,
     type: String,
   },joinedDt: {
      optional: true,
      type: Date,
    }
});
SkillClass.attachSchema(new SimpleSchema({
  isTemplate: {
     type: String,
     optional: true
   },
   isRecurring: {
     type: String,
     optional: true
   },
   className: {
     type: String,
     optional: true
   },
   plannedStart: {
     type: String,
     optional: true
   }
   ,
   durationMins: {
     type: Date,
     optional: true
   },
   planStartTime:{
     type: String,
     optional: true
   },
   planEndTime:{
     type: String,
     optional: true
   },
   classImagePath:{
     type: String,
     optional: true
   },
   classDescription:{
     type: String,
     optional: true
   },
   plannedEnd: {
     type: String,
     optional: true
   },
   actualStart: {
     type: Date,
     optional: true
   }
   ,
   actualEnd: {
     type: Date,
     optional: true
   },
   notes: {
     type: Date,
     optional: true
   },
   locationId: {
     type: String,
     optional: true
   },
   masterRecurringClassId: {
     type: String,
     optional: true
   },
   classTypeId: {
     type: String,
     optional: true
   },
   repeats: {
     type: String,
     optional: true
   },
   module: {
     type: Array,
     optional: true
   },
   classInstructor: {
     type: Array,
     optional: true
   },
   classAssistant: {
     type: Array,
     optional: true
   },
   classStudents: {
     type: Array,
     optional: true
   },
   schoolId:{
     type: String,
     optional: true
   },
   isNeedIgnore:{
     type:String,
     optional: true
   },
   tab_option:{
     type:String,
     optional: true
   },
   room:{
     type:String,
     optional: true
   },
   "module.$": {
       type: Schema.ModuleLink,
       optional: true
   },
   "classInstructor.$": {
       type: Schema.InstructorLink,
       optional: true
   },
   "classAssistant.$": {
       type: Schema.AssistantLink,
       optional: true
   },
   "classStudents.$": {
       type: Schema.StudentsLink,
       optional: true
   }
 }));

 if(Meteor.isServer){
   SkillClass._ensureIndex({className:"text",classDescription:"text"})
   Meteor.publish("userSkillClass", function(userId){
     user = Meteor.users.findOne({_id:userId});
     classIds = []
     if(user.profile){
       if(user.profile.schoolId){
         school_class = SkillClass.find({schoolId:user.profile.schoolId});
         classIds = school_class.map(function(a){
           return a._id
         })
       }

       if(user.profile){
         joinClass = []
         if(user.profile.classIds){
           joinClass = user.profile.classIds
         }
         classIds = classIds.concat(joinClass)
         skill_class = SkillClass.find({_id:{$in:classIds}});
         schoolIds = skill_class.map(function(a){
           return a.schoolId
         })
      }
       classIds = classIds.concat(user.profile.classIds)
       return [SkillClass.find({_id:{$in:classIds}}),SLocation.find({schoolId:{$in:schoolIds}}),ClassPricing.find({schoolId:{$in:schoolIds}}),MonthlyPricing.find({schoolId:{$in:schoolIds}}),ClassType.find({schoolId:{$in:schoolIds}}),School.find({_id:{$in:schoolIds}})]
     }else{
       return [];
     }
   });
   Meteor.publish("SkillClassbySchool", function(schoolId){
      return SkillClass.find({schoolId:schoolId})
   });
   Meteor.publish("SkillClassbySchoolBySlug", function(slug){
      school = School.findOne({slug:slug})
      return SkillClass.find({schoolId:school._id})
   });
   Meteor.publish("SkillClassbySchoolBySlugWithFilter", function(slug,city,skill){
      school = School.findOne({slug:slug})
      slocation = []
      classtypes = []
      if(city){
        slocation = SLocation.find({schoolId:school._id,city:city}).fetch();
        if(skill){
          classtypes = ClassType.find({schoolId:school._id,skillTypeId:skill}).fetch()
        }
      }
      if(skill){
        classtypes = ClassType.find({schoolId:school._id,skillTypeId:skill}).fetch();
      }
      if(slocation.length > 0 && classtypes.length > 0){
        locationIds = slocation.map(function(a){ return a._id});
        classTypeIds = classtypes.map(function(a){return a._id})
        return SkillClass.find({schoolId:school._id,locationId : {$in:locationIds},classTypeId:{$in:classTypeIds}})
      }else if(slocation.length > 0){
        locationIds = slocation.map(function(a){ return a._id});
        return SkillClass.find({schoolId:school._id,locationId : {$in:locationIds}})
      }else if(classtypes.length > 0){
        classTypeIds = classtypes.map(function(a){return a._id})
        return SkillClass.find({schoolId:school._id,classTypeId:{$in:classTypeIds}})
      }else{
        return SkillClass.find({schoolId:school._id})
      }
   });
   Meteor.methods({
     addSkillClass:function(doc){
        id = SkillClass.insert(doc)
        if(doc.isRecurring == "true"){
          newSchedule = buildScheduleExpansion(doc.repeats,id,"")
          ClassSchedule.remove({skillClassId:id});
          _.each(newSchedule, function(doc) {
              ClassSchedule.insert(doc);
          })
        }else if(doc.isRecurring == "false"){
          ClassSchedule.remove({skillClassId:id});
          date = moment(doc.plannedStart,"MM/DD/YYYY")
          scheduleClass = {
              skillClassId : id,
              eventStartTime: doc.planStartTime,
              eventEndTime: doc.planEndTime,
              eventDay: date.format("dddd"),
              eventDate: date.toDate()
          }
          ClassSchedule.insert(scheduleClass);
        }
        return id;
     },
     updateSkillClass:function(id,doc){
        old_obj = SkillClass.findOne({_id:id})
        old_repeats = old_obj.repeats
        repeats = doc.repeats
        if(old_repeats != repeats && doc.isRecurring == true){
          newSchedule = buildScheduleExpansion(repeats,id,moment().format("MM/DD/YYYY"))
          ClassSchedule.remove({skillClassId:id,eventDate:{'$gte': moment().startOf('day').toDate()}});
          _.each(newSchedule, function(doc) {
              ClassSchedule.insert(doc);
          })
        }else if(doc.isRecurring == false){
          ClassSchedule.remove({skillClassId:id});
          date = moment(doc.plannedStart,"MM/DD/YYYY")
          scheduleClass = {
              skillClassId : id,
              eventStartTime: doc.planStartTime,
              eventEndTime: doc.planEndTime,
              eventDay: date.format("dddd"),
              eventDate: date.toDate()
          }
          ClassSchedule.insert(scheduleClass);
        }
        return SkillClass.update({_id:id}, {$set:doc});
     },
     removeSkillClass:function(id){
       ClassSchedule.remove({skillClassId:id});
       return SkillClass.remove(id);
     },
     updateStatus:function(id,status){
       status =  "checked"
       skill = SkillClass.findOne({_id:id});
       if(skill.isNeedIgnore == "checked"){
         status = "unchecked"
       }
       return SkillClass.update({_id:id}, {$set:{"isNeedIgnore" : status}});
     },
     updateClassDetail:function(data){
        skillclass = SkillClass.findOne({_id:data.classId})
        scheduleClass = ClassSchedule.findOne({_id:data.id})
        update_data = {
          locationId:data.locationId,
          eventStartTime:data.start_time,
          eventEndTime:data.end_time
        }
        ClassSchedule.update({_id:data.id},{$set:update_data})
     },
     editClass:function(){

     }
   });
 }
