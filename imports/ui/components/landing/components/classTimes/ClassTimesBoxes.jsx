import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import ClassInterest from "/imports/api/classInterest/fields";

import ClassTimesSlider from "/imports/ui/components/landing/components/classTimes/ClassTimesSlider.jsx";
import ClassTimesBar from "/imports/ui/components/landing/components/classTimes/ClassTimesBar.jsx";
import classTime from "/imports/ui/components/landing/constants/structure/classTime.js";
import { DAYS_IN_WEEK } from "/imports/ui/components/landing/constants/classTypeConstants.js";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const SliderWrapper = styled.div`
  display: none;
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    display: block;
  }
`;

const BarWrapper = styled.div`
  display: block;
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    display: ${props => (props.show ? "none" : "block")};
  }
`;

class ClassTimesBoxes extends Component {
  _checkForAddToCalender = data => {
    let closedChecker;
    const userId = Meteor.userId();
    if (!isEmpty(data)) {
      DAYS_IN_WEEK.map(day => {
        const scheduleData = data.formattedClassTimesDetails[day];
        if (!isEmpty(scheduleData)) {
          scheduleData.forEach((schedule, i) => {
            if (schedule.startTime < new Date() && data.closed) {
              closedChecker = "closed";
            }
          });
        }
      });
      if (closedChecker) return "closed";
    }
    if (!isEmpty(data) && data.closed && data.startDate < new Date()) {
      return "closed";
    } else if (isEmpty(data) || isEmpty(userId)) {
      return true;
    } else {
      return isEmpty(ClassInterest.find({ classTimeId: data._id }).fetch());
    }
  };

  render() {
    const {
      classTimesData,
      classInterestData,
      inPopUp,
      withSlider,
      onModalClose,
      editMode
    } = this.props;
    let modifiedClassTimesData = classTimesData;
    if (!editMode) {
      modifiedClassTimesData = classTimesData.map(data => {
        data.addToCalendar = this._checkForAddToCalender(data);
        return data;
      });
    }
    return (
      <Fragment>
        {withSlider && (
          <SliderWrapper>
            <ClassTimesSlider
              data={modifiedClassTimesData}
              componentProps={{ classInterestData: classInterestData }}
            />
          </SliderWrapper>
        )}
        <BarWrapper show={withSlider}>
          <ClassTimesBar
            editMode={editMode}
            inPopUp={inPopUp}
            classTimesData={modifiedClassTimesData}
            classInterestData={classInterestData}
            onModalClose={onModalClose}
          />
        </BarWrapper>
      </Fragment>
    );
  }
}

ClassTimesBoxes.propTypes = {
  withSlider: PropTypes.bool,
  inPopUp: PropTypes.bool,
  classTimesData: PropTypes.arrayOf(classTime)
};

ClassTimesBoxes.defaultProps = {
  withSlider: true,
  inPopUp: false
};

export default ClassTimesBoxes;
