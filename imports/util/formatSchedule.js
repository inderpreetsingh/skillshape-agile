import moment from 'moment';
import { DAYS_IN_WEEK } from '/imports/ui/components/landing/constants/classTypeConstants.js';

export const formatTime = (startTime) => {
  if(startTime) {
    return moment(startTime.props || startTime).format("hh:mm");
  }
}

// This method will work without props..
export const formatAmPm = (startTime) => {
  if(startTime) {
    let hours = startTime.props ? startTime.props.getHours() : startTime.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    return `${ampm}`
  }
}


export const formatDate = (date) => {
  // console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
  return moment(date).format('MMMM DD, YYYY');
}

export const formatDateNoYear = (date) => {
  return moment(date).format('MMMM DD');
}

export const formatDataBasedOnScheduleType = (data, hidePastDates = true) => {
   const classTimesData = {...data};
    // debugger;
    console.log("formatDataBasedOnScheduleType________", data);
    let classTimes;
    if(data && data.scheduleDetails && data.scheduleDetails.oneTime) {
      classTimes = {};
      let schoolDetails = data.scheduleDetails.oneTime;
      let startDate, dayOfTheWeek, day, startTime, formattedTime, timePeriod, currentJsonData;
      schoolDetails.forEach((item) => {
        startDate = new Date(item.startDate);
        dayOfTheWeek = startDate.getDay(); // day of the week (from 0 to 6)
        if(dayOfTheWeek === 0)
          dayOfTheWeek = 7;
        day = DAYS_IN_WEEK[dayOfTheWeek - 1];
        startTime = new Date(item.startTime); // Get Time from date time
        formattedTime = formatTime(startTime);
        timePeriod = _formatAMPM(startTime);
        currentJsonData = {
          startTime: startTime,
          time: formattedTime,
          timePeriod: timePeriod,
          duration: item.duration,
          date: `${startDate}`
        };
        if(classTimes && classTimes[day]) {
          let existingTimes = classTimes[day];
          existingTimes.push(currentJsonData);
          classTimes[day] = existingTimes;
        } else {
          classTimes[day] = [];
          classTimes[day].push(currentJsonData);
        }
        // this.handleSliderState(dayOfTheWeek - 1);
      })
      classTimes;
    } else {
      classTimes = data.scheduleDetails;
    }
    if(hidePastDates)
      return removePastTimesFromSchedule(classTimes , data.scheduleType.toLowerCase(), {startDate: data.startDate, endDate: data.endDate});

    return classTimes;
}


const removePastTimesFromSchedule = (classTimes,scheduleType,scheduleData) => {
  // console.log(classTimes);
  /*
  const currentDate = new Date();
  if(scheduleType === 'recurring') {
    console.log(moment(currentDate),moment(currentDate).isBetween(moment(scheduleData.startDate), moment(scheduleData.endDate)));
    if(moment(currentDate).isBetween(moment(scheduleData.startDate), moment(scheduleData.endDate)) ) {
        // now we need don't need to check anything
      return classTimes;
    }
    else if(moment(currentDate).isAfter(moment(scheduleData.startDate)) || moment(currentDate).isBefore(moment(scheduleData.endDate)) )
      Object.keys(classTimes).forEach(day => {
        classTimes[day] = classTimes[day].filter(classTime => {
          if(moment(currentDate).isBefore(moment(classTime.startTime))) {
            return true;
          }
          return false;
        })
      });

      console.log(classTimes,"after filtering.........");

      return classTimes;
    }

    return {};
    */

    return classTimes;
}

export const _formatAMPM = (startTime) => {
    let hours = startTime.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    return ampm;
}
