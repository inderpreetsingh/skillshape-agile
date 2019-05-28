import { isArray, isEmpty } from "lodash";
import Icon from "material-ui/Icon";
import Paper from "material-ui/Paper";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { DAYS_IN_WEEK } from "/imports/ui/components/landing/constants/classTypeConstants.js";
import { formatAmPm, formatDateNoYear, formatTime } from "/imports/util";


const styles = {
  cardWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "transparent",
    overflowX: "hidden",
    overflowY: "auto",
    height: "100%",
    boxShadow: "none",
    position: "relative",
    zIndex: 0
  },
  cardWrapperHidden: {
    overflowY: "hidden"
  },
  cardItem: {
    backgroundColor: "white",
    padding: `${helpers.rhythmDiv}px`,
    marginBottom: helpers.rhythmDiv,
    fontWeight: "300",
    width: "100%",
    fontSize: helpers.baseFontSize,
    fontFamily: helpers.specialFont,
    cursor: "initial"
  },
  cardItemPopUp: {
    padding: helpers.rhythmDiv * 2,
    boxShadow: "none",
    fontSize: 18
  },
  icon: {
    fontSize: helpers.baseFontSize,
    transform: `translateY(${helpers.rhythmDiv / 2}px)`
  }
};

const OuterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  padding-top: ${props => (props.show ? helpers.rhythmDiv : 0)}px;
  padding-bottom: ${props => (props.show ? helpers.rhythmDiv : 0)}px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  position: relative;
`;

const CardContent = styled.div`
  width: 100%;
  // padding-right: ${helpers.rhythmDiv}px;
`;

const Text = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  margin: 0;
  line-height: 1;
`;

const Day = Text.extend`
  text-align: center;
  font-weight: 400;
  font-size: 18px;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Heading = Day.extend`
  text-align: left;
`;

const Times = styled.ul`
  padding: 0;
  margin: 0;
`;

const Time = Text.withComponent("li").extend`
  list-style: none;
`;

const DateTime = Time.extend``;

const Bold = styled.span`
  font-weight: 500;
`;

const IconWithStyles = props => (
  <Icon classes={{ root: props.classes.icon }}>{props.iconName}</Icon>
);
const MyIcon = withStyles(styles)(IconWithStyles);

const ClassTimesList = props => {
  const { classes ,timeZone} = props;

  const ScheduleDisplay = props => (
    <Time>
      <MyIcon iconName={"access_time"} /> At <Bold>{props.time}</Bold> for{" "}
      <Bold>{props.duration}</Bold> mins
    </Time>
  );

  const SchedulePopUp = props => {
    let { day } = props;
    if (
      props.scheduleType === "recurring" ||
      props.scheduleType === "ongoing"
    ) {
      return (
        <DateTime>
          {" "}
          {day} at <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold>{" "}
          mins
        </DateTime>
      );
    } else {
      return (
        <DateTime>
          {props.day.substr(0, 3)}, {formatDateNoYear(props.eventDate)} at{" "}
          <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> mins
        </DateTime>
      );
    }
  };

  const formatScheduleDisplay = (data, scheduleType, inPopUp) => {
    let eventTime;
    const { day, eventDate, eventStartTime, time, timePeriod, duration } = data;

    if (scheduleType === "recurring" || scheduleType === "ongoing") {
      eventTime = `${formatTime(eventStartTime,timeZone)} `;
    } else {
      eventTime = `${time} ${timePeriod}`;
    }

    if (inPopUp) {
      return (
        <SchedulePopUp
          time={eventTime}
          duration={duration}
          scheduleType={scheduleType}
          day={day}
          eventDate={eventDate}
        />
      );
    }

    return <ScheduleDisplay time={eventTime} duration={duration} />;
  };

  const getScheduleDetailsFromFormattedClassTimes = (
    formattedClassTimes,
    scheduleType,
    inPopUp
  ) => {
    const eventScheduleType = scheduleType.toLowerCase();
    let cardItemClass = classes.cardItem;
    if (inPopUp) cardItemClass = cardItemClass + " " + classes.cardItemPopUp;

    // console.group("FORMATTED CLASS TIMES");
    // console.info(formattedClassTimes);
    // console.groupEnd();

    if (eventScheduleType === "recurring" || eventScheduleType === "ongoing") {
      if (!isArray(formattedClassTimes)) {
        return;
      }
      return formattedClassTimes.map(scheduleData => {
        if (!isEmpty(scheduleData)) {
          const allDatesData = [];
          const eventStartTime = new Date(scheduleData.startTime);
          eventDate = scheduleData.date;

          let eventDaysUnformatted = scheduleData.key
            .map(schedule => schedule.label)
            .join(", ");
          const commaIndex = eventDaysUnformatted.lastIndexOf(",");
          const eventDaysFormatted =
            eventDaysUnformatted.substr(0, commaIndex) +
            " and " +
            eventDaysUnformatted.substr(commaIndex + 1);
          const noOfDays = scheduleData.key.length;
          const eventDay = scheduleData.key[0].label;

          const data = {
            eventStartTime: eventStartTime,
            time: scheduleData.time,
            timePeriod: scheduleData.timePeriod,
            duration: scheduleData.duration,
            days: noOfDays,
            day: noOfDays > 1 ? eventDaysFormatted : eventDay,
            eventDate: eventDate
          };

          allDatesData.push(
            formatScheduleDisplay(data, eventScheduleType, inPopUp)
          );

          if (
            eventScheduleType == "recurring" ||
            eventScheduleType == "ongoing"
          ) {
            return (
              <Paper className={cardItemClass}>
                {!props.inPopUp &&
                  (data.days ? (
                    <Day>{data.day}</Day>
                  ) : (
                    <Day>Every {data.day}</Day>
                  ))}
                <Times>{allDatesData}</Times>
              </Paper>
            );
          }
        }
      });
    }

    return DAYS_IN_WEEK.map(day => {
      const scheduleData = formattedClassTimes[day];
      const currentDay = day;
      if (!isEmpty(scheduleData)) {
        const allDatesData = [];
        let eventData;
        scheduleData.forEach((schedule, i) => {
          const eventStartTime = new Date(schedule.startTime);
          eventDate = schedule.date;
          const data = {
            eventStartTime: eventStartTime,
            time: schedule.time,
            timePeriod: schedule.timePeriod,
            duration: schedule.duration,
            day: day,
            eventDate: eventDate
          };
          // console.info(eventStartTime,"===========================");
          allDatesData.push(
            formatScheduleDisplay(data, eventScheduleType, inPopUp)
          );
        });

        return (
          <Paper className={cardItemClass}>
            {!props.inPopUp && (
              <Day>
                On {day}, {formatDateNoYear(eventDate)}
              </Day>
            )}
            <Times>{allDatesData}</Times>
          </Paper>
        );
      }
    });
  };

  let wrapperClassName = "";
  if (props.show) {
    wrapperClassName = classes.cardWrapper;
  } else {
    wrapperClassName = classes.cardWrapper + " " + classes.cardWrapperHidden;
  }

  return (
    <OuterWrapper show={props.show}>
      <Paper className={wrapperClassName} elevation={3}>
        <Wrapper show={props.show}>
          <CardContent>
            {getScheduleDetailsFromFormattedClassTimes(
              props.formattedClassTimes,
              props.scheduleType,
              props.inPopUp
            )}
          </CardContent>
        </Wrapper>
      </Paper>
    </OuterWrapper>
  );
};

ClassTimesList.propTypes = {
  inPopUp: PropTypes.bool,
  scheduleType: PropTypes.string,
  formattedClassTimes: PropTypes.shape,
  show: PropTypes.bool
};

ClassTimesList.defaultProps = {
  inPopUp: false
};

export default withStyles(styles)(ClassTimesList);
