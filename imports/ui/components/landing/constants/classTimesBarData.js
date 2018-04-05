import uuidv4 from 'uuid/v4';

// duration is in mins.
const classTimesBarData = [
  {
    _id: uuidv4(),
    classTimes : {
      'monday': [{
          time: '07:00',
          timePeriod: 'am',
          duration: 120,
          date: "2018-04-03T06:45:54.289Z"
        },
        {
          time: '07:00',
          timePeriod: 'am',
          duration: 120,
          date: "2018-04-03T09:45:54.289Z"
        },
        {
          time: '09:00',
          timePeriod: 'pm',
          duration: 200,
          date: "2018-04-01T16:45:54.219Z"
        },
        {
          time: '02:30',
          timePeriod: 'am',
          duration: 180,
          day: "2018-04-03T06:45:54.289Z"
        }],
      'wednesday': [{
          time: '07:00',
          timePeriod: 'am',
          duration: 120,
          date: "2018-04-03T06:45:54.289Z"
      }],
      'friday': [{
        time: '7:10',
        timePeriod: 'pm',
        duration: 170,
        date: "2018-04-03T06:45:54.289Z"
      }]
    },
    desc: 'This class is taught by Mr. Surnaam Singh, who is head of naam yoga festival foundation celebration in New York and Los Angeles',
    addedToCalendar: true,
    scheduleType: 'Ongoing',
    isTrending: true
  },
  {
    _id: uuidv4(),
    classTimes : {
      'monday': [{
          time: '07:00',
          timePeriod: 'am',
          duration: 120,
          date: "2018-04-06T06:45:54.289Z"
      }],
      'tuesday': [{
        time: '3:00',
        timePeriod: 'pm',
        duration: 145,
        date: "2018-04-16T06:45:54.289Z"
      },
      {
        time: '05:30',
        timePeriod: 'am',
        duration: 175,
        date: "2018-04-16T06:45:54.289Z"
      }]
    },
    desc: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well. Her immense experience in this field make her really great instructor.',
    addedToCalendar: true,
    scheduleType: 'recurring',
    isTrending: false
  },
  {
    _id: uuidv4(),
    classTimes : [
      'monday': [{
          time: '07:00',
          timePeriod: 'am',
          duration: 120,
          date: "2018-04-06T06:45:54.289Z"
      }],
      'wednesday': [{
        time: '3:00',
        timePeriod: 'pm',
        duration: 145,
        date: "2018-04-16T06:45:54.289Z"
      },
      {
        time: '05:30',
        timePeriod: 'am',
        duration: 175,
        date: "2018-04-16T06:45:54.289Z"
      }]
    ],
    desc: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well. Her immense experience in this field make her really great instructor.',
    addedToCalendar: false,
    scheduleType: 'oneTime',
  }
];

export default classTimesBarData;
