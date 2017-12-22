import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import SchoolViewBase from './schoolViewBase';
import SchoolViewRender from './schoolViewRender';

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import SLocation from "/imports/api/sLocation/fields";
import School from "/imports/api/school/fields";

class SchoolView extends SchoolViewBase {
  
  constructor(props){
    super(props);
    this.state = {
      isPublish: true,
    }
  }

  render() {
    return SchoolViewRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  let { schoolId, slug } = props.params
  let schoolData;
  let classPricing;
  let monthlyPricing;
  let schoolLocation;
  let classType;

  if(slug) {
    Meteor.subscribe("UserSchoolbySlug", slug);
    Meteor.subscribe("SkillClassbySchoolBySlug", slug)

    schoolData = School.findOne({slug: slug})
    schoolId = schoolData && schoolData._id
  }

  if(schoolId) {
    Meteor.subscribe("UserSchool", schoolId);
    Meteor.subscribe("SkillClassbySchool", schoolId);
    Meteor.subscribe("ClaimOrder", "");
    Meteor.subscribe("location.getSchoolLocation", {schoolId});
    Meteor.subscribe("classTypeBySchool", schoolId);
    Meteor.subscribe("classPricing.getClassPricing", {schoolId})
    Meteor.subscribe("monthlyPricing.getMonthlyPricing", {schoolId})

    schoolData = School.findOne({_id: schoolId})
    classPricing = ClassPricing.find({schoolId: schoolId}).fetch() 
    monthlyPricing = MonthlyPricing.find({schoolId: schoolId}).fetch()
    schoolLocation = SLocation.find({schoolId: schoolId}).fetch()
    classType = ClassType.find({schoolId: schoolId}).fetch();
  } 

  console.log("SchoolView schoolData--->>",schoolData)
  console.log("SchoolView classType--->>",classType)
  console.log("SchoolView classPricing--->>",classPricing)
  console.log("SchoolView monthlyPricing--->>",monthlyPricing)
  return { ...props, 
    schoolData, 
    classPricing, 
    monthlyPricing, 
    schoolLocation,
    classType,
    schoolId, 
  };
}, SchoolView);