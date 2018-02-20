import uuidv4 from 'uuid/v4';

// duration is in mins.
const classTimesBarData = [
{
    _id: uuidv4(),
    classTimes : [
      {
        time: '07:00',
        timePeriod: 'am',
        duration: 120,
        day: 'Monday'
      },
      {
        time: '07:00',
        timePeriod: 'am',
        duration: 120,
        day: 'Tuesday'
      },
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 200,
        day: 'Friday'
      },
      {
        time: '02:30',
        timePeriod: 'am',
        duration: 180,
        day: 'Thursday'
      },
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 100,
        day: 'Saturday'
      },
      {
        time: '12:30',
        timePeriod: 'am',
        duration: 80,
        day: 'Sunday'
      },
      {
        time: '09:30',
        timePeriod: 'pm',
        duration: 90,
        day: 'Wednesday'
      }
    ],
    description: 'This class is taught by Mr. Surnaam Singh, who is head of naam yoga festival foundation celebration in New York and Los Angeles',
    addToCalendar: true,
    scheduleType: 'Ongoing',
    isTrending: true
},
{
    _id: uuidv4(),
    classTimes : [
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 200,
        day: 'Friday'
      },
      {
        time: '02:30',
        timePeriod: 'am',
        duration: 180,
        day: 'Thursday'
      },
    ],
    description: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well. Her immense experience in this field make her really great instructor.',
    addToCalendar: true,
    scheduleType: 'Finished',
    isTrending: false
},
{
    _id: uuidv4(),
    classTimes : [
      {
        time: '07:00',
        timePeriod: 'am',
        duration: 120,
        day: 'Monday'
      },
      {
        time: '08:30',
        timePeriod: 'am',
        duration: 180,
        day: 'Thursday'
      },
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 100,
        day: 'Sunday'
      }
    ],
    description: 'This class is taught by Mr. Surnaam Singh, who is head of naam yoga festival foundation celebration in New York and Los Angeles',
    addToCalendar: false,
    scheduleType: 'Ongoing',
},
{
    _id: uuidv4(),
    classTimes : [
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 200,
        day: 'Friday'
      },
      {
        time: '02:30',
        timePeriod: 'am',
        duration: 180,
        day: 'Thursday'
      },
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 100,
        day: 'Saturday'
      }
    ],
    description: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well. Her immense experience in this field make her really great instructor.',
    addToCalendar: false,
    scheduleType: 'Finished',
},
{
    _id: uuidv4(),
    classTimes : [
      {
        time: '07:00',
        timePeriod: 'am',
        duration: 120,
        day: 'Monday'
      },
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 200,
        day: 'Friday'
      },
    ],
    description: 'This class is taught by Mr. Surnaam Singh, who is head of naam yoga festival foundation celebration in New York and Los Angeles.',
    addToCalendar: false,
    scheduleType: 'Ongoing'
},
{
    _id: uuidv4(),
    classTimes : [
      {
        time: '07:00',
        timePeriod: 'am',
        duration: 120,
        day: 'Monday'
      },
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 200,
        day: 'Friday'
      },
      {
        time: '02:30',
        timePeriod: 'am',
        duration: 180,
        day: 'Thursday'
      },
      {
        time: '09:00',
        timePeriod: 'pm',
        duration: 100,
        day: 'Saturday'
      }
    ],
    description: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well. Her immense experience in this field make her really great instructor.',
    addToCalendar: false,
    scheduleType: 'Finished',
}
];

export default classTimesBarData;
