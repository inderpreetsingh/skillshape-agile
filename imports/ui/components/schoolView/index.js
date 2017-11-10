import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import SchoolViewBase from './schoolViewBase';
import SchoolViewRender from './schoolViewRender';

class SchoolView extends SchoolViewBase {

  render() {
    return SchoolViewRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  const { schoolId } = props.params

  Meteor.subscribe("UserSchool",schoolId);
  Meteor.subscribe("SkillClassbySchool",schoolId);
  Meteor.subscribe("ClaimOrder","");
  Meteor.subscribe("SchoolLocation",schoolId);
  Meteor.subscribe("classTypeBySchool",schoolId);
  Meteor.subscribe("ClassPricing",schoolId)
  Meteor.subscribe("MonthlyPricing",schoolId)

  let schoolData = School.findOne({_id: schoolId})
  let classPricing = ClassPricing.find({schoolId: schoolId}).fetch() 
  let monthlyPricing = MonthlyPricing.find({schoolId:school._id}).fetch()
  let schoolLocation = SLocation.find({schoolId:schoolId}).fetch()
  let classType = ClassType.find({schoolId: schoolId}).fetch();

  console.log("SchoolView schoolData--->>",schoolData)
  console.log("SchoolView classType--->>",classType)
  // console.log("SchoolView classPricing--->>",classPricing)
  // console.log("SchoolView monthlyPricing--->>",monthlyPricing)
  return { ...props, 
    schoolData, 
    classPricing, 
    monthlyPricing, 
    schoolLocation,
    classType, 
  };
}, SchoolView);