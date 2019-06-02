import { confirmationDialog, getUserFullName } from '/imports/util';
import { isEmpty } from 'lodash';

export function handleJoin() {
  this.setState({ isLoading: true });
  const {
    checkBoxes,
    checkBoxesData: { classInterestData },
  } = this.state;
  const {
    classTimeId,
    classTypeId,
    schoolId,
    popUp,
    onModalClose,
    name: classTypeName,
  } = this.props;
  const userId = Meteor.userId();
  if (!userId) {
    let data = {};
    data = {
      popUp,
      title: 'Oops',
      type: 'alert',
      content: 'Please Login First.',
      buttons: [{ label: 'Ok', onClick: onModalClose, greyColor: true }],
    };
    confirmationDialog(data);
  } else {
    if (checkBoxes[0]) {
      const data = {
        doc: {
          classTimeId, classTypeId, schoolId, userId,
        },
      };
      callMethod('classInterest.addClassInterest', data, popUp, onModalClose);
    } else if (!checkBoxes[0] && !isEmpty(classInterestData)) {
      const data = { doc: { _id: classInterestData._id, userId } };
      callMethod('classInterest.removeClassInterest', data, popUp, onModalClose);
    }
    const currentUser = Meteor.user();
    const userName = getUserFullName(currentUser);
    if (!isEmpty(currentUser)) {
      const data = {
        name: userName,
        email: currentUser.emails[0].address,
        schoolId,
        classTypeId,
        userId,
        notification: checkBoxes[1],
        createdAt: new Date(),
        classTypeName,
        existingUser: true,
      };
      const memberData = {
        activeUserId: userId,
        schoolId,
        classTypeId,
        from: 'classes',
        emailAccess: checkBoxes[2],
      };
      callMethod('schoolMemberDetails.addNewMember', memberData, popUp, onModalClose);
      callMethod('classTypeLocationRequest.updateRequest', data, popUp, onModalClose);
      const self = this;
      callMethod('classTimesRequest.updateRequest', data, popUp, onModalClose, true, self);
    }
  }
}
callMethod = (methodName, data, popUp, onModalClose, showDialog, self) => {
  Meteor.call(methodName, data, (err, res) => {
    if (showDialog) {
      self.setState({ isLoading: false });
      const {
        state: { isFirstTime },
        handlePrivacySettingDialog,
      } = self;

      let data = {};
      data = {
        popUp,
        title: 'Success',
        type: 'success',
        content: 'Operation Completed Successfully.',
        buttons: [
          {
            label: 'Ok',
            onClick: !isFirstTime ? onModalClose : handlePrivacySettingDialog,
            greyColor: true,
          },
        ],
      };
      confirmationDialog(data);
    }
  });
};
