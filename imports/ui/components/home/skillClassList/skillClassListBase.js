import React from "react";
import { Session } from 'meteor/session';
import ListView from '/imports/ui/components/listView';
import config from '/imports/config';

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import Classes from "/imports/api/classes/fields";

export default class SkillClassListBase extends React.Component {

  constructor(props){
    super(props);
  }
   
  componentWillUnmount() {
    Session.set("pagesToload",1)
  }

  viewImage = ({classType, schoolData}) => {
    let image = config.defaultSchoolImage;
    if(classType && (classType.hasOwnProperty("classTypeImg") || classType.hasOwnProperty("classImagePath"))) {
        image = classType.classTypeImg || classType.classImagePath;
    } else if(schoolData && schoolData.mainImage) {
        image = schoolData.mainImage
    }
    return image;
  }

  addressView = (locationId) => {
    const class_location = SLocation.findOne({_id:locationId})
    if(class_location){
      return (class_location.city  || class_location.city.length < 1 ? "" : class_location.city+", ")+""+(class_location.state ? "" : class_location.state);
    }
    return
  }

  isMyClass = (schoolId) => {
    if(Meteor.user() && Meteor.user().profile.schoolId){
      return Meteor.user().profile.schoolId == schoolId;
    }else{
      return false
    }
  }

  checkJoin = (class_id) => {
    let default_value  = false;
    if(Meteor.user()){
      if(Meteor.user().profile && Meteor.user().profile.classIds){
        default_value = Meteor.user().profile.classIds.includes(class_id)
      }
    }
    return default_value;
  }

  showSkillClass = ({classType}) => {
    const skillClassData = Classes.find({classTypeId: classType._id}).fetch();
    const schoolData = School.findOne({_id: classType.schoolId});
    
    const checkJoin = this.checkJoin(classType._id)
    const isMyClass = this.isMyClass(classType.schoolId)
    const backgroundUrl = this.viewImage({classType, schoolData});
    
    console.log("showSkillClass school -->>",schoolData)
    // console.log("showSkillClass classType -->>",classType)
    // console.log("showSkillClass skillClass -->>",skillClassData)
    if(schoolData) {
      return skillClassData.map((data, index) => {
        const locationId = this.addressView(data.locationId)
        return <ListView
            key={index}
            className={this.props.listClass || "col-lg-6 col-md-6"}
            school={schoolData}
            classTypeData={classType}
            backgroundUrl={backgroundUrl}
            locationId={locationId}
            checkJoin={checkJoin}
            isMyClass={isMyClass}
          />
      })   
    }
    return "No Result Found";
  }

}