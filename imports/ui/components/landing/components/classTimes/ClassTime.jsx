import React, { Component, Fragment } from "react";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { isEmpty, get } from "lodash";
import {scroller} from 'react-scroll';
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
import ThinkingAboutAttending from "/imports/ui/components/landing/components/dialogs/ThinkingAboutAttending";
import Events from "/imports/util/events";
import {
  withPopUp,
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
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
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
    isLoading: false,
    thinkingAboutAttending:false
    // fullTextState: this.props.fullTextState,
  };

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
      const doc = {
        _id: result[0]._id,
        userId
      };
      this.handleClassInterest({
        methodName: "classInterest.removeClassInterest",
        data: { doc }
      });
      this.setState({addToCalendar:true})
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
      this.setState({addToCalendar:false})
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
          popUp.appear("success", { content: `Hi ${userName}, Class removed successfully from your calendar` });
        else
          popUp.appear("success", { content: `Hi ${userName}, Class added to your calendar` });
      }
    });
  };
  handleClassClosed = () => {
    const currentUser = Meteor.user();
    const userName = getUserFullName(currentUser);
    const { popUp } = this.props;
    let emailId;
    this.props && this.props.schoolId && Meteor.call('school.getMySchool',null,false, (err, res) => {
      if (res) {
        emailId = res && res[0].email;
        popUp.appear("success", { content: `Hi ${userName}, This class is closed to registration. ${emailId && emailId && `contact the administrator at ${emailId} for more details.`} ` });
      }
    })
  }

  getScheduleTypeFormatted = () => {
    const { startDate, endDate, scheduleType, addToCalendar } = this.props;
    const classScheduleType = scheduleType.toLowerCase();

    if (classScheduleType === "recurring")
      return (
        <ScheduleType>
          {addToCalendar == 'closed' ? 'This is a Closed Series.Enrollment closes once the first class starts.If you join the class, you are enrolled in all the classes in the series.' : "This is a Series class time."} {<br />}
          {formatDate(startDate)} - {formatDate(endDate)}
        </ScheduleType>
      );
    else if (classScheduleType === "onetime") {
      {
        /* Adding manual small letters splitted schedule type one time*/
      }
      return (
        <ScheduleType>
          {addToCalendar == 'closed' ? 'This is a Closed Single/set.Enrollment closes once the first class starts.If you join the class, you are enrolled in all the classes in the series.' : "This is a Single/Set class time."} {<br />}
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
    return (<div style={{ display: "flex" }}>
    <FormGhostButton
      onClick={()=>{this.setState({thinkingAboutAttending:true,addToCalendar:addToCalender})}}
      label="Thinking About Attending"
    />
  </div>)
    // if (addToCalender == 'closed') {

    //   return (
    //     <div style={{ display: "flex" }}>
    //       <FormGhostButton
    //         icon
    //         onClick={this.handleClassClosed}
    //         label="Class Closed"
    //         iconName={iconName}
    //       />
    //     </div>
    //   );
    // }
    // if (addToCalender || !Meteor.userId()) {
    //   return (
    //     <div style={{ display: "flex" }}>
          
    //       <FormGhostButton
    //         icon
    //         onClick={this.handleAddToMyCalendarButtonClick}
    //         label="Add to my Calender"
    //         iconName={iconName}
    //       />
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div style={{ display: "flex" }}>
          
    //       <FormGhostButton
    //         icon
    //         ghost
    //         onClick={this.handleRemoveFromCalendarButtonClick}
    //         label="Remove from calendar"
    //         iconName={iconName}
    //       />
    //     </div>
    //   );
    // }
    
  };
  scrollTo(name) {
    scroller.scrollTo((name || 'content-container'), {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
    })
}
  render() {
    // debugger;
    const {
      desc,
      startDate,
      endDate,
      scheduleType,
      name,
      inPopUp,
      formattedClassTimesDetails,
      classTypeName,
      onModalClose
    } = this.props;
    // const formattedClassTimes = formatDataBasedOnScheduleType(this.props);
    const {thinkingAboutAttending,addToCalendar}= this.state;
    
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
            {thinkingAboutAttending && <ThinkingAboutAttending
            open ={thinkingAboutAttending}
            onModalClose ={()=>{this.setState({thinkingAboutAttending:false})}}
            handleClassClosed ={this.handleClassClosed}
            handleAddToMyCalendarButtonClick = {this.handleAddToMyCalendarButtonClick}
            handleRemoveFromCalendarButtonClick = {this.handleRemoveFromCalendarButtonClick}
            addToCalendar = {addToCalendar}
            purchaseThisPackage ={()=>{
              this.setState({thinkingAboutAttending:false});
              this.scrollTo('price-section')
              onModalClose();
            }}
            />}
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

// export default withPopUp(withShowMoreText(ClassTime, { description: "desc"}));
export default withPopUp(ClassTime);
