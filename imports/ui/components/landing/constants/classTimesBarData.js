import uuidv4 from 'uuid/v4';

const classTimesBarData = [
{
    _id: uuidv4(),
    time: '07:00',
    timePeriod: 'am',
    days: 'Mo-Th-Fr',
    description: 'This class is taught by Mr. Surnaam Singh, who is head of naam yoga festival foundation celebration in New York and Los Angeles',
    addToCalendar: true,
    scheduleType: 'Ongoing',
    isTrending: true
},
{
    _id: uuidv4(),
    time: '09:00',
    timePeriod: 'am',
    days: 'Mo-Th-Fr',
    description: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well.',
    addToCalendar: true,
    scheduleType: 'Finished',
    isTrending: false
},
{
    _id: uuidv4(),
    time: '07:00',
    timePeriod: 'pm',
    days: 'Mo-Th-Fr',
    description: 'This class is taught by Mr. Surnaam Singh, who is head of naam yoga festival foundation celebration in New York and Los Angeles',
    addToCalendar: false,
    scheduleType: 'Ongoing'
},
{
    _id: uuidv4(),
    time: '09:00',
    timePeriod: 'am',
    days: 'Mo-Th-Fr',
    description: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well.',
    addToCalendar: false,
    scheduleType: 'Finished',
},
{
    _id: uuidv4(),
    time: '07:00',
    timePeriod: 'pm',
    days: 'Mo-Th-Fr',
    description: 'This class is taught by Mr. Surnaam Singh, who is head of naam yoga festival foundation celebration in New York and Los Angeles',
    addToCalendar: false,
    scheduleType: 'Ongoing'
},
{
    _id: uuidv4(),
    time: '09:00',
    timePeriod: 'am',
    days: 'Mo-Th-Fr',
    description: 'The karate class is practiced under Miss Jen who is black belt in Karate and have immense knowledge in TaekWondo as well.',
    addToCalendar: false,
    scheduleType: 'Finished',
}
];

export default classTimesBarData;
