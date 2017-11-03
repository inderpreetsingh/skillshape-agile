import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import MVPSideBarBase from './MVPSideBarBase';
import MVPSideBarRender from './MVPSideBarRender';

class MVPSideBar extends MVPSideBarBase {

  render() {
    return MVPSideBarRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
	Meteor.subscribe("ClaimRequest",Meteor.userId());
  return { ...props };
}, MVPSideBar);
