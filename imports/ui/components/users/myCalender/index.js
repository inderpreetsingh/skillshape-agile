import React from "react";
import { withStyles } from 'material-ui/styles';
import { browserHistory } from 'react-router';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import ClassIcon from 'material-ui-icons/Class';
import AvTimerIcon from 'material-ui-icons/AvTimer';
import CancelIcon from 'material-ui-icons/Cancel';
import CloseIcon from 'material-ui-icons/Close';
import UpdateClassTimeIcon from 'material-ui-icons/Update';
import EmailIcon from 'material-ui-icons/Email';

import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar";
import ClassDetailModal from "/imports/ui/modal/classDetailModal";
import SkillshapePopover from "/imports/ui/components/landing/components/popovers/SkillshapePopover";
import DropDownMenu from '/imports/ui/components/landing/components/form/DropDownMenu.jsx';

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
    };
  }

  _checkIfAdmin = () => {
    const { schoolData: { admins }, currentUser } = this.props;
    const currentUserId = currentUser._id;
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

  handleEventModal = (isOpen, eventData, clickedDate, jsEvent) => {
    const { routeName } = this.props
    const { originalEvent } = jsEvent;
    console.log(originalEvent, jsEvent.original, "____________");
    if (routeName === SCHOOL_VIEW) {
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
    } else {
      this.setState({
        isOpen,
        eventData,
        clickedDate,
      });
    }
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

  getStudentList = () => (
    <List>
      <ListItem button onClick={this._navigateTo('/classdetails-student')}>
        <PopoverListItemIcon>
          <ClassIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Class details" />
      </ListItem>
      <ListItem button>
        <PopoverListItemIcon>
          <AvTimerIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Class times" />
      </ListItem>
      {!Meteor.userId() && <ListItem button>
        <ListItemText primary="Sign in" />
      </ListItem>}
    </List>
  )

  getAdminList = () => (
    <List>
      <ListItem button>
        <PopoverListItemIcon>
          <CancelIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Cancel class" />
      </ListItem>
      <ListItem button>
        <PopoverListItemIcon>
          <CloseIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Close for the day" />
      </ListItem>
      <ListItem button>
        <PopoverListItemIcon>
          <UpdateClassTimeIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Change Class Time for Today" />
      </ListItem>
      <ListItem button>
        <PopoverListItemIcon>
          <EmailIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Email Attendencies" />
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
      isAdmin
    } = this.state;
    const { routeName } = this.props;
    console.log("MY CALENDAR STATE", anchorEl, "------")
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
        {isOpen && routeName !== SCHOOL_VIEW && (
          <ClassDetailModal
            eventData={eventData}
            showModal={isOpen}
            closeEventModal={this.handleEventModal}
            classInterestData={this.props.classInterestData}
            onJoinClassButtonClick={this.props.onJoinClassButtonClick}
            clickedDate={clickedDate}
            routeName={this.props.route && this.props.route.name}
            type={this.props.type}
            params={this.props.params}
          />
        )}
        {routeName === SCHOOL_VIEW && (
          <SkillshapePopover
            anchorEl={anchorEl}
            positionTop={positionTop}
            positionLeft={positionLeft}
            anchorReference={'anchorPosition'}
            isOpen={isOpen}
            onClose={this.handlePopoverClose}
          >
            {isAdmin ? this.getAdminList() : this.getStudentList()}
          </SkillshapePopover>
        )}
      </div>
    );
  }
}
