var require = meteorInstall({"lib":{"collections":{"Category.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Category.js                                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
category = "Category"; // avoid typos, this string occurs many times.                                                  // 1
//                                                                                                                     //
Category = new Mongo.Collection(category);                                                                             // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Category.attachSchema(new SimpleSchema({                                                                               // 9
  name: {                                                                                                              // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, programId: {                                                                                                      // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  }                                                                                                                    // 13
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ClaimOrder.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/ClaimOrder.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
claimOrder = "ClaimOrder"; // avoid typos, this string occurs many times.                                              // 1
//                                                                                                                     //
ClaimOrder = new Mongo.Collection(claimOrder);                                                                         // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
ClaimOrder.attachSchema(new SimpleSchema({                                                                             // 9
  name: {                                                                                                              // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, schoolId: {                                                                                                       // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  },                                                                                                                   // 13
  createdAt: {                                                                                                         // 17
    type: Date,                                                                                                        // 18
    optional: true                                                                                                     // 19
  },                                                                                                                   // 17
  remoteIP: {                                                                                                          // 21
    type: String,                                                                                                      // 22
    optional: true                                                                                                     // 23
  }                                                                                                                    // 21
}));                                                                                                                   // 9
if (Meteor.isServer) {                                                                                                 // 26
  Meteor.startup(function () {                                                                                         // 27
    ClaimOrder._ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });                                         // 28
  });                                                                                                                  // 29
}                                                                                                                      // 30
claimRequest = "ClaimRequest"; // avoid typos, this string occurs many times.                                          // 31
//                                                                                                                     //
ClaimRequest = new Mongo.Collection(claimRequest);                                                                     // 33
ClaimRequest.attachSchema(new SimpleSchema({                                                                           // 34
  userId: {                                                                                                            // 35
    type: String,                                                                                                      // 36
    optional: true                                                                                                     // 37
  }, schoolId: {                                                                                                       // 35
    type: String,                                                                                                      // 39
    optional: true                                                                                                     // 40
  },                                                                                                                   // 38
  currentUserId: {                                                                                                     // 42
    type: String,                                                                                                      // 43
    optional: true                                                                                                     // 44
  },                                                                                                                   // 42
  schoolName: {                                                                                                        // 46
    type: String,                                                                                                      // 47
    optional: true                                                                                                     // 48
  },                                                                                                                   // 46
  Status: {                                                                                                            // 50
    type: String,                                                                                                      // 51
    optional: true                                                                                                     // 52
  }                                                                                                                    // 50
}));                                                                                                                   // 34
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 56
  Meteor.publish(claimOrder, function (remoteIP) {                                                                     // 57
    remoteIP = this.connection.clientAddress;                                                                          // 58
    return ClaimOrder.find({ remoteIP: remoteIP });                                                                    // 59
  });                                                                                                                  // 60
  Meteor.publish(claimRequest, function (userId) {                                                                     // 61
    return ClaimRequest.find({ userId: userId, Status: "new" });                                                       // 62
  });                                                                                                                  // 63
  Meteor.methods({                                                                                                     // 64
    addClaimOrder: function addClaimOrder(doc) {                                                                       // 65
      doc.remoteIP = this.connection.clientAddress;                                                                    // 66
      doc.createdAt = new Date();                                                                                      // 67
      console.log(doc);                                                                                                // 68
      return ClaimOrder.insert(doc);                                                                                   // 69
    },                                                                                                                 // 70
    removeClaimOrder: function removeClaimOrder(claimOrders) {                                                         // 71
      for (var i = 0; i < claimOrders.length; i++) {                                                                   // 72
        ClaimOrder.remove({ _id: claimOrders[i]._id });                                                                // 73
      }                                                                                                                // 74
      return true;                                                                                                     // 75
    },                                                                                                                 // 76
    addClaimRequest: function addClaimRequest(doc) {                                                                   // 77
      this.unblock();                                                                                                  // 78
      cr = ClaimRequest.insert(doc);                                                                                   // 79
      user = Meteor.users.findOne({ _id: doc.userId });                                                                // 80
      current_user = Meteor.users.findOne({ _id: doc.currentUserId });                                                 // 81
      var fromEmail = "admin@techmeetups.com";                                                                         // 82
      console.log("email send started");                                                                               // 83
      console.log(current_user);                                                                                       // 84
      if (current_user) {                                                                                              // 85
        var toEmail = current_user.emails[0].address;                                                                  // 86
        console.log(toEmail);                                                                                          // 87
        Email.send({                                                                                                   // 88
          from: fromEmail,                                                                                             // 89
          to: toEmail,                                                                                                 // 90
          replyTo: fromEmail,                                                                                          // 91
          subject: "Your School claim by other user",                                                                  // 92
          text: "Hi ,\nWe get claim request from  another user about your school" + "\nhe claim  : " + Meteor.absoluteUrl() + "schoolAdmin/" + doc.schoolId + "\n" + "\nAdmin will contact you for further clarifications.\n" + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
          // + "http://www.graphical.io/assets/img/Graphical-IO.png"                                                   //
        });                                                                                                            // 88
      }                                                                                                                // 100
      var toEmail = user.emails[0].address;                                                                            // 101
      Email.send({                                                                                                     // 102
        from: fromEmail,                                                                                               // 103
        to: fromEmail,                                                                                                 // 104
        replyTo: fromEmail,                                                                                            // 105
        subject: "skillshape claim request",                                                                           // 106
        text: "Hi ,\nWe get claim request from : (" + toEmail + ")" + "\nhe claim  : " + Meteor.absoluteUrl() + "schoolAdmin/" + doc.schoolId + "\n" + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
        // + "http://www.graphical.io/assets/img/Graphical-IO.png"                                                     //
      });                                                                                                              // 102
      Email.send({                                                                                                     // 113
        from: fromEmail,                                                                                               // 114
        to: toEmail,                                                                                                   // 115
        replyTo: fromEmail,                                                                                            // 116
        subject: "Thanks for claim request",                                                                           // 117
        text: "Hi ," + toEmail + "\nYour claim Schools is  : " + Meteor.absoluteUrl() + "schoolAdmin/" + doc.schoolId + "\n" + "We will getback to you soon.\n" + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
        // + "http://www.graphical.io/assets/img/Graphical-IO.png"                                                     //
      });                                                                                                              // 113
      return true;                                                                                                     // 125
    }                                                                                                                  // 126
  });                                                                                                                  // 64
}                                                                                                                      // 128
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ClassPricing.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/ClassPricing.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
class_pricing = "ClassPricing"; // avoid typos, this string occurs many times.                                         // 3
//                                                                                                                     //
ClassPricing = new Mongo.Collection(class_pricing);                                                                    // 5
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
ClassPricing.attachSchema(new SimpleSchema({                                                                           // 11
  packageName: {                                                                                                       // 12
    type: String,                                                                                                      // 13
    optional: true                                                                                                     // 14
  }, cost: {                                                                                                           // 12
    type: Number,                                                                                                      // 16
    optional: true                                                                                                     // 17
  },                                                                                                                   // 15
  classTypeId: {                                                                                                       // 19
    type: String,                                                                                                      // 20
    optional: true                                                                                                     // 21
  }, noClasses: {                                                                                                      // 19
    type: String,                                                                                                      // 23
    optional: true                                                                                                     // 24
  }, start: {                                                                                                          // 22
    type: String,                                                                                                      // 26
    optional: true                                                                                                     // 27
  }, finish: {                                                                                                         // 25
    type: String,                                                                                                      // 29
    optional: true                                                                                                     // 30
  },                                                                                                                   // 28
  schoolId: {                                                                                                          // 32
    type: String,                                                                                                      // 33
    optional: true                                                                                                     // 34
  }                                                                                                                    // 32
}));                                                                                                                   // 11
if (Meteor.isServer) {                                                                                                 // 37
  Meteor.publish("ClassPricing", function (schoolId) {                                                                 // 38
    return ClassPricing.find({ schoolId: schoolId });                                                                  // 39
  });                                                                                                                  // 40
  Meteor.methods({                                                                                                     // 41
    addClassPricing: function addClassPricing(doc) {                                                                   // 42
      return ClassPricing.insert(doc);                                                                                 // 43
    },                                                                                                                 // 44
    updateClassPricing: function updateClassPricing(id, doc) {                                                         // 45
      return ClassPricing.update({ _id: id }, { $set: doc });                                                          // 46
    },                                                                                                                 // 47
    removeClassPricing: function removeClassPricing(id) {                                                              // 48
      return ClassPricing.remove({ _id: id });                                                                         // 49
    }                                                                                                                  // 50
  });                                                                                                                  // 41
}                                                                                                                      // 52
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ClassSchedule.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/ClassSchedule.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
classSchedule = "ClassSchedule"; // avoid typos, this string occurs many times.                                        // 1
//                                                                                                                     //
ClassSchedule = new Mongo.Collection(classSchedule);                                                                   // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
                                                                                                                       //
ClassSchedule.attachSchema(new SimpleSchema({                                                                          // 10
  skillClassId: {                                                                                                      // 11
    type: String,                                                                                                      // 12
    optional: true                                                                                                     // 13
  },                                                                                                                   // 11
  eventDate: {                                                                                                         // 15
    type: Date,                                                                                                        // 16
    optional: true                                                                                                     // 17
  },                                                                                                                   // 15
  eventDay: {                                                                                                          // 19
    type: String,                                                                                                      // 20
    optional: true                                                                                                     // 21
  },                                                                                                                   // 19
  eventStartTime: {                                                                                                    // 23
    type: String,                                                                                                      // 24
    optional: true                                                                                                     // 25
  },                                                                                                                   // 23
  eventEndTime: {                                                                                                      // 27
    type: String,                                                                                                      // 28
    optional: true                                                                                                     // 29
  },                                                                                                                   // 27
  locationId: {                                                                                                        // 31
    type: String,                                                                                                      // 32
    optional: true                                                                                                     // 33
  }                                                                                                                    // 31
}));                                                                                                                   // 10
if (Meteor.isServer) {                                                                                                 // 36
                                                                                                                       //
  extandSchedule = function extandSchedule(skillClassIds, condition, date) {                                           // 38
    skillclass = SkillClass.find({ _id: { $in: skillClassIds } }).fetch();                                             // 39
    for (var k = 0; k < skillclass.length; k++) {                                                                      // 40
      repeats = skillclass[k].repeats;                                                                                 // 41
      if (repeats) {                                                                                                   // 42
        josn_repeats = JSON.parse(repeats);                                                                            // 43
                                                                                                                       //
        console.log(skillclass[k].isRecurring);                                                                        // 45
        console.log(skillclass[k].isRecurring == "true");                                                              // 46
        if (josn_repeats && skillclass[k].isRecurring == "true" && josn_repeats.end_option == "Never") {               // 47
          condition['skillClassId'] = skillclass[k]._id;                                                               // 48
          count = ClassSchedule.find(condition).fetch().length;                                                        // 49
          classScheduleItem = ClassSchedule.find({ skillClassId: skillclass[k]._id }, { sort: { eventDate: -1 }, limit: 1 }).fetch();
          if (count < 1 && classScheduleItem.length > 0) {                                                             // 51
            schedule_date = classScheduleItem[0].eventDate;                                                            // 52
            start_date = moment(schedule_date);                                                                        // 53
            repeat_on = josn_repeats.repeat_on;                                                                        // 54
            end_date = start_date.add(1, 'years');                                                                     // 55
            start_date = moment(schedule_date);                                                                        // 56
            var days = matchingDaysBetween(start_date, end_date, function (day) {                                      // 57
              return repeat_on.indexOf(day.format('dddd')) > -1; //test function                                       // 58
            });                                                                                                        // 59
            scheduleClass = [];                                                                                        // 60
            repeat_details = josn_repeats.repeat_details;                                                              // 61
            days.map(function (day) {                                                                                  // 62
              start_time = '00:00';                                                                                    // 63
              end_time = '00:00';                                                                                      // 64
              locationId = '';                                                                                         // 65
              for (var rd = 0; rd < repeat_details.length; rd++) {                                                     // 66
                if (day.format('dddd') == repeat_details[rd].day) {                                                    // 67
                  start_time = repeat_details[rd].start_time;                                                          // 68
                  end_time = repeat_details[rd].end_time;                                                              // 69
                  locationId = repeat_details[rd].locationId;                                                          // 70
                }                                                                                                      // 71
              }                                                                                                        // 72
              scheduleClass.push({                                                                                     // 73
                skillClassId: skillclass[k]._id,                                                                       // 74
                eventStartTime: start_time,                                                                            // 75
                eventEndTime: end_time,                                                                                // 76
                eventDay: day.format("dddd"),                                                                          // 77
                eventDate: day.toDate(),                                                                               // 78
                locationId: locationId                                                                                 // 79
              });                                                                                                      // 73
            });                                                                                                        // 81
            _.each(scheduleClass, function (doc) {                                                                     // 82
              ClassSchedule.insert(doc);                                                                               // 83
            });                                                                                                        // 84
          }                                                                                                            // 85
        }                                                                                                              // 86
      }                                                                                                                // 87
    }                                                                                                                  // 88
  };                                                                                                                   // 89
  Meteor.publish("ClassSchedule", function (schoolId, current_date) {                                                  // 90
    var date = '';                                                                                                     // 91
    if (current_date) {                                                                                                // 92
      date = new Date(current_date);                                                                                   // 93
    } else {                                                                                                           // 94
      current_date = new Date();                                                                                       // 95
      date = new Date(current_date.getFullYear(), current_date.getMonth(), 0);                                         // 96
    }                                                                                                                  // 97
    school = School.findOne({ $or: [{ _id: schoolId }, { slug: schoolId }] });                                         // 98
    if (school) {                                                                                                      // 99
      skillclass = SkillClass.find({ schoolId: school._id });                                                          // 100
      skillClassIds = skillclass.map(function (i) {                                                                    // 101
        return i._id;                                                                                                  // 101
      });                                                                                                              // 101
      var lastDay = new Date(date);                                                                                    // 102
      lastDay.setDate(date.getDate() + 30);                                                                            // 103
      date_condition = { "eventDate": { '$gte': date, '$lte': lastDay } };                                             // 104
      var condition = { "eventDate": { '$gte': date, '$lte': lastDay }, skillClassId: { $in: skillClassIds } };        // 105
      /*console.log(condition);*/                                                                                      //
      extandSchedule(skillClassIds, date_condition, date);                                                             // 107
      return ClassSchedule.find(condition);                                                                            // 108
    } else {                                                                                                           // 109
      return [];                                                                                                       // 110
    }                                                                                                                  // 111
  });                                                                                                                  // 112
  Meteor.publish("ClassSchedulebyClassIds", function (skillClassIds, current_date) {                                   // 113
    var date = '';                                                                                                     // 114
    if (current_date) {                                                                                                // 115
      date = new Date(current_date);                                                                                   // 116
    } else {                                                                                                           // 117
      current_date = new Date();                                                                                       // 118
      date = new Date(current_date.getFullYear(), current_date.getMonth(), 0);                                         // 119
    }                                                                                                                  // 120
    var lastDay = new Date(date);                                                                                      // 121
    lastDay.setDate(date.getDate() + 30);                                                                              // 122
    date_condition = { "eventDate": { '$gte': date, '$lte': lastDay } };                                               // 123
    var condition = { "eventDate": { '$gte': date, '$lte': lastDay }, skillClassId: { $in: skillClassIds } };          // 124
    /*console.log(condition);*/                                                                                        //
    extandSchedule(skillClassIds, date_condition, date);                                                               // 126
    return ClassSchedule.find(condition);                                                                              // 127
  });                                                                                                                  // 128
                                                                                                                       //
  Meteor.methods({                                                                                                     // 130
    removeEvent: function removeEvent(id) {                                                                            // 131
      return ClassSchedule.remove({ _id: id });                                                                        // 132
    }                                                                                                                  // 133
  });                                                                                                                  // 130
}                                                                                                                      // 136
var matchingDaysBetween = function matchingDaysBetween(start, end, test) {                                             // 137
  var days = [];                                                                                                       // 138
  for (var day = moment(start); day.isBefore(end); day.add(1, 'd')) {                                                  // 139
    if (test(day)) {                                                                                                   // 140
      days.push(moment(day)); // push a copy of day                                                                    // 141
    }                                                                                                                  // 142
  }                                                                                                                    // 143
  return days;                                                                                                         // 144
};                                                                                                                     // 145
                                                                                                                       //
buildScheduleExpansion = function buildScheduleExpansion(sample_schedule, skillClassId, preStartDate) {                // 147
  scheduleClass = [];                                                                                                  // 148
  josn_repeats = JSON.parse(sample_schedule);                                                                          // 149
  repeat_type = josn_repeats.repeat_type;                                                                              // 150
  repeat_type = repeat_type;                                                                                           // 151
  repeat_every = josn_repeats.repeat_every;                                                                            // 152
  str_start_date = josn_repeats.start_date;                                                                            // 153
  if (preStartDate) {                                                                                                  // 154
    str_start_date = preStartDate;                                                                                     // 155
  }                                                                                                                    // 156
  if (str_start_date) {                                                                                                // 157
    start_date = moment(str_start_date, "MM/DD/YYYY");                                                                 // 158
  } else {                                                                                                             // 159
    start_date = moment();                                                                                             // 160
  }                                                                                                                    // 161
  if (josn_repeats && start_date) {                                                                                    // 162
    if (josn_repeats.end_option == "Never") {                                                                          // 163
      repeat_on = josn_repeats.repeat_on;                                                                              // 164
      end_date = start_date.add(1, 'years');                                                                           // 165
      if (preStartDate) {                                                                                              // 166
        str_start_date = preStartDate;                                                                                 // 167
      }                                                                                                                // 168
      start_date = moment(str_start_date, "MM/DD/YYYY");                                                               // 169
      var days = matchingDaysBetween(start_date, end_date, function (day) {                                            // 170
        return repeat_on.indexOf(day.format('dddd')) > -1; //test function                                             // 171
      });                                                                                                              // 172
      repeat_details = josn_repeats.repeat_details;                                                                    // 173
      days.map(function (day) {                                                                                        // 174
        start_time = '00:00';                                                                                          // 175
        end_time = '00:00';                                                                                            // 176
        locationId = '';                                                                                               // 177
        for (var rd = 0; rd < repeat_details.length; rd++) {                                                           // 178
          if (day.format('dddd') == repeat_details[rd].day) {                                                          // 179
            start_time = repeat_details[rd].start_time;                                                                // 180
            end_time = repeat_details[rd].end_time;                                                                    // 181
            locationId = repeat_details[rd].location;                                                                  // 182
          }                                                                                                            // 183
        }                                                                                                              // 184
        scheduleClass.push({                                                                                           // 185
          skillClassId: skillClassId,                                                                                  // 186
          eventStartTime: start_time,                                                                                  // 187
          eventEndTime: end_time,                                                                                      // 188
          eventDay: day.format("dddd"),                                                                                // 189
          eventDate: day.toDate(),                                                                                     // 190
          locationId: locationId                                                                                       // 191
        });                                                                                                            // 185
      });                                                                                                              // 193
    } else {                                                                                                           // 194
      repeat_on = josn_repeats.repeat_on;                                                                              // 195
      if (josn_repeats.end_option == "occurrence") {                                                                   // 196
        occurrence = josn_repeats.end_option_value;                                                                    // 197
        occure = module.runModuleSetters(eval(josn_repeats.repeat_every)) * module.runModuleSetters(eval(occurrence));
        str_start_date = josn_repeats.start_date;                                                                      // 199
        end_date = moment(str_start_date, "MM/DD/YYYY").add(occure, josn_repeats.repeat_type).format("YYYY-MM-DD");    // 200
      } else if (josn_repeats.end_option == "rend_date") {                                                             // 201
        end_date = josn_repeats.end_option_value;                                                                      // 202
        end_date = moment(end_date, "MM/DD/YYYY").format("YYYY-MM-DD");                                                // 203
      }                                                                                                                // 204
      var days = matchingDaysBetween(start_date, end_date, function (day) {                                            // 205
        return repeat_on.indexOf(day.format('dddd')) > -1; //test function                                             // 206
      });                                                                                                              // 207
      repeat_details = josn_repeats.repeat_details;                                                                    // 208
      days.map(function (day) {                                                                                        // 209
        start_time = '00:00';                                                                                          // 210
        end_time = '00:00';                                                                                            // 211
        locationId = '';                                                                                               // 212
        for (var rd = 0; rd < repeat_details.length; rd++) {                                                           // 213
          if (day.format('dddd') == repeat_details[rd].day) {                                                          // 214
            start_time = repeat_details[rd].start_time;                                                                // 215
            end_time = repeat_details[rd].end_time;                                                                    // 216
            locationId = repeat_details[rd].location;                                                                  // 217
          }                                                                                                            // 218
        }                                                                                                              // 219
        scheduleClass.push({                                                                                           // 220
          skillClassId: skillClassId,                                                                                  // 221
          eventStartTime: start_time,                                                                                  // 222
          eventEndTime: end_time,                                                                                      // 223
          eventDay: day.format("dddd"),                                                                                // 224
          eventDate: day.toDate(),                                                                                     // 225
          locationId: locationId                                                                                       // 226
        });                                                                                                            // 220
      });                                                                                                              // 228
    }                                                                                                                  // 229
  }                                                                                                                    // 230
  return scheduleClass;                                                                                                // 231
};                                                                                                                     // 232
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ClassType.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/ClassType.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
class_type = "ClassType"; // avoid typos, this string occurs many times.                                               // 1
//                                                                                                                     //
ClassType = new Mongo.Collection(class_type);                                                                          // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
ClassType.attachSchema(new SimpleSchema({                                                                              // 9
    createdBy: {                                                                                                       // 10
        type: String,                                                                                                  // 11
        optional: true                                                                                                 // 12
    },                                                                                                                 // 10
    schoolId: {                                                                                                        // 14
        type: String,                                                                                                  // 15
        optional: true                                                                                                 // 16
    },                                                                                                                 // 14
    name: {                                                                                                            // 18
        type: String,                                                                                                  // 19
        optional: true                                                                                                 // 20
    },                                                                                                                 // 18
    desc: {                                                                                                            // 22
        type: String,                                                                                                  // 23
        optional: true                                                                                                 // 24
    },                                                                                                                 // 22
    skillTypeId: {                                                                                                     // 26
        type: String,                                                                                                  // 27
        optional: true                                                                                                 // 28
    },                                                                                                                 // 26
    classTypeImg: {                                                                                                    // 30
        type: String,                                                                                                  // 31
        optional: true                                                                                                 // 32
    },                                                                                                                 // 30
    classes: {                                                                                                         // 34
        type: [String],                                                                                                // 35
        optional: true                                                                                                 // 36
    },                                                                                                                 // 34
    tags: {                                                                                                            // 38
        type: String,                                                                                                  // 39
        optional: true                                                                                                 // 40
    }                                                                                                                  // 38
}));                                                                                                                   // 9
                                                                                                                       //
ClassType.allow({                                                                                                      // 44
    insert: function insert() {                                                                                        // 45
        return true;                                                                                                   // 46
    },                                                                                                                 // 47
    update: function update() {                                                                                        // 48
        return true;                                                                                                   // 49
    },                                                                                                                 // 50
    remove: function remove() {                                                                                        // 51
        return true;                                                                                                   // 52
    }                                                                                                                  // 53
});                                                                                                                    // 44
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 57
                                                                                                                       //
    ClassType._ensureIndex({ name: "text", desc: "text" });                                                            // 59
    Meteor.publish("classTypeBySchool", function (schoolId) {                                                          // 60
        return ClassType.find({ schoolId: schoolId });                                                                 // 61
    });                                                                                                                // 62
    Meteor.methods({                                                                                                   // 63
        "addClassType": function addClassType(doc) {                                                                   // 64
            return ClassType.insert(doc);                                                                              // 65
        },                                                                                                             // 66
        "updateClassType": function updateClassType(id, doc) {                                                         // 67
            return ClassType.update({ _id: id }, { $set: doc });                                                       // 68
        },                                                                                                             // 69
        "removeClassType": function removeClassType(id) {                                                              // 70
            SkillClass.remove({ classTypeId: id });                                                                    // 71
            ClassSchedule.remove({ skillClassId: id });                                                                // 72
            ClassType.remove({ _id: id });                                                                             // 73
        }                                                                                                              // 74
                                                                                                                       //
    });                                                                                                                // 63
}                                                                                                                      // 77
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Company.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Company.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CompanyImages = new FS.Collection("company_images", {                                                                  // 1
  stores: [new FS.Store.GridFS("company_images", {})]                                                                  // 2
});                                                                                                                    // 1
CompanyImages.allow({                                                                                                  // 4
  insert: function insert(userId, doc) {                                                                               // 5
    return true;                                                                                                       // 6
  },                                                                                                                   // 7
  update: function update(userId, doc, fieldNames, modifier) {                                                         // 8
    return true;                                                                                                       // 9
  },                                                                                                                   // 10
  download: function download(userId) {                                                                                // 11
    return true;                                                                                                       // 12
  },                                                                                                                   // 13
  remove: function remove(userId, parties) {                                                                           // 14
    return true;                                                                                                       // 15
  }                                                                                                                    // 16
});                                                                                                                    // 4
//                                                                                                                     //
                                                                                                                       //
company = "Company"; // avoid typos, this string occurs many times.                                                    // 20
//                                                                                                                     //
Company = new Mongo.Collection(company);                                                                               // 22
Company.before.insert(function (userId, doc) {                                                                         // 23
  doc.created_at = new Date();                                                                                         // 25
  if (doc.user_id == '' || doc.user_id == undefined) {                                                                 // 26
    doc.user_id = Meteor.userId();                                                                                     // 27
  }                                                                                                                    // 28
});                                                                                                                    // 29
if (Meteor.isServer) {                                                                                                 // 30
  Meteor.methods({                                                                                                     // 31
    /**                                                                                                                //
     * Invoked by AutoForm to add a new Company record.                                                                //
     * @param doc The Company document.                                                                                //
     */                                                                                                                //
    setCompanyAsBase: function setCompanyAsBase(company_id) {                                                          // 36
      console.log(company_id);                                                                                         // 37
      access_key = Meteor.user().profile.access_key;                                                                   // 38
      companys = Company.find({ access_key: access_key }).fetch();                                                     // 39
      for (var c = 0; c < companys.length; c++) {                                                                      // 40
        company = companys[c];                                                                                         // 41
        console.log(Company.update({ _id: company._id, user_id: Meteor.userId() }, { $set: { base_company: false } }));
      }                                                                                                                // 43
      Company.update({ access_key: access_key, _id: company_id }, { $set: { base_company: true } });                   // 44
    },                                                                                                                 // 45
    addCompany: function addCompany(doc) {                                                                             // 46
      check(doc, Company.simpleSchema());                                                                              // 47
      url = Meteor.absoluteUrl("api/company?user_id=" + Meteor.userId());                                              // 48
      var result = HTTP.post(url, { data: doc });                                                                      // 49
      return result;                                                                                                   // 50
      // Company.insert(doc);                                                                                          //
    },                                                                                                                 // 52
    /**                                                                                                                //
     *                                                                                                                 //
     * Invoked by AutoForm to update a Company record.                                                                 //
     * @param doc The Company document.                                                                                //
     * @param docID It's ID.                                                                                           //
     */                                                                                                                //
    editCompany: function editCompany(doc, docID) {                                                                    // 59
      check(doc, Company.simpleSchema());                                                                              // 60
      url = Meteor.absoluteUrl("api/company?user_id=" + Meteor.userId() + "&company_id=" + docID);                     // 61
      var result = HTTP.put(url, { data: doc });                                                                       // 62
      return result;                                                                                                   // 63
      //  Company.update({_id: docID}, doc);                                                                           //
    },                                                                                                                 // 65
    deleteComapny: function deleteComapny(id) {                                                                        // 66
      Company.remove({ _id: id });                                                                                     // 67
      return true;                                                                                                     // 68
    }                                                                                                                  // 69
  });                                                                                                                  // 31
  //                                                                                                                   //
  // Publish the entire Collection.  Subscription performed in the router.                                             //
                                                                                                                       //
  Meteor.publish(company, function (user_id) {                                                                         // 74
    if (user_id == undefined) {                                                                                        // 75
      return [];                                                                                                       // 76
    }                                                                                                                  // 77
    var user = Meteor.users.findOne({ _id: user_id });                                                                 // 78
    company_id = user.profile.company_id;                                                                              // 79
    access_key = user.profile.access_key;                                                                              // 80
    return Company.find({ $or: [{ user_id: user_id }, { _id: company_id }, { access_key: access_key }] });             // 81
  });                                                                                                                  // 82
  Meteor.publish("CompanyShow", function (user_id, id) {                                                               // 83
    return Company.find({ user_id: user_id, _id: id });                                                                // 84
  });                                                                                                                  // 85
  Meteor.publish('CompanyImages', function (user_id) {                                                                 // 86
    if (user_id == undefined) {                                                                                        // 87
      return [];                                                                                                       // 88
    }                                                                                                                  // 89
    var user = Meteor.users.findOne({ _id: user_id });                                                                 // 90
    company_id = user.profile.company_id;                                                                              // 91
    company = Company.find({ $or: [{ user_id: user_id }, { _id: company_id }] }).fetch()[0];                           // 92
    if (company) {                                                                                                     // 93
      return CompanyImages.find({ $or: [{ "metadata.admin_id": user_id }, { "metadata.company_id": company_id }] });   // 94
    } else {                                                                                                           // 95
      return [];                                                                                                       // 96
    }                                                                                                                  // 97
  });                                                                                                                  // 98
}                                                                                                                      // 99
/**                                                                                                                    //
 * Create the schema for Company                                                                                       //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Company.attachSchema(new SimpleSchema({                                                                                // 105
  name: {                                                                                                              // 106
    label: "Name",                                                                                                     // 107
    type: String,                                                                                                      // 108
    optional: false,                                                                                                   // 109
    autoform: {                                                                                                        // 110
      placeholder: "Enter Company Name"                                                                                // 111
    }                                                                                                                  // 110
  },                                                                                                                   // 106
  url: {                                                                                                               // 114
    label: "URL",                                                                                                      // 115
    type: String,                                                                                                      // 116
    optional: false,                                                                                                   // 117
    autoform: {                                                                                                        // 118
      placeholder: "URL of your website (http://...)"                                                                  // 119
    }                                                                                                                  // 118
  },                                                                                                                   // 114
  zip_post_code: {                                                                                                     // 122
    label: "Post/Zip Code",                                                                                            // 123
    optional: true,                                                                                                    // 124
    type: String,                                                                                                      // 125
    autoform: {                                                                                                        // 126
      placeholder: "Post/Zip Code"                                                                                     // 127
    }                                                                                                                  // 126
  },                                                                                                                   // 122
  address: {                                                                                                           // 130
    label: "Address",                                                                                                  // 131
    type: String,                                                                                                      // 132
    optional: true,                                                                                                    // 133
    autoform: {                                                                                                        // 134
      placeholder: "Enter your Business Address"                                                                       // 135
    }                                                                                                                  // 134
  },                                                                                                                   // 130
  created_at: {                                                                                                        // 138
    type: Date,                                                                                                        // 139
    optional: true,                                                                                                    // 140
    autoform: {                                                                                                        // 141
      placeholder: ""                                                                                                  // 142
    }                                                                                                                  // 141
  },                                                                                                                   // 138
  location: {                                                                                                          // 145
    type: String,                                                                                                      // 146
    optional: true,                                                                                                    // 147
    autoform: {                                                                                                        // 148
      placeholder: "Enter Location"                                                                                    // 149
    }                                                                                                                  // 148
  },                                                                                                                   // 145
  industry: {                                                                                                          // 152
    type: String,                                                                                                      // 153
    optional: true,                                                                                                    // 154
    autoform: {                                                                                                        // 155
      placeholder: "Choose an Industry"                                                                                // 156
    }                                                                                                                  // 155
  },                                                                                                                   // 152
  expertise: {                                                                                                         // 159
    type: String,                                                                                                      // 160
    optional: true,                                                                                                    // 161
    autoform: {                                                                                                        // 162
      placeholder: "Choose an Expertise"                                                                               // 163
    }                                                                                                                  // 162
  },                                                                                                                   // 159
  logo: {                                                                                                              // 166
    type: String,                                                                                                      // 167
    optional: true,                                                                                                    // 168
    autoform: {                                                                                                        // 169
      afFieldInput: {                                                                                                  // 170
        type: 'fileUpload',                                                                                            // 171
        collection: 'CompanyImages'                                                                                    // 172
      },                                                                                                               // 170
      placeholder: "Enter URL of your Logo"                                                                            // 174
    }                                                                                                                  // 169
  },                                                                                                                   // 166
  description: {                                                                                                       // 177
    type: String,                                                                                                      // 178
    optional: true,                                                                                                    // 179
    autoform: {                                                                                                        // 180
      placeholder: "Enter some Description"                                                                            // 181
    }                                                                                                                  // 180
  },                                                                                                                   // 177
  radius: {                                                                                                            // 184
    type: Number,                                                                                                      // 185
    optional: true,                                                                                                    // 186
    autoform: {                                                                                                        // 187
      placeholder: "Business Radius in miles"                                                                          // 188
    }                                                                                                                  // 187
  },                                                                                                                   // 184
  user_id: {                                                                                                           // 191
    type: String,                                                                                                      // 192
    optional: true,                                                                                                    // 193
    autoform: {                                                                                                        // 194
      placeholder: "user_id"                                                                                           // 195
    }                                                                                                                  // 194
  },                                                                                                                   // 191
  base_company: {                                                                                                      // 198
    type: Boolean,                                                                                                     // 199
    optional: true                                                                                                     // 200
  },                                                                                                                   // 198
  access_key: {                                                                                                        // 202
    type: String,                                                                                                      // 203
    optional: true                                                                                                     // 204
  }                                                                                                                    // 202
}));                                                                                                                   // 105
                                                                                                                       //
// company = new Meteor.Pagination(Company, {                                                                          //
//   itemTemplate: "Company",                                                                                          //
//   route: "/company/list/",                                                                                          //
//   homeRoute: '/company/list/',                                                                                      //
//   // router: false,                                                                                                 //
//   routerTemplate: "ListCompany",                                                                                    //
//   routerLayout: "Layout",                                                                                           //
//   divWrapper: false,                                                                                                //
//   sort: {                                                                                                           //
//     id: 1                                                                                                           //
//   },                                                                                                                //
//   templateName: "ListCompany",                                                                                      //
//   perPage:5,                                                                                                        //
//   auth: function(skip, sub) {                                                                                       //
//     var currrentUser = sub.userId;                                                                                  //
//      if (!currrentUser) { return []; }                                                                              //
//     if(currrentUser){                                                                                               //
//       var user = Meteor.users.findOne({_id:currrentUser});                                                          //
//       company_id = user.profile.company_id;                                                                         //
//       access_key = user.profile.access_key;                                                                         //
//       //Custom queries:                                                                                             //
//        var customOwnerFilters = {$or:[{user_id:currrentUser},{_id:company_id},{access_key:access_key}]}             //
//        //Edit custom settings if required:                                                                          //
//        var customSettings = {};                                                                                     //
//       //  customSettings.fields = {address: 1}; //This is the only field that will be shown                         //
//        customSettings.filters = customOwnerFilters                                                                  //
//                                                                                                                     //
//        //Leave this part untouched:                                                                                 //
//        var fields = customSettings.fields || this.fields                                                            //
//            , sort = customSettings.sort || this.sort //Since I haven't supplied this field, the Pagination sort I've configured above will be used (=2)
//            , perPage = customSettings.perPage || this.perPage //Same as the line above                              //
//            , _filters = _.extend({}, customSettings.filters, this.filters)                                          //
//            , _options = { fields: fields, sort: sort, limit: perPage, skip: skip };                                 //
//        return [ _filters, _options ];                                                                               //
//     }                                                                                                               //
//   }                                                                                                                 //
// });                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Demand.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Demand.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
demand = "Demand"; // avoid typos, this string occurs many times.                                                      // 1
classDemand = "ClassDemand";                                                                                           // 2
//                                                                                                                     //
Demand = new Mongo.Collection(demand);                                                                                 // 4
ClassDemand = new Mongo.Collection(classDemand);                                                                       // 5
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Demand.attachSchema(new SimpleSchema({                                                                                 // 11
  userId: {                                                                                                            // 12
    type: String,                                                                                                      // 13
    optional: true                                                                                                     // 14
  }, schoolId: {                                                                                                       // 12
    type: String,                                                                                                      // 16
    optional: true                                                                                                     // 17
  },                                                                                                                   // 15
  classTypeId: {                                                                                                       // 19
    type: String,                                                                                                      // 20
    optional: true                                                                                                     // 21
  }, dateOfJoin: {                                                                                                     // 19
    type: Date,                                                                                                        // 23
    optional: true                                                                                                     // 24
  },                                                                                                                   // 22
  classId: {                                                                                                           // 26
    type: String,                                                                                                      // 27
    optional: true                                                                                                     // 28
  }                                                                                                                    // 26
}));                                                                                                                   // 11
ClassDemand.attachSchema(new SimpleSchema({                                                                            // 31
  userId: {                                                                                                            // 32
    type: String,                                                                                                      // 33
    optional: true                                                                                                     // 34
  }, schoolId: {                                                                                                       // 32
    type: String,                                                                                                      // 36
    optional: true                                                                                                     // 37
  },                                                                                                                   // 35
  classTypeId: {                                                                                                       // 39
    type: String,                                                                                                      // 40
    optional: true                                                                                                     // 41
  }, dateOfRequest: {                                                                                                  // 39
    type: Date,                                                                                                        // 43
    optional: true                                                                                                     // 44
  },                                                                                                                   // 42
  classId: {                                                                                                           // 46
    type: String,                                                                                                      // 47
    optional: true                                                                                                     // 48
  }                                                                                                                    // 46
}));                                                                                                                   // 31
if (Meteor.isServer) {                                                                                                 // 51
  var userClassJoin = function userClassJoin(user, school, skillClass) {                                               // 52
    var fromEmail = "admin@techmeetups.com";                                                                           // 54
    var toEmail = user.emails[0].address;                                                                              // 55
    Email.send({                                                                                                       // 56
      from: fromEmail,                                                                                                 // 57
      to: toEmail,                                                                                                     // 58
      replyTo: fromEmail,                                                                                              // 59
      subject: "skillshape Class Join Notification",                                                                   // 60
      text: "Hi " + user.emails[0].address + ",\nYou Join for " + skillClass.className + " at " + school.name + "\nFor more details please login " + Meteor.absoluteUrl() + "\n\n" + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
      // + "http://www.graphical.io/assets/img/Graphical-IO.png"                                                       //
    });                                                                                                                // 56
    Email.send({                                                                                                       // 67
      from: fromEmail,                                                                                                 // 68
      to: fromEmail,                                                                                                   // 69
      replyTo: fromEmail,                                                                                              // 70
      subject: "skillshape Class Join Notification",                                                                   // 71
      text: "Hi,\n User email :  " + user.emails[0].address + ",\n is requested for join " + skillClass.className + " at " + school.name + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
      // + "http://www.graphical.io/assets/img/Graphical-IO.png"                                                       //
    });                                                                                                                // 67
  };                                                                                                                   // 77
                                                                                                                       //
  Meteor.publish(demand, function (user_id) {                                                                          // 79
    return Demand.find({ userId: user_id });                                                                           // 80
  });                                                                                                                  // 81
  Meteor.publish("demandUser", function (classId) {                                                                    // 82
                                                                                                                       //
    console.log(classId);                                                                                              // 84
    demand = Demand.find({ classId: classId }).fetch();                                                                // 85
    user = demand.map(function (e) {                                                                                   // 86
      return e.userId;                                                                                                 // 86
    });                                                                                                                // 86
    return [Meteor.users.find({ _id: { $in: user } }), Demand.find({ classId: classId })];                             // 87
  });                                                                                                                  // 88
                                                                                                                       //
  Meteor.methods({                                                                                                     // 90
    addEmbadDemandWithUser: function addEmbadDemandWithUser(user, doc, school, skillClass) {                           // 91
      userId = Accounts.createUser(user);                                                                              // 92
      doc['userId'] = userId;                                                                                          // 93
      var classTypeId = doc.classTypeId;                                                                               // 94
      user_id = doc.userId;                                                                                            // 95
      var class_id = doc.classId;                                                                                      // 96
      user = Meteor.users.findOne({ _id: user_id });                                                                   // 97
      classIds = [];                                                                                                   // 98
      if (user.profile) {                                                                                              // 99
        if (user.profile.classIds) {                                                                                   // 100
          classIds = user.profile.classIds;                                                                            // 101
        } else {                                                                                                       // 102
          classIds = [];                                                                                               // 103
        }                                                                                                              // 104
      }                                                                                                                // 105
      if (!(classIds.indexOf(class_id) > -1)) {                                                                        // 106
        Meteor.users.update({ _id: user_id }, { $push: { "profile.classIds": class_id } });                            // 107
        doc['schoolId'] = school._id;                                                                                  // 108
        doc['dateOfJoin'] = new Date();                                                                                // 109
        user_id = doc.userId;                                                                                          // 110
        user = Meteor.users.findOne({ _id: user_id });                                                                 // 111
        Demand.insert(doc);                                                                                            // 112
        userClassJoin(user, school, skillClass);                                                                       // 113
        return true;                                                                                                   // 114
      } else {                                                                                                         // 115
        return false;                                                                                                  // 116
      }                                                                                                                // 117
    },                                                                                                                 // 118
    addEmbadDemand: function addEmbadDemand(doc, school, skillClass) {                                                 // 119
      var classTypeId = doc.classTypeId;                                                                               // 120
      user_id = doc.userId;                                                                                            // 121
      var class_id = doc.classId;                                                                                      // 122
      user = Meteor.users.findOne({ _id: user_id });                                                                   // 123
      classIds = [];                                                                                                   // 124
      if (user.profile) {                                                                                              // 125
        if (user.profile.classIds) {                                                                                   // 126
          classIds = user.profile.classIds;                                                                            // 127
        } else {                                                                                                       // 128
          classIds = [];                                                                                               // 129
        }                                                                                                              // 130
      }                                                                                                                // 131
      if (!(classIds.indexOf(class_id) > -1)) {                                                                        // 132
        Meteor.users.update({ _id: user_id }, { $push: { "profile.classIds": class_id } });                            // 133
        doc['schoolId'] = school._id;                                                                                  // 134
        doc['dateOfJoin'] = new Date();                                                                                // 135
        user_id = doc.userId;                                                                                          // 136
        user = Meteor.users.findOne({ _id: user_id });                                                                 // 137
        Demand.insert(doc);                                                                                            // 138
        userClassJoin(user, school, skillClass);                                                                       // 139
        return true;                                                                                                   // 140
      } else {                                                                                                         // 141
        return false;                                                                                                  // 142
      }                                                                                                                // 143
    },                                                                                                                 // 144
    addDemand: function addDemand(doc) {                                                                               // 145
      var classTypeId = doc.classTypeId;                                                                               // 146
      user_id = doc.userId;                                                                                            // 147
      var class_id = doc.classId;                                                                                      // 148
      Meteor.users.update({ _id: user_id }, { $push: { "profile.classIds": class_id } });                              // 149
      class_type = ClassType.findOne({ _id: classTypeId });                                                            // 150
      console.log(class_type);                                                                                         // 151
      doc['schoolId'] = class_type.schoolId;                                                                           // 152
      doc['dateOfJoin'] = new Date();                                                                                  // 153
      return Demand.insert(doc);                                                                                       // 154
    },                                                                                                                 // 155
    RemoveFromUser: function RemoveFromUser(classId, userId) {                                                         // 156
      Meteor.users.update({ _id: userId }, { $pull: { "profile.classIds": classId } });                                // 157
      return true;                                                                                                     // 158
    },                                                                                                                 // 159
    addClassDemand: function addClassDemand(doc) {                                                                     // 160
      classDemand = ClassDemand.findOne({ classTypeId: doc.classTypeId, userId: doc.userId });                         // 161
      if (classDemand) {                                                                                               // 162
        ClassDemand.update({ _id: classDemand._id }, { $set: { dateOfRequest: new Date() } });                         // 163
      } else {                                                                                                         // 164
        doc.dateOfRequest = new Date();                                                                                // 165
        ClassDemand.insert(doc);                                                                                       // 166
      }                                                                                                                // 167
      return true;                                                                                                     // 168
    }                                                                                                                  // 169
  });                                                                                                                  // 90
}                                                                                                                      // 171
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Evaluation.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Evaluation.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
evaluation = "Evaluation"; // avoid typos, this string occurs many times.                                              // 1
//                                                                                                                     //
Evaluation = new Mongo.Collection(evaluation);                                                                         // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Evaluation.attachSchema(new SimpleSchema({                                                                             // 9
  evaluationTypeId: {                                                                                                  // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, evaluationSubTypeId: {                                                                                            // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  },                                                                                                                   // 13
  classId: {                                                                                                           // 17
    type: String,                                                                                                      // 18
    optional: true                                                                                                     // 19
  },                                                                                                                   // 17
  studentId: {                                                                                                         // 21
    type: String,                                                                                                      // 22
    optional: true                                                                                                     // 23
  },                                                                                                                   // 21
  affectStudentId: {                                                                                                   // 25
    type: String,                                                                                                      // 26
    optional: true                                                                                                     // 27
  },                                                                                                                   // 25
  instructorId: {                                                                                                      // 29
    type: String,                                                                                                      // 30
    optional: true                                                                                                     // 31
  },                                                                                                                   // 29
  notes: {                                                                                                             // 33
    type: String,                                                                                                      // 34
    optional: true                                                                                                     // 35
  }, score: {                                                                                                          // 33
    type: String,                                                                                                      // 37
    optional: true                                                                                                     // 38
  }, levelScoreId: {                                                                                                   // 36
    type: String,                                                                                                      // 40
    optional: true                                                                                                     // 41
  }, skillId: {                                                                                                        // 39
    type: String,                                                                                                      // 43
    optional: true                                                                                                     // 44
  },                                                                                                                   // 42
  mediaList: {                                                                                                         // 46
    type: [String],                                                                                                    // 47
    optional: true                                                                                                     // 48
  }                                                                                                                    // 46
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"EvaluationType.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/EvaluationType.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       //
evaluation_type = "EvaluationType"; // avoid typos, this string occurs many times.                                     // 2
//                                                                                                                     //
EvaluationType = new Mongo.Collection(evaluation_type);                                                                // 4
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
EvaluationType.attachSchema(new SimpleSchema({                                                                         // 10
  evaluationType: {                                                                                                    // 11
    type: String,                                                                                                      // 12
    optional: true                                                                                                     // 13
  }, evaluationSubType: {                                                                                              // 11
    type: String,                                                                                                      // 15
    optional: true                                                                                                     // 16
  }, evaluationSubType: {                                                                                              // 14
    type: [String],                                                                                                    // 18
    optional: true                                                                                                     // 19
  },                                                                                                                   // 17
  notes: {                                                                                                             // 21
    type: String,                                                                                                      // 22
    optional: true                                                                                                     // 23
  },                                                                                                                   // 21
  hasScore: {                                                                                                          // 25
    type: String,                                                                                                      // 26
    optional: true                                                                                                     // 27
  }, skillMandatory: {                                                                                                 // 25
    type: String,                                                                                                      // 29
    optional: true                                                                                                     // 30
  }                                                                                                                    // 28
}));                                                                                                                   // 10
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Level.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Level.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
level = "Level"; // avoid typos, this string occurs many times.                                                        // 1
//                                                                                                                     //
Level = new Mongo.Collection(level);                                                                                   // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Level.attachSchema(new SimpleSchema({                                                                                  // 9
  title: {                                                                                                             // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, requirement: {                                                                                                    // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  }, sequence: {                                                                                                       // 13
    type: String,                                                                                                      // 17
    optional: true                                                                                                     // 18
  }, programId: {                                                                                                      // 16
    type: String,                                                                                                      // 20
    optional: true                                                                                                     // 21
  }, minTime: {                                                                                                        // 19
    type: String,                                                                                                      // 23
    optional: true                                                                                                     // 24
  }                                                                                                                    // 22
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Media.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Media.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
media = "Media"; // avoid typos, this string occurs many times.                                                        // 1
//                                                                                                                     //
Media = new Mongo.Collection(media);                                                                                   // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Media.attachSchema(new SimpleSchema({                                                                                  // 9
  mType: {                                                                                                             // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, mFormat: {                                                                                                        // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  }, title: {                                                                                                          // 13
    type: String,                                                                                                      // 17
    optional: true                                                                                                     // 18
  }, desc: {                                                                                                           // 16
    type: String,                                                                                                      // 20
    optional: true                                                                                                     // 21
  }, sourcePath: {                                                                                                     // 19
    type: String,                                                                                                      // 23
    optional: true                                                                                                     // 24
  }, studentId: {                                                                                                      // 22
    type: String,                                                                                                      // 26
    optional: true                                                                                                     // 27
  }, instrcutorId: {                                                                                                   // 25
    type: String,                                                                                                      // 29
    optional: true                                                                                                     // 30
  }, skillId: {                                                                                                        // 28
    type: String,                                                                                                      // 32
    optional: true                                                                                                     // 33
  }, createdBy: {                                                                                                      // 31
    type: String,                                                                                                      // 35
    optional: true                                                                                                     // 36
  }, createdAt: {                                                                                                      // 34
    type: Date,                                                                                                        // 38
    optional: true                                                                                                     // 39
  }                                                                                                                    // 37
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Module.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Module.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module = "Module"; // avoid typos, this string occurs many times.                                                      // 1
//                                                                                                                     //
Module = new Mongo.Collection(module);                                                                                 // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Module.attachSchema(new SimpleSchema({                                                                                 // 9
  skillId: {                                                                                                           // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, name: {                                                                                                           // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  },                                                                                                                   // 13
  timeMins: {                                                                                                          // 17
    type: String,                                                                                                      // 18
    optional: true                                                                                                     // 19
  }                                                                                                                    // 17
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MonthlyPricing.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/MonthlyPricing.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
monthly_pricing = "MonthlyPricing"; // avoid typos, this string occurs many times.                                     // 1
//                                                                                                                     //
MonthlyPricing = new Mongo.Collection(monthly_pricing);                                                                // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
MonthlyPricing.attachSchema(new SimpleSchema({                                                                         // 9
  packageName: {                                                                                                       // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, pymtType: {                                                                                                       // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  }, classTypeId: {                                                                                                    // 13
    type: String,                                                                                                      // 17
    optional: true                                                                                                     // 18
  },                                                                                                                   // 16
  oneMonCost: {                                                                                                        // 20
    type: Number,                                                                                                      // 21
    optional: true                                                                                                     // 22
  },                                                                                                                   // 20
  threeMonCost: {                                                                                                      // 24
    type: Number,                                                                                                      // 25
    optional: true                                                                                                     // 26
  }, sixMonCost: {                                                                                                     // 24
    type: Number,                                                                                                      // 28
    optional: true                                                                                                     // 29
  }, annualCost: {                                                                                                     // 27
    type: Number,                                                                                                      // 31
    optional: true                                                                                                     // 32
  }, lifetimeCost: {                                                                                                   // 30
    type: Number,                                                                                                      // 34
    optional: true                                                                                                     // 35
  },                                                                                                                   // 33
  schoolId: {                                                                                                          // 37
    type: String,                                                                                                      // 38
    optional: true                                                                                                     // 39
  }                                                                                                                    // 37
}));                                                                                                                   // 9
if (Meteor.isServer) {                                                                                                 // 42
  Meteor.publish("MonthlyPricing", function (schoolId) {                                                               // 43
    return MonthlyPricing.find({ schoolId: schoolId });                                                                // 44
  });                                                                                                                  // 45
  Meteor.methods({                                                                                                     // 46
    addMonthlyPackages: function addMonthlyPackages(doc) {                                                             // 47
      return MonthlyPricing.insert(doc);                                                                               // 48
    },                                                                                                                 // 49
    updateMonthlyPackages: function updateMonthlyPackages(id, doc) {                                                   // 50
      return MonthlyPricing.update({ _id: id }, { $set: doc });                                                        // 51
    },                                                                                                                 // 52
    removeMonthlyPackages: function removeMonthlyPackages(id) {                                                        // 53
      return MonthlyPricing.remove({ _id: id });                                                                       // 54
    }                                                                                                                  // 55
  });                                                                                                                  // 46
}                                                                                                                      // 57
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Program.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Program.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
program = "Program"; // avoid typos, this string occurs many times.                                                    // 1
//                                                                                                                     //
Program = new Mongo.Collection(program);                                                                               // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Program.attachSchema(new SimpleSchema({                                                                                // 9
  name: {                                                                                                              // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, schoolId: {                                                                                                       // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  }, description: {                                                                                                    // 13
    type: String,                                                                                                      // 17
    optional: true                                                                                                     // 18
  }, levelCount: {                                                                                                     // 16
    type: String,                                                                                                      // 20
    optional: true                                                                                                     // 21
  }, defaultMinmaxOrLevel: {                                                                                           // 19
    type: String,                                                                                                      // 23
    optional: true                                                                                                     // 24
  }, scoreMin: {                                                                                                       // 22
    type: String,                                                                                                      // 26
    optional: true                                                                                                     // 27
  },                                                                                                                   // 25
  scoreMax: {                                                                                                          // 29
    type: String,                                                                                                      // 30
    optional: true                                                                                                     // 31
  }                                                                                                                    // 29
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SLocation.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/SLocation.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
s_location = "SLocation"; // avoid typos, this string occurs many times.                                               // 1
//                                                                                                                     //
SLocation = new Mongo.Collection(s_location);                                                                          // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
                                                                                                                       //
Schema = {};                                                                                                           // 10
Schema.Room = new SimpleSchema({                                                                                       // 11
    id: {                                                                                                              // 12
        optional: true,                                                                                                // 13
        type: String                                                                                                   // 14
    }, name: {                                                                                                         // 12
        optional: true,                                                                                                // 16
        type: String                                                                                                   // 17
    },                                                                                                                 // 15
    capicity: {                                                                                                        // 19
        optional: true,                                                                                                // 20
        type: Number                                                                                                   // 21
    }                                                                                                                  // 19
});                                                                                                                    // 11
SLocation.attachSchema(new SimpleSchema({                                                                              // 24
    createdBy: {                                                                                                       // 25
        type: String,                                                                                                  // 26
        optional: true                                                                                                 // 27
    },                                                                                                                 // 25
    schoolId: {                                                                                                        // 29
        type: String,                                                                                                  // 30
        optional: true                                                                                                 // 31
    },                                                                                                                 // 29
    title: {                                                                                                           // 33
        type: String,                                                                                                  // 34
        optional: true                                                                                                 // 35
    },                                                                                                                 // 33
    address: {                                                                                                         // 37
        type: String,                                                                                                  // 38
        optional: true                                                                                                 // 39
    },                                                                                                                 // 37
    geoLat: {                                                                                                          // 41
        type: String,                                                                                                  // 42
        optional: true                                                                                                 // 43
    },                                                                                                                 // 41
    geoLong: {                                                                                                         // 45
        type: String,                                                                                                  // 46
        optional: true                                                                                                 // 47
    },                                                                                                                 // 45
    maxCapacity: {                                                                                                     // 49
        type: String,                                                                                                  // 50
        optional: true                                                                                                 // 51
    },                                                                                                                 // 49
    city: {                                                                                                            // 53
        type: String,                                                                                                  // 54
        optional: true                                                                                                 // 55
    },                                                                                                                 // 53
    state: {                                                                                                           // 57
        type: String,                                                                                                  // 58
        optional: true                                                                                                 // 59
    },                                                                                                                 // 57
    neighbourhood: {                                                                                                   // 61
        type: String,                                                                                                  // 62
        optional: true                                                                                                 // 63
    },                                                                                                                 // 61
    zip: {                                                                                                             // 65
        type: String,                                                                                                  // 66
        optional: true                                                                                                 // 67
    },                                                                                                                 // 65
    country: {                                                                                                         // 69
        type: String,                                                                                                  // 70
        optional: true                                                                                                 // 71
    },                                                                                                                 // 69
    loc: {                                                                                                             // 73
        type: [Number], // [<longitude>, <latitude>]                                                                   // 74
        index: '2d', // create the geospatial index                                                                    // 75
        optional: true,                                                                                                // 76
        decimal: true                                                                                                  // 77
    },                                                                                                                 // 73
    "rooms.$": {                                                                                                       // 79
        type: Schema.Room,                                                                                             // 80
        optional: true                                                                                                 // 81
    }                                                                                                                  // 79
}));                                                                                                                   // 24
if (Meteor.isServer) {                                                                                                 // 84
    Meteor.publish("SchoolLocation", function (schoolId) {                                                             // 85
        return SLocation.find({ schoolId: schoolId });                                                                 // 86
    });                                                                                                                // 87
    SLocation._ensureIndex({ loc: "2d" });                                                                             // 88
    /*SLocation._ensureIndex({ loc: "2dsphere" });*/                                                                   //
    /*createIndex({point:"2dsphere"});*/                                                                               //
    Meteor.methods({                                                                                                   // 91
        addLocation: function addLocation(data) {                                                                      // 92
            return SLocation.insert(data);                                                                             // 93
        },                                                                                                             // 94
        editLocation: function editLocation(id, data) {                                                                // 95
            return SLocation.update({ _id: id }, { $set: data });                                                      // 96
        },                                                                                                             // 97
        removeLocation: function removeLocation(id) {                                                                  // 98
            SLocation.remove({ _id: id });                                                                             // 99
        },                                                                                                             // 100
        addRoom: function addRoom(data, location, action) {                                                            // 101
            console.log(data);                                                                                         // 102
            console.log(location);                                                                                     // 103
            console.log(action);                                                                                       // 104
            if (action == "new") {                                                                                     // 105
                return SLocation.update({ _id: location }, { $push: { "rooms": data } });                              // 106
            } else {                                                                                                   // 107
                SLocation.update({ _id: location }, { $pull: { "rooms": { id: data.id } } }, { multi: true });         // 108
                return SLocation.update({ _id: location }, { $push: { "rooms": data } });                              // 109
            }                                                                                                          // 110
        },                                                                                                             // 112
        roomRemove: function roomRemove(id, location) {                                                                // 113
            SLocation.update({ _id: location }, { $pull: { "rooms": { id: id } } }, { multi: true });                  // 114
            return true;                                                                                               // 115
        }                                                                                                              // 116
    });                                                                                                                // 91
}                                                                                                                      // 118
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"School.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/School.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
school = "School"; // avoid typos, this string occurs many times.                                                      // 1
//                                                                                                                     //
School = new Mongo.Collection(school);                                                                                 // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Schema = {};                                                                                                           // 9
Schema.Media = new SimpleSchema({                                                                                      // 10
  mediaType: {                                                                                                         // 11
    optional: true,                                                                                                    // 12
    type: String                                                                                                       // 13
  },                                                                                                                   // 11
  fileName: {                                                                                                          // 15
    optional: true,                                                                                                    // 16
    type: String                                                                                                       // 17
  },                                                                                                                   // 15
  fileSize: {                                                                                                          // 19
    optional: true,                                                                                                    // 20
    type: String                                                                                                       // 21
  },                                                                                                                   // 19
  filePath: {                                                                                                          // 23
    optional: true,                                                                                                    // 24
    type: String                                                                                                       // 25
  },                                                                                                                   // 23
  contentType: {                                                                                                       // 27
    optional: true,                                                                                                    // 28
    type: String                                                                                                       // 29
  }                                                                                                                    // 27
});                                                                                                                    // 10
School.attachSchema(new SimpleSchema({                                                                                 // 32
  is_publish: {                                                                                                        // 33
    type: String,                                                                                                      // 34
    optional: true                                                                                                     // 35
  },                                                                                                                   // 33
  name: {                                                                                                              // 37
    type: String,                                                                                                      // 38
    optional: true                                                                                                     // 39
  },                                                                                                                   // 37
  website: {                                                                                                           // 41
    type: String,                                                                                                      // 42
    optional: true                                                                                                     // 43
  },                                                                                                                   // 41
  phone: {                                                                                                             // 45
    type: String,                                                                                                      // 46
    optional: true                                                                                                     // 47
  },                                                                                                                   // 45
  schooldesc: {                                                                                                        // 49
    type: String,                                                                                                      // 50
    optional: true                                                                                                     // 51
  },                                                                                                                   // 49
  address: {                                                                                                           // 53
    type: String,                                                                                                      // 54
    optional: true                                                                                                     // 55
  },                                                                                                                   // 53
  schoolGroupId: {                                                                                                     // 57
    type: String,                                                                                                      // 58
    optional: true                                                                                                     // 59
  },                                                                                                                   // 57
  tag: {                                                                                                               // 61
    type: String,                                                                                                      // 62
    optional: true                                                                                                     // 63
  },                                                                                                                   // 61
  quote: {                                                                                                             // 65
    type: String,                                                                                                      // 66
    optional: true                                                                                                     // 67
  },                                                                                                                   // 65
  message: {                                                                                                           // 69
    type: String,                                                                                                      // 70
    optional: true                                                                                                     // 71
  },                                                                                                                   // 69
  categoryCalled: {                                                                                                    // 73
    type: String,                                                                                                      // 74
    optional: true                                                                                                     // 75
  },                                                                                                                   // 73
  subjectCalled: {                                                                                                     // 77
    type: String,                                                                                                      // 78
    optional: true                                                                                                     // 79
  },                                                                                                                   // 77
  levelCalled: {                                                                                                       // 81
    type: String,                                                                                                      // 82
    optional: true                                                                                                     // 83
  },                                                                                                                   // 81
  phone: {                                                                                                             // 85
    type: String,                                                                                                      // 86
    optional: true                                                                                                     // 87
  },                                                                                                                   // 85
  claimed: {                                                                                                           // 89
    type: String,                                                                                                      // 90
    optional: true                                                                                                     // 91
  },                                                                                                                   // 89
  logoImg: {                                                                                                           // 93
    type: String,                                                                                                      // 94
    optional: true                                                                                                     // 95
  },                                                                                                                   // 93
  topBarColor: {                                                                                                       // 97
    type: String,                                                                                                      // 98
    optional: true                                                                                                     // 99
  },                                                                                                                   // 97
  bodyColour: {                                                                                                        // 101
    type: String,                                                                                                      // 102
    optional: true                                                                                                     // 103
  },                                                                                                                   // 101
  backGroundVideoUrl: {                                                                                                // 105
    type: String,                                                                                                      // 106
    optional: true                                                                                                     // 107
  },                                                                                                                   // 105
  moduleColour: {                                                                                                      // 109
    type: String,                                                                                                      // 110
    optional: true                                                                                                     // 111
  },                                                                                                                   // 109
  font: {                                                                                                              // 113
    type: String,                                                                                                      // 114
    optional: true                                                                                                     // 115
  },                                                                                                                   // 113
  mainImage: {                                                                                                         // 117
    type: String,                                                                                                      // 118
    optional: true                                                                                                     // 119
  },                                                                                                                   // 117
  aboutHtml: {                                                                                                         // 121
    type: String,                                                                                                      // 122
    optional: true                                                                                                     // 123
  },                                                                                                                   // 121
  descHtml: {                                                                                                          // 125
    type: String,                                                                                                      // 126
    optional: true                                                                                                     // 127
  },                                                                                                                   // 125
  scoreMin: {                                                                                                          // 129
    type: String,                                                                                                      // 130
    optional: true                                                                                                     // 131
  },                                                                                                                   // 129
  scoreMax: {                                                                                                          // 133
    type: String,                                                                                                      // 134
    optional: true                                                                                                     // 135
  },                                                                                                                   // 133
  mediaList: {                                                                                                         // 137
    type: [Schema.Media],                                                                                              // 138
    optional: true                                                                                                     // 139
  },                                                                                                                   // 137
  userId: {                                                                                                            // 141
    type: String,                                                                                                      // 142
    optional: true                                                                                                     // 143
  },                                                                                                                   // 141
  email: {                                                                                                             // 145
    type: String,                                                                                                      // 146
    optional: true                                                                                                     // 147
  }                                                                                                                    // 145
}));                                                                                                                   // 32
School.friendlySlugs({                                                                                                 // 150
  slugFrom: 'name',                                                                                                    // 152
  slugField: 'slug',                                                                                                   // 153
  distinct: true,                                                                                                      // 154
  updateSlug: true                                                                                                     // 155
});                                                                                                                    // 151
if (Meteor.isServer) {                                                                                                 // 158
  var emailRegex;                                                                                                      // 158
                                                                                                                       //
  (function () {                                                                                                       // 158
    var CreateNewUser = function CreateNewUser(email, name, firstName, lastName) {                                     // 158
      if (typeof email !== "undefined" && emailRegex.test(email)) {                                                    // 814
        var _user = Accounts.findUserByEmail(email);                                                                   // 815
        if (!_user) {                                                                                                  // 816
          return Accounts.createUser({                                                                                 // 817
            email: email, password: email,                                                                             // 818
            profile: { firstName: firstName, lastName: lastName },                                                     // 819
            roles: "Admin",                                                                                            // 820
            preverfiedUser: true                                                                                       // 821
          });                                                                                                          // 817
        } else {                                                                                                       // 823
          return _user._id;                                                                                            // 824
        }                                                                                                              // 825
      }                                                                                                                // 826
      return false;                                                                                                    // 827
    };                                                                                                                 // 828
                                                                                                                       //
    emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;                                                    // 159
                                                                                                                       //
    School._ensureIndex({ name: "text", website: "text" });                                                            // 160
    Meteor.publish(school, function (user_id, coords, skill, classPrice, monthPrice, textSearch, limit, selectedTag) {
      limit = limit;                                                                                                   // 162
                                                                                                                       //
      class_filter = {};                                                                                               // 164
      classTypeFilter = {};                                                                                            // 165
      allClassIds = [];                                                                                                // 166
      allClassTypeIds = [];                                                                                            // 167
      schoolList = School.find({ is_publish: 'N' }).fetch();                                                           // 168
      nSchoolIds = schoolList.map(function (a) {                                                                       // 169
        return a._id;                                                                                                  // 169
      });                                                                                                              // 169
      if (textSearch) {                                                                                                // 170
        textSearchfilter = { $text: { $search: textSearch, $caseSensitive: true } };                                   // 171
        console.log(textSearchfilter);                                                                                 // 172
        schools = School.find(textSearchfilter).fetch();                                                               // 173
        if (schools.length > 0) {                                                                                      // 174
          schoolIds = schools.map(function (a) {                                                                       // 175
            return a._id;                                                                                              // 176
          });                                                                                                          // 177
          console.log(schoolIds);                                                                                      // 178
          schoolClass = SkillClass.find({ schoolId: { $in: schoolIds } }).fetch();                                     // 179
          allClassIds = schoolClass.map(function (a) {                                                                 // 180
            return a._id;                                                                                              // 181
          });                                                                                                          // 182
          allClassTypeIds = schoolClass.map(function (a) {                                                             // 183
            return a.classTypeId;                                                                                      // 184
          });                                                                                                          // 185
        }                                                                                                              // 186
        classd = SkillClass.find(textSearchfilter).fetch();                                                            // 187
        classIds = classd.map(function (a) {                                                                           // 188
          return a._id;                                                                                                // 189
        });                                                                                                            // 190
        if (allClassIds.length > 0) {                                                                                  // 191
          allClassIds = classIds.concat(allClassIds);                                                                  // 192
        }                                                                                                              // 193
        console.log(classd);                                                                                           // 194
        classTypeIds = classd.map(function (a) {                                                                       // 195
          return a.classTypeId;                                                                                        // 196
        });                                                                                                            // 197
        if (allClassTypeIds.length > 0) {                                                                              // 198
          classTypeIds = classTypeIds.concat(allClassTypeIds);                                                         // 199
        }                                                                                                              // 200
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 201
        limit = { limit: limit };                                                                                      // 202
        console.log(allClassIds);                                                                                      // 203
        class_filter = { _id: { $in: allClassIds } };                                                                  // 204
        class_filter.schoolId = { $nin: nSchoolIds };                                                                  // 205
        classTypeFilter.schoolId = { $nin: nSchoolIds };                                                               // 206
                                                                                                                       //
        skillCursor = SkillClass.find(class_filter, limit);                                                            // 208
        skillResult = skillCursor.fetch();                                                                             // 209
        classTypeIds = skillResult.map(function (a) {                                                                  // 210
          return a.classTypeId;                                                                                        // 210
        });                                                                                                            // 210
        schoolIds = skillResult.map(function (a) {                                                                     // 211
          return a.schoolId;                                                                                           // 211
        });                                                                                                            // 211
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 212
        schoolFilter = { _id: { $in: schoolIds } };                                                                    // 213
                                                                                                                       //
        return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
      }                                                                                                                // 216
      if (coords) {                                                                                                    // 217
        // place variable will have all the information you are looking for.                                           //
        var maxDistance = 50;                                                                                          // 219
        // we need to convert the distance to radians                                                                  //
        // the raduis of Earth is approximately 6371 kilometers                                                        //
        maxDistance /= 63;                                                                                             // 222
        try {                                                                                                          // 223
          slocations = SLocation.find({                                                                                // 224
            /*loc: {                                                                                                   //
              $near : {$geometry:{type: "Point",coordinates:coords}, $maxDistance:50000}                               //
            }*/                                                                                                        //
            loc: {                                                                                                     // 228
              $near: coords,                                                                                           // 229
              $maxDistance: maxDistance                                                                                // 230
            }                                                                                                          // 228
            /*$maxDistance: maxDistance*/                                                                              //
                                                                                                                       //
          }).fetch();                                                                                                  // 224
        } catch (e) {                                                                                                  // 235
          slocations = [];                                                                                             // 236
        }                                                                                                              // 237
                                                                                                                       //
        locaion_ids = slocations.map(function (a) {                                                                    // 239
          return a._id;                                                                                                // 240
        });                                                                                                            // 241
        class_filter = { locationId: { $in: locaion_ids } };                                                           // 242
        skillClass = SkillClass.find(class_filter);                                                                    // 243
        tmpClassIds = skillClass.map(function (a) {                                                                    // 244
          return a._id;                                                                                                // 245
        });                                                                                                            // 246
        schoolIds = skillClass.map(function (a) {                                                                      // 247
          return a.schoolId;                                                                                           // 248
        });                                                                                                            // 249
        if (tmpClassIds.length < 1) {                                                                                  // 250
          tmpClassIds.push("000000000");                                                                               // 251
        }                                                                                                              // 252
        allClassIds = tmpClassIds;                                                                                     // 253
        /*class_type = ClassType.find({schoolId:{$in:schoolIds}}).fetch()                                              //
        classTypeIds = class_type.map(function(a) {                                                                    //
                      return a._id;                                                                                    //
        });*/                                                                                                          //
                                                                                                                       //
        class_type = ClassType.find({ schoolId: { $in: schoolIds } }).fetch();                                         // 259
        classTypeIds = class_type.map(function (a) {                                                                   // 260
          return a._id;                                                                                                // 261
        });                                                                                                            // 262
        if (skill) {                                                                                                   // 263
          var _query = { skillTypeId: skill, schoolId: { $in: schoolIds } };                                           // 264
          if (selectedTag) _query["tags"] = { $regex: new RegExp(selectedTag, 'mi') };                                 // 265
          class_type = ClassType.find(_query).fetch();                                                                 // 267
          classTypeIds = class_type.map(function (a) {                                                                 // 268
            return a._id;                                                                                              // 269
          });                                                                                                          // 270
        }                                                                                                              // 271
        if (monthPrice) {                                                                                              // 272
          price = module.runModuleSetters(eval(monthPrice));                                                           // 273
          if (price == 201) {                                                                                          // 274
            price = module.runModuleSetters(eval(price));                                                              // 275
            month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $gte: price } }, { threeMonCost: { $gte: price } }, { sixMonCost: { $gte: price } }, { annualCost: { $gte: price } }, { lifetimeCost: { $gte: price } }], schoolId: { $in: schoolIds } }).fetch();
          } else {                                                                                                     // 277
            month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $lte: price } }, { threeMonCost: { $lte: price } }, { sixMonCost: { $lte: price } }, { annualCost: { $lte: price } }, { lifetimeCost: { $lte: price } }], schoolId: { $in: schoolIds } }).fetch();
          }                                                                                                            // 279
          classTypeIds = [];                                                                                           // 280
          month_price.map(function (a) {                                                                               // 281
            if (a.classTypeId) {                                                                                       // 282
              Ids = a.classTypeId.split(",");                                                                          // 283
              classTypeIds = classTypeIds.concat(Ids);                                                                 // 284
            }                                                                                                          // 285
          });                                                                                                          // 286
        }                                                                                                              // 287
        if (classPrice) {                                                                                              // 288
          price = module.runModuleSetters(eval(classPrice));                                                           // 289
          console.lIntelliJIDEALicenseServer_linux_amd64og(price);                                                     // 290
          if (price == 201) {                                                                                          // 291
            class_price = ClassPricing.find({ cost: { $gte: price }, schoolId: { $in: schoolIds } }).fetch();          // 292
          } else {                                                                                                     // 293
            class_price = ClassPricing.find({ cost: { $lte: price }, schoolId: { $in: schoolIds } }).fetch();          // 294
          }                                                                                                            // 295
          /*{ "Price": {"$gt": 2, "$lt": 1250 } }*/                                                                    //
          console.log(class_price);                                                                                    // 297
          classTypeIds = [];                                                                                           // 298
          class_price.map(function (a) {                                                                               // 299
            if (a.classTypeId) {                                                                                       // 300
              Ids = a.classTypeId.split(",");                                                                          // 301
              classTypeIds = classTypeIds.concat(Ids);                                                                 // 302
            }                                                                                                          // 303
          });                                                                                                          // 304
        }                                                                                                              // 305
        class_filter.classTypeId = { $in: classTypeIds };                                                              // 306
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 307
        console.log(class_filter);                                                                                     // 308
        limit = { limit: limit };                                                                                      // 309
        class_filter.schoolId = { $nin: nSchoolIds };                                                                  // 310
        classTypeFilter.schoolId = { $nin: nSchoolIds };                                                               // 311
                                                                                                                       //
        skillCursor = SkillClass.find(class_filter, limit);                                                            // 313
        skillResult = skillCursor.fetch();                                                                             // 314
        classTypeIds = skillResult.map(function (a) {                                                                  // 315
          return a.classTypeId;                                                                                        // 315
        });                                                                                                            // 315
        schoolIds = skillResult.map(function (a) {                                                                     // 316
          return a.schoolId;                                                                                           // 316
        });                                                                                                            // 316
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 317
        schoolFilter = { _id: { $in: schoolIds } };                                                                    // 318
        return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
      }                                                                                                                // 320
      if (skill) {                                                                                                     // 321
        var _query2 = { skillTypeId: skill };                                                                          // 322
        if (selectedTag) _query2["tags"] = { $regex: new RegExp(selectedTag, 'mi') };                                  // 323
        console.log(_query2);                                                                                          // 325
        class_type = ClassType.find(_query2).fetch();                                                                  // 326
        classTypeIds = class_type.map(function (a) {                                                                   // 327
          return a._id;                                                                                                // 328
        });                                                                                                            // 329
        if (classPrice) {                                                                                              // 330
          price = module.runModuleSetters(eval(classPrice));                                                           // 331
          console.log(price);                                                                                          // 332
          if (price == 201) {                                                                                          // 333
            class_price = ClassPricing.find({ cost: { $gte: price } }).fetch();                                        // 334
          } else {                                                                                                     // 335
            class_price = ClassPricing.find({ cost: { $lte: price } }).fetch();                                        // 336
          }                                                                                                            // 337
          /*{ "Price": {"$gt": 2, "$lt": 1250 } }*/                                                                    //
          console.log(class_price);                                                                                    // 339
          newclassTypeIds = [];                                                                                        // 340
          class_price.map(function (a) {                                                                               // 341
            if (a.classTypeId) {                                                                                       // 342
              Ids = a.classTypeId.split(",");                                                                          // 343
              newclassTypeIds = newclassTypeIds.concat(Ids);                                                           // 344
            }                                                                                                          // 345
          });                                                                                                          // 346
          classTypeIds = newclassTypeIds.filter(function (obj) {                                                       // 347
            return classTypeIds.indexOf(obj) > -1;                                                                     // 347
          });                                                                                                          // 347
        }                                                                                                              // 348
        if (monthPrice) {                                                                                              // 349
          price = module.runModuleSetters(eval(monthPrice));                                                           // 350
          if (price == 201) {                                                                                          // 351
            price = module.runModuleSetters(eval(price));                                                              // 352
            month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $gte: price } }, { threeMonCost: { $gte: price } }, { sixMonCost: { $gte: price } }, { annualCost: { $gte: price } }, { lifetimeCost: { $gte: price } }] }).fetch();
          } else {                                                                                                     // 354
            month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $lte: price } }, { threeMonCost: { $lte: price } }, { sixMonCost: { $lte: price } }, { annualCost: { $lte: price } }, { lifetimeCost: { $lte: price } }] }).fetch();
          }                                                                                                            // 356
          newclassTypeIds = [];                                                                                        // 357
          month_price.map(function (a) {                                                                               // 358
            if (a.classTypeId) {                                                                                       // 359
              Ids = a.classTypeId.split(",");                                                                          // 360
              newclassTypeIds = classTypeIds.concat(Ids);                                                              // 361
            }                                                                                                          // 362
          });                                                                                                          // 363
          classTypeIds = newclassTypeIds.filter(function (obj) {                                                       // 364
            return classTypeIds.indexOf(obj) > -1;                                                                     // 364
          });                                                                                                          // 364
        }                                                                                                              // 365
                                                                                                                       //
        class_filter.classTypeId = { $in: classTypeIds };                                                              // 367
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 368
        limit = { limit: limit };                                                                                      // 369
        class_filter.schoolId = { $nin: nSchoolIds };                                                                  // 370
        classTypeFilter.schoolId = { $nin: nSchoolIds };                                                               // 371
                                                                                                                       //
        skillCursor = SkillClass.find(class_filter, limit);                                                            // 373
        skillResult = skillCursor.fetch();                                                                             // 374
        classTypeIds = skillResult.map(function (a) {                                                                  // 375
          return a.classTypeId;                                                                                        // 375
        });                                                                                                            // 375
        schoolIds = skillResult.map(function (a) {                                                                     // 376
          return a.schoolId;                                                                                           // 376
        });                                                                                                            // 376
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 377
        schoolFilter = { _id: { $in: schoolIds } };                                                                    // 378
        return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
      }                                                                                                                // 380
      if (classPrice) {                                                                                                // 381
        price = module.runModuleSetters(eval(classPrice));                                                             // 382
        console.log(price);                                                                                            // 383
        if (price == 201) {                                                                                            // 384
          class_price = ClassPricing.find({ cost: { $gte: price } }).fetch();                                          // 385
        } else {                                                                                                       // 386
          class_price = ClassPricing.find({ cost: { $lte: price } }).fetch();                                          // 387
        }                                                                                                              // 388
        /*{ "Price": {"$gt": 2, "$lt": 1250 } }*/                                                                      //
        classTypeIds = [];                                                                                             // 390
        class_price.map(function (a) {                                                                                 // 391
          if (a.classTypeId) {                                                                                         // 392
            Ids = a.classTypeId.split(",");                                                                            // 393
            classTypeIds = classTypeIds.concat(Ids);                                                                   // 394
          }                                                                                                            // 395
        });                                                                                                            // 396
        class_filter.classTypeId = { $in: classTypeIds };                                                              // 397
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 398
      }                                                                                                                // 399
                                                                                                                       //
      if (monthPrice) {                                                                                                // 401
        price = module.runModuleSetters(eval(monthPrice));                                                             // 402
        if (price == 201) {                                                                                            // 403
          price = module.runModuleSetters(eval(price));                                                                // 404
          month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $gte: price } }, { threeMonCost: { $gte: price } }, { sixMonCost: { $gte: price } }, { annualCost: { $gte: price } }, { lifetimeCost: { $gte: price } }] }).fetch();
        } else {                                                                                                       // 406
          month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $lte: price } }, { threeMonCost: { $lte: price } }, { sixMonCost: { $lte: price } }, { annualCost: { $lte: price } }, { lifetimeCost: { $lte: price } }] }).fetch();
        }                                                                                                              // 408
        classTypeIds = [];                                                                                             // 409
        month_price.map(function (a) {                                                                                 // 410
          if (a.classTypeId) {                                                                                         // 411
            Ids = a.classTypeId.split(",");                                                                            // 412
            classTypeIds = classTypeIds.concat(Ids);                                                                   // 413
          }                                                                                                            // 414
        });                                                                                                            // 415
        class_filter.classTypeId = { $in: classTypeIds };                                                              // 416
        classTypeFilter._id = { $in: classTypeIds };                                                                   // 417
      }                                                                                                                // 418
      limit = { limit: limit };                                                                                        // 419
      console.log("--------------------------");                                                                       // 420
      class_filter.schoolId = { $nin: nSchoolIds };                                                                    // 421
      classTypeFilter.schoolId = { $nin: nSchoolIds };                                                                 // 422
      console.log(class_filter);                                                                                       // 423
      console.log(limit);                                                                                              // 424
      skillCursor = SkillClass.find(class_filter, limit);                                                              // 425
      skillResult = skillCursor.fetch();                                                                               // 426
      classTypeIds = skillResult.map(function (a) {                                                                    // 427
        return a.classTypeId;                                                                                          // 427
      });                                                                                                              // 427
      schoolIds = skillResult.map(function (a) {                                                                       // 428
        return a.schoolId;                                                                                             // 428
      });                                                                                                              // 428
      classTypeFilter._id = { $in: classTypeIds };                                                                     // 429
      schoolFilter = { _id: { $in: schoolIds } };                                                                      // 430
      console.log("--------------------------");                                                                       // 431
      return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
    });                                                                                                                // 433
    Meteor.publish("UserSchool", function (schoolId) {                                                                 // 434
      return School.find({ _id: schoolId });                                                                           // 435
    });                                                                                                                // 436
    Meteor.publish("UserSchoolbySlug", function (slug) {                                                               // 437
      return School.find({ slug: slug });                                                                              // 438
    });                                                                                                                // 439
    Meteor.publish("ClaimSchoolFilter", function (phone, website, name, coords, cskill, role, limit) {                 // 440
      filter = {};                                                                                                     // 441
      limit = { limit: limit };                                                                                        // 442
      schoolList = School.find({ is_publish: 'N' }).fetch();                                                           // 443
      UnPublishSchoolIds = schoolList.map(function (a) {                                                               // 444
        return a._id;                                                                                                  // 444
      });                                                                                                              // 444
      if (phone) {                                                                                                     // 445
        filter.phone = { '$regex': '' + phone + '', '$options': '-i' };                                                // 446
      }                                                                                                                // 447
      if (website) {                                                                                                   // 448
        filter.website = { '$regex': '' + website + '', '$options': '-i' };                                            // 449
      }                                                                                                                // 450
      if (name) {                                                                                                      // 451
        filter.name = { '$regex': '' + name + '', '$options': '-i' };                                                  // 452
      }                                                                                                                // 453
      AllSchoolIds = [];                                                                                               // 454
      console.log(coords);                                                                                             // 455
      if (coords) {                                                                                                    // 456
        // place variable will have all the information you are looking for.                                           //
        var maxDistance = 50;                                                                                          // 458
        // we need to convert the distance to radians                                                                  //
        // the raduis of Earth is approximately 6371 kilometers                                                        //
        maxDistance /= 63;                                                                                             // 461
        slocations = SLocation.find({                                                                                  // 462
          loc: {                                                                                                       // 463
            $near: coords,                                                                                             // 464
            $maxDistance: maxDistance                                                                                  // 465
          }                                                                                                            // 463
        }).fetch();                                                                                                    // 462
        schoolIds = slocations.map(function (a) {                                                                      // 468
          return a.schoolId;                                                                                           // 469
        });                                                                                                            // 470
        console.log(schoolIds);                                                                                        // 471
        filter._id = { $in: schoolIds };                                                                               // 472
        AllSchoolIds = schoolIds;                                                                                      // 473
      }                                                                                                                // 474
      if (cskill) {                                                                                                    // 475
        class_type = ClassType.find({ skillTypeId: cskill }).fetch();                                                  // 476
        schoolIds = class_type.map(function (a) {                                                                      // 477
          return a.schoolId;                                                                                           // 478
        });                                                                                                            // 479
        console.log(schoolIds);                                                                                        // 480
        AllSchoolIds = schoolIds.concat(AllSchoolIds);                                                                 // 481
        if (AllSchoolIds.length > 0) {                                                                                 // 482
          filter._id = { $in: AllSchoolIds };                                                                          // 483
        } else {                                                                                                       // 484
          filter._id = { $in: schoolIds };                                                                             // 485
        }                                                                                                              // 486
      }                                                                                                                // 488
      if (role && role == "Superadmin") {} else {                                                                      // 489
        /*result = {}                                                                                                  //
        result = _.extend(result,filter._id, {$nin:UnPublishSchoolIds});*/                                             //
        filter.is_publish = { $ne: 'N' };                                                                              // 494
      }                                                                                                                // 495
      /*filter.claimed = { $ne : 'Y' }*/                                                                               //
      console.log(filter);                                                                                             // 497
      return School.find(filter, limit);                                                                               // 498
    });                                                                                                                // 499
    findUrl = function findUrl(text) {                                                                                 // 500
      var source = (text || '').toString();                                                                            // 501
      var urlArray = [];                                                                                               // 502
      var url;                                                                                                         // 503
      var matchArray;                                                                                                  // 504
      // Regular expression to find FTP, HTTP(S) and email URLs.                                                       //
      var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
      // Iterate through any URLs in the text.                                                                         //
      while ((matchArray = regexToken.exec(source)) !== null) {                                                        // 508
        var token = matchArray[0];                                                                                     // 509
        return token;                                                                                                  // 510
      }                                                                                                                // 511
      return '';                                                                                                       // 512
    };                                                                                                                 // 513
    Meteor.methods({                                                                                                   // 514
      project_upload: function project_upload(fileInfo, fileData) {                                                    // 515
        console.log("received file " + fileInfo.name + " data: " + fileData);                                          // 516
        var results = Papa.parse(fileData, {                                                                           // 517
          header: true                                                                                                 // 518
        });                                                                                                            // 517
        csvdata = results.data;                                                                                        // 520
        for (var i = 0; i < csvdata.length; i++) {                                                                     // 521
          if (csvdata[i].name && csvdata[i].website && csvdata[i].name.length > 0 && emailRegex.test(csvdata[i].emailAddress)) {
            school = School.findOne({ name: csvdata[i].name, website: csvdata[i].website });                           // 523
            schoolId = "";                                                                                             // 524
            locationId = "";                                                                                           // 525
            classTypeId = "";                                                                                          // 526
            if (school) {                                                                                              // 527
              schoolId = school._id;                                                                                   // 528
              doc = {                                                                                                  // 529
                name: csvdata[i].name,                                                                                 // 530
                website: findUrl(csvdata[i].website),                                                                  // 531
                phone: csvdata[i].phone,                                                                               // 532
                mainImage: findUrl(csvdata[i].mainImage),                                                              // 533
                aboutHtml: csvdata[i].aboutHtml,                                                                       // 534
                descHtml: csvdata[i].descHtml,                                                                         // 535
                email: csvdata[i].emailAddress                                                                         // 536
              };                                                                                                       // 529
              School.update({ _id: schoolId }, { $set: doc });                                                         // 538
            } else {                                                                                                   // 539
              doc = {                                                                                                  // 540
                name: csvdata[i].name,                                                                                 // 541
                website: findUrl(csvdata[i].website),                                                                  // 542
                phone: csvdata[i].phone,                                                                               // 543
                mainImage: findUrl(csvdata[i].mainImage),                                                              // 544
                aboutHtml: csvdata[i].aboutHtml,                                                                       // 545
                descHtml: csvdata[i].descHtml,                                                                         // 546
                email: csvdata[i].emailAddress                                                                         // 547
              };                                                                                                       // 540
              var newUser = CreateNewUser(csvdata[i].emailAddress, csvdata[i].name, csvdata[i].firstName, csvdata[i].lastName);
              if (newUser) {                                                                                           // 550
                doc["userId"] = newUser;                                                                               // 551
              }                                                                                                        // 552
              schoolId = School.insert(doc);                                                                           // 553
            }                                                                                                          // 554
            slocation = SLocation.findOne({ schoolId: schoolId, title: csvdata[i].LocationTitle, zip: csvdata[i].zip });
            if (slocation) {} else {                                                                                   // 556
              slocation = SLocation.findOne({ schoolId: schoolId, address: csvdata[i].address, zip: csvdata[i].zip });
            }                                                                                                          // 560
            doc = {                                                                                                    // 561
              title: csvdata[i].LocationTitle,                                                                         // 562
              neighbourhood: csvdata[i].neighbourhood,                                                                 // 563
              address: csvdata[i].address,                                                                             // 564
              city: csvdata[i].city,                                                                                   // 565
              state: csvdata[i].state,                                                                                 // 566
              zip: csvdata[i].zip,                                                                                     // 567
              country: csvdata[i].country,                                                                             // 568
              schoolId: schoolId                                                                                       // 569
            };                                                                                                         // 561
            var data = {};                                                                                             // 571
            try {                                                                                                      // 572
              slocation_detail = doc.address + "," + doc.city + "," + doc.state + "," + doc.zip;                       // 573
              console.log(slocation_detail);                                                                           // 574
              var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + slocation_detail + "&key=AIzaSyBtQoiRR6Ft0wGTajMd8uTZb71h8kwD5Ew";
              data = Meteor.http.call("GET", url);                                                                     // 576
              data = JSON.parse(data.content);                                                                         // 577
              if (data.results[0] && data.results[0].geometry && data.results[0].geometry.location) {                  // 578
                data = data.results[0].geometry.location;                                                              // 579
              }                                                                                                        // 580
              if (data.status == 'ZERO_RESULTS') {                                                                     // 581
                data.lat = 0;                                                                                          // 582
                data.lng = 0;                                                                                          // 583
                console.log("Location not found");                                                                     // 584
              }                                                                                                        // 585
              doc.geoLat = data.lat;                                                                                   // 586
              doc.geoLong = data.lng;                                                                                  // 587
              doc.loc = [data.lat, data.lng];                                                                          // 588
            } catch (err) {                                                                                            // 589
              console.log("Location not found");                                                                       // 590
              data.lat = 0;                                                                                            // 591
              data.lng = 0;                                                                                            // 592
              doc.geoLat = data.lat;                                                                                   // 593
              doc.geoLong = data.lng;                                                                                  // 594
              doc.loc = [data.lat, data.lng];                                                                          // 595
            }                                                                                                          // 596
            if (slocation) {                                                                                           // 597
              locationId = slocation._id;                                                                              // 598
              SLocation.update({ _id: locationId }, { $set: doc });                                                    // 599
            } else {                                                                                                   // 600
              if (csvdata[i].address) {                                                                                // 601
                locationId = SLocation.insert(doc);                                                                    // 602
              }                                                                                                        // 603
            }                                                                                                          // 604
                                                                                                                       //
            var obj = {};                                                                                              // 606
            obj.schoolId = schoolId;                                                                                   // 607
            obj.name = csvdata[i].classTypeName;                                                                       // 608
            skill = csvdata[i].skillType;                                                                              // 609
            if (skill) {                                                                                               // 610
              skill = skill.split(",");                                                                                // 611
              skill = skill[0].trim();                                                                                 // 612
            }                                                                                                          // 613
                                                                                                                       //
            skillType = SkillType.findOne({ name: skill });                                                            // 616
            if (skillType) {} else {                                                                                   // 617
              if (csvdata[i].classTypeName) {                                                                          // 620
                SkillType.insert({ name: skill });                                                                     // 621
              }                                                                                                        // 622
            }                                                                                                          // 623
            obj.skillTypeId = skill;                                                                                   // 624
            obj.desc = csvdata[i].classTypeDesc;                                                                       // 625
            obj.classTypeImg = csvdata[i].classTypeImg;                                                                // 626
                                                                                                                       //
            classtype = ClassType.findOne({ schoolId: schoolId, name: csvdata[i].classTypeName });                     // 628
            if (classtype) {} else {                                                                                   // 629
              classtype = ClassType.findOne({ schoolId: schoolId, desc: csvdata[i].classTypeDesc });                   // 632
              if (classtype) {} else {                                                                                 // 633
                classtype = ClassType.findOne({ schoolId: schoolId, skillTypeId: skill });                             // 636
              }                                                                                                        // 637
            }                                                                                                          // 638
            if (classtype) {                                                                                           // 639
              classTypeId = classtype._id;                                                                             // 640
              ClassType.update({ _id: classTypeId }, { $set: obj });                                                   // 641
            } else {                                                                                                   // 642
              if (obj.name) {                                                                                          // 643
                classTypeId = ClassType.insert(obj);                                                                   // 644
              }                                                                                                        // 645
            }                                                                                                          // 646
            skillClass = SkillClass.findOne({ className: csvdata[i].className, schoolId: schoolId });                  // 647
                                                                                                                       //
            var obj = {};                                                                                              // 649
            obj.className = csvdata[i].className;                                                                      // 650
            obj.schoolId = schoolId;                                                                                   // 651
            obj.locationId = locationId;                                                                               // 652
            obj.classTypeId = classTypeId;                                                                             // 653
            obj.plannedStart = csvdata[i].plannedStart;                                                                // 654
            obj.plannedEnd = csvdata[i].plannedStart;                                                                  // 655
            var repeat = {};                                                                                           // 656
            obj.planEndTime = csvdata[i].planEndTime;                                                                  // 657
            obj.planStartTime = csvdata[i].planStartTime;                                                              // 658
            repeat_type = csvdata[i].RepeatType;                                                                       // 659
            repeat.repeat_type = repeat_type;                                                                          // 660
            repeat_every = csvdata[i].RepeatEvery;                                                                     // 661
            repeat.repeat_every = repeat_every;                                                                        // 662
            start_date = csvdata[i].plannedStart;                                                                      // 663
            repeat.start_date = start_date;                                                                            // 664
            repeat_on_item = [];                                                                                       // 665
            obj.isRecurring = csvdata[i].isRecurring == "TRUE" ? true : false;                                         // 666
            csvdata[i].Sunday == "TRUE" ? repeat_on_item.push("Sunday") : false;                                       // 667
            csvdata[i].Monday == "TRUE" ? repeat_on_item.push("Monday") : false;                                       // 668
            csvdata[i].Tuesday == "TRUE" ? repeat_on_item.push("Tuesday") : false;                                     // 669
            csvdata[i].Wednesday == "TRUE" ? repeat_on_item.push("Wednesday") : false;                                 // 670
            csvdata[i].Thursday == "TRUE" ? repeat_on_item.push("Thursday") : false;                                   // 671
            csvdata[i].Friday == "TRUE" ? repeat_on_item.push("Friday") : false;                                       // 672
            csvdata[i].Saturday == "TRUE" ? repeat_on_item.push("Saturday") : false;                                   // 673
                                                                                                                       //
            repeat_on = [];                                                                                            // 675
            repeat_details = [];                                                                                       // 676
            repeat_on_item.map(function (day) {                                                                        // 677
              repeat_on.push(day);                                                                                     // 678
              console.log(csvdata[i]);                                                                                 // 679
              start_time = day + 'StartTime';                                                                          // 680
              end_time = day + 'EndTime';                                                                              // 681
              location = day + 'LocationTitle';                                                                        // 682
              stime = csvdata[i][start_time];                                                                          // 683
              etime = csvdata[i][end_time];                                                                            // 684
              slocation = SLocation.findOne({ schoolId: schoolId, title: csvdata[i][location] });                      // 685
              if (slocation) {                                                                                         // 686
                locationId = slocation._id;                                                                            // 687
              }                                                                                                        // 688
              repeat_details.push({ "day": day, "start_time": stime, "end_time": etime, "location": locationId });     // 689
            });                                                                                                        // 690
            repeat.repeat_on = repeat_on;                                                                              // 691
            repeat.repeat_details = repeat_details;                                                                    // 692
            end_option_item = csvdata[i].Ends;                                                                         // 693
            end_option = csvdata[i].Ends;                                                                              // 694
                                                                                                                       //
            if (end_option == "On Specific Date") {                                                                    // 696
              end_option = "rend_date";                                                                                // 697
            } else if (end_option == "After") {                                                                        // 698
              end_option = "occurrence";                                                                               // 699
            } else {                                                                                                   // 700
              end_option = "Never";                                                                                    // 701
            }                                                                                                          // 702
            repeat.end_option = end_option;                                                                            // 703
            if (end_option == "Never") {                                                                               // 704
              end_option_value = "Never";                                                                              // 705
            } else {                                                                                                   // 706
              end_option_value = csvdata[i].EndValue;                                                                  // 707
            }                                                                                                          // 708
            repeat.end_option_value = end_option_value;                                                                // 709
            obj.repeats = JSON.stringify(repeat);                                                                      // 710
            if (skillClass) {                                                                                          // 711
              SkillClass.update({ _id: skillClass._id }, { $set: obj });                                               // 712
            } else {                                                                                                   // 713
              if (obj.className) {                                                                                     // 714
                SkillClass.insert(obj);                                                                                // 715
              }                                                                                                        // 716
            }                                                                                                          // 717
            monthlypricing = MonthlyPricing.findOne({ schoolId: schoolId, packageName: csvdata[i].monthlyPackageName });
            var obj = {};                                                                                              // 719
            obj.packageName = csvdata[i].monthlyPackageName;                                                           // 720
            obj.pymtType = csvdata[i].PaymentType;                                                                     // 721
            obj.classTypeId = classTypeId;                                                                             // 722
            obj.oneMonCost = csvdata[i].oneMonCost;                                                                    // 723
            obj.threeMonCost = csvdata[i].threeMonCost;                                                                // 724
            obj.sixMonCost = csvdata[i].sixMonCost;                                                                    // 725
            obj.annualCost = csvdata[i].annualCost;                                                                    // 726
            obj.lifetimeCost = csvdata[i].lifeTimeCost;                                                                // 727
            obj.schoolId = schoolId;                                                                                   // 728
            if (monthlypricing) {                                                                                      // 729
              MonthlyPricing.update({ _id: monthlypricing._id }, { $set: obj });                                       // 730
            } else {                                                                                                   // 731
              if (obj.packageName) {                                                                                   // 732
                console.log(obj);                                                                                      // 733
                MonthlyPricing.insert(obj);                                                                            // 734
              }                                                                                                        // 735
            }                                                                                                          // 736
            classpricing = ClassPricing.findOne({ schoolId: schoolId, packageName: csvdata[i].ClassPackageName });     // 737
            obj = {};                                                                                                  // 738
            obj.packageName = csvdata[i].ClassPackageName;                                                             // 739
            obj.cost = !isNaN(csvdata[i].Cost) ? csvdata[i].Cost : 0;                                                  // 740
            obj.classTypeId = classTypeId;                                                                             // 741
            obj.noClasses = csvdata[i].NumberOfClasses;                                                                // 742
            obj.start = csvdata[i].Expires;                                                                            // 743
            obj.finish = csvdata[i].ExpiresValue;                                                                      // 744
            obj.schoolId = schoolId;                                                                                   // 745
            if (classpricing) {                                                                                        // 746
              ClassPricing.update({ _id: classpricing._id }, { $set: obj });                                           // 747
            } else {                                                                                                   // 748
              if (obj.packageName) {                                                                                   // 749
                console.log(obj);                                                                                      // 750
                ClassPricing.insert(obj);                                                                              // 751
              }                                                                                                        // 752
            }                                                                                                          // 753
          }                                                                                                            // 754
        }                                                                                                              // 758
      },                                                                                                               // 760
      getConnectedSchool: function getConnectedSchool(userId) {                                                        // 761
        school_list = [];                                                                                              // 762
        user = Meteor.users.findOne({ _id: userId });                                                                  // 763
        if (user && user.profile && user.profile.classIds && user.profile.classIds.length > 0) {                       // 764
          classIds = user.profile.classIds;                                                                            // 765
          var demand = Demand.find({ userId: userId, classId: { $in: classIds } });                                    // 766
          school_list = demand.map(function (a) {                                                                      // 767
            return a.schoolId;                                                                                         // 768
          });                                                                                                          // 769
        }                                                                                                              // 770
        return School.find({ _id: { $in: school_list } }).fetch();                                                     // 771
      },                                                                                                               // 772
      addSchool: function addSchool(data) {                                                                            // 773
        var schoolId = School.insert(data);                                                                            // 774
        Meteor.users.update({ _id: data.userId }, { $set: { "profile.schoolId": schoolId } });                         // 775
        return schoolId;                                                                                               // 776
      },                                                                                                               // 777
      editSchool: function editSchool(id, data) {                                                                      // 778
        return School.update({ _id: id }, { $set: data });                                                             // 779
      },                                                                                                               // 780
      getMySchool: function getMySchool(school_id, userId) {                                                           // 781
        console.log(school_id);                                                                                        // 782
        school = School.findOne({ _id: school_id });                                                                   // 783
        if (school) {} else {                                                                                          // 784
          Meteor.users.update({ _id: userId }, { $set: { "profile.schoolId": " " } });                                 // 787
        }                                                                                                              // 788
        return School.find({ _id: school_id }).fetch();                                                                // 789
      },                                                                                                               // 790
      claimSchool: function claimSchool(userId, schoolId) {                                                            // 791
        data = {};                                                                                                     // 792
        data.userId = userId;                                                                                          // 793
        data.claimed = 'Y';                                                                                            // 794
        School.update({ _id: schoolId }, { $set: data });                                                              // 795
        return Meteor.users.update({ _id: data.userId }, { $set: { "profile.schoolId": schoolId, "profile.acess_type": "school" } });
      },                                                                                                               // 797
      addMedia: function addMedia(schoolId, fileobj) {                                                                 // 798
        return School.update({ _id: schoolId }, { $push: { "mediaList": fileobj } });                                  // 799
      },                                                                                                               // 800
      removeMedia: function removeMedia(schoolId, path) {                                                              // 801
        console.log({ _id: schoolId }, { $pull: { "mediaList": { filePath: path } } }, { multi: true });               // 802
        School.update({ _id: schoolId }, { $pull: { "mediaList": { filePath: path } } }, { multi: true });             // 803
      },                                                                                                               // 804
      publish_school: function publish_school(schoolId, is_publish) {                                                  // 805
        data = { "is_publish": is_publish };                                                                           // 806
        return School.update({ _id: schoolId }, { $set: data });                                                       // 807
      }                                                                                                                // 808
                                                                                                                       //
    });                                                                                                                // 514
  })();                                                                                                                // 158
}                                                                                                                      // 830
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Skill.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Skill.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
skill = "Skill"; // avoid typos, this string occurs many times.                                                        // 1
//                                                                                                                     //
Skill = new Mongo.Collection(skill);                                                                                   // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Skill.attachSchema(new SimpleSchema({                                                                                  // 9
  categoryTag: {                                                                                                       // 10
    type: [String],                                                                                                    // 11
    optional: true                                                                                                     // 12
  },                                                                                                                   // 10
  subjectTag: {                                                                                                        // 14
    type: [String],                                                                                                    // 15
    optional: true                                                                                                     // 16
  },                                                                                                                   // 14
                                                                                                                       //
  ownTags: {                                                                                                           // 19
    type: [String],                                                                                                    // 20
    optional: true                                                                                                     // 21
  },                                                                                                                   // 19
                                                                                                                       //
  minmaxOrLevel: {                                                                                                     // 24
    type: [String],                                                                                                    // 25
    optional: true                                                                                                     // 26
  },                                                                                                                   // 24
                                                                                                                       //
  reqForLevelId: {                                                                                                     // 29
    type: String,                                                                                                      // 30
    optional: true                                                                                                     // 31
  },                                                                                                                   // 29
  prerequisitesSkill: {                                                                                                // 33
    type: [String],                                                                                                    // 34
    optional: true                                                                                                     // 35
  }, skillGroup: {                                                                                                     // 33
    type: [String],                                                                                                    // 37
    optional: true                                                                                                     // 38
  }, requiredFor: {                                                                                                    // 36
    type: [String],                                                                                                    // 40
    optional: true                                                                                                     // 41
  }, similarSkill: {                                                                                                   // 39
    type: [String],                                                                                                    // 43
    optional: true                                                                                                     // 44
  },                                                                                                                   // 42
  iconpic: {                                                                                                           // 46
    type: String,                                                                                                      // 47
    optional: true                                                                                                     // 48
  }, name: {                                                                                                           // 46
    type: String,                                                                                                      // 50
    optional: true                                                                                                     // 51
  }, basicInstruction: {                                                                                               // 49
    type: String,                                                                                                      // 53
    optional: true                                                                                                     // 54
  }, variationInstruction: {                                                                                           // 52
    type: String,                                                                                                      // 56
    optional: true                                                                                                     // 57
  }, counterInstructions: {                                                                                            // 55
    type: String,                                                                                                      // 59
    optional: true                                                                                                     // 60
  }, notesToStudents: {                                                                                                // 58
    type: String,                                                                                                      // 62
    optional: true                                                                                                     // 63
  },                                                                                                                   // 61
  teachingPointers: {                                                                                                  // 65
    type: String,                                                                                                      // 66
    optional: true                                                                                                     // 67
  },                                                                                                                   // 65
  notesToInstructors: {                                                                                                // 69
    type: String,                                                                                                      // 70
    optional: true                                                                                                     // 71
  },                                                                                                                   // 69
  mediaList: {                                                                                                         // 73
    type: [String],                                                                                                    // 74
    optional: true                                                                                                     // 75
  }                                                                                                                    // 73
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SkillClass.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/SkillClass.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
skill_class = "SkillClass"; // avoid typos, this string occurs many times.                                             // 1
                                                                                                                       //
SkillClass = new Mongo.Collection(skill_class);                                                                        // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
                                                                                                                       //
Schema = {};                                                                                                           // 10
Schema.ModuleLink = new SimpleSchema({                                                                                 // 11
  moduleId: {                                                                                                          // 12
    optional: true,                                                                                                    // 13
    type: String                                                                                                       // 14
  }, startTime: {                                                                                                      // 12
    optional: true,                                                                                                    // 16
    type: Date                                                                                                         // 17
  }, endTime: {                                                                                                        // 15
    optional: true,                                                                                                    // 19
    type: Date                                                                                                         // 20
  }                                                                                                                    // 18
});                                                                                                                    // 11
Schema.InstructorLink = new SimpleSchema({                                                                             // 23
  instructorId: {                                                                                                      // 24
    optional: true,                                                                                                    // 25
    type: String                                                                                                       // 26
  }, joinedDt: {                                                                                                       // 24
    optional: true,                                                                                                    // 28
    type: Date                                                                                                         // 29
  }                                                                                                                    // 27
});                                                                                                                    // 23
Schema.AssistantLink = new SimpleSchema({                                                                              // 32
  assistantId: {                                                                                                       // 33
    optional: true,                                                                                                    // 34
    type: String                                                                                                       // 35
  }, joinedDt: {                                                                                                       // 33
    optional: true,                                                                                                    // 37
    type: Date                                                                                                         // 38
  }                                                                                                                    // 36
});                                                                                                                    // 32
Schema.StudentsLink = new SimpleSchema({                                                                               // 41
  signedupStudentId: {                                                                                                 // 42
    optional: true,                                                                                                    // 43
    type: String                                                                                                       // 44
  }, joinedDt: {                                                                                                       // 42
    optional: true,                                                                                                    // 46
    type: Date                                                                                                         // 47
  }                                                                                                                    // 45
});                                                                                                                    // 41
SkillClass.attachSchema(new SimpleSchema({                                                                             // 50
  isTemplate: {                                                                                                        // 51
    type: String,                                                                                                      // 52
    optional: true                                                                                                     // 53
  },                                                                                                                   // 51
  isRecurring: {                                                                                                       // 55
    type: String,                                                                                                      // 56
    optional: true                                                                                                     // 57
  },                                                                                                                   // 55
  className: {                                                                                                         // 59
    type: String,                                                                                                      // 60
    optional: true                                                                                                     // 61
  },                                                                                                                   // 59
  plannedStart: {                                                                                                      // 63
    type: String,                                                                                                      // 64
    optional: true                                                                                                     // 65
  },                                                                                                                   // 63
                                                                                                                       //
  durationMins: {                                                                                                      // 68
    type: Date,                                                                                                        // 69
    optional: true                                                                                                     // 70
  },                                                                                                                   // 68
  planStartTime: {                                                                                                     // 72
    type: String,                                                                                                      // 73
    optional: true                                                                                                     // 74
  },                                                                                                                   // 72
  planEndTime: {                                                                                                       // 76
    type: String,                                                                                                      // 77
    optional: true                                                                                                     // 78
  },                                                                                                                   // 76
  classImagePath: {                                                                                                    // 80
    type: String,                                                                                                      // 81
    optional: true                                                                                                     // 82
  },                                                                                                                   // 80
  classDescription: {                                                                                                  // 84
    type: String,                                                                                                      // 85
    optional: true                                                                                                     // 86
  },                                                                                                                   // 84
  plannedEnd: {                                                                                                        // 88
    type: String,                                                                                                      // 89
    optional: true                                                                                                     // 90
  },                                                                                                                   // 88
  actualStart: {                                                                                                       // 92
    type: Date,                                                                                                        // 93
    optional: true                                                                                                     // 94
  },                                                                                                                   // 92
                                                                                                                       //
  actualEnd: {                                                                                                         // 97
    type: Date,                                                                                                        // 98
    optional: true                                                                                                     // 99
  },                                                                                                                   // 97
  notes: {                                                                                                             // 101
    type: Date,                                                                                                        // 102
    optional: true                                                                                                     // 103
  },                                                                                                                   // 101
  locationId: {                                                                                                        // 105
    type: String,                                                                                                      // 106
    optional: true                                                                                                     // 107
  },                                                                                                                   // 105
  masterRecurringClassId: {                                                                                            // 109
    type: String,                                                                                                      // 110
    optional: true                                                                                                     // 111
  },                                                                                                                   // 109
  classTypeId: {                                                                                                       // 113
    type: String,                                                                                                      // 114
    optional: true                                                                                                     // 115
  },                                                                                                                   // 113
  repeats: {                                                                                                           // 117
    type: String,                                                                                                      // 118
    optional: true                                                                                                     // 119
  },                                                                                                                   // 117
  module: {                                                                                                            // 121
    type: Array,                                                                                                       // 122
    optional: true                                                                                                     // 123
  },                                                                                                                   // 121
  classInstructor: {                                                                                                   // 125
    type: Array,                                                                                                       // 126
    optional: true                                                                                                     // 127
  },                                                                                                                   // 125
  classAssistant: {                                                                                                    // 129
    type: Array,                                                                                                       // 130
    optional: true                                                                                                     // 131
  },                                                                                                                   // 129
  classStudents: {                                                                                                     // 133
    type: Array,                                                                                                       // 134
    optional: true                                                                                                     // 135
  },                                                                                                                   // 133
  schoolId: {                                                                                                          // 137
    type: String,                                                                                                      // 138
    optional: true                                                                                                     // 139
  },                                                                                                                   // 137
  isNeedIgnore: {                                                                                                      // 141
    type: String,                                                                                                      // 142
    optional: true                                                                                                     // 143
  },                                                                                                                   // 141
  tab_option: {                                                                                                        // 145
    type: String,                                                                                                      // 146
    optional: true                                                                                                     // 147
  },                                                                                                                   // 145
  room: {                                                                                                              // 149
    type: String,                                                                                                      // 150
    optional: true                                                                                                     // 151
  },                                                                                                                   // 149
  "module.$": {                                                                                                        // 153
    type: Schema.ModuleLink,                                                                                           // 154
    optional: true                                                                                                     // 155
  },                                                                                                                   // 153
  "classInstructor.$": {                                                                                               // 157
    type: Schema.InstructorLink,                                                                                       // 158
    optional: true                                                                                                     // 159
  },                                                                                                                   // 157
  "classAssistant.$": {                                                                                                // 161
    type: Schema.AssistantLink,                                                                                        // 162
    optional: true                                                                                                     // 163
  },                                                                                                                   // 161
  "classStudents.$": {                                                                                                 // 165
    type: Schema.StudentsLink,                                                                                         // 166
    optional: true                                                                                                     // 167
  }                                                                                                                    // 165
}));                                                                                                                   // 50
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 171
  SkillClass._ensureIndex({ className: "text", classDescription: "text" });                                            // 172
  Meteor.publish("userSkillClass", function (userId) {                                                                 // 173
    user = Meteor.users.findOne({ _id: userId });                                                                      // 174
    classIds = [];                                                                                                     // 175
    if (user.profile) {                                                                                                // 176
      if (user.profile.schoolId) {                                                                                     // 177
        school_class = SkillClass.find({ schoolId: user.profile.schoolId });                                           // 178
        classIds = school_class.map(function (a) {                                                                     // 179
          return a._id;                                                                                                // 180
        });                                                                                                            // 181
      }                                                                                                                // 182
                                                                                                                       //
      if (user.profile) {                                                                                              // 184
        joinClass = [];                                                                                                // 185
        if (user.profile.classIds) {                                                                                   // 186
          joinClass = user.profile.classIds;                                                                           // 187
        }                                                                                                              // 188
        classIds = classIds.concat(joinClass);                                                                         // 189
        skill_class = SkillClass.find({ _id: { $in: classIds } });                                                     // 190
        schoolIds = skill_class.map(function (a) {                                                                     // 191
          return a.schoolId;                                                                                           // 192
        });                                                                                                            // 193
      }                                                                                                                // 194
      classIds = classIds.concat(user.profile.classIds);                                                               // 195
      return [SkillClass.find({ _id: { $in: classIds } }), SLocation.find({ schoolId: { $in: schoolIds } }), ClassPricing.find({ schoolId: { $in: schoolIds } }), MonthlyPricing.find({ schoolId: { $in: schoolIds } }), ClassType.find({ schoolId: { $in: schoolIds } }), School.find({ _id: { $in: schoolIds } })];
    } else {                                                                                                           // 197
      return [];                                                                                                       // 198
    }                                                                                                                  // 199
  });                                                                                                                  // 200
  Meteor.publish("SkillClassbySchool", function (schoolId) {                                                           // 201
    return SkillClass.find({ schoolId: schoolId });                                                                    // 202
  });                                                                                                                  // 203
  Meteor.publish("SkillClassbySchoolBySlug", function (slug) {                                                         // 204
    school = School.findOne({ slug: slug });                                                                           // 205
    return SkillClass.find({ schoolId: school._id });                                                                  // 206
  });                                                                                                                  // 207
  Meteor.publish("SkillClassbySchoolBySlugWithFilter", function (slug, city, skill) {                                  // 208
    school = School.findOne({ slug: slug });                                                                           // 209
    slocation = [];                                                                                                    // 210
    classtypes = [];                                                                                                   // 211
    if (city) {                                                                                                        // 212
      slocation = SLocation.find({ schoolId: school._id, city: city }).fetch();                                        // 213
      if (skill) {                                                                                                     // 214
        classtypes = ClassType.find({ schoolId: school._id, skillTypeId: skill }).fetch();                             // 215
      }                                                                                                                // 216
    }                                                                                                                  // 217
    if (skill) {                                                                                                       // 218
      classtypes = ClassType.find({ schoolId: school._id, skillTypeId: skill }).fetch();                               // 219
    }                                                                                                                  // 220
    if (slocation.length > 0 && classtypes.length > 0) {                                                               // 221
      locationIds = slocation.map(function (a) {                                                                       // 222
        return a._id;                                                                                                  // 222
      });                                                                                                              // 222
      classTypeIds = classtypes.map(function (a) {                                                                     // 223
        return a._id;                                                                                                  // 223
      });                                                                                                              // 223
      return SkillClass.find({ schoolId: school._id, locationId: { $in: locationIds }, classTypeId: { $in: classTypeIds } });
    } else if (slocation.length > 0) {                                                                                 // 225
      locationIds = slocation.map(function (a) {                                                                       // 226
        return a._id;                                                                                                  // 226
      });                                                                                                              // 226
      return SkillClass.find({ schoolId: school._id, locationId: { $in: locationIds } });                              // 227
    } else if (classtypes.length > 0) {                                                                                // 228
      classTypeIds = classtypes.map(function (a) {                                                                     // 229
        return a._id;                                                                                                  // 229
      });                                                                                                              // 229
      return SkillClass.find({ schoolId: school._id, classTypeId: { $in: classTypeIds } });                            // 230
    } else {                                                                                                           // 231
      return SkillClass.find({ schoolId: school._id });                                                                // 232
    }                                                                                                                  // 233
  });                                                                                                                  // 234
  Meteor.methods({                                                                                                     // 235
    addSkillClass: function addSkillClass(doc) {                                                                       // 236
      id = SkillClass.insert(doc);                                                                                     // 237
      if (doc.isRecurring == "true") {                                                                                 // 238
        newSchedule = buildScheduleExpansion(doc.repeats, id, "");                                                     // 239
        ClassSchedule.remove({ skillClassId: id });                                                                    // 240
        _.each(newSchedule, function (doc) {                                                                           // 241
          ClassSchedule.insert(doc);                                                                                   // 242
        });                                                                                                            // 243
      } else if (doc.isRecurring == "false") {                                                                         // 244
        ClassSchedule.remove({ skillClassId: id });                                                                    // 245
        date = moment(doc.plannedStart, "MM/DD/YYYY");                                                                 // 246
        scheduleClass = {                                                                                              // 247
          skillClassId: id,                                                                                            // 248
          eventStartTime: doc.planStartTime,                                                                           // 249
          eventEndTime: doc.planEndTime,                                                                               // 250
          eventDay: date.format("dddd"),                                                                               // 251
          eventDate: date.toDate()                                                                                     // 252
        };                                                                                                             // 247
        ClassSchedule.insert(scheduleClass);                                                                           // 254
      }                                                                                                                // 255
      return id;                                                                                                       // 256
    },                                                                                                                 // 257
    updateSkillClass: function updateSkillClass(id, doc) {                                                             // 258
      old_obj = SkillClass.findOne({ _id: id });                                                                       // 259
      old_repeats = old_obj.repeats;                                                                                   // 260
      repeats = doc.repeats;                                                                                           // 261
      if (old_repeats != repeats && doc.isRecurring == true) {                                                         // 262
        newSchedule = buildScheduleExpansion(repeats, id, moment().format("MM/DD/YYYY"));                              // 263
        ClassSchedule.remove({ skillClassId: id, eventDate: { '$gte': moment().startOf('day').toDate() } });           // 264
        _.each(newSchedule, function (doc) {                                                                           // 265
          ClassSchedule.insert(doc);                                                                                   // 266
        });                                                                                                            // 267
      } else if (doc.isRecurring == false) {                                                                           // 268
        ClassSchedule.remove({ skillClassId: id });                                                                    // 269
        date = moment(doc.plannedStart, "MM/DD/YYYY");                                                                 // 270
        scheduleClass = {                                                                                              // 271
          skillClassId: id,                                                                                            // 272
          eventStartTime: doc.planStartTime,                                                                           // 273
          eventEndTime: doc.planEndTime,                                                                               // 274
          eventDay: date.format("dddd"),                                                                               // 275
          eventDate: date.toDate()                                                                                     // 276
        };                                                                                                             // 271
        ClassSchedule.insert(scheduleClass);                                                                           // 278
      }                                                                                                                // 279
      return SkillClass.update({ _id: id }, { $set: doc });                                                            // 280
    },                                                                                                                 // 281
    removeSkillClass: function removeSkillClass(id) {                                                                  // 282
      ClassSchedule.remove({ skillClassId: id });                                                                      // 283
      return SkillClass.remove(id);                                                                                    // 284
    },                                                                                                                 // 285
    updateStatus: function updateStatus(id, status) {                                                                  // 286
      status = "checked";                                                                                              // 287
      skill = SkillClass.findOne({ _id: id });                                                                         // 288
      if (skill.isNeedIgnore == "checked") {                                                                           // 289
        status = "unchecked";                                                                                          // 290
      }                                                                                                                // 291
      return SkillClass.update({ _id: id }, { $set: { "isNeedIgnore": status } });                                     // 292
    },                                                                                                                 // 293
    updateClassDetail: function updateClassDetail(data) {                                                              // 294
      skillclass = SkillClass.findOne({ _id: data.classId });                                                          // 295
      scheduleClass = ClassSchedule.findOne({ _id: data.id });                                                         // 296
      update_data = {                                                                                                  // 297
        locationId: data.locationId,                                                                                   // 298
        eventStartTime: data.start_time,                                                                               // 299
        eventEndTime: data.end_time                                                                                    // 300
      };                                                                                                               // 297
      ClassSchedule.update({ _id: data.id }, { $set: update_data });                                                   // 302
    },                                                                                                                 // 303
    editClass: function editClass() {}                                                                                 // 304
  });                                                                                                                  // 235
}                                                                                                                      // 308
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SkillType.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/SkillType.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
skill_type = "SkillType"; // avoid typos, this string occurs many times.                                               // 1
//                                                                                                                     //
SkillType = new Mongo.Collection(skill_type);                                                                          // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
SkillType.attachSchema(new SimpleSchema({                                                                              // 9
  name: {                                                                                                              // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }                                                                                                                    // 10
}));                                                                                                                   // 9
if (Meteor.isServer) {                                                                                                 // 15
                                                                                                                       //
  Meteor.publish("SkillType", function (argument) {                                                                    // 17
    return SkillType.find({}, { sort: { "name": 1 } });                                                                // 18
  });                                                                                                                  // 19
                                                                                                                       //
  Meteor.methods({                                                                                                     // 21
    addSkillType: function addSkillType(doc) {                                                                         // 22
      return SkillType.insert(doc);                                                                                    // 23
    }                                                                                                                  // 24
  });                                                                                                                  // 21
}                                                                                                                      // 26
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Subject.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Subject.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
subject = "Subject"; // avoid typos, this string occurs many times.                                                    // 1
//                                                                                                                     //
Subject = new Mongo.Collection(subject);                                                                               // 3
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
Subject.attachSchema(new SimpleSchema({                                                                                // 9
  name: {                                                                                                              // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  }, categoryId: {                                                                                                     // 10
    type: String,                                                                                                      // 14
    optional: true                                                                                                     // 15
  }                                                                                                                    // 13
}));                                                                                                                   // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Tags.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/Tags.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import("babel-runtime/helpers/classCallCheck",{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import("babel-runtime/helpers/possibleConstructorReturn",{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import("babel-runtime/helpers/inherits",{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
var BaseTags = function (_Mongo$Collection) {                                                                          //
  _inherits(BaseTags, _Mongo$Collection);                                                                              //
                                                                                                                       //
  function BaseTags() {                                                                                                //
    _classCallCheck(this, BaseTags);                                                                                   //
                                                                                                                       //
    return _possibleConstructorReturn(this, _Mongo$Collection.apply(this, arguments));                                 //
  }                                                                                                                    //
                                                                                                                       //
  BaseTags.prototype.insert = function insert(doc, cb) {                                                               //
    doc.createdAt = new Date();                                                                                        // 3
    return _Mongo$Collection.prototype.insert.call(this, doc, cb);                                                     // 4
  };                                                                                                                   // 5
                                                                                                                       //
  return BaseTags;                                                                                                     //
}(Mongo.Collection);                                                                                                   //
                                                                                                                       //
tags = new BaseTags("Tags");                                                                                           // 9
                                                                                                                       //
tags.allow({                                                                                                           // 11
  insert: function insert() {                                                                                          // 12
    return true;                                                                                                       // 13
  },                                                                                                                   // 14
  update: function update() {                                                                                          // 15
    return true;                                                                                                       // 16
  },                                                                                                                   // 17
  remove: function remove() {                                                                                          // 18
    return true;                                                                                                       // 19
  }                                                                                                                    // 20
});                                                                                                                    // 11
                                                                                                                       //
tags.attachSchema(new SimpleSchema({                                                                                   // 24
  user_id: {                                                                                                           // 25
    type: String,                                                                                                      // 26
    optional: true                                                                                                     // 27
  },                                                                                                                   // 25
  tag: {                                                                                                               // 29
    type: String,                                                                                                      // 30
    optional: true                                                                                                     // 31
  },                                                                                                                   // 29
  createdBy: {                                                                                                         // 33
    type: String,                                                                                                      // 34
    optional: true                                                                                                     // 35
  },                                                                                                                   // 33
  createdAt: {                                                                                                         // 37
    type: Date,                                                                                                        // 38
    optional: true                                                                                                     // 39
  },                                                                                                                   // 37
  "class": {                                                                                                           // 41
    type: String,                                                                                                      // 42
    optional: true                                                                                                     // 43
  },                                                                                                                   // 41
  updaeddAt: {                                                                                                         // 45
    type: String,                                                                                                      // 46
    optional: true                                                                                                     // 47
  },                                                                                                                   // 45
  updatedBy: {                                                                                                         // 49
    type: String,                                                                                                      // 50
    optional: true                                                                                                     // 51
  }                                                                                                                    // 49
}));                                                                                                                   // 24
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 56
                                                                                                                       //
  Meteor.publish("tags", function () {                                                                                 // 58
    return tags.find();                                                                                                // 59
  });                                                                                                                  // 60
}                                                                                                                      // 61
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"User.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/User.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Images = new FS.Collection("images", {                                                                                 // 1
  stores: [new FS.Store.GridFS("images", {})]                                                                          // 2
});                                                                                                                    // 1
Images.allow({                                                                                                         // 4
  insert: function insert(userId, doc) {                                                                               // 5
    return true;                                                                                                       // 6
  },                                                                                                                   // 7
  update: function update(userId, doc, fieldNames, modifier) {                                                         // 8
    return true;                                                                                                       // 9
  },                                                                                                                   // 10
  download: function download(userId) {                                                                                // 11
    return true;                                                                                                       // 12
  },                                                                                                                   // 13
  remove: function remove(userId, parties) {                                                                           // 14
    return true;                                                                                                       // 15
  }                                                                                                                    // 16
});                                                                                                                    // 4
                                                                                                                       //
Schema = {};                                                                                                           // 19
Schema.UserProfile = new SimpleSchema({                                                                                // 20
  firstName: {                                                                                                         // 21
    optional: true,                                                                                                    // 22
    type: String                                                                                                       // 23
  },                                                                                                                   // 21
  lastName: {                                                                                                          // 25
    optional: true,                                                                                                    // 26
    type: String                                                                                                       // 27
  },                                                                                                                   // 25
  nickame: {                                                                                                           // 29
    optional: true,                                                                                                    // 30
    type: String                                                                                                       // 31
  },                                                                                                                   // 29
  url: {                                                                                                               // 33
    optional: true,                                                                                                    // 34
    type: String                                                                                                       // 35
  },                                                                                                                   // 33
  phone: {                                                                                                             // 37
    optional: true,                                                                                                    // 38
    type: Number                                                                                                       // 39
  },                                                                                                                   // 37
  pic: {                                                                                                               // 41
    optional: true,                                                                                                    // 42
    type: String                                                                                                       // 43
  },                                                                                                                   // 41
  dob: {                                                                                                               // 45
    optional: true,                                                                                                    // 46
    type: String                                                                                                       // 47
  },                                                                                                                   // 45
  address: {                                                                                                           // 49
    optional: true,                                                                                                    // 50
    type: String                                                                                                       // 51
  },                                                                                                                   // 49
  gender: {                                                                                                            // 53
    optional: true,                                                                                                    // 54
    type: String                                                                                                       // 55
  },                                                                                                                   // 53
  desc: {                                                                                                              // 57
    optional: true,                                                                                                    // 58
    type: String                                                                                                       // 59
  },                                                                                                                   // 57
  expertise: {                                                                                                         // 61
    optional: true,                                                                                                    // 62
    type: String                                                                                                       // 63
  },                                                                                                                   // 61
  state: {                                                                                                             // 65
    optional: true,                                                                                                    // 66
    type: String                                                                                                       // 67
  },                                                                                                                   // 65
  user_type: {                                                                                                         // 69
    optional: true,                                                                                                    // 70
    type: String,                                                                                                      // 71
    allowedValues: ['C', 'P', 'S', 'T']                                                                                // 72
  },                                                                                                                   // 69
  company_id: {                                                                                                        // 74
    optional: true,                                                                                                    // 75
    type: String                                                                                                       // 76
  },                                                                                                                   // 74
  role: {                                                                                                              // 78
    optional: true,                                                                                                    // 79
    type: String                                                                                                       // 80
  },                                                                                                                   // 78
  access_key: {                                                                                                        // 82
    type: String,                                                                                                      // 83
    optional: true                                                                                                     // 84
  },                                                                                                                   // 82
  is_demo_user: {                                                                                                      // 86
    type: Boolean,                                                                                                     // 87
    optional: true                                                                                                     // 88
  },                                                                                                                   // 86
  acess_type: {                                                                                                        // 90
    type: String,                                                                                                      // 91
    optional: true                                                                                                     // 92
  },                                                                                                                   // 90
  classIds: {                                                                                                          // 94
    type: [String],                                                                                                    // 95
    optional: true                                                                                                     // 96
  },                                                                                                                   // 94
  schoolId: {                                                                                                          // 98
    type: String,                                                                                                      // 99
    optional: true                                                                                                     // 100
  }                                                                                                                    // 98
});                                                                                                                    // 20
Schema.User = new SimpleSchema({                                                                                       // 103
  username: {                                                                                                          // 104
    type: String,                                                                                                      // 105
    // For accounts-password, either emails or username is required, but not both. It is OK to make this               //
    // optional here because the accounts-password package does its own validation.                                    //
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.              //
    optional: true                                                                                                     // 109
  },                                                                                                                   // 104
  emails: {                                                                                                            // 111
    type: Array,                                                                                                       // 112
    // For accounts-password, either emails or username is required, but not both. It is OK to make this               //
    // optional here because the accounts-password package does its own validation.                                    //
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.              //
    optional: true                                                                                                     // 116
  },                                                                                                                   // 111
  "emails.$": {                                                                                                        // 118
    type: Object                                                                                                       // 119
  },                                                                                                                   // 118
  "emails.$.address": {                                                                                                // 121
    type: String,                                                                                                      // 122
    regEx: SimpleSchema.RegEx.Email                                                                                    // 123
  },                                                                                                                   // 121
  "emails.$.verified": {                                                                                               // 125
    type: Boolean                                                                                                      // 126
  },                                                                                                                   // 125
  // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
  registered_emails: {                                                                                                 // 129
    type: Array,                                                                                                       // 130
    optional: true                                                                                                     // 131
  },                                                                                                                   // 129
  'registered_emails.$': {                                                                                             // 133
    type: Object,                                                                                                      // 134
    blackbox: true                                                                                                     // 135
  },                                                                                                                   // 133
  createdAt: {                                                                                                         // 137
    type: Date,                                                                                                        // 138
    optional: true                                                                                                     // 139
  },                                                                                                                   // 137
  profile: {                                                                                                           // 141
    type: Schema.UserProfile,                                                                                          // 142
    optional: true                                                                                                     // 143
  },                                                                                                                   // 141
  // Make sure this services field is in your schema if you're using any of the accounts packages                      //
  services: {                                                                                                          // 146
    type: Object,                                                                                                      // 147
    optional: true,                                                                                                    // 148
    blackbox: true                                                                                                     // 149
  },                                                                                                                   // 146
  // Add `roles` to your schema if you use the meteor-roles package.                                                   //
  // Option 1: Object type                                                                                             //
  // If you specify that type as Object, you must also specify the                                                     //
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.                                                     //
  // Example:                                                                                                          //
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);                                                     //
  // You can't mix and match adding with and without a group since                                                     //
  // you will fail validation in some cases.                                                                           //
  roles: {                                                                                                             // 159
    type: Object,                                                                                                      // 160
    optional: true,                                                                                                    // 161
    blackbox: true                                                                                                     // 162
  },                                                                                                                   // 159
  // Option 2: [String] type                                                                                           //
  // If you are sure you will never need to use role groups, then                                                      //
  // you can specify [String] as the type                                                                              //
  roles: {                                                                                                             // 167
    type: Array,                                                                                                       // 168
    optional: true                                                                                                     // 169
  },                                                                                                                   // 167
  'roles.$': {                                                                                                         // 171
    type: String                                                                                                       // 172
  },                                                                                                                   // 171
  // In order to avoid an 'Exception in setInterval callback' from Meteor                                              //
  heartbeat: {                                                                                                         // 175
    type: Date,                                                                                                        // 176
    optional: true                                                                                                     // 177
  }                                                                                                                    // 175
});                                                                                                                    // 103
Meteor.users.attachSchema(Schema.User);                                                                                // 180
                                                                                                                       //
Meteor.users.before.insert(function (userId, doc) {                                                                    // 182
  doc.createdAt = new Date();                                                                                          // 184
});                                                                                                                    // 185
if (Meteor.isServer) {                                                                                                 // 186
                                                                                                                       //
  Meteor.methods({                                                                                                     // 188
    /**                                                                                                                //
     * Invoked by AutoForm to update a User record.                                                                    //
     * @param doc The User document.                                                                                   //
     * @param docID It's ID.                                                                                           //
     */                                                                                                                //
    editUser: function editUser(doc, docID, role_name) {                                                               // 194
      console.log(doc);                                                                                                // 195
      user = Meteor.users.findOne({ _id: docID });                                                                     // 196
      if (role_name) {                                                                                                 // 197
        if (user && user.roles) {                                                                                      // 198
          for (var i = 0; i < user.roles.length; i++) {                                                                // 199
            console.log(user.roles[i]);                                                                                // 200
            Roles.removeUsersFromRoles(docID, user.roles[i]);                                                          // 201
          }                                                                                                            // 202
        }                                                                                                              // 203
        Roles.addUsersToRoles(docID, role_name);                                                                       // 204
      }                                                                                                                // 205
      if (doc) {                                                                                                       // 206
        console.log("----------");                                                                                     // 207
        console.log(doc);                                                                                              // 208
        console.log("----------");                                                                                     // 209
        Meteor.users.update({ _id: docID }, { $set: doc });                                                            // 210
      }                                                                                                                // 211
      // check(doc, Meteor.users.simpleSchema());                                                                      //
                                                                                                                       //
      return true;                                                                                                     // 214
    },                                                                                                                 // 215
    addUser: function addUser(doc) {                                                                                   // 216
      console.log(doc);                                                                                                // 217
      //  doc = _.extend({}, doc, {password: Math.random().toString(36).slice(2), login: false,email:doc.email,auto_created:true});
      doc = _.extend({}, doc, { password: "password", login: false, email: doc.email, auto_created: true });           // 219
      //  check(doc, Meteor.users.simpleSchema());                                                                     //
      console.log(doc);                                                                                                // 221
      doc.profile['role'] = 'Normal';                                                                                  // 222
      console.log(doc);                                                                                                // 223
      var user_id = Accounts.createUser(doc);                                                                          // 224
      Accounts.sendVerificationEmail(user_id, doc.email);                                                              // 225
      //  Roles.addUsersToRoles(user_id, ['Normal']);                                                                  //
      //  Meteor.users.update({_id: docID}, doc);                                                                      //
    },                                                                                                                 // 228
    deleteUser: function deleteUser(id) {                                                                              // 229
      Meteor.users.remove(id);                                                                                         // 230
    },                                                                                                                 // 231
    setAdmin: function setAdmin(user_id) {                                                                             // 232
      Meteor.users.update({ _id: user_id }, { $set: { "profile.role": "Admin" } });                                    // 233
      //  Roles.addUsersToRoles(user_id, ['Admin']);                                                                   //
    },                                                                                                                 // 235
    setNormal: function setNormal(user_id) {                                                                           // 236
      Meteor.users.update({ _id: user_id }, { $set: { "profile.role": "Normal" } });                                   // 237
      //  Roles.addUsersToRoles(user_id, ['Normal']);                                                                  //
    },                                                                                                                 // 239
    createUserFromAdmin: function createUserFromAdmin(email, password) {                                               // 240
      user_id = Accounts.createUser({ email: email, password: password });                                             // 241
      Accounts.sendVerificationEmail(user_id, email);                                                                  // 242
      return user_id;                                                                                                  // 243
    },                                                                                                                 // 244
    checkUserByEmail: function checkUserByEmail(email) {                                                               // 245
      console.log(email);                                                                                              // 246
      var user = Meteor.users.findOne({ "emails.address": email });                                                    // 247
      console.log(user);                                                                                               // 248
      if (user) {                                                                                                      // 249
        return user;                                                                                                   // 250
      } else {                                                                                                         // 251
        return false;                                                                                                  // 252
      }                                                                                                                // 253
    }                                                                                                                  // 254
  });                                                                                                                  // 188
                                                                                                                       //
  Meteor.publish("User", function (user_id) {                                                                          // 258
    if (user_id == undefined) {                                                                                        // 259
      return [];                                                                                                       // 260
    }                                                                                                                  // 261
    company_id_list = [];                                                                                              // 262
    var user = Meteor.users.findOne({ _id: user_id });                                                                 // 263
    var access_key = user.profile.access_key;                                                                          // 264
    // company_id = user.profile.company_id                                                                            //
    // if( company_id){                                                                                                //
    //   company_id_list.push(company_id)                                                                              //
    // }                                                                                                               //
    // company_list = Company.find({user_id:user_id}).fetch();                                                         //
    // company_list.map(function(doc){                                                                                 //
    //   company_id_list.push(doc._id)                                                                                 //
    // });                                                                                                             //
    return Meteor.users.find({}); //.find({$or:[{_id:user_id},{"profile.access_key":access_key}]});                    // 273
  });                                                                                                                  // 274
  Meteor.publish("UserShow", function (user_id, id) {                                                                  // 275
    return Meteor.users.find({ _id: user_id });                                                                        // 276
  });                                                                                                                  // 277
  Meteor.publish('images', function (admin_id) {                                                                       // 278
    return Images.find({ $or: [{ "metadata.admin_id": admin_id }, { "metadata.company_id": admin_id }] });             // 279
  });                                                                                                                  // 280
  Meteor.publish(null, function () {                                                                                   // 281
    return Meteor.roles.find({});                                                                                      // 282
  });                                                                                                                  // 283
}                                                                                                                      // 284
                                                                                                                       //
users = new Meteor.Pagination(Meteor.users, {                                                                          // 287
  itemTemplate: "User",                                                                                                // 288
  route: "/users/",                                                                                                    // 289
  homeRoute: '/users/',                                                                                                // 290
  // router: "iron-router",                                                                                            //
  routerTemplate: "ListUser",                                                                                          // 292
  routerLayout: "Layout",                                                                                              // 293
  divWrapper: false,                                                                                                   // 294
  sort: {                                                                                                              // 295
    id: 1                                                                                                              // 296
  },                                                                                                                   // 295
  templateName: "ListUser",                                                                                            // 298
  perPage: 5,                                                                                                          // 299
  auth: function auth(skip, sub) {                                                                                     // 300
    var user_id = sub.userId;                                                                                          // 301
    if (!user_id) {                                                                                                    // 302
      return [];                                                                                                       // 302
    }                                                                                                                  // 302
    company_id_list = [];                                                                                              // 303
    var user = Meteor.users.findOne({ _id: user_id });                                                                 // 304
    access_key = user.profile.access_key;                                                                              // 305
    var customOwnerFilters = {};                                                                                       // 306
    // var customOwnerFilters = {"profile.access_key":access_key}                                                      //
    //Edit custom settings if required:                                                                                //
    var customSettings = {};                                                                                           // 309
    //  customSettings.fields = {address: 1}; //This is the only field that will be shown                              //
    customSettings.filters = customOwnerFilters;                                                                       // 311
    //Leave this part untouched:                                                                                       //
    var fields = customSettings.fields || this.fields,                                                                 // 313
        sort = customSettings.sort || this.sort //Since I haven't supplied this field, the Pagination sort I've configured above will be used (=2)
    ,                                                                                                                  // 313
        perPage = customSettings.perPage || this.perPage //Same as the line above                                      // 313
    ,                                                                                                                  // 313
        _filters = _.extend({}, customSettings.filters, this.filters),                                                 // 313
        _options = { fields: fields, sort: sort, limit: perPage, skip: skip };                                         // 313
    return [_filters, _options];                                                                                       // 318
  }                                                                                                                    // 319
});                                                                                                                    // 287
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"UserDemand.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/UserDemand.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
userDemand = "UserDemand"; // avoid typos, this string occurs many times.                                              // 1
//                                                                                                                     //
UserDemand = new Mongo.Collection(userDemand);                                                                         // 3
                                                                                                                       //
/**                                                                                                                    //
 * Create the schema                                                                                                   //
 * See: https://github.com/aldeed/meteor-autoform#common-questions                                                     //
 * See: https://github.com/aldeed/meteor-autoform#affieldinput                                                         //
 */                                                                                                                    //
UserDemand.attachSchema(new SimpleSchema({                                                                             // 10
  email: {                                                                                                             // 11
    type: String,                                                                                                      // 12
    optional: true                                                                                                     // 13
  }, location: {                                                                                                       // 11
    type: String,                                                                                                      // 15
    optional: true                                                                                                     // 16
  },                                                                                                                   // 14
  skill: {                                                                                                             // 18
    type: String,                                                                                                      // 19
    optional: true                                                                                                     // 20
  },                                                                                                                   // 18
  classPrice: {                                                                                                        // 22
    type: String,                                                                                                      // 23
    optional: true                                                                                                     // 24
  },                                                                                                                   // 22
  monthPrice: {                                                                                                        // 26
    type: String,                                                                                                      // 27
    optional: true                                                                                                     // 28
  },                                                                                                                   // 26
  dateOfJoin: {                                                                                                        // 30
    type: Date,                                                                                                        // 31
    optional: true                                                                                                     // 32
  }                                                                                                                    // 30
}));                                                                                                                   // 10
if (Meteor.isServer) {                                                                                                 // 35
  Meteor.methods({                                                                                                     // 36
    addUserDemand: function addUserDemand(doc) {                                                                       // 37
      console.log(doc);                                                                                                // 38
      doc.dateOfJoin = new Date();                                                                                     // 39
      return UserDemand.insert(doc);                                                                                   // 40
    }                                                                                                                  // 41
  });                                                                                                                  // 36
}                                                                                                                      // 43
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"admin.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/collections/admin.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// AdminConfig = {                                                                                                     //
//   name: 'Scioma Admin',                                                                                             //
//   adminEmails: ['shawn@techmeetups.com','jayeshdalwadi2007@gmail.com'],                                             //
//   collections: {                                                                                                    //
//     Company:{}                                                                                                      //
//   },                                                                                                                //
// };                                                                                                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"router":{"Router.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/router/Router.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    //
 * Configure Iron Router.                                                                                              //
 * See: http://iron-meteor.github.io/iron-router/                                                                      //
 */                                                                                                                    //
                                                                                                                       //
Router.configure({                                                                                                     // 6
    layoutTemplate: 'Layout',                                                                                          // 7
    loadingTemplate: 'Loading'                                                                                         // 8
});                                                                                                                    // 6
                                                                                                                       //
if (Meteor.isClient) {                                                                                                 // 11
    Router.route('/verify-email/:token', {                                                                             // 12
        name: 'verifyemail',                                                                                           // 13
        data: function data() {                                                                                        // 14
            console.log("verify-email");                                                                               // 15
            Accounts.verifyEmail(this.params.token, function (error) {                                                 // 16
                if (error) {                                                                                           // 17
                    toastr.error(error.reason, 'danger');                                                              // 18
                } else {                                                                                               // 19
                    Router.go('/');                                                                                    // 20
                    toastr.success('Email verified! Thanks!', 'Success');                                              // 21
                }                                                                                                      // 22
            });                                                                                                        // 23
        }                                                                                                              // 24
    });                                                                                                                // 12
                                                                                                                       //
    Router.route('/evaluation_details/:id', {                                                                          // 28
        name: 'EvaluationDetails',                                                                                     // 29
        waitOn: function waitOn() {}                                                                                   // 30
    });                                                                                                                // 28
    Router.route('/AboutUs/', {                                                                                        // 34
        name: 'AboutUs',                                                                                               // 35
        waitOn: function waitOn() {}                                                                                   // 36
    });                                                                                                                // 34
                                                                                                                       //
    Router.route('/howitworks/', {                                                                                     // 41
        name: 'howitworks',                                                                                            // 43
        waitOn: function waitOn() {}                                                                                   // 44
    });                                                                                                                // 42
    Router.route('/SchoolUpload', {                                                                                    // 48
        name: 'SchoolUpload',                                                                                          // 49
        waitOn: function waitOn() {}                                                                                   // 50
    });                                                                                                                // 48
                                                                                                                       //
    Router.route('/ContactUs/', {                                                                                      // 55
        name: 'ContactUs',                                                                                             // 56
        waitOn: function waitOn() {}                                                                                   // 57
    });                                                                                                                // 55
    Router.route('/timeline/:id', {                                                                                    // 61
        name: 'timeline',                                                                                              // 62
        waitOn: function waitOn() {}                                                                                   // 63
    });                                                                                                                // 61
    Router.route('/schedule', {                                                                                        // 68
        name: 'ScheduleView',                                                                                          // 69
        waitOn: function waitOn() {}                                                                                   // 70
    });                                                                                                                // 68
                                                                                                                       //
    Router.route('/Login', {                                                                                           // 75
        name: 'Login',                                                                                                 // 76
        waitOn: function waitOn() {}                                                                                   // 77
    });                                                                                                                // 75
    Router.route('/Join', {                                                                                            // 81
        name: 'Join',                                                                                                  // 82
        waitOn: function waitOn() {}                                                                                   // 83
    });                                                                                                                // 81
    Router.route('/ForgotPassword', {                                                                                  // 87
        name: 'ForgotPassword',                                                                                        // 88
        waitOn: function waitOn() {}                                                                                   // 89
    });                                                                                                                // 87
    Router.route('/MyCalendar', {                                                                                      // 93
        name: 'MyCalendar',                                                                                            // 94
        waitOn: function waitOn() {                                                                                    // 95
            return this.subscribe("userSkillClass", Meteor.userId());                                                  // 96
        }                                                                                                              // 97
    });                                                                                                                // 93
    Router.route('/ManageSchool', {                                                                                    // 99
        name: 'Schools',                                                                                               // 100
        waitOn: function waitOn() {                                                                                    // 101
            return this.subscribe("School", Meteor.userId());                                                          // 102
        }                                                                                                              // 103
    });                                                                                                                // 99
    Router.route('/claimSchool', {                                                                                     // 105
        name: 'ClaimSchool',                                                                                           // 106
        waitOn: function waitOn() {                                                                                    // 107
            return [];                                                                                                 // 108
        }                                                                                                              // 109
    });                                                                                                                // 105
    Router.route('/school', {                                                                                          // 111
        name: 'SchoolOverview',                                                                                        // 112
        waitOn: function waitOn() {}                                                                                   // 113
    });                                                                                                                // 111
    Router.route('/reset-password/:token', {                                                                           // 117
        name: 'RecoverPassword',                                                                                       // 118
        waitOn: function waitOn() {}                                                                                   // 119
    });                                                                                                                // 117
    Router.route('/ComingSoon', {                                                                                      // 123
        name: 'ComingSoon',                                                                                            // 124
        waitOn: function waitOn() {}                                                                                   // 125
    });                                                                                                                // 123
    Router.route('/instructor', {                                                                                      // 129
        name: 'Instructor',                                                                                            // 130
        waitOn: function waitOn() {}                                                                                   // 131
    });                                                                                                                // 129
    Router.route('/class_archive', {                                                                                   // 135
        name: 'ClassArchive',                                                                                          // 136
        waitOn: function waitOn() {}                                                                                   // 137
    });                                                                                                                // 135
    Router.route('/class_edit/:id', {                                                                                  // 141
        name: 'ClassEdit',                                                                                             // 142
        waitOn: function waitOn() {}                                                                                   // 143
    });                                                                                                                // 141
                                                                                                                       //
    Router.route('/add_class', {                                                                                       // 148
        name: 'AddClass',                                                                                              // 149
        waitOn: function waitOn() {}                                                                                   // 150
    });                                                                                                                // 148
    Router.route('/school/:id', {                                                                                      // 154
        name: 'EditSchool',                                                                                            // 155
        waitOn: function waitOn() {}                                                                                   // 156
    });                                                                                                                // 154
    Router.route('/class_detail/:id', {                                                                                // 160
        name: 'ClassDetail',                                                                                           // 161
        waitOn: function waitOn() {}                                                                                   // 162
    });                                                                                                                // 160
    Router.route('/class_template/:id', {                                                                              // 166
        name: 'ClassTemplate',                                                                                         // 167
        waitOn: function waitOn() {}                                                                                   // 168
    });                                                                                                                // 166
    Router.route('/member_home', {                                                                                     // 172
        name: 'MemberHome',                                                                                            // 173
        waitOn: function waitOn() {}                                                                                   // 174
    });                                                                                                                // 172
                                                                                                                       //
    Router.route('/program_manager', {                                                                                 // 179
        name: 'ProgramManager',                                                                                        // 180
        waitOn: function waitOn() {}                                                                                   // 181
    });                                                                                                                // 179
    Router.route('/member_signup', {                                                                                   // 185
        name: 'membersignup',                                                                                          // 186
        waitOn: function waitOn() {}                                                                                   // 187
    });                                                                                                                // 185
    Router.route('/personal_info/:id', {                                                                               // 191
        name: 'PersonalInfo',                                                                                          // 192
        waitOn: function waitOn() {}                                                                                   // 193
    });                                                                                                                // 191
                                                                                                                       //
    Router.route('/MemberList', {                                                                                      // 198
        name: 'MemberList',                                                                                            // 199
        waitOn: function waitOn() {}                                                                                   // 200
    });                                                                                                                // 198
    Router.route('/MemberDetails', {                                                                                   // 204
        name: 'MemberDetails',                                                                                         // 205
        waitOn: function waitOn() {}                                                                                   // 206
    });                                                                                                                // 204
    Router.route('/MemberDetailsInstructor', {                                                                         // 210
        name: 'MemberDetailsInstructor',                                                                               // 211
        waitOn: function waitOn() {}                                                                                   // 212
    });                                                                                                                // 210
    Router.route('/MemberDetailsStudent', {                                                                            // 216
        name: 'MemberDetailsStudent',                                                                                  // 217
        waitOn: function waitOn() {}                                                                                   // 218
    });                                                                                                                // 216
    Router.route('/student_evaluator', {                                                                               // 222
        name: 'StudentEvaluator',                                                                                      // 223
        waitOn: function waitOn() {}                                                                                   // 224
    });                                                                                                                // 222
                                                                                                                       //
    Router.route('/SkillView', {                                                                                       // 229
        name: 'SkillView',                                                                                             // 230
        waitOn: function waitOn() {}                                                                                   // 231
    });                                                                                                                // 229
    Router.route('/SkillList', {                                                                                       // 235
        name: 'SkillList',                                                                                             // 236
        waitOn: function waitOn() {}                                                                                   // 237
    });                                                                                                                // 235
    Router.route('/SkillEditor', {                                                                                     // 241
        name: 'SkillEditor',                                                                                           // 242
        waitOn: function waitOn() {}                                                                                   // 243
    });                                                                                                                // 241
    Router.route('/media_upload', {                                                                                    // 247
        name: 'MediaUpload',                                                                                           // 248
        waitOn: function waitOn() {}                                                                                   // 249
    });                                                                                                                // 247
    Router.route('/EvaluationArchive', {                                                                               // 251
        name: 'EvaluationArchive',                                                                                     // 252
        waitOn: function waitOn() {}                                                                                   // 253
    });                                                                                                                // 251
    Router.route('/StudentProgressView', {                                                                             // 255
        name: 'StudentProgressView',                                                                                   // 256
        waitOn: function waitOn() {}                                                                                   // 257
    });                                                                                                                // 255
    Router.route('/MemberNewAdmin', {                                                                                  // 261
        name: 'MemberNewAdmin',                                                                                        // 262
        waitOn: function waitOn() {}                                                                                   // 263
    });                                                                                                                // 261
    Router.route('/member_chooser', {                                                                                  // 267
        name: 'MemberChooser',                                                                                         // 268
        waitOn: function waitOn() {}                                                                                   // 269
    });                                                                                                                // 267
    Router.route('/schoolAdmin', {                                                                                     // 273
        template: 'schoolAdmin',                                                                                       // 274
        name: 'schoolCreate',                                                                                          // 275
        waitOn: function waitOn() {}                                                                                   // 276
    });                                                                                                                // 273
    Router.route('/schools/:schoolId/calendar', {                                                                      // 280
        template: 'SchoolView',                                                                                        // 281
        name: 'calendar',                                                                                              // 282
        waitOn: function waitOn() {                                                                                    // 283
            var slug = this.params.schoolId;                                                                           // 284
            console.log(slug);                                                                                         // 285
            params = this.params.query;                                                                                // 286
            console.log(params);                                                                                       // 287
            if (params && params.city || params && params.skillType) {                                                 // 288
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlugWithFilter", slug, params.city, params.skillType)];
            } else {                                                                                                   // 290
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlug", slug)];   // 291
            }                                                                                                          // 292
        },                                                                                                             // 293
        data: function data() {                                                                                        // 294
            return School.findOne({ slug: this.params.schoolId });                                                     // 295
        }                                                                                                              // 296
    });                                                                                                                // 280
    Router.route('/embed/schools/:schoolId/calendar', {                                                                // 298
        layoutTemplate: 'iframeembed',                                                                                 // 299
        template: 'SchoolView',                                                                                        // 300
        name: 'embedcalendar',                                                                                         // 301
        waitOn: function waitOn() {                                                                                    // 302
            var slug = this.params.schoolId;                                                                           // 303
            console.log(slug);                                                                                         // 304
            params = this.params.query;                                                                                // 305
            console.log(params);                                                                                       // 306
            if (params && params.city || params && params.skillType) {                                                 // 307
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlugWithFilter", slug, params.city, params.skillType)];
            } else {                                                                                                   // 309
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlug", slug)];   // 310
            }                                                                                                          // 311
        },                                                                                                             // 312
        data: function data() {                                                                                        // 313
            params = this.params.query;                                                                                // 314
            if (params.height) {                                                                                       // 315
                Session.set("embed_height", module.runModuleSetters(eval(params.height)));                             // 316
            } else {                                                                                                   // 317
                Session.set("embed_height", 800);                                                                      // 318
            }                                                                                                          // 319
            if (params.width) {                                                                                        // 320
                Session.set("embed_width", params.width);                                                              // 321
            } else {                                                                                                   // 322
                Session.set("embed_width", null);                                                                      // 323
            }                                                                                                          // 324
            return School.findOne({ slug: this.params.schoolId });                                                     // 325
        }                                                                                                              // 326
    });                                                                                                                // 298
                                                                                                                       //
    Router.route('/embed/schools/:schoolId/pricing', {                                                                 // 329
        layoutTemplate: 'iframeembed',                                                                                 // 330
        template: 'SchoolView',                                                                                        // 331
        name: 'embedPricing',                                                                                          // 332
        waitOn: function waitOn() {                                                                                    // 333
            var slug = this.params.schoolId;                                                                           // 334
            console.log(slug);                                                                                         // 335
            params = this.params.query;                                                                                // 336
            console.log(params);                                                                                       // 337
            if (params && params.city || params && params.skillType) {                                                 // 338
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlugWithFilter", slug, params.city, params.skillType)];
            } else {                                                                                                   // 340
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlug", slug)];   // 341
            }                                                                                                          // 342
        },                                                                                                             // 343
        data: function data() {                                                                                        // 344
            params = this.params.query;                                                                                // 345
            if (params.height) {                                                                                       // 346
                Session.set("embed_height", params.height);                                                            // 347
            } else {                                                                                                   // 348
                Session.set("embed_height", null);                                                                     // 349
            }                                                                                                          // 350
            if (params.width) {                                                                                        // 351
                if (module.runModuleSetters(eval(params.width)) < 1000) {                                              // 352
                    params.width = 1000;                                                                               // 353
                }                                                                                                      // 354
                Session.set("embed_width", params.width);                                                              // 355
            } else {                                                                                                   // 356
                Session.set("embed_width", null);                                                                      // 357
            }                                                                                                          // 358
            return School.findOne({ slug: this.params.schoolId });                                                     // 359
        }                                                                                                              // 360
    });                                                                                                                // 329
                                                                                                                       //
    Router.route('/schools/:schoolId/pricing', {                                                                       // 363
        template: 'SchoolView',                                                                                        // 364
        name: 'pricing',                                                                                               // 365
        waitOn: function waitOn() {                                                                                    // 366
            var slug = this.params.schoolId;                                                                           // 367
            console.log(slug);                                                                                         // 368
            params = this.params.query;                                                                                // 369
            console.log(params);                                                                                       // 370
            if (params && params.city || params && params.skillType) {                                                 // 371
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlugWithFilter", slug, params.city, params.skillType)];
            } else {                                                                                                   // 373
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlug", slug)];   // 374
            }                                                                                                          // 375
        },                                                                                                             // 376
        data: function data() {                                                                                        // 377
            return School.findOne({ slug: this.params.schoolId });                                                     // 378
        }                                                                                                              // 379
    });                                                                                                                // 363
    Router.route('/schools/:schoolId', {                                                                               // 381
        template: 'SchoolView',                                                                                        // 382
        name: 'SlagbasedViewSchool',                                                                                   // 383
        waitOn: function waitOn() {                                                                                    // 384
            var slug = this.params.schoolId;                                                                           // 385
            console.log(slug);                                                                                         // 386
            params = this.params.query;                                                                                // 387
            console.log(params);                                                                                       // 388
            date = null; //new Date();                                                                                 // 389
            /*date = Session.get("currentCalanderDate")*/                                                              //
            if (params && params.city || params && params.skillType) {                                                 // 391
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlugWithFilter", slug, params.city, params.skillType)];
            } else {                                                                                                   // 393
                return [this.subscribe("UserSchoolbySlug", slug), this.subscribe("SkillClassbySchoolBySlug", slug)];   // 394
            }                                                                                                          // 395
        },                                                                                                             // 396
        data: function data() {                                                                                        // 397
            return School.findOne({ slug: this.params.schoolId });                                                     // 398
        }                                                                                                              // 399
    });                                                                                                                // 381
    Router.route('/schoolAdmin/:schoolId', {                                                                           // 401
        template: 'SchoolView',                                                                                        // 402
        name: 'viewSchool',                                                                                            // 403
        waitOn: function waitOn() {                                                                                    // 404
            var school_id = this.params.schoolId;                                                                      // 405
            return [this.subscribe("UserSchool", school_id), this.subscribe("SkillClassbySchool", school_id), this.subscribe("ClaimOrder", "")];
        },                                                                                                             // 407
        data: function data() {                                                                                        // 408
            return School.findOne({ _id: this.params.schoolId });                                                      // 409
        }                                                                                                              // 410
    });                                                                                                                // 401
    Router.route('/schoolAdmin/:schoolId/edit', {                                                                      // 412
        template: 'schoolAdmin',                                                                                       // 413
        name: 'schoolEdit',                                                                                            // 414
        waitOn: function waitOn() {                                                                                    // 415
            var school_id = this.params.schoolId;                                                                      // 416
            return this.subscribe("UserSchool", school_id);                                                            // 417
        },                                                                                                             // 418
        data: function data() {                                                                                        // 419
            return School.findOne({ _id: this.params.schoolId });                                                      // 420
        }                                                                                                              // 421
    });                                                                                                                // 412
    Router.onRun(function () {                                                                                         // 423
        try {                                                                                                          // 424
            var currentRoute = Router.current().originalUrl;                                                           // 425
        } catch (e) {                                                                                                  // 426
            var currentRoute = "/";                                                                                    // 427
        }                                                                                                              // 428
                                                                                                                       //
        console.log(currentRoute);                                                                                     // 430
                                                                                                                       //
        if (Meteor.loggingIn() || Meteor.user()) {                                                                     // 432
            console.log(Meteor.userId());                                                                              // 433
            // if (Meteor.user() && !Meteor.user().emails[0].verified){                                                //
            //   if(currentRoute == "/" || currentRoute.indexOf("verify-email") > -1){                                 //
            //     this.next();                                                                                        //
            //   }else{                                                                                                //
            //     this.render('Home');                                                                                //
            //     this.stop();                                                                                        //
            //   }                                                                                                     //
            // }else{                                                                                                  //
            this.next();                                                                                               // 442
            // }                                                                                                       //
        } else {}                                                                                                      // 444
    });                                                                                                                // 447
    Router.route('/search', function () {                                                                              // 448
        params = this.params.query;                                                                                    // 449
        if (params && params.school) {                                                                                 // 450
            this.redirect('/schools/' + params.school + "?city=" + params.city + "&skillType=" + params.skillType);    // 451
        } else {                                                                                                       // 452
            if (params && params.skillType) {                                                                          // 453
                Session.set("Hskill", params.skillType);                                                               // 454
            }                                                                                                          // 455
            if (params.city) {                                                                                         // 456
                Session.set("initNearByLocation", false);                                                              // 457
                console.log(params.city);                                                                              // 458
                getLatLong(params.city, function (data) {                                                              // 459
                    coords = [];                                                                                       // 460
                    coords[0] = data.lat;                                                                              // 461
                    coords[1] = data.lng;                                                                              // 462
                    console.log(data);                                                                                 // 463
                    Session.set("coords", coords);                                                                     // 464
                    Session.set("SLocation", data.formatted_address);                                                  // 465
                    if (params.skillType) {                                                                            // 466
                        Router.go('/' + "?city=" + params.city + "&skillType=" + params.skillType);                    // 467
                    } else {                                                                                           // 468
                        Router.go('/?city=' + params.city);                                                            // 469
                    }                                                                                                  // 470
                });                                                                                                    // 471
            } else {                                                                                                   // 472
                Session.set("initNearByLocation", false);                                                              // 473
                Router.go('/' + "?skillType=" + params.skillType);                                                     // 474
            }                                                                                                          // 475
        }                                                                                                              // 476
    });                                                                                                                // 477
    Router.route('/', {                                                                                                // 478
        name: 'Home',                                                                                                  // 479
        onBeforeAction: function onBeforeAction() {                                                                    // 480
            if (Meteor.userId() && IsDemoUser()) {                                                                     // 481
                this.redirect('/schedule');                                                                            // 482
                this.next();                                                                                           // 483
            } else {                                                                                                   // 484
                this.next();                                                                                           // 485
            }                                                                                                          // 486
        },                                                                                                             // 487
        waitOn: function waitOn() {                                                                                    // 488
            params = this.params.query;                                                                                // 489
            return [];                                                                                                 // 490
        }                                                                                                              // 491
    });                                                                                                                // 478
                                                                                                                       //
    Router.route('/profile/:id', {                                                                                     // 494
        name: 'MyProfile',                                                                                             // 495
        data: function data() {}                                                                                       // 496
    });                                                                                                                // 494
    Router.route('/profile', {                                                                                         // 499
        name: 'Profile',                                                                                               // 500
        data: function data() {                                                                                        // 501
            return Meteor.user();                                                                                      // 502
        },                                                                                                             // 503
        waitOn: function waitOn() {                                                                                    // 504
            return this.subscribe("images");                                                                           // 505
        }                                                                                                              // 506
    });                                                                                                                // 499
                                                                                                                       //
    Router.route('/users', {                                                                                           // 511
        name: 'ListUser',                                                                                              // 512
        waitOn: function waitOn() {                                                                                    // 513
            return [this.subscribe("User", Meteor.userId())];                                                          // 514
        },                                                                                                             // 515
        onBeforeAction: function onBeforeAction() {                                                                    // 516
            if (Meteor.user()) {                                                                                       // 517
                this.next();                                                                                           // 518
            } else {                                                                                                   // 520
                Router.go('Home');                                                                                     // 521
                this.next();                                                                                           // 522
            }                                                                                                          // 523
        }                                                                                                              // 524
    });                                                                                                                // 511
    Router.route('/user/add', {                                                                                        // 526
        waitOn: function waitOn() {                                                                                    // 527
            return this.subscribe("Company", Meteor.userId());                                                         // 528
        },                                                                                                             // 529
        name: 'AddUser'                                                                                                // 530
    });                                                                                                                // 526
    Router.route('/user/:_id', {                                                                                       // 532
        name: 'EditUser',                                                                                              // 533
        waitOn: function waitOn() {                                                                                    // 534
            return [this.subscribe("UserShow", this.params._id, this.params._id)];                                     // 535
        },                                                                                                             // 538
        data: function data() {                                                                                        // 539
            return Meteor.users.findOne(this.params._id);                                                              // 540
        }                                                                                                              // 541
    });                                                                                                                // 532
}                                                                                                                      // 543
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"publish.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publish.js                                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish("school", function () {                                                                                 // 1
    return School.find({});                                                                                            // 2
});                                                                                                                    // 3
Meteor.publish("salocation", function () {                                                                             // 4
    return SLocation.find({});                                                                                         // 5
});                                                                                                                    // 6
Meteor.publish("classtype", function () {                                                                              // 7
    return ClassType.find({});                                                                                         // 8
});                                                                                                                    // 9
Meteor.publish("sclass", function () {                                                                                 // 10
    return Sclass.find({});                                                                                            // 11
});                                                                                                                    // 12
Meteor.publish("priceMonth", function () {                                                                             // 13
    return Pricemonthly.find({});                                                                                      // 14
});                                                                                                                    // 15
Meteor.publish("priceClass", function () {                                                                             // 16
    return Priceclass.find({});                                                                                        // 17
});                                                                                                                    // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"smtp.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/smtp.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
    smtp = {                                                                                                           // 2
        username: 'admin@techmeetups.com', // eg: server@gentlenode.com                                                // 3
        password: '@dmin_555', // eg: 3eeP1gtizk5eziohfervU                                                            // 4
        server: 'send.one.com', // eg: mail.gandi.net                                                                  // 5
        port: 587                                                                                                      // 6
    };                                                                                                                 // 2
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});                                                                                                                    // 11
                                                                                                                       //
// Meteor.startup(function () {                                                                                        //
//     smtp = {                                                                                                        //
//         username: 'jayeshdalwadi2007@gmail.com',   // eg: server@gentlenode.com                                     //
//         password: '1234567bond',   // eg: 3eeP1gtizk5eziohfervU                                                     //
//         server:   'smtp.gmail.com',  // eg: mail.gandi.net                                                          //
//         port: 465                                                                                                   //
//     }                                                                                                               //
//     process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
// });                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":["meteor/meteor","url",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});                                            // 1
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 3
    // Accounts.config({                                                                                               //
    //   sendVerificationEmail: true                                                                                   //
    // });                                                                                                             //
    Accounts.emailTemplates.from = 'admin <admin@techmeetups.com>';                                                    // 7
    // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).      //
    Accounts.emailTemplates.siteName = 'skillshape';                                                                   // 9
    // A Function that takes a user object and returns a String for the subject line of the email.                     //
    Accounts.emailTemplates.verifyEmail.subject = function (user) {                                                    // 11
        return 'Confirm Your Email Address';                                                                           // 12
    };                                                                                                                 // 13
    // A Function that takes a user object and a url, and returns the body text for the email.                         //
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html                          //
    Accounts.emailTemplates.verifyEmail.text = function (user, url) {                                                  // 16
        url = url.replace('#/', '');                                                                                   // 17
        return 'click on the following link to verify your email address: ' + url;                                     // 18
    };                                                                                                                 // 19
    Accounts.urls.resetPassword = function (token) {                                                                   // 20
        return Meteor.absoluteUrl('reset-password/' + token);                                                          // 21
    };                                                                                                                 // 22
    // code to run on server at startup                                                                                //
                                                                                                                       //
    var _tagObj = { "Dance": ["African", "Argentine tango", "B-boying", "Ballet", "Ballroom dance", "Belly dance", "Bounce", "Break Dancing", "Capoeira", "Cha Cha", "Charleston", "Classical Indian dance", "Concert dance", "Contact improvisation", "Contemporary Dance", "Disco / electronic dance", "East Coast Swing", "Ethnic dance", "Experimental / freestyle", "Flamenco", "Flexing", "Floating", "Folk dance", "Footwork", "Foxtrot", "Hip Hop / Street Dance", "Jazz dance", "Jitterbug", "Krumping", "Locking", "MaculelÃª", "Mambo", "Medieval dance", "Merengue", "Metal Mosh", "Modern dance", "Quickstep", "Reggaeton", "Robot dance", "Rumba", "Salsa", "Samba", "Swing dance", "Tango", "Tap dance", "Vogue", "Waltz", "Zumba"],
        "Art/ Design/Craft": ["Acrylic Painting", "Cartoon Art", "Crafting", "Creative Writing", "Crocheting", "Drawing", "Figure Drawing", "Fingernail Art", "Graphic Design", "Hair Styling", "Knitting", "Makeup", "Oil Paint", "Sculpture", "Sewing", "Soap / Cosmetic", "Stitching", "Watercolor"],
        "Sport/Exercise": ["American Football", "Baseball", "Basketball", "Boot Camp", "Cycling", "Darts", "Football / Soccer", "Frisbee", "Gymnastics", "High Intensity Interval Training", "Jogging", "Juggling", "Other Ball Games", "Parkour", "Rugby", "Sprinting", "Swimming", "Tai Chi", "Tennis", "Ultimate Frisbee", "Walking", "Weight / Resistance", "Racketball"],
        "Language": ["Arabic", "Bengali", "Dutch", "English", "French", "German", "Hindi", "Italian", "Japanese", "Mandarin", "Portuguese", "Russian", "Spanish"],
        "Coding and Computers": ["Android", "C#", "C+", "iOS", "Javascript", "Javascript", "Meteor", "Node", "PHP", "Python"],
        "Business/Marketing": ["Accounting", "Business Strategy", "Business Writing", "Entrepreneurship", "Marketing", "Sales", "Software Development"],
        "Meditation/Religion": ["Meditation", "Catholic Prayer Meeting", "Muslim Prayer Meeting", "Buddhist Chanting", "Protestant Prayer Meeting", "Christian Meeting", "Bible Study", "Koran Study", "Sutra Study"],
        "Acting/Comedy": ["Acting Class", "Improvisation", "Stand-Up Comedy", "Movement / Slapstick"],                 // 40
        "Games": ["Video Games", "Role Playing Games", "Miniature Games", "Chess", "Checkers", "Poker", "Board Games", "Card Games"],
        "Pets": ["Dog Walks", "Dog Grooming", "Dog Meetups", "Exotic Pet Meetups", "Dog Training"],                    // 42
        "Parents/Children": ["Child Meetup by Age", "Parents with Autistic Children", "Parents with Special Needs Children"],
        "Yoga/Pilates": ["Anusara", "Ashtanga", "Bikram", "Hatha", "Hot Yoga", "Iyengar", "Jivamukti", "Kripalu", "Kundalini", "Prenatal", "Restorative", "Sivananda", "Viniyoga", "Vinyasa / Power", "Yin"],
        "Food and Beverage": ["Cooking", "Fermentation", "Bread Making", "Wine Tasting", "Beer Making", "Cocktail Mixing"] };
                                                                                                                       //
    if (tags.find().count() == 0) {                                                                                    // 48
                                                                                                                       //
        for (var key in _tagObj) {                                                                                     // 50
            _tagObj[key].forEach(function (f) {                                                                        // 51
                tags.insert({ tag: f, 'class': key });                                                                 // 52
            });                                                                                                        // 53
        }                                                                                                              // 54
                                                                                                                       //
        tags.insert({ tag: 'Aikido', 'class': 'Martial Art' });                                                        // 56
        tags.insert({ tag: 'American Karate', 'class': 'Martial Art' });                                               // 57
        tags.insert({ tag: 'American Kenpo', 'class': 'Martial Art' });                                                // 58
        tags.insert({ tag: 'Arnis/Eskrima/Kali', 'class': 'Martial Art' });                                            // 59
        tags.insert({ tag: 'Brazilian jiu-jitsu', 'class': 'Martial Art' });                                           // 60
        tags.insert({ tag: 'DaitÅ-ryÅ« Aiki-jÅ«jutsu', 'class': 'Martial Art' });                                     // 61
        tags.insert({ tag: 'Danzan-ryÅ«', 'class': 'Martial Art' });                                                   // 62
        tags.insert({ tag: 'Hapkido', 'class': 'Martial Art' });                                                       // 63
        tags.insert({ tag: 'Iaido', 'class': 'Martial Art' });                                                         // 64
        tags.insert({ tag: 'Japanese Jujitsu', 'class': 'Martial Art' });                                              // 65
        tags.insert({ tag: 'Japanese Karate', 'class': 'Martial Art' });                                               // 66
        tags.insert({ tag: 'Japnese KenPo', 'class': 'Martial Art' });                                                 // 67
        tags.insert({ tag: 'Jeet Kune Do', 'class': 'Martial Art' });                                                  // 68
        tags.insert({ tag: 'Judo', 'class': 'Martial Art' });                                                          // 69
        tags.insert({ tag: 'Jujutsu', 'class': 'Martial Art' });                                                       // 70
        tags.insert({ tag: 'Kalaripayattu', 'class': 'Martial Art' });                                                 // 71
        tags.insert({ tag: 'Kendo', 'class': 'Martial Art' });                                                         // 72
        tags.insert({ tag: 'Kenjutsu', 'class': 'Martial Art' });                                                      // 73
        tags.insert({ tag: 'Kick Boxing', 'class': 'Martial Art' });                                                   // 74
        tags.insert({ tag: 'Krav Maga', 'class': 'Martial Art' });                                                     // 75
        tags.insert({ tag: 'Kung Fu', 'class': 'Martial Art' });                                                       // 76
        tags.insert({ tag: 'Mixed Martial Arts', 'class': 'Martial Art' });                                            // 77
        tags.insert({ tag: 'Muay Thai', 'class': 'Martial Art' });                                                     // 78
        tags.insert({ tag: 'Ninjutsu', 'class': 'Martial Art' });                                                      // 79
        tags.insert({ tag: 'Nippon Kempo', 'class': 'Martial Art' });                                                  // 80
        tags.insert({ tag: 'Okinawan martial arts', 'class': 'Martial Art' });                                         // 81
        tags.insert({ tag: 'Japanese Karate', 'class': 'Martial Art' });                                               // 82
        tags.insert({ tag: 'Other Traditional Martial Art', 'class': 'Martial Art' });                                 // 83
        tags.insert({ tag: 'Pankration', 'class': 'Martial Art' });                                                    // 84
        tags.insert({ tag: 'Sambo', 'class': 'Martial Art' });                                                         // 85
        tags.insert({ tag: 'Jujutsu', 'class': 'Martial Art' });                                                       // 86
        tags.insert({ tag: 'Savate', 'class': 'Martial Art' });                                                        // 87
        tags.insert({ tag: 'SCA', 'class': 'Martial Art' });                                                           // 88
        tags.insert({ tag: 'Shootfighting (American)', 'class': 'Martial Art' });                                      // 89
        tags.insert({ tag: 'Small Circle Jujutsu', 'class': 'Martial Art' });                                          // 90
        tags.insert({ tag: 'Sumo', 'class': 'Martial Art' });                                                          // 91
        tags.insert({ tag: 'Systema', 'class': 'Martial Art' });                                                       // 92
        tags.insert({ tag: "T'ai chi ch'uan", 'class': 'Martial Art' });                                               // 93
        tags.insert({ tag: 'Vale Tudo', 'class': 'Martial Art' });                                                     // 94
        tags.insert({ tag: 'Wing Chun', 'class': 'Martial Art' });                                                     // 95
        tags.insert({ tag: 'WuShu', 'class': 'Martial Art' });                                                         // 96
    }                                                                                                                  // 98
});                                                                                                                    // 100
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 102
    S3.config = {                                                                                                      // 104
        key: 'AKIAIUDOMFJ4ZGYKIO6Q',                                                                                   // 105
        secret: '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',                                                            // 106
        bucket: 'skillshape',                                                                                          // 107
        region: 'us-west-1'                                                                                            // 108
    };                                                                                                                 // 104
    Accounts.onCreateUser(function (options, user) {                                                                   // 110
        console.log("on account create");                                                                              // 112
        console.log(options);                                                                                          // 113
        if (options.profile == null || options.profile == undefined) {                                                 // 114
            user.profile = { "role": "Admin", "access_key": Math.random().toString(36).slice(2) };                     // 115
            // Roles.addUsersToRoles(user._id,'admin')                                                                 //
            // console.log(Roles.userIsInRole(Meteor.userId(),'admin'));                                               //
        } else {                                                                                                       // 118
                user.profile = options.profile;                                                                        // 119
            }                                                                                                          // 120
        user.profile = _.extend(user.profile, { "user_type": "C" });                                                   // 121
                                                                                                                       //
        debugger;                                                                                                      // 123
                                                                                                                       //
        if (options.preverfiedUser) {                                                                                  // 125
            user.emails[0].verified = true;                                                                            // 126
            return user;                                                                                               // 127
        }                                                                                                              // 128
                                                                                                                       //
        console.log("--------------------USER-------------------");                                                    // 130
                                                                                                                       //
        console.log(user);                                                                                             // 132
                                                                                                                       //
        console.log("--------------------OPTIONS-------------------");                                                 // 134
                                                                                                                       //
        console.log(options);                                                                                          // 136
                                                                                                                       //
        if (options.auto_created == true) {                                                                            // 138
            try {                                                                                                      // 139
                userRegistration(user, options.password);                                                              // 140
            } catch (e) {}                                                                                             // 141
            return user;                                                                                               // 144
        }                                                                                                              // 145
        try {                                                                                                          // 146
            userRegistration(user, "hidden");                                                                          // 147
        } catch (e) {                                                                                                  // 148
            console.log(e);                                                                                            // 149
        }                                                                                                              // 150
        return user;                                                                                                   // 151
    });                                                                                                                // 152
                                                                                                                       //
    var userRegistration = function userRegistration(user, pass) {                                                     // 154
        var fromEmail = "admin@techmeetups.com";                                                                       // 156
        var toEmail = user.emails[0].address;                                                                          // 157
        Email.send({                                                                                                   // 158
            from: fromEmail,                                                                                           // 159
            to: toEmail,                                                                                               // 160
            replyTo: fromEmail,                                                                                        // 161
            subject: "skillshape Registration",                                                                        // 162
            text: "Hi " + user.emails[0].address + ",\nYour Email: " + user.emails[0].address + " has been registered." + "\nYour password is : " + pass + "\n\n" + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"                                                 //
        });                                                                                                            // 158
    };                                                                                                                 // 169
                                                                                                                       //
    var userFeedBack = function userFeedBack(user, email, message, request) {                                          // 171
        var fromEmail = "admin@techmeetups.com";                                                                       // 173
        var toEmail = "admin@techmeetups.com";                                                                         // 174
        Email.send({                                                                                                   // 175
            from: fromEmail,                                                                                           // 176
            to: toEmail,                                                                                               // 177
            replyTo: fromEmail,                                                                                        // 178
            subject: "skillshape Feedback",                                                                            // 179
            text: "Hi ,\nWe have feedback from : " + user + "(" + email + ")" + "\nHis feedback request is : " + request + "\n" + "\nMessage : " + message + "\n\n" + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"                                                 //
        });                                                                                                            // 175
    };                                                                                                                 // 187
                                                                                                                       //
    var userPasswordReset = function userPasswordReset(user, pass) {                                                   // 189
        var fromEmail = "admin@techmeetups.com";                                                                       // 191
        var toEmail = user.emails[0].address;                                                                          // 192
        Email.send({                                                                                                   // 193
            from: fromEmail,                                                                                           // 194
            to: toEmail,                                                                                               // 195
            replyTo: fromEmail,                                                                                        // 196
            subject: "skillshape Password Reset",                                                                      // 197
            text: "Hi " + user.emails[0].address + ",\nYour password has been reset." + "\nYour new password is : " + pass + "\n\n" + "Thank you.\n" + "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"                                                  //
        });                                                                                                            // 193
    };                                                                                                                 // 204
                                                                                                                       //
    Meteor.publish("roles", function () {                                                                              // 206
        return Meteor.roles.find({});                                                                                  // 208
    });                                                                                                                // 209
                                                                                                                       //
    var absolutePath = function absolutePath(domain, href) {                                                           // 211
        var url = require('url');                                                                                      // 213
        var link = url.resolve(domain, href);                                                                          // 214
        return link;                                                                                                   // 215
    };                                                                                                                 // 216
                                                                                                                       //
    Meteor.methods({                                                                                                   // 219
        sendVerificationLink: function sendVerificationLink() {                                                        // 220
            var userId = Meteor.userId();                                                                              // 221
            if (userId) {                                                                                              // 222
                return Accounts.sendVerificationEmail(userId);                                                         // 223
            }                                                                                                          // 224
        },                                                                                                             // 225
                                                                                                                       //
        get_url: function get_url(url) {                                                                               // 226
            return Meteor.http.get(url, { headers: { "User-Agent": "Meteor/1.0" }, timeout: 25000 });                  // 228
        },                                                                                                             // 229
        sendfeedbackToAdmin: function sendfeedbackToAdmin(user, email, message, request) {                             // 230
            userFeedBack(user, email, message, request);                                                               // 231
            return true;                                                                                               // 232
        }                                                                                                              // 233
    });                                                                                                                // 219
    var restServiceGetCall = function restServiceGetCall(url) {                                                        // 235
        var result = HTTP.get(url);                                                                                    // 237
        if (result.statusCode == 200) {                                                                                // 238
            response = JSON.parse(result.content);                                                                     // 240
            return response;                                                                                           // 241
        } else {                                                                                                       // 242
            var json = JSON.parse(result.content);                                                                     // 245
            throw new Meteor.Error(result.statusCode, json.error);                                                     // 246
        }                                                                                                              // 247
    };                                                                                                                 // 248
}                                                                                                                      // 249
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./lib/collections/Category.js");
require("./lib/collections/ClaimOrder.js");
require("./lib/collections/ClassPricing.js");
require("./lib/collections/ClassSchedule.js");
require("./lib/collections/ClassType.js");
require("./lib/collections/Company.js");
require("./lib/collections/Demand.js");
require("./lib/collections/Evaluation.js");
require("./lib/collections/EvaluationType.js");
require("./lib/collections/Level.js");
require("./lib/collections/Media.js");
require("./lib/collections/Module.js");
require("./lib/collections/MonthlyPricing.js");
require("./lib/collections/Program.js");
require("./lib/collections/SLocation.js");
require("./lib/collections/School.js");
require("./lib/collections/Skill.js");
require("./lib/collections/SkillClass.js");
require("./lib/collections/SkillType.js");
require("./lib/collections/Subject.js");
require("./lib/collections/Tags.js");
require("./lib/collections/User.js");
require("./lib/collections/UserDemand.js");
require("./lib/collections/admin.js");
require("./lib/router/Router.js");
require("./server/publish.js");
require("./server/smtp.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
