import React, { Component, Fragment } from "react";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { isEmpty, get } from "lodash";
import Button from "material-ui/Button";
import ClassTimeClockManager from "/imports/ui/components/landing/components/classTimes/ClassTimeClockManager.jsx";
import ClassTimesCard from "/imports/ui/components/landing/components/cards/ClassTimesCard.jsx";
import TrendingIcon from "/imports/ui/components/landing/components/icons/Trending.jsx";
import Dialog, {
  DialogActions,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";
import { cutString } from "/imports/util";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton";
import SecondaryButton from "/imports/ui/components/landing/components/buttons/SecondaryButton";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";

import NonUserDefaultDialogBox from "/imports/ui/components/landing/components/dialogs/NonUserDefaultDialogBox.jsx";

import Events from "/imports/util/events";
import {
  toastrModal,
  formatDate,
  formatTime,
  formatDataBasedOnScheduleType,
  getUserFullName
} from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container.js";

import {
  DAYS_IN_WEEK,
  CLASS_TIMES_CARD_WIDTH
} from "/imports/ui/components/landing/constants/classTypeConstants.js";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

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
`;
const ConfirmationDialog = styled.div`
  margin: 8px;
`;
const ClassTimeDescription = styled.div`
  border: 2px solid black;
  margin-top: 5px;
  width: 100%;
  padding: 7px;
  border-radius: 10px;
`;
const ClassTypeName = styled.h5`
  width: 100%;
  margin: 0;
  line-height: 1;
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-weight: 400;
  font-size: ${props =>
    props.inPopUp ? helpers.baseFontSize * 1.5 : helpers.baseFontSize * 1.25}px;
  text-align: center;
  text-transform: capitalize;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ScheduleType = ClassTypeName.withComponent("p").extend`
  font-weight: 300;
  font-size: 18px;
  text-transform: capitalize;
`;

const Description = styled.p`
  margin: ${helpers.rhythmDiv}px 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  overflow-y: auto;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${helpers.rhythmDiv}px;
  transition: 0.1s ease-in opacity;
  ${props => (props.showCard ? "opacity: 0" : "opacity: 1")};
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
  max-height: ${props => (props.inPopUp ? "auto" : "296px")}; // computed height
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
    isLoading: false
    // fullTextState: this.props.fullTextState,
  };

  handleAddToMyCalendarButtonClick = () => {
    // console.log("this.props.handleAddToMyCalendarButtonClick",this.props);
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
    // console.log("this.props",this.props)
    const classTimeData = { ...this.props };
    this.removeFromMyCalender(classTimeData);
  };

  removeFromMyCalender = classTimeRec => {
    const { toastr } = this.props;
    console.log("this.props", this.props, classTimeRec);
    const result = this.props.classInterestData.filter(
      data => data.classTimeId == classTimeRec._id
    );
    console.log("result==>", result);
    // check for user login or not
    const userId = Meteor.userId();
    if (!isEmpty(userId)) {
      const doc = {
        _id: result[0]._id,
        userId
      };
      this.handleClassInterest({
        methodName: "classInterest.removeClassInterest",
        data: { doc }
      });
    } else {
      // toastr.error("Please login !","Error");
      this.setState({
        nonUserDialogBox: true
      });
    }
  };

  addToMyCalender = data => {
    // check for user login or not
    console.log("addToMyCalender", data);
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
    } else {
      // alert("Please login !!!!")
      //Events.trigger("loginAsUser");
      this.setState({
        nonUserDialogBox: true
      });
    }
  };

  handleClassInterest = ({ methodName, data }) => {
    console.log("handleClassInterest", methodName, data);
    this.setState({ isLoading: true });
    const currentUser = Meteor.user();
    const userName = getUserFullName(currentUser);
    Meteor.call(methodName, data, (err, res) => {
      const { toastr } = this.props;
      this.setState({ isLoading: false });
      if (err) {
        toastr.error(err.message, "Error");
      } else {
        if (methodName.indexOf("remove") !== -1)
          toastr.success(
            `Hi ${userName}, Class removed successfully from your calendar`,
            "Success"
          );
        else
          toastr.success(
            `Hi ${userName}, Class added to your calendar`,
            "Success"
          );
      }
    });
  };

  getScheduleTypeFormatted = () => {
    const { startDate, endDate, scheduleType } = this.props;
    const classScheduleType = scheduleType.toLowerCase();

    if (classScheduleType === "recurring")
      return (
        <ScheduleType>
          This is a Recurring class time.{<br />}
          {formatDate(startDate)} - {formatDate(endDate)}
        </ScheduleType>
      );
    else if (classScheduleType === "onetime") {
      {
        /* Adding manual small letters splitted schedule type one time*/
      }
      return (
        <ScheduleType>
          {"This is a one time class time."}
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

  getCalenderButton = addToCalender => {
    const iconName = addToCalender ? "add_circle_outline" : "delete";
    // const label = addToCalender ? "Remove from Calender" :  "Add to my Calendar";
    if (addToCalender || !Meteor.userId()) {
      return (
        <div style={{ display: "flex" }}>
          <ClassTimeButton
            icon
            onClick={this.handleAddToMyCalendarButtonClick}
            label="Add to my Calender"
            iconName={iconName}
          />
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex" }}>
          <ClassTimeButton
            icon
            ghost
            onClick={this.handleRemoveFromCalendarButtonClick}
            label="Remove from calendar"
            iconName={iconName}
          />
        </div>
      );
    }
    return <div />;
  };

  render() {
    // debugger;
    console.log("this.props of classtime", this.props);
    const {
      desc,
      startDate,
      endDate,
      scheduleType,
      name,
      inPopUp,
      formattedClassTimesDetails,
      classTypeName
    } = this.props;
    // const formattedClassTimes = formatDataBasedOnScheduleType(this.props);

    console.log(desc, this.props, "Formatted Class Times.........");
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
            <div>
              <ClassTimeContainer
                inPopUp={inPopUp}
                className={`class-time-bg-transition ${this.getWrapperClassName(
                  this.props.addToCalendar
                )}`}
                key={this.props._id}
              >
                <ClassTimeContent>
                  {/*Class type name */}
                  <ClassTypeName inPopUp={inPopUp}>{`${name}`}</ClassTypeName>
                  {/* Schedule type */}
                  {this.getScheduleTypeFormatted()}
                  {this.props.desc && (
                    <ClassTimeDescription>
                      {`Description: ${cutString(this.props.desc, 70)}`}
                    </ClassTimeDescription>
                  )}
                  <ClassTimesCardWrapper inPopUp={inPopUp}>
                    <ClassTimesCard
                      inPopUp={inPopUp}
                      show={true}
                      formattedClassTimes={formattedClassTimesDetails}
                      scheduleType={scheduleType}
                      description={desc}
                    />
                  </ClassTimesCardWrapper>
                </ClassTimeContent>

                {/* View All times button */}
                <ButtonsWrapper />
                <ButtonsWrapper>
                  {this.getCalenderButton(this.props.addToCalendar)}
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
  isTrending: PropTypes.bool
};

// export default toastrModal(withShowMoreText(ClassTime, { description: "desc"}));
export default toastrModal(ClassTime);
