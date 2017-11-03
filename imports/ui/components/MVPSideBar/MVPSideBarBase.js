import React from 'react';
import { Session } from 'meteor/session';

export default class MVPSideBarBase extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      mySchool: [],
      connectedSchool: [],
      claimRequest: []
    }
  }

  componentWillMount() {
    console.log("---- MVPSideBarBase componentWillMount ----")
    Session.set("ConnectedSchool",[])
    Session.set("MySchool",[])
    if(Meteor.userId()) {
      this.loadConnectedSchool();
      this.loadMySchool();
      this.claimRequestPresnet();
    }
  }

  claimRequestPresnet = () => {
    this.setState({claimRequest: ClaimRequest.find({userId:Meteor.userId()}).fetch()})
  }

  loadConnectedSchool = () => {
    Meteor.call("getConnectedSchool", Meteor.userId(), (error, result) => {
      if(error){
        console.log("error", error);
      }
      if(result){
        this.setState({connectedSchool: result})
        Session.set("ConnectedSchool",result) //no use
      }
    });
  }

  loadMySchool = () => {
    if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
      school_id = Meteor.user().profile.schoolId
      Meteor.call("getMySchool", school_id,Meteor.userId(), (error, result) => {
        if(error){
          console.log("error", error);
        }
        if(result){
          console.log(result);
          this.setState({mySchool: result})
          Session.set("MySchool",result) //no use
        }
      });
    }
  }

  getUserName = () => {
    const { currentUser } = this.props;
    if(currentUser) {
      if(currentUser.profile && currentUser.profile && currentUser.profile.firstName){
        let name = currentUser.profile.nickame
        if(name && name != undefined && name != "undefined"){
          name = name
        } else {
          name = ""
        }
        return currentUser.profile.firstName+" "+name
      } else {
        return currentUser.emails[0].address
      }
    }
  }

  checkSchoolAccess = () => {
    const { currentUser } = this.props;
    if(currentUser && currentUser.profile) 
      return currentUser.profile.acess_type == "school";
    return false;
  }

}