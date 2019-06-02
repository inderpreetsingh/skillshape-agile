import { isEmpty } from 'lodash';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ClassInterest from '/imports/api/classInterest/fields';
import ClassTime from '/imports/ui/components/landing/components/classTimes/ClassTime';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import {
  CLASS_TIMES_CARD_WIDTH,
  DAYS_IN_WEEK,
} from '/imports/ui/components/landing/constants/classTypeConstants';
import classTime from '/imports/ui/components/landing/constants/structure/classTime';
import { getContainerMaxWidth } from '/imports/util/cards';

const CARD_WIDTH = CLASS_TIMES_CARD_WIDTH;

const Wrapper = styled.div`
  width: 100%;
`;

const styles = {
  typeItem: {
    display: 'flex',
    justifyContent: 'center',
  },
};

const ClassTimesWrapper = styled.div`
  max-width: ${props => getContainerMaxWidth(CARD_WIDTH, props.spacing, 4)}px;
  margin: 0 auto;

  @media screen and (max-width: ${props => getContainerMaxWidth(CARD_WIDTH, props.spacing, 4)}px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH, props.spacing, 3)}px;
  }

  @media screen and (max-width: ${props => getContainerMaxWidth(CARD_WIDTH, props.spacing, 3)}px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH, props.spacing, 2)}px;
  }

  @media screen and (max-width: ${props => getContainerMaxWidth(CARD_WIDTH, props.spacing, 2)}px) {
    max-width: 600px;
  }
`;

const GridContainer = styled.div`
  ${helpers.flexCenter} justify-content: flex-start;
  flex-wrap: wrap;
`;

const GridItem = styled.div`
  padding: ${props => (props.spacing ? props.spacing / 2 : '16')}px;
  flex-grow: 1;
  width: 100%;
  max-width: ${props => (props.inPopUp ? '100%' : `${CARD_WIDTH + props.spacing}px`)};

  @media screen and (max-width: ${props => getContainerMaxWidth(CARD_WIDTH, props.spacing, 2)}px) {
    max-width: ${props => (props.inPopUp ? '100%' : `${CARD_WIDTH}px`)};
  }

  media screen and (max-width: 600px) {
    max-width: ${props => (props.inPopUp ? '100%' : `${CARD_WIDTH + props.spacing}px`)};
  }
`;

const ClassTimesBar = (props) => {
  checkForAddToCalender = (data) => {
    const userId = Meteor.userId();
    if (isEmpty(data) || isEmpty(userId)) {
      return true;
    }
    return isEmpty(ClassInterest.find({ classTimeId: data._id, userId }).fetch());
  };
  checkPastEndDate = classTimesData => classTimesData.map((classTimeObj) => {
    if (classTimeObj.scheduleType == 'OnGoing') {
      return (
        <GridItem key={classTimeObj._id} spacing={32} inPopUp={inPopUp}>
          <ClassTime
            {...classTimeObj}
            inPopUp={inPopUp}
            classTimeData={classTimeObj}
            classInterestData={classInterestData}
            onModalClose={onModalClose}
            params={params}
            schoolName={schoolName}
            enrollmentIds={enrollmentIds}
            schoolData={schoolData}
          />
        </GridItem>
      );
    }
    if (classTimeObj.endDate > new Date()) {
      return (
        <GridItem key={classTimeObj._id} spacing={32} inPopUp={inPopUp}>
          <ClassTime
            {...classTimeObj}
            inPopUp={inPopUp}
            classTimeData={classTimeObj}
            classInterestData={classInterestData}
            onModalClose={onModalClose}
            params={params}
            schoolName={schoolName}
            enrollmentIds={enrollmentIds}
            schoolData={schoolData}
          />
        </GridItem>
      );
    }
    if (classTimeObj.scheduleType == 'oneTime') {
      // if single/set all times are ended/ in past
      let allPastDate = false;
      let totalPastDates = 0;
      let totalClassTimes;
      // debugger;
      DAYS_IN_WEEK.map((day) => {
        totalClassTimes = classTimeObj.formattedClassTimesDetails.totalClassTimes;
        const scheduleData = classTimeObj.formattedClassTimesDetails[day];
        if (!isEmpty(scheduleData)) {
          scheduleData.forEach((schedule, i) => {
            if (schedule.startTime < new Date()) {
              totalPastDates++;
              if (totalPastDates == totalClassTimes) {
                allPastDate = true;
              }
            }
          });
        }
      });

      if (!allPastDate) {
        return (
          <GridItem key={classTimeObj._id} spacing={32} inPopUp={inPopUp}>
            <ClassTime
              {...classTimeObj}
              inPopUp={inPopUp}
              classTimeData={classTimeObj}
              classInterestData={classInterestData}
              onModalClose={onModalClose}
              params={params}
              schoolName={schoolName}
              schoolData={schoolData}
              enrollmentIds={enrollmentIds}
            />
          </GridItem>
        );
      }
    }
  });

  displayAll = classTimesData => classTimesData.map(classTimeObj => (
    <GridItem key={classTimeObj._id} spacing={32} inPopUp={inPopUp}>
      <ClassTime
        {...classTimeObj}
        onEditClassTimesClick={onEditClassTimesClick}
        editMode={editMode}
        inPopUp={inPopUp}
        classTimeData={classTimeObj}
        classInterestData={classInterestData}
        onModalClose={onModalClose}
        params={params}
        schoolName={schoolName}
        enrollmentIds={enrollmentIds}
        schoolData={schoolData}
      />
    </GridItem>
  ));

  const {
    editMode,
    inPopUp,
    classTimesData,
    classInterestData,
    onModalClose,
    onEditClassTimesClick,
    params,
    schoolName,
    enrollmentIds,
    schoolData,
  } = props;
  return (
    <Wrapper>
      <ClassTimesWrapper spacing={32}>
        <GridContainer>
          {editMode ? displayAll(classTimesData) : checkPastEndDate(classTimesData)}
        </GridContainer>
      </ClassTimesWrapper>
    </Wrapper>
  );
};

ClassTimesBar.propTypes = {
  inPopUp: PropTypes.bool,
  classTimesData: PropTypes.arrayOf(classTime),
};

ClassTimesBar.defaultProps = {
  inPopUp: false,
};

export default withStyles(styles)(ClassTimesBar);
