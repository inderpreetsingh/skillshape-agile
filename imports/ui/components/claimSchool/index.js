import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import ClaimSchoolBase from "./claimSchoolBase";
import ClaimSchoolRender from "./claimSchoolRender";

class ClaimSchool extends ClaimSchoolBase {

  render() {
    return ClaimSchoolRender.call(this, this.props, this.state)
  }

}

export default createContainer(props => {
  Meteor.subscribe('SkillType');
  let dataForSkillTypes = SkillType.find().fetch();
  console.log("dataForSkillTypes-->>",dataForSkillTypes);
  return {...props, dataForSkillTypes};
}, ClaimSchool);