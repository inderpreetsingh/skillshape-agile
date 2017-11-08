import React from 'react';
import TagFilterBase from './tagFilterBase';
import TagFilterRender from './tagFilterRender';

export default class TagFilter extends TagFilterBase {

  render() {
    return TagFilterRender.call(this, this.props, this.state);
  }
}
