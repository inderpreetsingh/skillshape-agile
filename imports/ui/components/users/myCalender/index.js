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
import { capitalizeString } from '/imports/util';

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
  getStudentStatus = (filter) =>{
    //classes.getClassData
    //classPricing.signInHandler
    Meteor.call("classes.getClassData",filter,(err,res)=>{
      if(res){
        res.students && res.students.map((obj,index)=>{
          if(obj.userId == Meteor.userId()){
            if(obj.status=='signIn' || obj.status=='checkIn')
            this.setState({status:'Sign Out'});
          }
        })
      }
      this.setState({classDetails:res,filter:filter});
    })
  }
  handleEventModal = (isOpen, eventData, clickedDate, jsEvent) => {
    this.setState({ classDetailModal: false });
    const { routeName, classTimesData, classTypeData, schoolData } = this.props
    const originalEvent  = get(jsEvent,"originalEvent",'');
    this.setState({status:'Sign In'})
    classTimesData && classTimesData.map((obj)=>{
      if(obj._id==eventData.classTimeId){
        this.setState({classTimes:obj})
      }
    })
    classTypeData && classTypeData.map((obj) => {
      if (obj._id == eventData.classTypeId) {
        this.setState({ classType: obj })
      }
    })
    const {schoolId,classTypeId,classTimeId,start} = eventData;
    let filter = {schoolId,classTypeId,classTimeId,scheduled_date:new Date(start)};
    this.getStudentStatus(filter);
   
    if(isEmpty(schoolData)){
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
  handleClassUpdate = (filter,status,popUp)=>{
    Meteor.call('classPricing.signInHandler',filter,(err,res)=>{
       if(!isEmpty(res)){
        popUp.appear("inform", {
          title: `Confirmation`,
          content: `You have the followings packages. Please select one from which you are going to use.`,
          RenderActions: (<ButtonWrapper>
            {res.map((obj)=>
             <FormGhostButton
             label={capitalizeString(obj.packageName)}
             onClick={() => {this.updateClass(filter,status,obj,popUp)}}
             applyClose
           />
              )}
          </ButtonWrapper>)
        }, true);
       }
       else{
        popUp.appear("inform", {
          title: `No Package Purchased Yet.`,
          content: `You haven't purchased any package please purchase one first. `,
          RenderActions: (<ButtonWrapper>
          {this.purchaseLaterButton()}
           {this.purchaseNowButton()}
          </ButtonWrapper>)
        }, true);
       }
     })
   }

  updateClass = (filter,status,purchaseData,popUp)=>{
    let {packageType,noClasses,_id,packageName,monthlyAttendance} = purchaseData;
    let condition=0;
    if(packageType == 'CP'){
      condition = noClasses;
    }else if(packageType == 'MP'){
      condition = get(monthlyAttendance,'noClasses',0);
      }
    
        Meteor.call('purchase.manageAttendance',_id,packageType,0,(err,res)=>{
         
            if(condition==0 && packageType=='MP' && res){
              condition = res;
            
            if(condition>0){
              this.setState({isLoading:true});
              Meteor.call("classes.updateClassData",filter,status,_id,packageType,(err,res)=>{
                if(res){
                  this.setState({status:'Sign In',isLoading:false});
                  popUp.appear("success", {
                    title: `${this.state.status} successfully`,
                    content: `You have been successfully ${status == 'signIn' ? 'Sign In' : 'Sign Out'}.`,
                    RenderActions: (<ButtonWrapper>
                      <FormGhostButton
                          label={'Ok'}
                          onClick={() => {
                            this.setState({status: status == 'signIn' ? 'Sign Out' : 'Sign In'})
                          }}
                          applyClose
                      />
                  </ButtonWrapper>)
                  }, true);
                }
              })
            }
            else{
              popUp.appear("alert", {
                title: `Caution`,
                content: `You have ${condition} classes left of package ${packageName}. Sorry you can't Sign in. Please renew your package.`,
                RenderActions: (<ButtonWrapper>
                    {this.purchaseLaterButton()}
                   {this.purchaseNowButton()}
              </ButtonWrapper>)
              }, true);
            }
          }
        });
    
   
  
  }
  purchaseNowButton = ()=>(
    <FormGhostButton
    label={'Purchase Now'}
    onClick={() => {this.setState({classTypePackages:true})}}
    applyClose
  />
  )
  purchaseLaterButton = ()=>(
    <FormGhostButton
             label={'Purchase Later'}
             onClick={() => {}}
             applyClose
           />
  )
  handleSignIn = () => {
    const {popUp} = this.props;
    const {classDetails,filter,status} = this.state;
   
    if(status == "Sign In"){
      popUp.appear("success", {
        title: "Confirmation",
        content: `You are going to sign in into this class.`,
        RenderActions: ( <Div > 
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
                  this.handleClassUpdate(classDetails ?classDetails : filter,'signIn',popUp)
                }}
                applyClose
            />
        </ButtonWrapper>
        </Div>)
      }, true);
    }
    else {
      popUp.appear("inform", {
        title: "Confirmation",
        content: `You are already sign in. Do you want to sign out?`,
        RenderActions: ( <Div > 
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
                  this.handleClassUpdate(classDetails ?classDetails : filter,'signOut',popUp)
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
      classDetails
    } = this.state;
    const { routeName,schoolData } = this.props;
    let name,_id;
    if( !isEmpty(schoolData)){
      name = get (schoolData,'name','School Name');
      _id = get(schoolData,'_id',null);
    }
    let classTypeId;
    if(!isEmpty(classDetails)){
      classTypeId = get(classDetails,'classTypeId',null);
    }
    else{
      classTypeId = get(filter,'classTypeId',null);
    }
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
        {isLoading && <ContainerLoader />}
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
            schoolName = {name}
          />
        )}
        {classTypePackages && <ClassTypePackages 
                    schoolId = {_id}
                    open={classTypePackages}
                    onClose={()=>{this.setState({classTypePackages:false})}}
                    params= {this.props.params}
                    classTypeId = {classTypeId}
                    userId={Meteor.userId()}
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