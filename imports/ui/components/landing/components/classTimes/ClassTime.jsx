import React, { Component, Fragment } from "react";
import moment from "moment";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { isEmpty, get } from "lodash";
import { scroller } from "react-scroll";
import { Checkbox } from "material-ui";
import Paper from "material-ui/Paper";
import Icon from "material-ui/Icon";
import Button from "material-ui/Button";

import ClassTimeClockManager from "/imports/ui/components/landing/components/classTimes/ClassTimeClockManager.jsx";
import ClassTimesList from "/imports/ui/components/landing/components/classTimes/ClassTimesList.jsx";
import TrendingIcon from "/imports/ui/components/landing/components/icons/Trending.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import SecondaryButton from "/imports/ui/components/landing/components/buttons/SecondaryButton";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import NonUserDefaultDialogBox from "/imports/ui/components/landing/components/dialogs/NonUserDefaultDialogBox.jsx";
import ThinkingAboutAttending from "/imports/ui/components/landing/components/dialogs/ThinkingAboutAttending";

import Events from "/imports/util/events";
import { cutString } from "/imports/util";
import {
  withPopUp,
  formatDate,
  formatTime,
  formatDataBasedOnScheduleType,
  getUserFullName
} from "/imports/util";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";

import { ContainerLoader } from "/imports/ui/loading/container.js";

import {
  DAYS_IN_WEEK,
  CLASS_TIMES_CARD_WIDTH
} from "/imports/ui/components/landing/constants/classTypeConstants.js";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  classTimeIcon: {
    fontSize: helpers.baseFontSize,
    color: helpers.black,
    marginRight: helpers.rhythmDiv / 2
  },
  descriptionPanelCloseIcon: {
    top: 0,
    left: `calc(100% - ${helpers.rhythmDiv * 4}px)`,
    fontSize: helpers.baseFontSize,
    color: helpers.black,
    padding: helpers.rhythmDiv,
    borderRadius: "50%",
    background: "white",
    position: "absolute",
    boxShadow: helpers.buttonBoxShadow,
    cursor: "pointer"
  },
  descriptionPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    transition: "transform 0.2s linear",
    maxHeight: "272px",
    transformOrigin: "50% 100%",
    paddingTop: helpers.rhythmDiv,
    marginBottom: helpers.rhythmDiv,
    overflowY: "auto",
    background: "white",
    borderRadius: 5
  }
};

const ClassTimeContainer = styled.div`
  ${helpers.flexHorizontalSpaceBetween} flex-direction: column;
  max-width: 100%;
  width: 100%;
  height: ${props => (props.inPopUp ? "auto" : "420px")};
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
  z-index: 0;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    margin: 0 auto;
  }

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    max-width: ${props => (props.inPopUp ? "100%" : CLASS_TIMES_CARD_WIDTH)}px;
  }
`;

const ClassScheduleWrapper = styled.div`
  ${helpers.flexCenter};
`;

const ScheduleAndDescriptionWrapper = styled.div`
  max-height: 330px; // This is the computed max-height for the container.
  display: flex;
  flex-direction: column;
`;

const ScheduleWrapper = styled.div`
  flex-shrink: 0;
`;

const DescriptionWrapper = styled.div`
  flex-grow: 1;
  display: flex;
`;

const ClassTimeContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
`;

const ClassTimeContentInnerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${props => props.showDescription && "filter: blur(2px);"};
`;

const ConfirmationDialog = styled.div`
  margin: 8px;
`;

const ClassTimeDescriptionWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  transition: transform 0.2s linear;
  max-height: 272px;
  transform-origin: 50% 100%;
  transform: scaleY(${props => (props.show ? 1 : 0)});
  padding-top: ${helpers.rhythmDiv}px;
  margin-bottom: ${helpers.rhythmDiv}px;
  overflow-y: auto;
  background: white;
  border-radius: 5px;
`;

const ClassTimeDescription = styled.div`
  padding: ${helpers.rhythmDiv}px;
  width: 100%;
  // background: white;
  border-radius: 5px;
`;

const ClassTypeName = Text.withComponent("h4").extend`
  font-size: ${props =>
    props.inPopUp ? helpers.baseFontSize * 1.5 : helpers.baseFontSize * 1.25}px;
  text-align: center;
  text-transform: capitalize;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ScheduleType = Text.extend`
  font-weight: 300;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const RecurringDate = Text.extend`
  font-size: 14px;
  font-weight: 500;
`;

const ClassTimeLocation = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ClassTimeRoom = styled.div`
  ${helpers.flexCenter};
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const LocationTitle = Text.extend`
  margin: 0 auto;
  padding: 0;
  font-style: italic;
  margin-bottom: ${helpers.rhythmDiv / 2}px;
`;

let LocationContent, RoomInfoContent;
LocationContent = RoomInfoContent = Text.extend`
  font-weight: 300;
  font-style: italic;
  margin: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  transition: 0.1s ease-in opacity;
  ${props => (props.showCard ? "opacity: 0" : "opacity: 1")};
  ${props => props.marginBottom && `margin-bottom: ${helpers.rhythmDiv}px;`};
`;

const TrendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  right: ${helpers.rhythmDiv * 2}px;
  left: auto;
`;

const ClassTimesCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: auto;
  // max-height: ${props =>
    props.inPopUp ? "auto" : "296px"}; // computed height
`;

const Trending = () => {
  return (
    <TrendingWrapper>
      <TrendingIcon />
    </TrendingWrapper>
  );
};

class ClassTime extends Component {
  state = {
    isLoading: false,
    showCard: false,
    showDescription: false,
    thinkingAboutAttending: false
    // fullTextState: this.props.fullTextState,
  };

  escFunction = event => {
    if (event.keyCode === 27) {
      this.handleDescriptionState(false)(event);
    }
  };
  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  componentWillMount() {
    Meteor.call(
      "classTypeLocationRequest.getUserRecord",
      this.props.classTypeId,
      (err, res) => {
        if (err) {
        } else {
          this.setState({ notification: res });
        }
      }
    );
  }

  handleAddToMyCalendarButtonClick = () => {
    const classTimeData = { ...this.props };
    this.addToMyCalender(classTimeData);
  };

  handleNonUserDialogBoxState = state => e => {
    this.setState({
      nonUserDialogBox: state
    });
  };

  handleRemoveFromCalendarButtonClick = () => {
    // this.setState({ addToCalendar: true });
    const classTimeData = { ...this.props };
    this.removeFromMyCalender(classTimeData);
  };

  removeFromMyCalender = classTimeRec => {
    const { popUp } = this.props;
    const result = this.props.classInterestData.filter(
      data => data.classTimeId == classTimeRec._id
    );
    // check for user login or not
    const userId = Meteor.userId();
    if (!isEmpty(userId)) {
      if (!_.isEmpty(result)) {
        const doc = {
          _id: result[0]._id,
          userId
        };
        this.handleClassInterest({
          methodName: "classInterest.removeClassInterest",
          data: { doc }
        });
      }
      this.setState({ addToCalendar: true });
    } else {
      // popUp.error("Please login !","Error");
      this.setState({
        nonUserDialogBox: true
      });
    }
  };

  addToMyCalender = data => {
    // check for user login or not
    const userId = Meteor.userId();
    if (!isEmpty(userId)) {
      const doc = {
        classTimeId: data._id,
        classTypeId: data.classTypeId,
        schoolId: data.schoolId,
        userId
      };
      this.handleClassInterest({
        methodName: "classInterest.addClassInterest",
        data: { doc }
      });
      this.setState({ addToCalendar: false });
    } else {
      // alert("Please login !!!!")
      //Events.trigger("loginAsUser");
      this.setState({
        nonUserDialogBox: true
      });
    }
  };

  handleClassInterest = ({ methodName, data }) => {
    this.setState({ isLoading: true });
    const currentUser = Meteor.user();
    const userName = getUserFullName(currentUser);
    Meteor.call(methodName, data, (err, res) => {
      const { popUp } = this.props;
      this.setState({ isLoading: false });
      if (err) {
        popUp.appear("error", { content: err.message });
      } else {
        if (methodName.indexOf("remove") !== -1)
          popUp.appear("success", {
            content: `Hi ${userName}, Class removed successfully from your calendar`
          });
        else
          popUp.appear("success", {
            content: `Hi ${userName}, Class added to your calendar`
          });
      }
    });
  };
  handleClassClosed = () => {
    const currentUser = Meteor.user();
    const userName = getUserFullName(currentUser);
    const { popUp } = this.props;
    let emailId;
    this.props &&
      this.props.schoolId &&
      Meteor.call("school.getMySchool", null, false, (err, res) => {
        if (res) {
          emailId = res && res[0].email;
          popUp.appear("success", {
            content: `Hi ${userName}, This class is closed to registration. ${emailId &&
              emailId &&
              `contact the administrator at ${emailId} for more details.`} `
          });
        }
      });
  };

  reformatNewFlowData = () => {
    const newData = {};
    let { formattedClassTimesDetails, scheduleType } = this.props;
    scheduleType = scheduleType.toLowerCase();

    if (scheduleType === "recurring" || scheduleType === "ongoing") {
      if (typeof formattedClassTimesDetails[0] !== "object") {
        return formattedClassTimesDetails;
      }

      // key attr specifies the day information is stored on keys
      formattedClassTimesDetails.forEach((scheduleData, index) => {
        scheduleData.key.forEach(dowObj => {
          // debugger;
          if (!newData[dowObj.label]) {
            newData[dowObj.label] = [];
          }

          const scheduleDataCopy = JSON.parse(JSON.stringify(scheduleData));
          delete scheduleDataCopy.key;
          newData[dowObj.label].push(scheduleDataCopy);
        });
      });

      return newData;
    }

    return formattedClassTimesDetails;
  };

  getScheduleTypeFormatted = () => {
    const { startDate, endDate, scheduleType, addToCalendar } = this.props;
    const classScheduleType = scheduleType.toLowerCase();

    if (classScheduleType === "recurring")
      return (
        <Fragment>
          <ScheduleType>
            {addToCalendar == "closed"
              ? "This is a Closed Series.Enrollment closes once the first class starts.If you join the class, you are enrolled in all the classes in the series."
              : "This is a Series class time."}{" "}
            {<br />}
          </ScheduleType>
          <RecurringDate>
            Between {formatDate(startDate, "MMM")} and{" "}
            {formatDate(endDate, "MMM")}
          </RecurringDate>
        </Fragment>
      );
    else if (classScheduleType === "onetime") {
      /* Adding manual small letters splitted schedule type one time*/
      return (
        <ScheduleType>
          {addToCalendar == "closed"
            ? "This is a Closed Single/set.Enrollment closes once the first class starts.If you join the class, you are enrolled in all the classes in the series."
            : "This is a Single/Set class time."}{" "}
          {<br />}
        </ScheduleType>
      );
    }
    return (
      <ScheduleType>
        {`This is an ${classScheduleType} class time.`}
      </ScheduleType>
    );
  };

  getWrapperClassName = addToCalendar =>
    addToCalendar ? "add-to-calendar" : "remove-from-calendar";

  getOuterClockClassName = addToCalendar =>
    addToCalendar ? "add-to-calendar-clock" : "remove-from-calendar-clock";

  getDotColor = addToCalendar =>
    addToCalendar ? helpers.primaryColor : helpers.cancel;

  getCalenderButton = (addToCalender, formattedClassTimesDetails) => {
    const iconName = addToCalender ? "add_circle_outline" : "delete";
    // const label = addToCalender ? "Remove from Calender" :  "Add to my Calendar";

    return (
      <div style={{ display: "flex" }}>
        <FormGhostButton
          onClick={() => {
            this.setState({
              thinkingAboutAttending: true,
              addToCalendar: addToCalender
            });
          }}
          label="Thinking About Attending"
        />
      </div>
    );
  };

  scrollTo(name) {
    scroller.scrollTo(name || "content-container", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }

  handleNotification = CheckBoxes => {
    this.setState({ isLoading: true });
    const { schoolId, classTypeId, classTypeName } = this.props;
    const currentUser = Meteor.user();
    const userName = getUserFullName(currentUser);
    let data = {
      name: userName,
      email: currentUser.emails[0].address,
      schoolId: schoolId,
      classTypeId: classTypeId,
      userId: Meteor.userId(),
      notification: CheckBoxes[1],
      createdAt: new Date(),
      classTypeName: classTypeName.name,
      existingUser: true
    };
    Meteor.call("classTypeLocationRequest.updateRequest", data, (err, res) => {
      this.setState({ isLoading: false });
      const { popUp } = this.props;
      if (res) {
        Meteor.call("classTimesRequest.updateRequest", data, (err1, res1) => {
          if (res1) {
            popUp.appear("success", {
              content: `Hi ${userName}, You are ${
                CheckBoxes[1] ? "subscribed" : "unsubscribed"
              } to  notification related to the
            location and time update of class type ${classTypeName.name}.
            `
            });
            this.componentWillMount();
          }
        });
      }
    });
  };

  getClassTimeRoomInfo = () => {
    const { selectedLocation, classes } = this.props;
    // console.group("ROOM INFO");
    // console.log(selectedLocation);
    // console.groupEnd();

    if (
      (isEmpty(selectedLocation) && isEmpty(selectedLocation.rooms)) ||
      !selectedLocation.rooms.length
    ) {
      return null;
    }

    const { rooms } = selectedLocation;

    return (
      <ClassTimeRoom>
        <Icon className={classes.classTimeIcon}>{"meeting_room"}</Icon>
        <RoomInfoContent>
          {rooms.map(room => room.name).join(",")}
        </RoomInfoContent>
      </ClassTimeRoom>
    );
  };

  getClassTimeLocation = () => {
    // debugger;
    const { selectedLocation, classes } = this.props;

    // console.group("CLASSTIME LOCATION INFO");
    // console.log(selectedLocation);
    // console.groupEnd();

    if (isEmpty(selectedLocation)) {
      return null;
    }
    const addressComponents = ["address", "city", "state", "country"];
    const eventLocationTitle = selectedLocation.title || "";
    let eventAddress = "";
    addressComponents.forEach(component => {
      if (selectedLocation[component])
        eventAddress += ", " + selectedLocation[component];
    });
    eventAddress = eventAddress.replace(",", "");

    return (
      <ClassTimeLocation>
        <LocationTitle>
          <Icon className={classes.classTimeIcon}>{"location_on"}</Icon>
          <span>{eventLocationTitle ? eventLocationTitle : eventLocation}</span>
        </LocationTitle>
        {eventLocationTitle && (
          <LocationContent>{eventAddress}</LocationContent>
        )}
      </ClassTimeLocation>
    );
  };

  handleCheckBoxes = CheckBoxes => {
    const { addToCalendar } = this.props;
    if (CheckBoxes[0] != !addToCalendar) {
      if (CheckBoxes[0]) {
        this.handleAddToMyCalendarButtonClick();
      } else {
        this.handleRemoveFromCalendarButtonClick();
      }
    }
    this.handleNotification(CheckBoxes);
  };

  handleDescriptionState = descriptionState => e => {
    e.stopPropagation();

    this.setState(state => {
      return {
        ...state,
        showDescription: descriptionState
      };
    });
  };

  render() {
    // debugger;
    const {
      selectedLocation,
      desc,
      startDate,
      endDate,
      scheduleType,
      name,
      classes,
      inPopUp,
      formattedClassTimesDetails,
      classTypeName,
      onModalClose
    } = this.props;
    // const formattedClassTimes = formatDataBasedOnScheduleType(this.props);
    const { thinkingAboutAttending, addToCalendar, notification } = this.state;

    // console.group("formattedClassTimes");
    // console.groupEnd();

    //const showDescription = this.showDescription(formattedClassTimes);
    const classNameForClock = this.getOuterClockClassName(
      this.props.addToCalendar
    );
    const dotColor = this.getDotColor(this.props.addToCalendar);
    return (
      <Fragment>
        {" "}
        {formattedClassTimesDetails.totalClassTimes > 0 && (
          <Fragment>
            {this.state.isLoading && <ContainerLoader />}
            {this.state.nonUserDialogBox && (
              <NonUserDefaultDialogBox
                title={"Sign In"}
                content={"You need to sign in to add classes"}
                open={this.state.nonUserDialogBox}
                onModalClose={this.handleNonUserDialogBoxState(false)}
              />
            )}
            {thinkingAboutAttending && (
              <ThinkingAboutAttending
                open={thinkingAboutAttending}
                onModalClose={() => {
                  this.setState({ thinkingAboutAttending: false });
                }}
                handleClassClosed={this.handleClassClosed}
                handleAddToMyCalendarButtonClick={
                  this.handleAddToMyCalendarButtonClick
                }
                handleRemoveFromCalendarButtonClick={
                  this.handleRemoveFromCalendarButtonClick
                }
                addToCalendar={addToCalendar}
                notification={notification}
                purchaseThisPackage={() => {
                  this.setState({ thinkingAboutAttending: false });
                  this.scrollTo("price-section");
                  onModalClose();
                }}
                handleCheckBoxes={this.handleCheckBoxes}
                name={name}
              />
            )}
            <div>
              <ClassTimeContainer
                onClick={this.handleDescriptionState(false)}
                inPopUp={inPopUp}
                className={`class-time-bg-transition ${this.getWrapperClassName(
                  this.props.addToCalendar
                )}`}
                key={this.props._id}
              >
                <ClassTimeContent>
                  {/*Class type name */}
                  <ClassTypeName inPopUp={inPopUp}>{`${name}`}</ClassTypeName>

                  <ClassTimeContentInnerWrapper
                    showDescription={this.state.showDescription}
                  >
                    {/* Class Location */}
                    {this.getClassTimeLocation()}

                    {/* Class Time Room */}
                    {this.getClassTimeRoomInfo()}

                    {/* Schedule type */}
                    {this.getScheduleTypeFormatted()}

                    {/* class times */}
                    <ClassTimesCardWrapper inPopUp={inPopUp}>
                      <ClassTimesList
                        inPopUp={true}
                        show={true}
                        formattedClassTimes={this.reformatNewFlowData()}
                        scheduleType={scheduleType}
                        description={desc}
                      />
                    </ClassTimesCardWrapper>
                  </ClassTimeContentInnerWrapper>

                  {/* description */}
                  {this.props.desc && (
                    <Paper
                      className={classes.descriptionPanel}
                      style={{
                        transform: this.state.showDescription
                          ? "scaleY(1)"
                          : "scaleY(0)"
                      }}
                    >
                      <Icon
                        classes={{
                          root: classes.descriptionPanelCloseIcon
                        }}
                        onClick={this.handleDescriptionState(false)}
                      >
                        {"close"}
                      </Icon>

                      <ClassTimeDescription>
                        {this.props.desc}
                      </ClassTimeDescription>
                    </Paper>
                  )}
                </ClassTimeContent>

                {/* View All times button */}
                <ButtonsWrapper>
                  {this.props.desc && (
                    <ButtonWrapper marginBottom>
                      <ClassTimeButton
                        white
                        fullWidth
                        icon
                        iconName="description"
                        label="View Description"
                        onClick={this.handleDescriptionState(true)}
                      />
                    </ButtonWrapper>
                  )}
                  <ButtonWrapper>
                    {this.getCalenderButton(this.props.addToCalendar)}
                  </ButtonWrapper>
                </ButtonsWrapper>
                {this.props.isTrending && <Trending />}
              </ClassTimeContainer>{" "}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

ClassTime.propTypes = {
  classTimes: PropTypes.arrayOf({
    time: PropTypes.string.isRequired,
    timePeriod: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired
  }),
  description: PropTypes.string.isRequired,
  addToCalendar: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  inPopUp: PropTypes.bool, // True => the class time cards are present inside of pop up in homepage,  false => are on the classtype page
  isTrending: PropTypes.bool
};

// export default withPopUp(withShowMoreText(ClassTime, { description: "desc"}));
export default withPopUp(withStyles(styles)(ClassTime));
