import { get, isEmpty } from 'lodash';
import Assignment_turned_in from 'material-ui-icons/AssignmentTurnedIn';
import ClassIcon from 'material-ui-icons/Class';
import CloseIcon from 'material-ui-icons/Close';
import UpdateClassTimeIcon from 'material-ui-icons/Update';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import React from "react";
import { browserHistory, Link } from "react-router";
import styled from "styled-components";
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import SkillshapePopover from "/imports/ui/components/landing/components/popovers/SkillshapePopover";
import { ContainerLoader } from "/imports/ui/loading/container";
import ClassDetailModal from "/imports/ui/modal/classDetailModal";
import { capitalizeString, getUserFullName } from '/imports/util';
import ThinkingAboutAttending from "/imports/ui/components/landing/components/dialogs/ThinkingAboutAttending";

import ClassTypePackages from '/imports/ui/components/landing/components/dialogs/classTypePackages.jsx';
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;

const SCHOOL_VIEW = 'SchoolView';

const styles = {
  listItemIcon: {
    marginRight: 0
  }
}

const PopoverListItemIcon = withStyles(styles)(({ classes, children }) => (
  <ListItemIcon classes={{ root: classes.listItemIcon }}>
    {children}
  </ListItemIcon>
))

export default class MyCalender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: this._checkIfAdmin(),
      school: this.props.schoolData,
      status: 'Sign In'
    };
  }

  componentWillMount() {

  }

  _checkIfAdmin = () => {
    const { schoolData, currentUser, classTimesData, eventData } = this.props;
    let admins = get(schoolData, 'admins', [])
    const currentUserId = get(currentUser, "_id", 0);
    if (admins.indexOf(currentUserId) !== -1) {
      return true;
    }
    return false;
  }

  _navigateTo = (link) => (e) => {
    e.preventDefault();
    browserHistory.push(link);
  }

  setDate = (startDate, endDate) => this.setState({ startDate, endDate });
  getStudentStatus = (filter) => {
    Meteor.call("classes.getClassData", filter, (err, res) => {
      if (res) {
        res.students && res.students.map((obj, index) => {
          if (obj.userId == Meteor.userId()) {
            if (obj.status == 'signIn' || obj.status == 'checkIn')
              this.setState({ status: 'Sign Out' });
          }
        })
      }
      this.setState({ classDetails: res, filter: filter });
    })
  }
  handleEventModal = (isOpen, eventData, clickedDate, jsEvent) => {
    let newState = { classDetailModal: false, status: 'Sign In' }
    const { routeName, classTimesData, classTypeData, schoolData } = this.props
    const originalEvent  = get(jsEvent,"originalEvent",'');
    classTimesData && classTimesData.map((obj)=>{
      if(obj._id== eventData && eventData.classTimeId){
        newState.classTimes = obj;
      }
    })
    classTypeData && classTypeData.map((obj) => {
      if (obj._id == eventData && eventData.classTypeId) {
        newState.classType = obj;
      }
    })
    this.setState(state => {
      return {
        ...state,
        ...newState
      }
    })
    this.setDate()
    const { schoolId, classTypeId, classTimeId, start,startDate,title,eventEndTime,eventStartTime,durationAndTimeunits } = eventData;
    let eventDataForClass = {startDate:new Date(startDate),title,eventEndTime,eventStartTime,durationAndTimeunits};
    let filter = { schoolId, classTypeId, classTimeId, scheduled_date: new Date(start),eventData:eventDataForClass };
    this.getStudentStatus(filter);
      Meteor.call("school.getMySchool", schoolId, (err, res) => {
        if (res) {
          let admins = get(res, 'admins', []);
          if (admins.indexOf(Meteor.userId()) !== -1) {
            this.setState({ isAdmin: true, school: res })
          } else {
            this.setState({ isAdmin: false, school: res })
          }
        }
      })
   
    Meteor.call("location.getLocsFromIds", [eventData.locationId], (err, res) => {
      if (res) {
        this.setState({ location: res[0] })
      }
    })

    this.setState(state => {
      return {
        ...state,
        isOpen,
        eventData,
        clickedDate,
        positionLeft: originalEvent.clientX,
        positionTop: originalEvent.clientY,
        anchorEl: jsEvent.currentTarget
      }
    });

    // if (routeName === SCHOOL_VIEW) {
    //   this.setState(state => {
    //     return {
    //       ...state,
    //       isOpen,
    //       eventData,
    //       clickedDate,
    //       positionLeft: originalEvent.clientX,
    //       positionTop: originalEvent.clientY,
    //       anchorEl: jsEvent.currentTarget
    //     }
    //   });
    // } else {
    //   this.setState({
    //     isOpen,
    //     eventData,
    //     clickedDate,
    //   });
    // }
  };

  handlePopoverClose = () => {
    this.setState(state => {
      return {
        ...state,
        isOpen: false,
        eventData: null,
        clickedDate: null,
        positionLeft: 0,
        positionTop: 0,
        anchorEl: null
      }
    })
  }

  handleModelState = (modelName, modelState) => () => {
    this.setState(state => {
      return {
        ...state,
        [modelName]: modelState
      }
    })
  }

  handleClassUpdate = (filter, status, popUp) => {
    Meteor.call('classPricing.signInHandler', filter, (err, res) => {
      let purchased = get(res, 'purchased', []);
      let epStatus = get(res, "epStatus", false);
      let pos = -1;
      if (status == 'signOut') {
        let { classDetails: { students } } = this.state, purchaseId, purchaseData;

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
        }
        this.updateClass(filter, status, purchaseData, popUp);
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
          //   title:'Confirmation',
          //   type:'inform',
          //   content: <div>This class is covered by <b>{purchased[0].packageName}</b>.</div>,
          //   buttons:[{label:'Cancel',onClick:()=>{},greyColor:true},{label:'Confirm Sign In',onClick:()=>{this.updateClass(filter,status,purchased[0],popUp)}}]
          // }
          // confirmationDialog(data);
          this.updateClass(filter, status, purchased[0], popUp)
          return;
        }
        if (pos != -1) {
          // let data = {};
          // data = {
          //   popUp,
          //   title:'Confirmation',
          //   type:'inform',
          //   content: <div>This class is covered by <b>{purchased[pos].packageName}</b>.</div>,
          //   buttons:[{label:'Cancel',onClick:()=>{},greyColor:true},{label:'Confirm Sign In',onClick:()=>{this.updateClass(filter,status,purchased[pos],popUp)}}]
          // }
          // confirmationDialog(data);
          this.updateClass(filter, status, purchased[pos], popUp)
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
      else {
        this.setState({thinkingAboutAttending:true,filter});
        // let packageType, packagesRequired, content, title;
        // if (!epStatus) {
        //   packageType = ' Enrollment package ';
        //   packagesRequired = 'enrollment';
        //   title = 'Enrollment Fee Required';
        //   content = 'This class requires an enrollment fee and the fee for the class itself. You can purchase the enrollment fee here, and afterward, you will be shown packages available for this class type.';
        // } else {
        //   packageType = ' Class Fees Due ';
        //   packagesRequired = 'perClassAndMonthly';
        //   title = `No ${packageType} Purchased Yet.`
        //   content = `You do not have any active Per Class or Monthly Packages which cover this class type. You can purchase one here.`;
        // }
        // popUp.appear("inform", {
        //   title,
        //   content,
        //   RenderActions: (<ButtonWrapper>
        //     {this.cancelSignIn()}
        //     {this.signInAndPurchaseLater(filter, status, popUp)}
        //     {this.purchaseNowButton(packagesRequired)}
        //   </ButtonWrapper>)
        // }, true);
      }
    })
  }

  updateClass = (filter, status, purchaseData, popUp) => {
    let { packageType, noClasses, _id, packageName, monthlyAttendance } = purchaseData || {};
    let condition = 0, inc = 0;
    if (packageType == 'CP') {
      condition = noClasses;
    } else if (packageType == 'MP') {
      condition = get(monthlyAttendance, 'noClasses', 0);
    }

    Meteor.call('purchase.manageAttendance', _id, packageType, inc, (err, res) => {
      if (condition <= 0) {
        condition = res;
      }
      if (condition > 0 || res == undefined && !condition < 0 || !purchaseData) {
        this.setState({ isLoading: true });
        Meteor.call("classes.updateClassData", filter, status, _id, packageType, (err, res) => {
          if (res) {
            this.setState({ status: 'Sign In', isLoading: false });
            popUp.appear("success", {
              title: `${this.state.status} successfully`,
              content: `You have been successfully ${status == 'signIn' ? 'Sign In' : 'Sign Out'}.`,
              RenderActions: (<ButtonWrapper>
                <FormGhostButton
                  label={'Ok'}
                  onClick={() => {
                    this.setState({ status: status == 'signIn' ? 'Sign Out' : 'Sign In' ,thinkingAboutAttending:false})
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
                this.setState({ status: status == 'signIn' ? 'Sign Out' : 'Sign In' ,thinkingAboutAttending:false})
              }}
              applyClose
            />
          </ButtonWrapper>)
        }, true);
      }
    })
  }
  handleSignIn = () => {
    const { popUp } = this.props;
    const { classDetails, filter, status } = this.state;

    if (status == "Sign In") {
      this.handleClassUpdate(classDetails ? classDetails : filter, 'signIn', popUp)
    }
    else {
      popUp.appear("inform", {
        title: "Confirmation",
        content: `You are currently signed in. Do you want to sign out?`,
        RenderActions: (<Div >
          <ButtonWrapper>
            <FormGhostButton
              label={'No'}
              onClick={() => {
              }}
              applyClose
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <FormGhostButton
              label={'Yes'}
              onClick={() => {
                this.handleClassUpdate(classDetails ? classDetails : filter, 'signOut', popUp)
              }}
              applyClose
            />
          </ButtonWrapper>
        </Div>)
      }, true);
    }
  }
 
  getStudentList = (route, status) => (
    <List>
      <ListItem button onClick={() => { this.setState({ classDetailModal: true }) }}>
        <PopoverListItemIcon>
          <UpdateClassTimeIcon />
        </PopoverListItemIcon>
        <ListItemText primary="View Class Time" />
      </ListItem>
        <ListItem button onClick={()=>{browserHistory.push(route)}}>
          <PopoverListItemIcon>
            <ClassIcon />
          </PopoverListItemIcon>
          <ListItemText primary="View Class Details" />
        </ListItem>
      <ListItem button onClick={this.handleSignIn}>
        <PopoverListItemIcon>
          <Assignment_turned_in />
        </PopoverListItemIcon>
        <ListItemText primary={status} />
      </ListItem>
      <ListItem button onClick={() => { this.setState({ isOpen: false }) }}>
        <PopoverListItemIcon>
          <CloseIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Close" />
      </ListItem>
    </List>
  )

  getAdminList = (route, status) => (
    <List>
      <ListItem button onClick={() => { this.setState({ classDetailModal: true }) }}>
        <PopoverListItemIcon>
          <UpdateClassTimeIcon />
        </PopoverListItemIcon>
        <ListItemText primary="View Class Time" />
      </ListItem>
        <ListItem button onClick={()=>{browserHistory.push(route)}}>
          <PopoverListItemIcon>
            <ClassIcon />
          </PopoverListItemIcon>
          <ListItemText primary="View Class Details" />
        </ListItem>
      <ListItem button onClick={this.handleSignIn}>
        <PopoverListItemIcon>
          <Assignment_turned_in />
        </PopoverListItemIcon>
        <ListItemText primary={status} />
      </ListItem>
      <ListItem button onClick={() => { this.setState({ isOpen: false }) }}>
        <PopoverListItemIcon>
          <CloseIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Close" />
      </ListItem>
    </List>
  )
  closeClassTypePackages = () => {
    this.setState({ classTypePackages: false });
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
    const { isOpen,
      eventData,
      clickedDate,
      anchorEl,
      positionLeft,
      positionTop,
      isAdmin,
      classDetailModal,
      status,
      isLoading,
      classTypePackages,
      filter,
      classDetails,
      packagesRequired,
      thinkingAboutAttending
    } = this.state;
    const {schoolId,classTypeName} = eventData || {};
    const { routeName, schoolData ,params,popUp} = this.props;
    let name, _id;
    if (!isEmpty(schoolData)) {
      name = get(schoolData, 'name', 'School Name');
      _id = get(schoolData, '_id', null);
    }
   const { classTypeId,_id:classId} = classDetails || {};
   let route = `/classDetails/${classId}`;
    return (
      <div>
        <FullCalendarContainer
          subscriptionName="ClassSchedule"
          setDate={this.setDate}
          showEventModal={this.handleEventModal}
          {...this.state}
          {...this.props}
          manageMyCalendar={true}
        />
        {isLoading && <ContainerLoader />}
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
            name={classTypeName}
            params={params}
            classTypeId={classTypeId}
            handleSignIn={()=>{this.handleSIgnInAndPurchaseLater(filter,'signIn',popUp)}}
          />)}

        {classDetailModal && (
          <ClassDetailModal
            eventData={eventData}
            showModal={classDetailModal}
            closeEventModal={this.handleModelState('classDetailModal', false)}
            classInterestData={this.props.classInterestData}
            onJoinClassButtonClick={this.props.onJoinClassButtonClick}
            clickedDate={clickedDate}
            routeName={this.props.route && this.props.route.name}
            type={this.props.type}
            params={this.props.params}
            schoolName={name}
          />
        )}
        {classTypePackages && <ClassTypePackages
          schoolId={_id}
          open={classTypePackages}
          onClose={() => { this.setState({ classTypePackages: false }) }}
          params={this.props.params}
          classTypeId={classTypeId}
          userId={Meteor.userId()}
          packagesRequired={packagesRequired}
          handleSignIn={this.handleSignIn}
          fromSignFunctionality
          closeClassTypePackages={this.closeClassTypePackages}
          schoolData={schoolData}
        />}
        {isOpen && (
          <SkillshapePopover
            anchorEl={anchorEl}
            positionTop={positionTop}
            positionLeft={positionLeft}
            anchorReference={'anchorPosition'}
            isOpen={isOpen}
            onClose={this.handlePopoverClose}
          >
            {isAdmin ? this.getAdminList(route, status) : this.getStudentList(route, status)}
          </SkillshapePopover>
        )}
      </div>
    );
  }
}
/*
{max,duration,current,startDate}
*/