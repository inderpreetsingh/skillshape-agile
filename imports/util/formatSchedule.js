import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { DAYS_IN_WEEK } from "/imports/ui/components/landing/constants/classTypeConstants.js";

export const formatTime = startTime => {
  if (startTime) {
    return moment(startTime.props || startTime).format("hh:mm");
  }
};

// This method will work without props..
export const formatAmPm = startTime => {
  if (startTime) {
    let hours = startTime.props
      ? startTime.props.getHours()
      : startTime.getHours();
    let ampm = hours >= 12 ? "pm" : "am";
    return `${ampm}`;
  }
};

export const formatDate = (date, monthFormat = "MMMM") => {
  // console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
  return moment(date).format(`${monthFormat} DD, YYYY`);
};

export const formatDateNoYear = date => {
  return moment(date).format("MMMM DD");
};

export const formatClassTimesData = (classTimesData, hidePastDates = true) => {
  return classTimesData.map(data => {
    const formattedClassTimesDetails = formatDataBasedOnScheduleType(
      data,
      hidePastDates
    );
    data.formattedClassTimesDetails = formattedClassTimesDetails;
    return data;
  });
};

export const formatDataBasedOnScheduleType = (data, hidePastDates = true) => {
  const classTimesData = { ...data };
  // debugger;
  let classTimes;
  if (data && data.scheduleDetails && data.scheduleType === "oneTime") {
    classTimes = {};
    let currentSchedule = data.scheduleDetails.oneTime || data.scheduleDetails;
    let startDate,
      dayOfTheWeek,
      day,
      startTime,
      formattedTime,
      timePeriod,
      currentJsonData,
      timeUnits;

    currentSchedule.forEach(item => {
      startDate = new Date(item.startDate);
      dayOfTheWeek = startDate.getDay(); // day of the week (from 0 to 6)
      if (dayOfTheWeek === 0) dayOfTheWeek = 7;
      day = DAYS_IN_WEEK[dayOfTheWeek - 1];
      startTime = new Date(item.startTime); // Get Time from date time
      formattedTime = formatTime(startTime);
      timePeriod = _formatAMPM(startTime);
      timeUnits = item.timeUnits;
      currentJsonData = {
        startTime,
        time: formattedTime,
        timePeriod: timePeriod,
        duration: item.duration,
        timeUnits: timeUnits,
        date: `${startDate}`
      };
      if (classTimes && classTimes[day]) {
        let existingTimes = classTimes[day];
        existingTimes.push(currentJsonData);
        classTimes[day] = existingTimes;
      } else {
        classTimes[day] = [];
        classTimes[day].push(currentJsonData);
      }
      // this.handleSliderState(dayOfTheWeek - 1);
    });
  } else {
    classTimes = data.scheduleDetails;
  }

  // console.group("CLASS TIMES DATA");
  // console.info(classTimes, data.scheduleType);
  // console.groupEnd();

  if (hidePastDates)
    return removePastTimesFromSchedule(
      classTimes,
      data.scheduleType.toLowerCase(),
      { startDate: data.startDate, endDate: data.endDate }
    );
  else return addTotalClassTimes(classTimes);
};

const addTotalClassTimes = (classTimes, scheduleType) => {
  let classTimesCounter = 0;
  if (typeof classTimes === "object" && !classTimes.length) {
    Object.keys(classTimes).forEach(day => {
      if (typeof classTimes[day] == "object") {
        classTimes[day].filter(classTime => {
          if (!isEmpty(classTime)) {
            ++classTimesCounter;
          }
        });
      }
    });
  } else {
    classTimes.forEach(classTime => {
      classTimesCounter += classTime.key.length;
    });
  }

  classTimes.totalClassTimes = classTimesCounter;

  return classTimes;
};

const filterOutAndAddTotalClassTimes = classTimes => {
  const currentDate = new Date();
  Object.keys(classTimes).forEach(day => {
    if (typeof classTimes[day] == "object") {
      classTimes[day] = classTimes[day].filter(classTime => {
        if (moment(currentDate).isBefore(moment(classTime.startTime))) {
          return true;
        }
        return false;
      });
    }
  });

  return addTotalClassTimes(classTimes);
};

const removePastTimesFromSchedule = (
  classTimes,
  scheduleType,
  scheduleData
) => {
  const currentDate = new Date();
  if (scheduleType === "recurring") {
    if (scheduleData.endDate > new Date()) {
      return addTotalClassTimes(classTimes);
    }

    return {};
  } else if (scheduleType === "onetime") {
    let allPastDate = true;
    DAYS_IN_WEEK.map(day => {
      const scheduleData = classTimes[day];
      if (!isEmpty(scheduleData)) {
        scheduleData.forEach((schedule, i) => {
          if (schedule.startTime > new Date()) {
            allPastDate = false;
          }
        });
      }
    });
    if (!allPastDate) {
      return addTotalClassTimes(classTimes);
    } else return {};
  }
  return addTotalClassTimes(classTimes);
};

export const _formatAMPM = startTime => {
  let hours = startTime.getHours();
  let ampm = hours >= 12 ? "pm" : "am";
  return ampm;
};

// export const isScheduleEmpty = (formattedClassTimesData) => {
//   // debugger;
//   for(let i = 0; i < formattedClassTimesData.length; ++i) {
//     const currentClassTime = formattedClassTimesData[i];
//     if(currentClassTime.formattedClassTimesDetails.totalClassTimes > 0) {
//       return true;
//     }
//   }
//   return false;
// }
// function to check if the classs time end date ended
