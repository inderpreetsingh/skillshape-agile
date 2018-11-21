import React from "react";
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import ClassIcon from 'material-ui-icons/Class';
import AvTimerIcon from 'material-ui-icons/AvTimer';
import CancelIcon from 'material-ui-icons/Cancel';
import CloseIcon from 'material-ui-icons/Close';
import UpdateClassTimeIcon from 'material-ui-icons/Update';
import EmailIcon from 'material-ui-icons/Email';
import { browserHistory,Link } from "react-router";
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar";
import ClassDetailModal from "/imports/ui/modal/classDetailModal";
import SkillshapePopover from "/imports/ui/components/landing/components/popovers/SkillshapePopover";
import DropDownMenu from '/imports/ui/components/landing/components/form/DropDownMenu.jsx';
import {get} from 'lodash';
import classDetailModal from "../../../modal/classDetailModal";
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
      school:this.props.schoolData
    };
  }

  _checkIfAdmin = () => {
    const { schoolData: { admins }, currentUser,classTimesData,eventData } = this.props;
  
    const currentUserId = get(currentUser,"_id",0);
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
    this.setState({classDetailModal:false});
    const { routeName,classTimesData,classType } = this.props
    const { originalEvent } = jsEvent;
    classTimesData && classTimesData.map((obj)=>{
      if(obj._id==eventData.classTimeId){
        this.setState({classTimes:obj})
      }
    })
    classType && classType.map((obj)=>{
      if(obj._id==eventData.classTypeId){
        this.setState({classType:obj})
      }
    })
    Meteor.call("location.getLocsFromIds",[eventData.locationId],(err,res)=>{
      if(res){
        this.setState({location:res[0]})
      }
    })
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

  getStudentList = (route) => (
    <List>
       <ListItem button onClick={()=>{this.setState({classDetailModal:true})}}>
        <PopoverListItemIcon>
          <UpdateClassTimeIcon />
        </PopoverListItemIcon>
        <ListItemText primary="View Class Time" />
      </ListItem>
      <Link to={{ pathname: route, state: { props: this.props,state:this.state} }}>
        <ListItem button >
        <PopoverListItemIcon>
          <ClassIcon />
        </PopoverListItemIcon>
        <ListItemText primary="View Class Details" />
      </ListItem>
      </Link>
      <ListItem button>
        <PopoverListItemIcon>
          <AvTimerIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Class times" />
      </ListItem>
      {!Meteor.userId() && <ListItem button>
        <ListItemText primary="Sign in" />
      </ListItem>}
      <ListItem button onClick={()=>{this.setState({isOpen:false})}}>
        <PopoverListItemIcon>
        <CloseIcon />
        </PopoverListItemIcon>
        <ListItemText primary="Close" />
      </ListItem>
    </List>
  )

  getAdminList = (route) => (
    <List>
       <ListItem button onClick={()=>{this.setState({classDetailModal:true})}}>
        <PopoverListItemIcon>
          <UpdateClassTimeIcon />
        </PopoverListItemIcon>
        <ListItemText primary="View Class Time" />
      </ListItem>
      <Link to={{ pathname: route, state: { props: this.props,state:this.state} }}>
        <ListItem button >
        <PopoverListItemIcon>
          <ClassIcon />
        </PopoverListItemIcon>
        <ListItemText primary="View Class Details" />
      </ListItem>
      </Link>
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
      <ListItem button onClick={()=>{this.setState({isOpen:false})}}>
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
      classDetailModal
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
        {classDetailModal  && (
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
        {routeName === SCHOOL_VIEW && (
          <SkillshapePopover
            anchorEl={anchorEl}
            positionTop={positionTop}
            positionLeft={positionLeft}
            anchorReference={'anchorPosition'}
            isOpen={isOpen}
            onClose={this.handlePopoverClose}
          >
            {isAdmin ? this.getAdminList(route) : this.getStudentList(route)}
          </SkillshapePopover>
        )}
      </div>
    );
  }
}
