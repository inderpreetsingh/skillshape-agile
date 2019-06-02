
import axios from 'axios';
import {
  cloneDeep, compact, get, isEmpty,
} from 'lodash';
import { check } from 'meteor/check';
import moment from 'moment';
import ClassInterest from '/imports/api/classInterest/fields';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassTypes from '/imports/api/classType/fields';
import SLocation from '/imports/api/sLocation/fields';

const getStartDate = (key = [], startTime) => {
  const dayINeed = get(key[0], 'value', 0); // for Thursday
  const today = moment(startTime).isoWeekday();
  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    return moment(startTime).isoWeekday(dayINeed).format();
  }
  // otherwise, give me *next week's* instance of that same day
  return moment(startTime).add(1, 'weeks').isoWeekday(dayINeed).format();
};

const generatorByDay = (key) => {
  const str = [];
  key.forEach((day) => {
    if (day.value === 0) {
      str.push('SU');
    } else if (day.value === 1) {
      str.push('MO');
    } else if (day.value === 2) {
      str.push('TU');
    } else if (day.value === 3) {
      str.push('WE');
    } else if (day.value === 4) {
      str.push('TH');
    } else if (day.value === 5) {
      str.push('FR');
    } else if (day.value === 6) {
      str.push('SA');
    }
  });
  return str.join(',');
};
Meteor.methods({
  'calendar.handleGoogleCalendar': async (userId, action, eventsIds = [], classInterestData = []) => {
    check(userId, String);
    check(action, String);
    check(eventsIds, Array);
    check(classInterestData, Array);
    try {
      const { refresh_token, googleCalendarId: calendarId } = Meteor.users.findOne({ _id: userId });
      if (refresh_token && calendarId) {
        const client_id = Meteor.settings.google.auth.appId;
        const client_secret = Meteor.settings.google.auth.secret;
        const data = {
          client_id,
          client_secret,
          refresh_token,
          grant_type: 'refresh_token',
        };
        const response = await axios({
          method: 'post',
          url: 'https://accounts.google.com/o/oauth2/token',
          headers: { 'Content-Type': 'application/json' },
          data,
        });
        const { access_token } = response.data;

        if (action === 'insert') {
          const eventsList = Meteor.call('calendar.generateEvents', userId, classInterestData) || [];
          if (!isEmpty(eventsList)) {
            eventsList.map(async (e) => {
              try {
                const eventResponse = await axios({
                  method: 'post',
                  url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?alt=json`,
                  headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
                  data: e,
                  timeout: 20000,
                });
                const { id: eventId } = eventResponse.data;
                const { _id } = e;
                if (eventId) {
                  ClassInterest.update({ _id }, { $set: { eventId } });
                }
              } catch (error) {
                console.log('​Error in map of the calendar.handleGoogleCalendar');
              }
            });
          }
        } else if (action === 'delete' && !isEmpty(eventsIds)) {
          eventsIds.map(async (eventId) => {
            if (eventId) {
              await axios({
                method: 'delete',
                url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
                headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
                timeout: 20000,
              });
            }
          });
        }
      }
    } catch (error) {
      console.log('Error in calendar.handleGoogleCalendar', error, error.response);
      throw new Meteor.Error(error);
    }
  },
  'calendar.generateEvents': (userId, classInterestData = []) => {
    check(userId, String);
    try {
      let classInterestDataCopy = classInterestData;
      const events = [];
      if (isEmpty(classInterestDataCopy)) {
        classInterestDataCopy = ClassInterest.find({ userId }).fetch();
      }
      if (!isEmpty(classInterestDataCopy)) {
        classInterestDataCopy.forEach((classInterest) => {
          const { classTimeId, classTypeId, _id: id } = classInterest;
          const classTimeData = ClassTimes.findOne({ _id: classTimeId });
          const classTypeData = ClassTypes.findOne({ _id: classTypeId });
          const {
            locationId, name: classTimeName, desc: classTimeDesc,
            scheduleType, scheduleDetails = [], endDate,
          } = classTimeData;
          const locationData = SLocation.findOne({ _id: locationId });
          let location = ''; let
            timeZone = 'Europe/Amsterdam';
          if (locationData) {
            const {
              address, city, state, country, timeZone: tz,
            } = locationData;
            location = `${address ? `${address}, ` : ''} ${city ? `${city}, ` : ''} ${state ? `${state}, ` : ''} ${country || ''}`;
            if (tz) {
              timeZone = tz;
            }
          }
          const { name: classTypeName, desc: classTypeDesc } = classTypeData;
          const summary = `${classTypeName}: ${classTimeName}`;
          if (!isEmpty(scheduleDetails)) {
            scheduleDetails.forEach((obj) => {
              const event = {};
              event._id = id;
              event.location = location;
              event.summary = summary;
              event.description = classTimeDesc || classTypeDesc || 'No Description';
              const currentObj = cloneDeep(obj);
              let {
                duration,
              } = currentObj;
              const { startTime, timeUnits, key } = currentObj;
              let date1 = moment(startTime);
              let date2 = moment(startTime);
              const COUNT = moment(endDate).diff(date1, 'days') + 2;
              if (key && scheduleType !== 'oneTime') date1 = getStartDate(key, startTime);
              else date1 = moment(date1).format();
              duration = timeUnits ? duration : 1;
              if (duration) {
                if (timeUnits === 'Minutes') {
                  date2 = moment(date1).add(duration, 'm');
                } else {
                  date2 = moment(date1).add(duration, 'h');
                }
              }
              date2 = moment(date2).format();
              event.start = { dateTime: date1, timeZone };
              event.end = { dateTime: date2, timeZone };
              if (scheduleType !== 'oneTime') {
                let str = 'RRULE:FREQ=WEEKLY;';
                if (key) {
                  const byDay = generatorByDay(key);
                  if (byDay) {
                    str += `BYDAY=${byDay};`;
                  }
                }
                if (scheduleType === 'recurring') {
                  str += `COUNT=${COUNT};`;
                }
                event.recurrence = [str];
              }
              events.push(event);
            });
          }
        });
      }
      return events;
    } catch (error) {
      console.log('error in calendar.generateEvents', error);
    }
    return null;
  },
  'calendar.getRefreshToken': async (code = '') => {
    check(code, String);
    try {
      const client_id = Meteor.settings.google.auth.appId;
      const client_secret = Meteor.settings.google.auth.secret;
      const data = {
        code, // 99
        client_id, // 100
        client_secret, // 101
        redirect_uri: Meteor.absoluteUrl().slice(0, -1), // 102
        grant_type: 'authorization_code',
        timeout: 20000,
      };
      // get refresh token
      const response = await axios({
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: { 'Content-Type': 'application/json' },
        data,
      });
      const { refresh_token } = response.data;
      // generate access token
      const dataForAccessToken = {
        client_id,
        client_secret,
        refresh_token,
        grant_type: 'refresh_token',
      };
      const accessTokenResponse = await axios({
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: { 'Content-Type': 'application/json' },
        data: dataForAccessToken,
      });
      const { access_token } = accessTokenResponse.data;
      // create new google calendar
      const calendarResponse = await axios({
        method: 'post',
        url: 'https://www.googleapis.com/calendar/v3/calendars',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
        data: { summary: 'SkillShape' },
        timeout: 20000,
      });
      const { id: googleCalendarId } = calendarResponse.data;
      if (refresh_token) {
        const docId = this.userId;
        const doc = { refresh_token, googleCalendarId };
        Meteor.call('user.editUser', { doc, docId }, () => {
          Meteor.call('calendar.handleGoogleCalendar', this.userId, 'insert');
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log('​}catch -> error', error.response);
      throw new Meteor.Error(error);
    }
  },
  'calendar.clearAllEvents': ({ doc, docId }) => {
    try {
      const classInterestData = ClassInterest.find({ userId: this.userId }).fetch();
      const eventIds = compact(classInterestData.map(obj => obj.eventId));
      Meteor.call('calendar.handleGoogleCalendar', this.userId, 'delete', eventIds, () => {
        Meteor.call('calendar.removeGoogleCalendar', () => {
          Meteor.call('user.editUser', { doc, docId });
        });
      });
      return true;
    } catch (error) {
      console.log('​error in calendar.clearAllEvents', error);
    }
    return null;
  },
  'calendar.removeGoogleCalendar': async () => {
    try {
      const {
        refresh_token,
        googleCalendarId: calendarId,
      } = Meteor.users.findOne({ _id: this.userId });
      if (refresh_token && calendarId) {
        const client_id = Meteor.settings.google.auth.appId;
        const client_secret = Meteor.settings.google.auth.secret;
        // generate access token
        const dataForAccessToken = {
          client_id,
          client_secret,
          refresh_token,
          grant_type: 'refresh_token',
        };
        const accessTokenResponse = await axios({
          method: 'post',
          url: 'https://accounts.google.com/o/oauth2/token',
          headers: { 'Content-Type': 'application/json' },
          data: dataForAccessToken,
        });
        const { access_token } = accessTokenResponse.data;
        // delete google calendar
        await axios({
          method: 'delete',
          url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`,
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
          timeout: 20000,
        });
        console.log('calendar deleted');
      }
    } catch (error) {
      console.log('​error in calendar.removeGoogleCalendar', error);
    }
  },
});


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
gapi.client.setToken
      ({access_token:"ya29.GluWBiAkek5QvCMOq8vPV3H2D5oq59ffnS18OzJ
      _6S2IHvJGxVKPmLk0TsDqF2pVR_FUsJP9HjZIjrMEGyeHlaaoeqp6F-uDSv5r3QOLTNaTjoiWpS9txYYoH1Te"})
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


/*  --------FLow For Update of calendar events
1. Get id of class time from classtime.edit code.
2. Get classInterestData of  which are interested in that from class interest collection.
2.1 Get Group by userId of classInterestData.
3. Get EventsIds from  classInterestData;
4. Call "calendar.handleGoogleCalendar" with those eventsIds to remove them.
5. Call Again "calendar.handleGoogleCalendar" with those classInterestData to Generate them.
6. Update calendar.generateEvents with option for classIInterestData.


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
