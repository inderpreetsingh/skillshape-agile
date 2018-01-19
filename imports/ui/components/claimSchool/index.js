import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import ClaimSchoolBase from "./claimSchoolBase";
import ClaimSchoolRender from "./claimSchoolRender";
import SkillCategory from "/imports/api/skillCategory/fields";


class ClaimSchool extends ClaimSchoolBase {

    render() {
        return ClaimSchoolRender.call(this, this.props, this.state)
    }

}

export default createContainer(props => {
  Meteor.subscribe('skillCategory.get');
  let currentUser = Meteor.user();
  let dataForSkillTypes = SkillCategory.find().fetch();
  return {...props, dataForSkillTypes,currentUser};
}, ClaimSchool);