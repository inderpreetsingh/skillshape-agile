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
  // console.log("schoolId --->>",schoolId)
  // console.log("schoolData --->>",schoolData)
  // console.log("SchoolView --->>",classPricing)
  return { ...props };
}, SchoolView);