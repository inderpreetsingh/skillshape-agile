import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { withPopUp, confirmationDialog, redirectToThisUrl } from '/imports/util';
import { createContainer } from 'meteor/react-meteor-data';

import Notification from '/imports/ui/components/landing/components/helpers/Notification.jsx';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { isEmpty, findKey, get } from 'lodash';
import { ContainerLoader } from '/imports/ui/loading/container';
import School from '/imports/api/school/fields.js';
import SLocation from '/imports/api/sLocation/fields';
import ClassType from '/imports/api/classType/fields';
import ClassPricing from '/imports/api/classPricing/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import EnrollmentFees from '/imports/api/enrollmentFee/fields';
import ClassTimes from '/imports/api/classTimes/fields';
import { OnBoardingDialogBox } from '/imports/ui/components/landing/components/dialogs';


class CompletePrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: Meteor.user(),
    };
  }

    GenerateNotificationContent = () => {
      const { currentUser } = this.state;
      const { itemListsData, isSchool } = this.props;
      const itemLists = [{ label: 'My Profile', value: 'myProfile' }];
      if (isSchool) {
        itemLists.push.apply(itemLists, [{ label: 'School Info', value: 'school' }, { label: 'Locations', value: 'sLocation' }, { label: 'Class Types', value: 'classType' }, { label: 'Class Times', value: 'classTime' }, { label: 'Prices', value: 'prices' }]);
      }
      if (!isEmpty(currentUser)) {
        return (
          <div>
            {itemLists.map((item, index) => {
              const { label, value } = item;
              return (
                <FormGhostButton
                  key={index.toString()}
                  darkGreyColor
                  onClick={() => { }}
                  label={label}
                  icon
                  iconName={itemListsData[value] ? 'check' : 'cancel'}
                  disabled
                />
              );
            })}
          </div>
        );
      }
      return '';
    }

    onNextButtonClick = () => {
      const { itemListsData, schoolId, userId } = this.props;
      const keyName = findKey(itemListsData, o => !o);
      if (keyName == 'myProfile') {
        const url = `/profile/${userId}`;
        redirectToThisUrl(url);
      } else if (keyName == 'school') { this.setState({ onBoardingDialogBox: true }); } else if (keyName && schoolId) {
        const tabValue = keyName == 'sLocation' ? 1 : keyName == 'classType' || keyName == 'classTime' ? 2 : 3;
        const url = `SchoolAdmin/${schoolId}/edit/${tabValue}`;
        redirectToThisUrl(url);
      }
    }

    render() {
      const { currentUser, onBoardingDialogBox } = this.state;
      const { hide } = this.props;
      if (isEmpty(currentUser) || hide) {
        return <Fragment />;
      }
      return (
        <Fragment>
          <Notification
            notificationContent={this.GenerateNotificationContent()}
            bgColor={helpers.primaryColor}
            buttonLabel="Next"
            onButtonClick={this.onNextButtonClick}
          />
          {onBoardingDialogBox && (
          <OnBoardingDialogBox
            open={onBoardingDialogBox}
            onModalClose={() => { this.setState({ onBoardingDialogBox: false }); }}
          />
          )}
        </Fragment>
      );
    }
}

CompletePrompt.propTypes = {

};

export default createContainer((props) => {
  const completePromptSub = Meteor.subscribe('school.getUserCompletePromptData');
  let userData = []; let schoolData = []; let classTypeData = []; let classTimeData = []; let schoolLocationData = []; let classPriceData = []; let monthlyPriceData = []; let
    enrollmentPriceData = [];
  let itemListsData = {};
  let schoolId;
  let isSchool = false;
  let hide = true;
  let userId;
  if (completePromptSub && completePromptSub.ready()) {
    userData = Meteor.users.find().fetch();
    schoolData = School.find().fetch();
    classTypeData = ClassType.find().fetch();
    classTimeData = ClassTimes.find().fetch();
    schoolLocationData = SLocation.find().fetch();
    classPriceData = ClassPricing.find().fetch();
    monthlyPriceData = MonthlyPricing.find().fetch();
    enrollmentPriceData = EnrollmentFees.find().fetch();
    const myProfile = get(userData[0], 'savedByUser', false);
    userId = get(userData[0], '_id', null);
    itemListsData = {
      myProfile,
      school: !isEmpty(schoolData),
      sLocation: !isEmpty(schoolLocationData) || schoolData.length > 1,
      classType: !isEmpty(classTypeData) || schoolData.length > 1,
      classTime: !isEmpty(classTimeData) || schoolData.length > 1,
      prices: !isEmpty(classPriceData) || !isEmpty(monthlyPriceData) || !isEmpty(enrollmentPriceData) || schoolData.length > 1,
    };
    if (schoolData.length == 1) {
      schoolId = schoolData[0]._id;
    }
    const roles = get(userData[0], 'roles', []);
    roles.map((role) => {
      if (role == 'School') {
        isSchool = true;
      }
    });
    if (isSchool) {
      Object.values(itemListsData).map((item) => {
        if (!item) {
          hide = false;
        }
      });
    } else if (!itemListsData.myProfile) {
      hide = false;
    }
  }

  return {
    itemListsData,
    schoolId,
    hide,
    isSchool,
    userId,
  };
}, (withPopUp(CompletePrompt)));
