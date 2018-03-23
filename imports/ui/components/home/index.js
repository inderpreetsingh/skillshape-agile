import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import HomeBase from './homeBase';
import HomeRender from './homeRender';
import { Session } from 'meteor/session';

export default class Home extends HomeBase {
  render() {
    return HomeRender.call(this, this.props, this.state);
  }
}