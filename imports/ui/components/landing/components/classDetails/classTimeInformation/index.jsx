import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import Description from "./presentational/Description";
import LocationDetails from "./presentational/LocationDetails";
import NameBar from "./presentational/NameBar";
import { rhythmDiv, tablet } from "/imports/ui/components/landing/components/jss/helpers.js";
import { classTimeData } from "/imports/ui/components/landing/constants/classDetails/classTimeData";
import ThinkingAboutAttending from "/imports/ui/components/landing/components/dialogs/ThinkingAboutAttending";
import { getUserFullName, } from "/imports/util";
import { isEmpty, get } from "lodash";
import {  formatTime } from "/imports/util";

const Wrapper = styled.div`
  padding: 0;

  @media screen and (min-width: ${tablet}px) {
    flex: 1;
    margin-right: ${rhythmDiv * 2}px;
    border-radius: 5px;
  }
`;

class ClassTimeInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getTitle = () => {
    const { classType } = this.props;
    return get(classType, 'name', '');
  }

  handleJoinNowButtonClick = () => {
    // No package type purchased ---> packages list dialogBox should appear
    // if ---> unlimited monthly package is purchased
    // if not ---> show all packages 
    const { classTypeId } = this.props;
    Meteor.call("purchases.checkPurchasedPackagesWithClassId", classTypeId, (err, res) => {
      if (res) {
        const anyActivePackage = res.any
      }
    });
  }

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
  handleAddToMyCalendarButtonClick = () => {
    const classTimeData = { ...this.props };
    this.addToMyCalender(classTimeData);
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
  handleNotification = CheckBoxes => {
    this.setState({ isLoading: true });
    const { schoolId, classTypeId, classType } = this.props;
    const currentUser = Meteor.user();
    const userName = getUserFullName(currentUser);
    if (!isEmpty(currentUser)) {
      let data = {
        name: userName,
        email: currentUser.emails[0].address,
        schoolId: schoolId,
        classTypeId: classTypeId,
        userId: Meteor.userId(),
        notification: CheckBoxes[1],
        createdAt: new Date(),
        classType: classType.name,
        existingUser: true
      };
      Meteor.call("classTypeLocationRequest.updateRequest", data, (err, res) => {
        const { popUp } = this.props;
        if (res) {
          Meteor.call("classTimesRequest.updateRequest", data, (err1, res1) => {
            if (res1) {
              popUp.appear("success", {
                content: `Hi ${userName}, You are ${
                  CheckBoxes[1] ? "subscribed" : "unsubscribed"
                  } to  notification related to the
            location and time update of class type ${classType.name}.
            `
              });
              this.componentWillMount();
            }
          });
        }
      });
    }
    this.setState({ isLoading: false });
  };
  render() {
    const {
      classData:{eventData:{title}},
      schoolName,
      schoolCoverSrc,
       desc, address, 
      website, start, schoolId, classType, params, classData,selectedLocation,notification
    } = this.props;
    const {scheduled_date} = classData || {};
    const eventStartTime = formatTime(scheduled_date)
    const { thinkingAboutAttending } = this.state;
    locationName = () => {
      return `${get(selectedLocation,'address','')}, ${get(selectedLocation, 'city', '')}, ${get(selectedLocation, 'state', '')}, ${get(selectedLocation, 'country', '')}, ${get(selectedLocation, 'zip', '')}`
    }

    return (
      <Wrapper bgImg={schoolCoverSrc}>
        {thinkingAboutAttending && (
          <ThinkingAboutAttending
            schoolId={schoolId}
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
            addToCalendar={true}
            notification={true}
            purchaseThisPackage={() => {
              this.setState({ thinkingAboutAttending: false });
            }}
            handleCheckBoxes={this.handleCheckBoxes}
            name={classType.name}
            params={params}
            classTypeId={classType._id}
          />)}

        <NameBar
          title={title}
          schoolName={schoolName}
          onJoinClassButtonClick={() => { this.setState({ thinkingAboutAttending: true }) }}
        />
        <Description description={desc} />
        <LocationDetails
          website={website}
          time={eventStartTime}
          startDate={scheduled_date}
          address={locationName()}
          locationData={{ lat: get(selectedLocation, 'loc[1]', ''), lng: get(selectedLocation, "loc[0]", '') }}
        />

      </Wrapper>
    );
  }
}

ClassTimeInformation.defaultProps = {
  classTimeData: classTimeData
};

ClassTimeInformation.propTypes = {
  classTimeData: PropTypes.object
};

export default ClassTimeInformation;
