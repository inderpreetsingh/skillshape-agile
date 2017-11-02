import React from 'react';
import ListBase from './listBase';
import ListRender from './listRender';

export default class ListView extends ListBase {

  render() {
    return ListRender.call(this, this.props, this.state);
  }
}
