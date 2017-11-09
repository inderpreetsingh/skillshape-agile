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
  let schoolData = School.findOne({_id: schoolId})
  let classPricing = ClassPricing.find({schoolId: schoolId}).fetch() 
  let monthlyPricing = MonthlyPricing.find({schoolId:school._id}).fetch()
  // console.log("schoolId --->>",schoolId)
  console.log("SchoolView schoolData--->>",schoolData)
  console.log("SchoolView classPricing--->>",classPricing)
  console.log("SchoolView monthlyPricing--->>",monthlyPricing)
  return { ...props, schoolData, classPricing, monthlyPricing };
}, SchoolView);