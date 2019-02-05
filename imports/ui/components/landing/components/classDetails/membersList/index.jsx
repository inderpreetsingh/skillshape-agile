import React, { Component, Fragment, } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythmDiv, panelColor } from '/imports/ui/components/landing/components/jss/helpers.js';
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
import { ContainerLoader } from "/imports/ui/loading/container";
import Pagination from "/imports/ui/componentHelpers/pagination";
import moment from 'moment';
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const ListWrapper = styled.div`  
  padding: 0 ${rhythmDiv * 2}px;
  margin-bottom: ${ props => props.marginBottom || rhythmDiv * 7}px;
`;
const PaginationWrapper = styled.div`
  background: ${panelColor};
`
const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;
class MembersListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachersFilterWith: "",
      studentsFilterWith: "",
      addInstructorDialogBoxState: false,
      notification: true,
      packagesRequired: 'enrollment',
      limit: 40,
      skip: 0,
      pageCount: 0,
      perPage: 40
    };
  }

  componentWillMount() {
    this.studentsData();
  }

  studentsData = () => {
    let studentsIds = [];
    let purchaseIds = [];
    const { classData, schoolId } = this.props;
    let { classTypeId } = classData && classData[0] || {};
    let filter = { classTypeId, userId: Meteor.userId() };
    Meteor.call("classPricing.signInHandler", filter, (err, res) => {
      if (!isEmpty(res)) {
        let { epStatus, purchased } = res;
        if (epStatus && !isEmpty(purchased)) {
          this.setState({ notification: false });
        }
        else if (!epStatus) {
          this.setState({ packagesRequired: 'enrollment' })
        }
        else {
          this.setState({ packagesRequired: 'perClassAndMonthly' })
        }
      }
    })
    if (classData) {
      get(classData[0], 'students', []).map((obj, index) => {
        studentsIds.push(obj.userId);
        purchaseIds.push(obj.purchaseId);
        this.setState({ pageCount: Math.ceil(studentsIds.length / this.state.limit) })
      })
      if (!isEmpty(studentsIds)) {
        let { limit, skip } = this.state;
        let limitAndSkip = { limit, skip }
        let data = { studentsIds, classTypeId, schoolId, classData, purchaseIds, limitAndSkip };
        Meteor.call('user.getUsersFromIds', data, (err, res) => {
          if (res) {
            this.setState({ studentsData: res, isBusy: false });
          }
        })
      }
      else {
        this.setState({ studentsData: [], isBusy: false });
      }
    }
  }
  changePageClick = (skip) => {
    this.setState({ skip: skip.skip, isBusy: true }, () => { this.studentsData(); });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.notes && nextState.notes != this.state.notes) {
      return false
    }
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }
  componentWillReceiveProps(nextProps, prevProps) {
    this.studentsData();
  }

  updateClass = (filter, status, purchaseData, popUp, packageConnected) => {
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
    this.setState({ isBusy: true });
    Meteor.call('purchase.manageAttendance', _id, packageType, inc, (err, res) => {
      if (condition <= 0) {
        condition = res;
      }
      let state = { isBusy: false }
      if (condition > 0 || res == undefined) {
        Meteor.call("classes.updateClassData", filter, status, _id, packageType, (err, res) => {
          if (res) {
            state.status = 'Sign In';
            let newStatus = `${status == 'signIn' ? 'Sign In' : status == 'checkIn' ? 'Check In' : 'Sign Out'}`
            popUp.appear("success", {
              title: packageConnected ? 'Package successfully purchased.' : `${newStatus} successfully`,
              content: packageConnected ? 'Your student can now attend class!' : `Student have been successfully ${newStatus}.`,
              RenderActions: (<ButtonWrapper>
                <FormGhostButton
                  label={'Ok'}
                  onClick={() => {
                    !packageConnected ? this.setState({ status: status == 'signIn' ? 'Sign Out' : 'Sign In' }) : this.setState({ buyPackagesBoxState: false })
                  }}
                  applyClose
                />
              </ButtonWrapper>)
            }, true);
          }
          this.setState({ ...state })
        })
      }
      else {
        this.setState({ ...state })
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
  handleClassUpdate = (filter, status, popUp, packageConnected) => {
		console.log('TCL: MembersListContainer -> handleClassUpdate -> filter, status, popUp, packageConnected', filter, status, popUp, packageConnected)
    Meteor.call('classPricing.signInHandler', filter, (err, res) => {
      let purchased = get(res, 'purchased', []);
      let epStatus = get(res, "epStatus", false);
      let pos = -1;
      if (status == 'signOut') {
        let { students } = filter, purchaseId, purchaseData = {};
        if (!isEmpty(students)) {
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
      if (!epStatus && status != 'signIn') {
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
          // let data = {};
          // data = {
          //   popUp,
          //   title: 'Confirmation',
          //   type: 'inform',
          //   content: <div>This class is covered by <b>{purchased[0].packageName}</b>.</div>,
          //   buttons: [{ label: 'Cancel', onClick: () => { }, greyColor: true }, { label: 'Confirm Check-In', onClick: () => { this.updateClass(filter, status, purchased[0], popUp,packageConnected) } }]
          // }
          // confirmationDialog(data);
          this.updateClass(filter, status, purchased[0], popUp, packageConnected)
          return;
        }
        if (pos != -1) {
          // let data = {};
          // data = {
          //   popUp,
          //   title: 'Confirmation',
          //   type: 'inform',
          //   content: <div>This class is covered by <b>{purchased[pos].packageName}</b>.</div>,
          //   buttons: [{ label: 'Cancel', onClick: () => { }, greyColor: true }, { label: 'Confirm Check-In', onClick: () => {  } }]
          // }
          // confirmationDialog(data);
          this.updateClass(filter, status, purchased[pos], popUp, packageConnected)
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
                  onClick={() => { this.updateClass(filter, status, obj, popUp, packageConnected) }}
                  applyClose
                />
              )}
            </ButtonWrapper>)
          }, true);
        }
      }
      else if (status == 'checkIn') {
        popUp.appear("alert", { title: "Alert", content: "Oops user don't have any package. Please use Accept payment button to accept payment and send link or else ask user to purchase one itself." });
        return;
      }
      else if (status == 'signIn') {
        this.updateClass(filter, status, {}, popUp);
        return;
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
        this.setState({ status: 'Sign In', isBusy: false });
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
  handleSignIn = (e, userId, status = 'signIn', packageConnected = false) => {
    e && e.preventDefault();
    const { popUp, classData } = this.props;
    let classDetails = classData[0];
    if (userId) {
      classDetails.userId = userId;
    }
    this.handleClassUpdate(classDetails, status, popUp, packageConnected)
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
		console.log('TCL: MembersListContainer -> updateStatus -> n, props', n, props)
    let { status, popUp, purchaseId, classData } = props;
    let { scheduled_date } = classData && classData[0] || {};
    let inc = 0, packageType, packageConnected = false;
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
    else if (n == 2) {
      inc = 0;
      status = 'signIn';
      packageConnected = true;
    }
    else {
      if (status == 'signIn' || status == 'checkIn') {
        if (status == 'checkIn') {
          inc = 1;
        }
        status = 'signOut';
      }
    }
    if (status == 'checkIn' && moment(scheduled_date).format('DD-MM-YYYY') > moment().format('DD-MM-YYYY')) {
      let data = {};
      data = {
        popUp,
        title: 'Oops',
        type: 'alert',
        content: <div>You can't control future classes. Instructor not allowed to auto check in students for future classes.</div>,
        buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
      }
      confirmationDialog(data);
      return;
    }
    if (!purchaseId) {
      this.handleSignIn(null, props._id, status, packageConnected);
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
  handleDialogBoxState = (dialogState, currentProps, packagesRequired) => {
    this.setState(state => {
      return {
        ...state,
        buyPackagesBoxState: dialogState,
        currentProps: currentProps ? currentProps : state.currentProps,
        packagesRequired
      };
    });
  };
  closeClassTypePackages = () => {
    this.setState({ classTypePackages: false });
  }
  setPackagesRequired = () => {
    this.setState({ packagesRequired: 'perClassAndMonthly' });
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
      this.toggleIsBusy();
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
        this.toggleIsBusy();
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
  successPopUp = (popUp, userName, title) => {
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
              onClick={() => {
                this.setPackagesRequired()
              }}
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
      content: "Do you really want to confirm the payment ?",
      onAffirmationButtonClick: () => { this.acceptPayment(packageData, props, paymentMethod) },
      defaultButtons: true,
    }, true)
  }

  acceptPayment = (packageData, props, paymentMethod) => {
    this.toggleIsBusy();
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
          this.toggleIsBusy();
          let title = 'Package Purchased Successfully';
          if (packageType != 'EP')
            this.updateStatus(2, props)
          else
            this.successPopUp(popUp, null, title);
        })
      } else {
        this.toggleIsBusy();
        this.purchaseEnrollmentFirst(popUp);
      }
    })
  }
  handleNoteChange = (doc_id) => {
    this.toggleIsBusy();
    if (!doc_id) {
      const { popUp } = this.props;
      let data = {};
      data = {
        popUp,
        title: 'Error',
        type: 'error',
        content: 'Old Data Please use new data.',
        buttons: [{ label: 'Ok', onClick: () => { } }]
      }
      confirmationDialog(data);
      return;
    }
    Meteor.call("schoolMemberDetails.editSchoolMemberDetails", { doc_id, doc: { adminNotes: this.state.notes } }, (err, res) => {
      this.toggleIsBusy();
      const { popUp } = this.props;
      let data = {};
      data = {
        popUp,
        title: 'Success',
        type: 'success',
        content: 'Note saved successfully',
        buttons: [{ label: 'Ok', onClick: () => { } }]
      }
      confirmationDialog(data);
    });
  }
  setNotes = (notes) => {
    this.setState({ notes });
  }
  toggleIsBusy = () => {
    this.setState({ isBusy: !this.state.isBusy });
  }
  render() {
    const { studentsList, instructorsList, currentView, classData, instructorsData, popUp, instructorsIds, schoolId, params, schoolName, classTypeName, schoolData } = this.props;
    const { addInstructorDialogBoxState, studentsData, text, classTypePackages, userId, purchaseData, packagesRequired, buyPackagesBoxState, currentProps, notification, isBusy } = this.state;
    // const currentView =
    //   location.pathname === "/classdetails-student"
    //     ? "studentsView"
    //     : "instructorsView";
    let classTypeId;
    !isEmpty(classData) && classData[0].students && classData[0].students.map((obj) => {
      classTypeId = get(classData[0], "classTypeId", null);
    })

    return (
      <Fragment>
        {isBusy && <ContainerLoader />}
        {buyPackagesBoxState && (
          <BuyPackagesDialogBox
            classTypeId={classTypeId}
            open={buyPackagesBoxState}
            onModalClose={() => { this.handleDialogBoxState(false) }}
            onSendLinkClick={this.sendLinkConfirmation}
            currentProps={currentProps}
            acceptPayment={this.acceptPaymentConfirmation}
            packagesRequired={packagesRequired}
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
              notificationContent={`You need to purchase ${packagesRequired == 'enrollment' ? "enrollment " : 'monthly/per class '}package first.`}
              bgColor={danger}
              buttonLabel="Purchase Package"
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
          schoolData={schoolData}
          setPackagesRequired={this.setPackagesRequired}
        />}
        <ListWrapper>

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
        </ListWrapper>
        <ListWrapper>

          <MembersList
            viewType={currentView}
            searchedValue={this.state.studentsFilterWith}
            onSearchChange={this.handleSearchChange("studentsFilterWith")}
            data={studentsData}
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
            toggleIsBusy={this.toggleIsBusy}
            schoolId={schoolId}
            onAcceptPaymentClick={this.handleDialogBoxState}
            buyPackagesBoxState={buyPackagesBoxState}
            currentProps={currentProps}
            updateStatus={this.updateStatus}
            handleNoteChange={this.handleNoteChange}
            setNotes={this.setNotes}
          />
        </ListWrapper>
        <PaginationWrapper>
          <Pagination
            style={{
              marginBottom: 0
            }}
            {...this.state}
            onChange={this.changePageClick}
          />
        </PaginationWrapper>
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