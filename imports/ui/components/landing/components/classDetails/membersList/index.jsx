import React, { Component, Fragment } from "react";
import { isEmpty, get } from 'lodash';
import PropTypes from "prop-types";
import styled from "styled-components";

import { capitalizeString } from '/imports/util';

import { membersList } from "/imports/ui/components/landing/constants/classDetails";
import { BuyPackagesDialogBox, AddInstructorDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';

import { rhythmDiv, danger } from '/imports/ui/components/landing/components/jss/helpers.js';
import MembersList from "./presentational/MembersList.jsx";

const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
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
    if (classData) {
      get(classData[0], 'students', []).map((obj, index) => {
        studentsIds.push(obj.userId);
        purchaseIds.push(obj.purchaseId);
      })
      if (!isEmpty(studentsIds)) {
        Meteor.call('user.getUsersFromIds', studentsIds, (err, res) => {
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
  componentWillReceiveProps(nextProps) {
    this.studentsData(nextProps);
  }
  updateClass = (filter, status, purchaseData, popUp) => {
    let { packageType, noClasses, _id, packageName, monthlyAttendance } = purchaseData;
    let condition = 0;
    if (packageType == 'CP') {
      condition = noClasses;
    } else if (packageType == 'MP') {
      condition = get(monthlyAttendance, 'noClasses', 0);
    }

    Meteor.call('purchase.manageAttendance', _id, packageType, 0, (err, res) => {

      if (condition == 0 && packageType == 'MP' && res) {
        condition = res;
      }
      if (condition > 0) {
        this.setState({ isLoading: true });
        Meteor.call("classes.updateClassData", filter, status, _id, packageType, (err, res) => {
          if (res) {
            this.setState({ status: 'Sign In', isLoading: false });
            popUp.appear("success", {
              title: `Sign in successfully`,
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
      else {
        popUp.appear("alert", {
          title: `Caution`,
          content: `You have ${condition} classes left of package ${packageName}. Sorry you can't Sign in. Please renew your package.`,
          RenderActions: (<ButtonWrapper>
            {this.purchaseLaterButton()}
            {this.purchaseNowButton()}
          </ButtonWrapper>)
        }, true);
      }

    });



  }
  purchaseNowButton = () => (
    <FormGhostButton
      label={'Purchase Now'}
      onClick={() => { this.setState({ classTypePackages: true }) }}
      applyClose
    />
  )
  purchaseLaterButton = () => (
    <FormGhostButton
      label={'Purchase Later'}
      onClick={() => { }}
      applyClose
    />
  )
  handleClassUpdate = (filter, status, popUp) => {
    Meteor.call('classPricing.signInHandler', filter, (err, res) => {
      let purchased = get(res, 'purchased', []);
      let epStatus = get(res, "epStatus", false);
      if (epStatus && !isEmpty(purchased)) {
        popUp.appear("inform", {
          title: `Confirmation`,
          content: `You have the followings packages. Please select one from which you are going to use.`,
          RenderActions: (<ButtonWrapper>
            {purchased.map((obj) =>
              <FormGhostButton
                label={capitalizeString(obj.packageName)}
                onClick={() => { this.updateClass(filter, status, obj, popUp) }}
                applyClose
              />
            )}
          </ButtonWrapper>)
        }, true);
      }
      else {
        let packageType = 'Package';
        popUp.appear("inform", {
          title: `No ${packageType} Purchased Yet.`,
          content: `You haven't purchased any ${packageType} please purchase one first. `,
          RenderActions: (<ButtonWrapper>
            {this.purchaseLaterButton()}
            {this.purchaseNowButton()}
          </ButtonWrapper>)
        }, true);
      }
    })
  }
  handleSignIn = (userId, status = 'signIn') => {
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
    // console.group("entities");
    // console.info(entities);
    // console.groupEnd();
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
  render() {
    const { studentsList, instructorsList, currentView, classData, instructorsData, popUp, instructorsIds, schoolId, params, schoolName, classTypeName, toggleIsBusy } = this.props;
    const { addInstructorDialogBoxState, studentsData, text, classTypePackages, userId, purchaseData } = this.state;
    // console.log(currentView, "From inside membersList");
    // const currentView =
    //   location.pathname === "/classdetails-student"
    //     ? "studentsView"
    //     : "instructorsView";
    let notification = true;
    !isEmpty(classData) && classData[0].students && classData[0].students.map((obj) => {
      if (obj.userId == Meteor.userId()) {
        notification = !obj.purchaseId ? true : false;
      }
    })
    return (
      <Fragment>
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
        {classTypePackages && <BuyPackagesDialogBox
          schoolId={schoolId}
          open={classTypePackages}
          onClose={() => { this.setState({ classTypePackages: false }) }}
          params={params}
          classTypeId={get(classData[0], 'classTypeId', null)}
          userId={userId}
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
