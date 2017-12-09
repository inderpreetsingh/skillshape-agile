import Classes from "../../imports/api/classes/fields";
import ClassType from "../../imports/api/classType/fields";

classSchedule = "ClassSchedule"; // avoid typos, this string occurs many times.
//
ClassSchedule = new Mongo.Collection(classSchedule);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */

ClassSchedule.attachSchema(new SimpleSchema({
  skillClassId: {
    type: String,
    optional: true
  },
  eventDate: {
    type: Date,
    optional: true
  },
  eventDay: {
    type: String,
    optional: true
  },
  eventStartTime: {
    type: String,
    optional: true
  },
  eventEndTime: {
    type: String,
    optional: true
  },
  locationId:{
    type: String,
    optional: true
  }
}));
if(Meteor.isServer){

  extandSchedule = function(skillClassIds,condition,date){
    skillclass = SkillClass.find({_id:{$in:skillClassIds}}).fetch();
    for(var k=0 ; k < skillclass.length; k++){
      repeats = skillclass[k].repeats
      if(repeats){
        josn_repeats = JSON.parse(repeats);
        
        console.log(skillclass[k].isRecurring);
        console.log(skillclass[k].isRecurring == "true");
        if(josn_repeats && skillclass[k].isRecurring == "true" && josn_repeats.end_option == "Never"){
          condition['skillClassId'] = skillclass[k]._id
          count = ClassSchedule.find(condition).fetch().length
          classScheduleItem = ClassSchedule.find({skillClassId:skillclass[k]._id},{sort:{eventDate:-1},limit:1}).fetch();
          if(count < 1 && classScheduleItem.length > 0){
            schedule_date = classScheduleItem[0].eventDate
            start_date = moment(schedule_date);
            repeat_on = josn_repeats.repeat_on
            end_date = start_date.add(1, 'years')
            start_date = moment(schedule_date);
            var days = matchingDaysBetween(start_date,end_date, function(day) {
            	return repeat_on.indexOf(day.format('dddd')) > -1; //test function
            });
            scheduleClass = []
            repeat_details = josn_repeats.repeat_details
            days.map(function(day) {
              start_time = '00:00'
              end_time = '00:00'
              locationId = ''
              for (var rd = 0; rd < repeat_details.length; rd++) {
                if (day.format('dddd') == repeat_details[rd].day) {
                    start_time = repeat_details[rd].start_time;
                    end_time =  repeat_details[rd].end_time;
                    locationId = repeat_details[rd].locationId
                }
              }
              scheduleClass.push({
                  skillClassId : skillclass[k]._id,
                  eventStartTime:start_time,
                  eventEndTime:end_time,
                  eventDay:day.format("dddd"),
                  eventDate:day.toDate(),
                  locationId:locationId
              })
            });
            _.each(scheduleClass, function(doc) {
                ClassSchedule.insert(doc);
            })
          }
        }
      }
    }
  }
  Meteor.publish("ClassSchedule", function(schoolId,current_date){
    var date = '';
    if(current_date){
      date = new Date(current_date);
    }else{
      current_date = new Date();
      date = new Date(current_date.getFullYear(),current_date.getMonth(),0);
    }
    school = School.findOne({$or:[{_id:schoolId},{slug:schoolId}]});
    if(school){
      // console.log("school data -->>",school)
      skillclass = Classes.find({schoolId:school._id})
      // console.log("classes data -->>",skillclass.fetch());
      skillClassIds = skillclass.map((i) => { return i._id })
      // console.log("skillClassIds data -->>",skillClassIds);
      var lastDay = new Date(date);
      lastDay.setDate(date.getDate() + 30);
      date_condition = {"eventDate": {'$gte': date, '$lte': lastDay}}
      var condition = {"eventDate": {'$gte': date, '$lte': lastDay},skillClassId:{$in :skillClassIds}};
      console.log("ClassSchedule condition --->>",condition)
      extandSchedule(skillClassIds,date_condition,date);
      return [
        ClassSchedule.find(condition), 
        Classes.find({schoolId:school._id}),
      ]
    }else{
      return []
    }
  });
  Meteor.publish("ClassSchedulebyClassIds", function(skillClassIds,current_date){
    var date = '';
    if(current_date){
      date = new Date(current_date);
    }else{
      current_date = new Date();
      date = new Date(current_date.getFullYear(),current_date.getMonth(),0);
    }
    var lastDay = new Date(date);
    lastDay.setDate(date.getDate() + 30);
    date_condition = {"eventDate": {'$gte': date, '$lte': lastDay}}
    var condition = {"eventDate": {'$gte': date, '$lte': lastDay},skillClassId:{$in :skillClassIds}};
    /*console.log(condition);*/
    extandSchedule(skillClassIds,date_condition,date);
    return ClassSchedule.find(condition)
  });

  Meteor.methods({
    removeEvent: function(id) {
      return ClassSchedule.remove({_id:id});
    }
  });

}
var matchingDaysBetween = function(start, end, test) {
  var days = [];
  for (var day = moment(start); day.isBefore(end); day.add(1, 'd')) {
    if (test(day)) {
      days.push(moment(day)); // push a copy of day
    }
  }
  return days;
}

buildScheduleExpansion = function(sample_schedule,skillClassId,preStartDate){
  scheduleClass = []
  josn_repeats = JSON.parse(sample_schedule);
  repeat_type = josn_repeats.repeat_type
  repeat_type = repeat_type
  repeat_every = josn_repeats.repeat_every
  str_start_date = josn_repeats.start_date
  if(preStartDate){
    str_start_date = preStartDate
  }
  if(str_start_date){
    start_date = moment(str_start_date, "MM/DD/YYYY");
  }else{
    start_date = moment();
  }
  if (josn_repeats && start_date) {
    if (josn_repeats.end_option == "Never") {
      repeat_on = josn_repeats.repeat_on
      end_date = start_date.add(1, 'years')
      if(preStartDate){
        str_start_date = preStartDate
      }
      start_date = moment(str_start_date, "MM/DD/YYYY");
      var days = matchingDaysBetween(start_date,end_date, function(day) {
      	return repeat_on.indexOf(day.format('dddd')) > -1; //test function
      });
      repeat_details = josn_repeats.repeat_details
      days.map(function(day) {
        start_time = '00:00'
        end_time = '00:00'
        locationId = ''
        for (var rd = 0; rd < repeat_details.length; rd++) {
          if (day.format('dddd') == repeat_details[rd].day) {
              start_time = repeat_details[rd].start_time;
              end_time =  repeat_details[rd].end_time;
              locationId = repeat_details[rd].location
          }
        }
        scheduleClass.push({
          skillClassId : skillClassId,
          eventStartTime:start_time,
          eventEndTime:end_time,
          eventDay:day.format("dddd"),
          eventDate:day.toDate(),
          locationId:locationId
          })
      });
    } else {
      repeat_on = josn_repeats.repeat_on
      if (josn_repeats.end_option == "occurrence") {
        occurrence = josn_repeats.end_option_value;
        occure = eval(josn_repeats.repeat_every) * eval(occurrence)
        str_start_date = josn_repeats.start_date
        end_date = moment(str_start_date, "MM/DD/YYYY").add(occure, josn_repeats.repeat_type).format("YYYY-MM-DD");
      } else if (josn_repeats.end_option == "rend_date") {
        end_date = josn_repeats.end_option_value;
        end_date = moment(end_date, "MM/DD/YYYY").format("YYYY-MM-DD");
      }
      var days = matchingDaysBetween(start_date, end_date, function(day) {
        return repeat_on.indexOf(day.format('dddd')) > -1; //test function
      });
      repeat_details = josn_repeats.repeat_details
      days.map(function(day) {
        start_time = '00:00'
        end_time = '00:00'
        locationId = ''
        for (var rd = 0; rd < repeat_details.length; rd++) {
          if (day.format('dddd') == repeat_details[rd].day) {
              start_time = repeat_details[rd].start_time;
              end_time =  repeat_details[rd].end_time;
              locationId = repeat_details[rd].location
          }
        }
        scheduleClass.push({
          skillClassId : skillClassId,
          eventStartTime:start_time,
          eventEndTime:end_time,
          eventDay:day.format("dddd"),
          eventDate:day.toDate(),
          locationId:locationId
        })
      });
    }
  }
  return scheduleClass;
}
