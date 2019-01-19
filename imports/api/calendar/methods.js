
import { check } from 'meteor/check';
import axios from 'axios';
const event = {
  id:'aaaaaaaaaaaaaaaaaaaaaaa',
  summary: 'Testing',
  location: '800 Howard St., San Francisco, CA 94103',
  description: 'A chance to hear more about Google"s developer products.',
  start: {
    dateTime: '2019-01-19T09:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: '2019-01-19T17:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  recurrence: [
    'RRULE:FREQ=DAILY;COUNT=2',
  ],
  attendees: [
    { email: 'lpage@example.com' },
    { email: 'sbrin@example.com' },
  ],
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 2000 },
      { method: 'popup', minutes: 10 },
    ],
  },
};
Meteor.methods({
  "calendar.handleGoogleCalendar":async function (){
    try{
      let response = await  axios({
          method: 'post',
          url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json',
          headers: { 'Content-Type': 'application/json', authorization: 'Bearer ya29.GluWBpbX3cSWEMid13mDosTbMvjBWAYzojaQJSvLKqVKwlwgi1OZfBUGyFAESuAfpAMe-JfNhYv9nnhWQ70vWy5cBtGymGTzLyYw0t-u5C3u5RvWc0CVO--Ows5m' },
          data: event,
          timeout: 20000,
        })
        console.log("response",response);
    }catch(error){
      console.log("Error in the calendar.handleGoogleCalendar",error);
    }
  }
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