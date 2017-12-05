import React from "react";
import { Session } from 'meteor/session';
import ListView from '/imports/ui/components/listView';

// import collection definition over here
import ClassType from "/imports/api/classType/fields";

export default class SkillClassListBase extends React.Component {

  constructor(props){
    super(props);
  }
   
  componentWillUnmount() {
    Session.set("pagesToload",1)
  }

  viewImage = (classType,classImagePath,schoolId) => {
    const image = ClassType.findOne({_id: classType})
    if (typeof image!=="undefined"){
     if(image.hasOwnProperty("classTypeImg") && image.classTypeImg.length>0){
        return image.classTypeImg;
     }
     else if(image.hasOwnProperty("classImagePath") && image.classImagePath.length>0){
     return image.classImagePath;
    }
   }
    else {
      school = School.findOne({_id: schoolId})
        if(school && school.mainImage){
          return school.mainImage;
        }
    }
    return "images/SkillShape-Whitesmoke.png";
  }

  addressView = (locationId) => {
    const class_location = SLocation.findOne({_id:locationId})
    if(class_location){
      return (class_location.city == undefined  || class_location.city.length < 1 ? "" : class_location.city+", ")+""+(class_location.state == undefined ? "" : class_location.state);
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

  showSkillClass = (classTypeData) => {
    console.log("showSkillClass -->>",classTypeData)
    const skillClass = SkillClass.find({classTypeId: classTypeData._id}).fetch();
    const school = School.findOne({_id: classTypeData.schoolId});
    
    const checkJoin = this.checkJoin(classTypeData._id)
    const locationId = this.addressView(classTypeData.locationId)
    const isMyClass = this.isMyClass(classTypeData.schoolId)
    const backgroundUrl = this.viewImage(classTypeData._id, classTypeData.classTypeImg, classTypeData.schoolId);
    
    return skillClass.map((data, index) => {
      return <ListView
          key={index}
          className={this.props.listClass || "col-lg-6 col-md-6"}
          school={school}
          classTypeData={classTypeData}
          backgroundUrl={backgroundUrl}
          locationId={locationId}
          checkJoin={checkJoin}
          isMyClass={isMyClass}
        />
    })   
  }

}