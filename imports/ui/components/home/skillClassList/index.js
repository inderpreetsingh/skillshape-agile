import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import SkillClassListRender from "./skillClassListRender";
import { Session } from 'meteor/session';
import { withSubscriptionAndPagination } from '/imports/util';
import ListView from '/imports/ui/components/listView';
import SkillClassListBase from './skillClassListBase';
import ClassType from "/imports/api/classType/fields";

class SkillClassList extends SkillClassListBase {


  render() {
    return SkillClassListRender.call(this, this.props, this.state)
  }
}

export default withSubscriptionAndPagination(SkillClassList, {collection: ClassType, subscriptionName: "School", filter: {}, recordLimit: 10});