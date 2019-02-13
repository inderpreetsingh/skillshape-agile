
import { check } from 'meteor/check';
import ClassInterest from "/imports/api/classInterest/fields.js";
import ClassTimes from "/imports/api/classTimes/fields.js";
import ClassTypes from "/imports/api/classType/fields.js";
import SLocation from "/imports/api/sLocation/fields.js";
import { get, isEmpty,cloneDeep } from 'lodash';
import moment from 'moment';
import axios from 'axios';

Meteor.methods({
  "calendar.handleGoogleCalendar": async function (userId, action, ids) {
    try {
      let { refresh_token, googleCalendarId: calendarId } = Meteor.users.findOne({ _id: userId });
      if (refresh_token && calendarId) {
        let client_id = Meteor.settings.google.auth.appId;
        let client_secret = Meteor.settings.google.auth.secret;
        let data = {
          client_id,
          client_secret,
          refresh_token,
          grant_type: 'refresh_token',
        }
        let response = await axios({
          method: 'post',
          url: 'https://accounts.google.com/o/oauth2/token',
          headers: { 'Content-Type': 'application/json' },
          data
        })
        let { access_token } = response.data;

        if (action == 'insert') {
          let eventsList = Meteor.call('calendar.generateEvents', userId);
         !isEmpty(eventsList || []) && eventsList.map(async (e) => {
            try {
              let response = await axios({
                method: 'post',
                url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?alt=json`,
                headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
                data: e,
                timeout: 20000,
              })
              let { id: eventId } = response.data;
              let { _id } = e;
              if (eventId) {
                ClassInterest.update({ _id }, { $set: { eventId } });
              }
              console.log('Event Added')
            } catch (error) {
              console.log('​Error in map of the calendar.handleGoogleCalendar')
            }
          })
        }
        else if (action == 'delete' && !isEmpty(ids)) {
          let classInterestData = ClassInterest.find({ _id: { $in: ids } }).fetch();
          classInterestData.map(async (obj) => {
            let { eventId } = obj;
            if (eventId) {
              let response = await axios({
                method: 'delete',
                url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
                headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
                timeout: 20000,
              })
              console.log('Event Deleted');
            }
          })
        }
      }
    } catch (error) {
      console.log('Error in calendar.handleGoogleCalendar', error, error.response)
      throw new Meteor.Error(error);
    }
  },
  "calendar.generateEvents": function (userId) {
    try {
      let events = [];
      let classInterestData = ClassInterest.find({ userId, }).fetch();
      if (!isEmpty(classInterestData)) {
        classInterestData.map((classInterest) => {
          let { classTimeId, classTypeId, _id: id } = classInterest;
          let classTimeData = ClassTimes.findOne({ _id: classTimeId });
          let classTypeData = ClassTypes.findOne({ _id: classTypeId });
          let { locationId, name: classTimeName, desc: classTimeDesc, scheduleType, scheduleDetails, endDate } = classTimeData;
          let locationData = SLocation.findOne({ _id: locationId });
          let location = '',timeZone = "Europe/Amsterdam";
          if (locationData) {
            let { address, city, state, country ,timeZone:tz} = locationData;
            location = `${address ? address + ', ':''} ${city ? city+ ', ':'' } ${state ? state+ ', ':''} ${country ? country : ""}`;
            if(tz){
              timeZone = tz;
            }
          }
          let { name: classTypeName, desc: classTypeDesc } = classTypeData;
          console.log('TCL: classTimeName', classTimeName)
					console.log('TCL: classTypeName', classTypeName)
          let summary = `${classTypeName}: ${classTimeName}`;
          console.log('TCL: scheduleDetails', scheduleDetails)
          !isEmpty(scheduleDetails || []) && scheduleDetails.map((obj) => {
            let event = {};
            event._id = id;
            event.location = location;
            event.summary = summary;
            event.description = classTimeDesc || classTypeDesc || 'No Description';
            let currentObj = cloneDeep(obj);
            let { startTime, duration, timeUnits, key } = currentObj;
            let date1 = moment(startTime);
            let date2 = moment(startTime);
            let COUNT = moment(endDate).diff(date1, 'days') + 2;
            if(key && scheduleType != 'oneTime') date1 = getStartDate(key,startTime);
            else date1 = moment(date1).format();
            duration = timeUnits ? duration : 1;
            if (duration) {
              if (timeUnits == 'Minutes') {
                date2 = moment(date1).add(duration, 'm');
              } else {
                date2 = moment(date1).add(duration, 'h');
              }
            }
            date2 = moment(date2).format();
            event.start = { dateTime: date1, timeZone };
            event.end = { dateTime: date2, timeZone };
            if (scheduleType != 'oneTime') {
              let str = 'RRULE:FREQ=WEEKLY;';
              if (key) {
                let byDay = generatorByDay(key);
                if (byDay) {
                  str += `BYDAY=${byDay};`;
                 }
              }
              if (scheduleType == 'recurring') {
                str += `COUNT=${COUNT};`;
              }
              event.recurrence = [str];
            }
            events.push(event);
          })
        })
      }
      return events;
    }catch(error){
		console.log('error in calendar.generateEvents', error)
    }
  },
  "calendar.getRefreshToken": async function (code) {
    try {
      let client_id = Meteor.settings.google.auth.appId;
      let client_secret = Meteor.settings.google.auth.secret;
      let data = {
        code,                                                                                             // 99
        client_id,                                                                                   // 100
        client_secret,                                                               // 101
        redirect_uri: Meteor.absoluteUrl().slice(0, -1),                                                           // 102
        grant_type: 'authorization_code',
        timeout: 20000,
      }
      //get refresh token
      let response = await axios({
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: { 'Content-Type': 'application/json' },
        data
      })
      let { refresh_token } = response.data;
      //generate access token
      let dataForAccessToken = {
        client_id,
        client_secret,
        refresh_token,
        grant_type: 'refresh_token',
      }
      let accessTokenResponse = await axios({
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: { 'Content-Type': 'application/json' },
        data: dataForAccessToken
      })
      let { access_token } = accessTokenResponse.data;
      //create new google calendar
      let calendarResponse = await axios({
        method: 'post',
        url: 'https://www.googleapis.com/calendar/v3/calendars',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
        data: { summary: 'SkillShape' },
        timeout: 20000,
      })
      let { id: googleCalendarId } = calendarResponse.data;
      if (refresh_token) {
        let docId = this.userId;
        let doc = { refresh_token, googleCalendarId };
        Meteor.call("user.editUser", { doc, docId },(err,res)=>{
          Meteor.call("calendar.handleGoogleCalendar", this.userId, 'insert');
        })
        return true;
      }
      return false;
    } catch (error) {
      console.log('​}catch -> error', error.response)
      throw new Meteor.Error(error);
    }
  },
  "calendar.clearAllEvents": function ({ doc, docId }) {
    try {
      let classInterestData = ClassInterest.find({ userId: this.userId, }).fetch();
      let ids = classInterestData.map((obj) => obj._id);
      Meteor.call("calendar.handleGoogleCalendar", this.userId, 'delete', ids,(err,res)=>{
        Meteor.call("calendar.removeGoogleCalendar",(err,res)=>{
          Meteor.call("user.editUser", { doc, docId });
        });
      });
      return true;
    } catch (error) {
      console.log('​error in calendar.clearAllEvents', error);
    }
  },
  "calendar.removeGoogleCalendar": async function () {
    try {
      let { refresh_token, googleCalendarId: calendarId } = Meteor.users.findOne({ _id: this.userId });
      if (refresh_token && calendarId) {
        let client_id = Meteor.settings.google.auth.appId;
        let client_secret = Meteor.settings.google.auth.secret;
        //generate access token
        let dataForAccessToken = {
          client_id,
          client_secret,
          refresh_token,
          grant_type: 'refresh_token',
        }
        let accessTokenResponse = await axios({
          method: 'post',
          url: 'https://accounts.google.com/o/oauth2/token',
          headers: { 'Content-Type': 'application/json' },
          data: dataForAccessToken
        })
        let { access_token } = accessTokenResponse.data;
        //delete google calendar
        let calendarDeleteResponse = await axios({
          method: 'delete',
          url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`,
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
          timeout: 20000,
        })
        console.log('calendar deleted');
      }
    } catch (error) {
      console.log('​error in calendar.removeGoogleCalendar', error)

    }
  }
});

generatorByDay = (key) => {
  let str = [];
  key.map((day) => {
    if (day.value == 0) {
      str.push('SU');
    } else if (day.value == 1) {
      str.push('MO');
    } else if (day.value == 2) {
      str.push('TU');
    } else if (day.value == 3) {
      str.push('WE');
    } else if (day.value == 4) {
      str.push('TH');
    } else if (day.value == 5) {
      str.push('FR');
    } else if (day.value == 6) {
      str.push('SA');
    }
  })
  return str.join(",");
}

getStartDate = (key = [],startTime) => {
  const dayINeed = get(key[0], 'value', 0); // for Thursday
  const today = moment(startTime).isoWeekday();
  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    return moment(startTime).isoWeekday(dayINeed).format();
  } else {
    // otherwise, give me *next week's* instance of that same day
    return moment(startTime).add(1, 'weeks').isoWeekday(dayINeed).format();
  }
}


/* 
      clientId = '696642172475-7bvf1h48domaoobbv69qktk9sq66597k.apps.googleusercontent.com',
     scopes = 'https://www.googleapis.com/auth/calendar',
     calendarId = 'Your google calendar id',
     event = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': '2015-05-28T09:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'end': {
    'dateTime': '2015-05-28T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'lpage@example.com'},
    {'email': 'sbrin@example.com'}
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10}
    ]
  }
};
// code for handling with old access token
gapi.client.setToken({access_token:"ya29.GluWBiAkek5QvCMOq8vPV3H2D5oq59ffnS18OzJ_6S2IHvJGxVKPmLk0TsDqF2pVR_FUsJP9HjZIjrMEGyeHlaaoeqp6F-uDSv5r3QOLTNaTjoiWpS9txYYoH1Te"})
	var request = gapi.client.calendar.events.insert({
  'calendarId': 'primary',
  'resource': event
});

request.execute(function(event) {
  console.log(event)
});
// code for handling with new access token
 gapi.auth.authorize(
      {
         'client_id': clientId,
         'scope': scopes,
         
      }, (authResult)=>{
			  console.log("authResult", authResult)
		var request = gapi.client.calendar.events.insert({
  'calendarId': 'primary',
  'resource': event
});

request.execute(function(event) {
  console.log(event)
});
      });
*/


/*  --------FLow For Calendar Sync 
1. User Click on the sync button.
2. Open the Google Login PopUp.
3. Get the access token.
3.1 Show Loading on the client side.
4. Call the method with access token and the userId.
5. Get all the calendar events from the interest collection with userId.
6. Get all the class times ids.
7. Get all the class times data from collection.
8. Generate events based on the class time type.
9. Map on the events and start calling the api with axios.
10. After Map show success popUp.


*/













/* 
Code for getting calendar id of the user
clientId = '696642172475-7bvf1h48domaoobbv69qktk9sq66597k.apps.googleusercontent.com',
scopes = 'https://www.googleapis.com/auth/calendar',
gapi.auth.authorize(
      {
         'client_id': clientId,
         'scope': scopes,
         
      }, (authResult)=>{
			  console.log("authResult", authResult)
		 gapi.client.load('calendar', 'v3', function() {
              var request = gapi.client.calendar.calendarList.list({});
              request.execute(function(resp) {
                 console.log('resp',resp)
              });
          });

})


*/