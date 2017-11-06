import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import MyProfileBase from './myProfileBase';
import MyProfileRender from './myProfileRender';

class MyProfile extends MyProfileBase {

  render() {
    return MyProfileRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
	let currentUser = Meteor.user();
	return { ...props, currentUser };
}, MyProfile);