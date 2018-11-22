import React from "react";
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import ClassIcon from 'material-ui-icons/Class';
import AvTimerIcon from 'material-ui-icons/AvTimer';
import CancelIcon from 'material-ui-icons/Cancel';
import CloseIcon from 'material-ui-icons/Close';
import UpdateClassTimeIcon from 'material-ui-icons/Update';
import EmailIcon from 'material-ui-icons/Email';
import { browserHistory, Link } from "react-router";
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar";
import ClassDetailModal from "/imports/ui/modal/classDetailModal";
import SkillshapePopover from "/imports/ui/components/landing/components/popovers/SkillshapePopover";
import DropDownMenu from '/imports/ui/components/landing/components/form/DropDownMenu.jsx';
import { get, isEmpty } from 'lodash';
import classDetailModal from "../../../modal/classDetailModal";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import styled from "styled-components";
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;
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
      this.setState({ classDetails: res, filter: filter });
    })
  }
  handleEventModal = (isOpen, eventData, clickedDate, jsEvent) => {
    this.setState({ classDetailModal: false });
    const { routeName, classTimesData, classTypeData, schoolData } = this.props
    const { originalEvent } = jsEvent;
    classTimesData && classTimesData.map((obj) => {
      if (obj._id == eventData.classTimeId) {
        this.setState({ classTimes: obj })
      }
    })
    classTypeData && classTypeData.map((obj) => {
      if (obj._id == eventData.classTypeId) {
        this.setState({ classType: obj })
      }
    })
    const { schoolId, classTypeId, classTimeId, start } = eventData;
    let filter = { schoolId, classTypeId, classTimeId, scheduled_date: new Date(eventData.start) };
    this.getStudentStatus(filter);
    if (isEmpty(schoolData)) {
      let schoolId = this.state.classTimes.schoolId;
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
    }
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
  updateClass = (filter, status, popUp) => {
    Meteor.call("classes.updateClassData", filter, status, (err, res) => {
      if (res) {
        this.setState({ status: 'Sign In' });
        popUp.appear("success", {
          title: `${this.state.status} successfully`,
          content: `You have been successfully ${this.state.status}.`,
          RenderActions: (<Div >
            <ClassTimeButton
              fullWidth
              label="Ok"
              noMarginBottom
              onClick={() => { }}
            />
          </Div>)
        }, true);
      }
    })
  }
  handleSignIn = () => {
    const { popUp } = this.props;
    const { classDetails, filter, status } = this.state;
    if (classDetails && classDetails.students) {
      classDetails.students.map((obj, index) => {
        if (obj.userId == Meteor.userId()) {
          if (obj.status == 'signIn')
            this.setState({ status: 'Sign Out' });
        }
      })
    }
    if (status == "Sign In") {
      popUp.appear("success", {
        title: "Confirmation",
        content: `You are going to sign in into this class.`,
        RenderActions: (<Div >
          <ClassTimeButton
            fullWidth
            label="No"
            noMarginBottom
            onClick={() => {
            }}
          />
          <ClassTimeButton
            fullWidth
            label="Yes"
            noMarginBottom
            onClick={() => {
              this.updateClass(classDetails ? classDetails : filter, 'signIn', popUp)
            }}
          />
        </Div>)
      }, true);
    }
    else {
      popUp.appear("inform", {
        title: "Confirmation",
        content: `You are already sign in. Do you want to sign out?`,
        RenderActions: (<Div >
          <ClassTimeButton
            fullWidth
            label="No"
            noMarginBottom
            onClick={() => {
            }}
          />
          <ClassTimeButton
            fullWidth
            label="Yes"
            noMarginBottom
            onClick={() => {
              this.updateClass(classDetails ? classDetails : filter, 'signOut', popUp)
            }}
          />
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
      <Link to={{ pathname: route, state: { props: this.props, state: this.state } }}>
        <ListItem button >
          <PopoverListItemIcon>
            <ClassIcon />
          </PopoverListItemIcon>
          <ListItemText primary="View Class Details" />
        </ListItem>
      </Link>
      <ListItem button onClick={this.handleSignIn}>
        <PopoverListItemIcon>
          <ClassIcon />
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
      <Link to={{ pathname: route, state: { props: this.props, state: this.state } }}>
        <ListItem button >
          <PopoverListItemIcon>
            <ClassIcon />
          </PopoverListItemIcon>
          <ListItemText primary="View Class Details" />
        </ListItem>
      </Link>
      <ListItem button onClick={this.handleSignIn}>
        <PopoverListItemIcon>
          <ClassIcon />
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

  render() {
    const { isOpen,
      eventData,
      clickedDate,
      anchorEl,
      positionLeft,
      positionTop,
      isAdmin,
      classDetailModal,
      status
    } = this.state;
    const { routeName } = this.props;
    let route = this.state.isAdmin ? '/classdetails-instructor' : '/classdetails-student';
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
        {classDetailModal && (
          <ClassDetailModal
            eventData={eventData}
            showModal={classDetailModal}
            closeEventModal={this.handleEventModal}
            classInterestData={this.props.classInterestData}
            onJoinClassButtonClick={this.props.onJoinClassButtonClick}
            clickedDate={clickedDate}
            routeName={this.props.route && this.props.route.name}
            type={this.props.type}
            params={this.props.params}
          />
        )}
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
