import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import HeaderBase from './headerBase';
import HeaderRender from './headerRender';

export default class Header extends HeaderBase {
  render() {
    return HeaderRender.call(this, this.props, this.state);
  }
}
