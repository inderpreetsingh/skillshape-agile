import React from 'react';
import SideBarBase from './sideBarBase';
import SideBarRender from './sideBarRender';

export default class SideBar extends SideBarBase {

  render() {
    return SideBarRender.call(this, this.props, this.state);
  }
}
