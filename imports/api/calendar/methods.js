
import { check } from 'meteor/check';
import ClassInterest from "/imports/api/classInterest/fields.js";
import ClassTimes from "/imports/api/classTimes/fields.js";
import ClassTypes from "/imports/api/classType/fields.js";
import SLocation from "/imports/api/sLocation/fields.js";
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import axios from 'axios';

Meteor.methods({
  "calendar.handleGoogleCalendar": async function (userId) {
    try {
      let { refresh_token } = Meteor.users.findOne({ _id: userId });
      if (refresh_token) {
        let eventsList = Meteor.call('calendar.generateEvents', userId);
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
        eventsList.map(async (e) => {
          try {
            let response = await axios({
              method: 'post',
              url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json',
              headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
              data: e,
              timeout: 20000,
            })
             //console.log('​response', response)
            console.log('Event Added')
          } catch (error) {
           // console.log('​Error in map of the calendar.handleGoogleCalendar', error.response)
            console.log('​Error in map of the calendar.handleGoogleCalendar')
          }
        })
      }
    } catch (error) {
      console.log('​}catch -> error', error.response)
      throw new Meteor.Error(error);
    }
  },
  "calendar.generateEvents": function (userId) {
    let events = [];
    let classInterestData = ClassInterest.find({ userId }, { limit: 2 }).fetch();
    if (!isEmpty(classInterestData)) {
      classInterestData.map((classInterest) => {
        let event = {};
        let { classTimeId, classTypeId, _id: id } = classInterest;
        event.id = id.toLowerCase().replace(/[ywxz]/g, '')+'0';
        let classTimeData = ClassTimes.findOne({ _id: classTimeId });
        let classTypeData = ClassTypes.findOne({ _id: classTypeId });
        let { locationId, name: classTimeName, desc: classTimeDesc, scheduleType, scheduleDetails, endDate } = classTimeData;
        let locationData = SLocation.findOne({ _id: locationId });
        if (locationData) {
          let { address, city, state, country } = locationData;
          let location = `${address}, ${city}, ${state}, ${country}`;
          event.location = location;
        }
        let { name: classTypeName, desc: classTypeDesc } = classTypeData;
        let summary = `${classTypeName}: ${classTimeName}`;
        event.summary = summary;
        event.description = classTimeDesc || classTypeDesc || 'No Description';
        scheduleDetails.map((obj) => {
          let { startTime, duration, timeUnits, key } = obj;
          let date1 = moment(startTime);
          let date2 = moment(startTime);

          if (duration && timeUnits) {
            if (timeUnits == 'Minutes') {
              date2 = moment(date2).add(duration, 'm');
            } else {
              date2 = moment(date2).add(duration, 'h');
            }
          }
          let COUNT = moment(endDate).diff(date1, 'days') + 2;
          date2 = moment(date2).format();
          date1 = moment(date1).format();
          event.start = { dateTime: date1, timeZone: 'Asia/Kolkata' };
          event.end = { dateTime: date2, timeZone: 'Asia/Kolkata' };
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

      let response = await axios({
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: { 'Content-Type': 'application/json' },
        data
      })
      let { refresh_token } = response.data;
      if (refresh_token) {
        Meteor.users.update({ _id: this.userId }, { $set: { refresh_token } });
        return true;
      }
      return false;
    } catch (error) {
      console.log('​}catch -> error', error.response)
      throw new Meteor.Error(error);
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