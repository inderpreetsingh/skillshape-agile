import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import HeaderBase from './headerBase';
import HeaderRender from './headerRender';

class Header extends HeaderBase {
  render() {
    return HeaderRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  const currentUser = Meteor.user();
  return { ...props, currentUser };
}, Header);