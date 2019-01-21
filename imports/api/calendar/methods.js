
import { check } from 'meteor/check';
import ClassInterest from "/imports/api/classInterest/fields.js";
import ClassTimes from "/imports/api/classTimes/fields.js";
import ClassTypes from "/imports/api/classType/fields.js";
import SLocation from "/imports/api/sLocation/fields.js";
import {get,isEmpty} from 'lodash';
import moment from 'moment';
import axios from 'axios';
const event = {
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
  "calendar.handleGoogleCalendar": async function (access_token,userId){
    try{
      let eventsList = Meteor.call('calendar.generateEvents',userId);
      if(!isEmpty(eventsList)){
        eventsList.map(async (e)=>{
          let response = await  axios({
            method: 'post',
            url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json',
            headers: { 'Content-Type': 'application/json', authorization: `Bearer ${access_token}` },
            data: e,
            timeout: 20000,
          })
        })
      }
      return true;
    }catch(error){
      console.log("Error in the calendar.handleGoogleCalendar",error);
      throw new Meteor.Error(error);
    }
  },
  "calendar.generateEvents":function(userId){
    let events = [];
    let classInterestData = ClassInterest.find({userId}).fetch();
    if(!isEmpty(classInterestData)){
      classInterestData.map((classInterest)=>{
        let event = {};
        let {classTimeId,classTypeId,_id:id} = classInterest;
        event.id = id;
        let classTimeData = ClassTimes.findOne({_id:classTimeId});
        let classTypeData = ClassTypes.findOne({_id:classTypeId});
        let {locationId,name:classTimeName,desc:classTimeDesc,scheduleType,scheduleDetails,endDate} = classTimeData;
        let locationData = SLocation.findOne({_id:locationId});
        if(locationData){
          let {address,city,state,country} = locationData;
          let location = `${address}, ${city}, ${state}, ${country}`;
          event.location = location;
        }
        let {name:classTypeName,desc:classTypeDesc} = classTypeData;
        let summary = `${classTypeName}: ${classTimeName}`;
        event.summary = summary;
        event.description = classTimeDesc || classTypeDesc || 'No Description';
        if(scheduleType != 'OnGoing'){
          scheduleDetails.map((obj)=>{
            let {startDate,duration,timeUnits} = obj;
            let date1 = moment(startDate).format();
            let date2 = moment(scheduleType == 'oneTime' ? startDate : endDate).format();
            if(duration && timeUnits){
              if(timeUnits == 'Minutes'){
                date2 = moment(date2).add(duration,'m');
              }else{
                date2 = moment(date2).add(duration,'h');
              }
            }
            event.start = {dateTime:date1,timeZone:'Asia/Kolkata'};
            event.end = {dateTime:date2,timeZone:'Asia/Kolkata'}
            events.push(event);
          })
        }

      })
    }
    return events;
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