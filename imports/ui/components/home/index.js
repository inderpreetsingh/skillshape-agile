import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import HomeBase from './homeBase';
import HomeRender from './homeRender';
import { Session } from 'meteor/session';

class Home extends HomeBase {

  render() {
    return HomeRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  const classType = ClassType.find({}).fetch();
  const currentUser = Meteor.user();
  let pagesToload = Session.get("pagesToload") || 1;
  let subscription = Meteor.subscribe("School",{limit: pagesToload*10});
  const loadMore = ()=> {
    if(subscription.ready()) {
      Session.set("pagesToload", pagesToload + 1);
    }
  }
  return { ...props, classType, currentUser, loadMore: loadMore, loadMoreEnabled: subscription.ready()};
}, Home);