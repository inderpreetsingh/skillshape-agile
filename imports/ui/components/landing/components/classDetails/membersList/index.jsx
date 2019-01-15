import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import MembersList from "./presentational/MembersList.jsx";
import AddInstructorDialogBox from "/imports/ui/components/landing/components/dialogs/AddInstructorDialogBox";
import { membersList } from "/imports/ui/components/landing/constants/classDetails";
import { isEmpty, get, isEqual } from 'lodash';
import ClassTypePackages from '/imports/ui/components/landing/components/dialogs/classTypePackages.jsx';
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import { BuyPackagesDialogBox } from "/imports/ui/components/landing/components/dialogs/";
import { danger } from "/imports/ui/components/landing/components/jss/helpers.js";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { capitalizeString, confirmationDialog } from '/imports/util';
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const ListWrapper = styled.div`  
  padding: 0 ${ rhythmDiv * 2} px;
  margin - bottom: ${ props => props.marginBottom || rhythmDiv * 7} px;
`;

const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;
class MembersListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachersFilterWith: "",
      studentsFilterWith: "",
      addInstructorDialogBoxState: false
    };
  }

  componentWillMount() {
    this.studentsData(this.props);
  }

  studentsData = (props) => {
    let studentsIds = [];
    let purchaseIds = [];
    const { classData } = props;
    let {classTypeId} = classData[0] || {};
    if (classData) {
      get(classData[0], 'students', []).map((obj, index) => {
        studentsIds.push(obj.userId);
        purchaseIds.push(obj.purchaseId);
      })
      if (!isEmpty(studentsIds)) {
        Meteor.call('user.getUsersFromIds', studentsIds,classTypeId, (err, res) => {
          if (res) {
            this.setState({ studentsData: res });
          }
        })
      }
      if (!isEmpty(purchaseIds)) {
        Meteor.call("purchases.getPackagesFromPurchaseIds", purchaseIds, (err, res) => {
          if (res)
            this.setState({ purchaseData: res });
        });
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }
  componentWillReceiveProps(nextProps, prevProps) {

    this.studentsData(nextProps);
  }
  updateClass = (filter, status, purchaseData, popUp) => {
    let { packageType, noClasses, _id, packageName, monthlyAttendance } = purchaseData || {};
    let condition = 0, inc = 0;
    if (packageType == 'CP') {
      condition = noClasses;
    } else if (packageType == 'MP') {
      condition = get(monthlyAttendance, 'noClasses', 0);
    }
    if (status == 'checkIn') {
      inc = -1;
    }
    /*  */
    Meteor.call('purchase.manageAttendance', _id, packageType, inc, (err, res) => {
      if (condition <= 0) {
        condition = res;
      }
      if (condition > 0 || res == undefined) {
        this.setState({ isLoading: true });
        Meteor.call("classes.updateClassData", filter, status, _id, packageType, (err, res) => {
          if (res) {
            this.setState({ status: 'Sign In', isLoading: false });
            popUp.appear("success", {
              title: `Sign in successfully`,
              content: `You have been successfully ${status == 'signIn' ? 'Sign In' : status == 'checkIn' ? 'Check In' : 'Sign Out'}.`,
              RenderActions: (<ButtonWrapper>
                <FormGhostButton
                  label={'Ok'}
                  onClick={() => {
                    this.setState({ status: status == 'signIn' ? 'Sign Out' : 'Sign In' })
                  }}
                  applyClose
                />
              </ButtonWrapper>)
            }, true);
          }
        })
      }
      else {
        popUp.appear("alert", {
          title: `Caution`,
          content: `You have ${condition} classes left of package ${packageName}. Sorry you can't Sign in. Please renew your package.`,
          RenderActions: (<ButtonWrapper>
            {this.cancelSignIn()}
            {this.signInAndPurchaseLater(filter, status, popUp)}
            {this.purchaseNowButton()}
          </ButtonWrapper>)
        }, true);
      }

    });



  }
  purchaseNowButton = (packagesRequired) => (
    <FormGhostButton
      label={'Purchase Now'}
      onClick={() => { this.setState({ classTypePackages: true, packagesRequired }) }}
      applyClose
    />
  )
  cancelSignIn = () => (
    <FormGhostButton
      label={'Cancel Sign In'}
      onClick={() => { }}
      applyClose
    />
  )
  signInAndPurchaseLater = (filter, status, popUp) => (
    <FormGhostButton
      label={'Sign In And Purchase Later'}
      onClick={() => { this.handleSIgnInAndPurchaseLater(filter, status, popUp) }}
      applyClose
    />
  )
  handleClassUpdate = (filter, status, popUp) => {
    Meteor.call('classPricing.signInHandler', filter, (err, res) => {
      let purchased = get(res, 'purchased', []);
      let epStatus = get(res, "epStatus", false);
      let pos = -1;
      if (status == 'signOut') {
        let { students } = filter, purchaseId, purchaseData;
        if (!isEmpty(students) && !isEmpty(purchased)) {
          students.map((obj) => {
            if (obj.userId == filter.userId ? filter.userId : Meteor.userId()) {
              purchaseId = obj.purchaseId;
            }
          })
          purchased.map((obj) => {
            if (obj._id == purchaseId) {
              purchaseData = obj;
            }
          })
          this.updateClass(filter, status, purchaseData, popUp);
        }
        return;

      }
      if (!epStatus) {
        this.purchaseEnrollmentFirst(popUp);
        return;
      }
      if (epStatus && !isEmpty(purchased)) {
        purchased.map((obj, index) => {
          if (obj.noClasses == null && obj.packageType == 'MP') {
            pos = index;
          }
        })
        if (purchased.length == 1) {
          let data = {};
          data = {
            popUp,
            title: 'Confirmation',
            type: 'inform',
            content: <div>This class is covered by <b>{purchased[0].packageName}</b>.</div>,
            buttons: [{ label: 'Cancel', onClick: () => { }, greyColor: true }, { label: 'Confirm Check-In', onClick: () => { this.updateClass(filter, status, purchased[0], popUp) } }]
          }
          confirmationDialog(data);
          return;
        }
        if (pos != -1) {
          let data = {};
          data = {
            popUp,
            title: 'Confirmation',
            type: 'inform',
            content: <div>This class is covered by <b>{purchased[pos].packageName}</b>.</div>,
            buttons: [{ label: 'Cancel', onClick: () => { }, greyColor: true }, { label: 'Confirm Check-In', onClick: () => { this.updateClass(filter, status, purchased[pos], popUp) } }]
          }
          confirmationDialog(data);
          return;
        }

        else {
          popUp.appear("inform", {
            title: `Confirmation`,
            content: `You have the followings packages. Please select one from which you are going to use.`,
            RenderActions: (<ButtonWrapper>
              {purchased.map((obj) =>
                <FormGhostButton
                  label={capitalizeString(`Sign in with ${obj.packageName}`)}
                  onClick={() => { this.updateClass(filter, status, obj, popUp) }}
                  applyClose
                />
              )}
            </ButtonWrapper>)
          }, true);
        }
      }
      else if (status == 'checkIn') {
        popUp.appear("alert", { title: "Alert", content: "Oops user don't have any package. Please use Accept payment button to accept payment and send link or else ask user to purchase one itself." });
      }
      else {
        let packageType, packagesRequired, content, title;
        if (!epStatus) {
          packageType = ' Enrollment package ';
          packagesRequired = 'enrollment';
          title = 'Enrollment Fee Required';
          content = 'This class requires an enrollment fee and the fee for the class itself. You can purchase the enrollment fee here, and afterward, you will be shown packages available for this class type.';
        } else {
          packageType = ' Class Fees Due ';
          packagesRequired = 'perClassAndMonthly';
          title = `No ${packageType} Purchased Yet.`
          content = `You do not have any active Per Class or Monthly Packages which cover this class type. You can purchase one here.`;
        }
        popUp.appear("inform", {
          title,
          content,
          RenderActions: (<ButtonWrapper>
            {this.cancelSignIn()}
            {this.signInAndPurchaseLater(filter, status, popUp)}
            {this.purchaseNowButton(packagesRequired)}
          </ButtonWrapper>)
        }, true);
      }
    })
  }
  handleSIgnInAndPurchaseLater = (filter, status, popUp) => {
    Meteor.call("classes.updateClassData", filter, status, null, null, (err, res) => {
      if (res) {
        this.setState({ status: 'Sign In', isLoading: false });
        popUp.appear("success", {
          title: `${this.state.status} successfully`,
          content: `You have been successfully ${status == 'signIn' ? 'Sign In' : 'Sign Out'}.`,
          RenderActions: (<ButtonWrapper>
            <FormGhostButton
              label={'Ok'}
              onClick={() => {
                this.setState({ status: status == 'signIn' ? 'Sign Out' : 'Sign In' })
              }}
              applyClose
            />
          </ButtonWrapper>)
        }, true);
      }
    })
  }
  handleSignIn = (e, userId, status = 'signIn') => {
    e && e.preventDefault();
    const { popUp, classData } = this.props;
    let classDetails = classData[0];
    if (userId) {
      classDetails.userId = userId;
    }
    this.handleClassUpdate(classDetails, status, popUp)
  }
  handleAddInstructorDialogBoxState = (dialogBoxState, text) => () => {
    this.setState(state => {
      return {
        ...state,
        addInstructorDialogBoxState: dialogBoxState,
        text
      };
    });
  };
  purchaseEnrollmentFirst = (popUp) => {
    popUp.appear("alert", { title: "Alert", content: "Please purchase the enrollment package First. Before purchasing monthly and per class packages. " });
  }
  handleSearchChange = type => e => {
    const value = e.target.value;
    this.setState(state => {
      return {
        ...state,
        [type]: value
      };
    });
  };

  getParticularEntityFromMembersList = entityType => {
    const { membersList } = this.props;
    const entities = membersList.filter(member => {
      if (typeof entityType == "string") return member.type == entityType;
      else return entityType.indexOf(member.type) !== -1;
    });
    return entities;
  };
  getPurchaseData = _id => {
    Meteor.call("purchase.getDataFromPurchaseId", _id, (err, res) => {
      this.setState({ purchaseData: res });
    });
  }

  studentsListMaker = (studentsData, classData, purchaseData) => {
    let studentStatus = classData && classData[0] ? classData[0].students : [];
    studentsData && studentsData.map((obj, index) => {
      studentStatus.map((obj1, index2) => {
        if (obj1.userId == obj._id) {
          {
            obj.status = get(obj1, "status", null);
            obj.purchaseId = get(obj1, "purchaseId", null);
          }
          !isEmpty(purchaseData) && purchaseData.map((purchaseRec) => {
            if (purchaseRec._id == obj1.purchaseId) {
              obj.purchaseData = purchaseRec;
            }
          })

        }
      })
    })
    return studentsData;
  }
  getStatusInfo = status => {
    if (status == 'signIn') {
      return 'Signed In';
    } else if (status == 'signOut') {
      return 'Singed Out';
    }
    else if (status == 'checkIn') {
      return 'Checked In';
    }
    else if (status == 'checkOut') {
      return 'Checked Out';
    }
  };

  updateStatus = (n, props) => {
    let { status, popUp, purchaseId, classData } = props;
    let { scheduled_date } = classData && classData[0] || {};
    let inc = 0, packageType;
    if (n == 1) {
      if (status == 'signIn' || status == 'checkOut') {
        inc = -1;
        status = 'checkIn';
      }
      else if (status == 'checkIn') {
        inc = 1;
        status = 'checkOut';
      }
    }
    else {
      if (status == 'signIn' || status == 'checkIn') {
        inc = 1;
        status = 'signOut';
      }
    }
    if (status == 'checkIn' && scheduled_date >= new Date()) {
      let data = {};
      data = {
        popUp,
        title: 'Oops',
        type: 'alert',
        content: <div>You can't control future classes.</div>,
        buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
      }
      confirmationDialog(data);
      return;
    }
    if (!purchaseId) {
      this.handleSignIn(null, props._id, status);
      return;
    }
    let filter = props.classData[0];
    filter.userId = props._id;
    props.classData[0].students.map((obj) => {
      if (obj.userId == props._id) {
        purchaseId = obj.purchaseId;
        packageType = obj.packageType;
      }
    })
    Meteor.call("classes.updateClassData", filter, status, purchaseId, packageType, (err, res) => {
      if (res) {
        Meteor.call('purchase.manageAttendance', purchaseId, packageType, inc);
        this.setState({})
        popUp.appear("success", {
          title: `Successfully`,
          content: `${this.getStatusInfo(status)} Performed Successfully.`,
          RenderActions: (<ButtonWrapper>
            <FormGhostButton
              label={'Ok'}
              onClick={() => { }}
              applyClose
            />
          </ButtonWrapper>)
        }, true);
      }
    })
  }
  handleDialogBoxState = (dialogState, currentProps) => {
    this.setState(state => {
      return {
        ...state,
        buyPackagesBoxState: dialogState,
        currentProps
      };
    });
  };
  closeClassTypePackages = () => {
    this.setState({ classTypePackages: false });
  }
  sendLinkConfirmation = (props, packageId = null, packageType = null) => {
    let { popUp } = props;
    popUp.appear("inform", {
      title: "Confirmation",
      content: "Do you really want to send a package link to this student.",
      onAffirmationButtonClick: () => { this.sendLink(props, packageId = null, packageType = null) },
      defaultButtons: true,
    }, true)
  }
  sendLink = (props, packageId = null, packageType = null) => {
    try {
      let userId, classesId, valid, data = {}, schoolName, className, schoolId;
      let { popUp } = props;
      this.props.toggleIsBusy();
      userId = props._id;
      classesId = props.classData[0]._id;
      valid = true;
      userName = get(props.profile, "firstName", get(props.profile, "name", get(props.profile, "lastName", "Old Data")));
      userEmail = get(props.emails[0], 'address', null);
      schoolName = props.schoolName;
      className = props.classTypeName;
      schoolId = props.schoolId;
      data = { userId, packageId, classesId, valid, userEmail, userName, schoolName, className, schoolId, packageType }
      Meteor.call("packageRequest.addRecord", data, (err, res) => {
        this.props.toggleIsBusy();
        if (res && res.status) {
          this.successPopUp(popUp, userName, null, props)
        }
        else if (res && !res.status) {
          data.link = `${Meteor.absoluteUrl() + 'purchasePackage/' + res.record._id}`;
          this.confirmationPopUp(popUp, data);
        }
      })
    } catch (error) {
      console.log("​sendLink error", error)
    }

  }
  successPopUp = (popUp, userName, title, props) => {
    popUp.appear(
      'success',
      {
        title: 'Success',
        content: title ? title : `Email with purchase link send to ${userName} successfully.`,
        RenderActions: (
          <ButtonWrapper>
            <FormGhostButton
              label={'Ok'}
              applyClose
              onClick={() => { this.handleDialogBoxState(false) }}
            />
          </ButtonWrapper>
        )
      },
      true
    );
  }
  confirmationPopUp = (popUp, data) => {
    popUp.appear(
      'inform',
      {
        title: 'Confirmation',
        content: `An email is already sent to ${data.userName}.Do you want to send the email again.`,
        RenderActions: (
          <ButtonWrapper>
            <FormGhostButton
              label={'Cancel'}
              applyClose
            />
            <FormGhostButton
              label={'Yes'}
              onClick={() => {
                this.sendEmailAgain(data);
                this.successPopUp(popUp, data.userName);
              }}
              applyClose
            />
          </ButtonWrapper>
        )
      },
      true
    );
  }
  sendEmailAgain = (data) => {
    Meteor.call("packageRequest.sendPurchaseRequest", data);
  }
  acceptPaymentConfirmation = (packageData, props, paymentMethod) => {
    let { popUp } = props;
    popUp.appear("inform", {
      title: "Confirmation",
      content: "Do you really want to confirm the payment.",
      onAffirmationButtonClick: () => { this.acceptPayment(packageData, props, paymentMethod) },
      defaultButtons: true,
    }, true)
  }
  acceptPayment = (packageData, props, paymentMethod) => {
    this.props.toggleIsBusy();
    let userId, packageId, packageType, schoolId, data, noClasses, packageName, planId = null;
    let { popUp, classData } = props;
    userId = props._id;
    packageId = get(packageData, '_id', null);
    packageType = get(packageData, 'packageType', null);
    schoolId = props.schoolId;
    noClasses = get(packageData, 'noClasses', 0);
    packageName = get(packageData, 'name', get(packageData, 'packageName', 'packageName'));
    if (packageType == 'MP' && !isEmpty(packageData.pymtDetails)) {
      planId = get(packageData.pymtDetails[0], 'planId', null);
    }
    data = { userId, packageId, schoolId, packageType, paymentMethod, noClasses, packageName, planId };
    let classDetails = classData[0];
    classDetails.userId = userId;
    Meteor.call('classPricing.signInHandler', classDetails, (err, res) => {
      let epStatus = get(res, "epStatus", false);
      if (epStatus || packageType == 'EP') {
        Meteor.call('stripe.handleOtherPaymentMethods', data, (err, res) => {
          this.props.toggleIsBusy();
          props.onAcceptPaymentClick(false);
          let title = 'Package Purchased Successfully';
          if (packageType != 'EP')
            this.updateStatus(1, props)
          else
            this.successPopUp(popUp, 'prototype', title)

        })
      } else {
        this.props.toggleIsBusy();
        this.purchaseEnrollmentFirst(popUp);
      }
    })
  }
  render() {
    const { studentsList, instructorsList, currentView, classData, instructorsData, popUp, instructorsIds, schoolId, params, schoolName, classTypeName, toggleIsBusy } = this.props;
    const { addInstructorDialogBoxState, studentsData, text, classTypePackages, userId, purchaseData, packagesRequired, buyPackagesBoxState, currentProps } = this.state;
    // const currentView =
    //   location.pathname === "/classdetails-student"
    //     ? "studentsView"
    //     : "instructorsView";
    let notification = true, classTypeId;
    !isEmpty(classData) && classData[0].students && classData[0].students.map((obj) => {
      classTypeId = get(classData[0], "classTypeId", null);
      if (obj.userId == Meteor.userId()) {
        notification = !obj.purchaseId ? true : false;
      }
    })

    return (
      <Fragment>
        {buyPackagesBoxState && (
          <BuyPackagesDialogBox
            classTypeId={classTypeId}
            open={buyPackagesBoxState}
            onModalClose={() => { this.handleDialogBoxState(false) }}
            onSendLinkClick={this.sendLinkConfirmation}
            currentProps={currentProps}
            acceptPayment={this.acceptPaymentConfirmation}
          />
        )}
        {addInstructorDialogBoxState && (
          <AddInstructorDialogBox
            open={addInstructorDialogBoxState}
            onModalClose={this.handleAddInstructorDialogBoxState(false)}
            classData={classData}
            popUp={popUp}
            schoolId={schoolId}
            instructorsIds={instructorsIds}
            text={text}
          />
        )}
        {notification &&
          currentView === "studentsView" && (
            <Notification
              notificationContent="You do not have any packages that will cover this class."
              bgColor={danger}
              buttonLabel="Purchase Classes"
              onButtonClick={() => { this.setState({ classTypePackages: true }) }}
            />
          )}
        {classTypePackages && <ClassTypePackages
          schoolId={schoolId}
          open={classTypePackages}
          onClose={() => { this.setState({ classTypePackages: false }) }}
          params={params}
          classTypeId={get(classData[0], 'classTypeId', null)}
          userId={userId}
          packagesRequired={packagesRequired}
          handleSignIn={this.handleSignIn}
          fromSignFunctionality
          closeClassTypePackages={this.closeClassTypePackages}
        />}
        <MembersList
          viewType={currentView}
          onSearchChange={this.handleSearchChange("teachersFilterWith")}
          data={instructorsData}
          entityType={"teachers"}
          searchedValue={this.state.teachersFilterWith}
          onAddIconClick={this.handleAddInstructorDialogBoxState(true, "Instructor")}
          classData={classData}
          popUp={popUp}
          instructorsIds={instructorsIds}
          addInstructor

        />
        <MembersList
          viewType={currentView}
          searchedValue={this.state.studentsFilterWith}
          onSearchChange={this.handleSearchChange("studentsFilterWith")}
          data={this.studentsListMaker(studentsData, classData, purchaseData)}
          entityType={"students"}
          searchedValue={this.state.studentsFilterWith}
          classData={classData}
          popUp={popUp}
          instructorsIds={instructorsIds}
          onAddIconClick={this.handleAddInstructorDialogBoxState(true, "Student")}
          addStudent
          onViewStudentClick={(userId) => { this.setState({ classTypePackages: true, userId }) }}
          params={params}
          onJoinClassClick={this.handleSignIn}
          schoolName={schoolName}
          classTypeName={classTypeName}
          toggleIsBusy={toggleIsBusy}
          schoolId={schoolId}
          onAcceptPaymentClick={this.handleDialogBoxState}
          buyPackagesBoxState={buyPackagesBoxState}
          currentProps={currentProps}
          updateStatus={this.updateStatus}
        />
      </Fragment>
    );
  }
}

MembersListContainer.propTypes = {
  data: PropTypes.object,
  membersList: PropTypes.array
};

MembersListContainer.defaultProps = {
  membersList: membersList
};

export default MembersListContainer;