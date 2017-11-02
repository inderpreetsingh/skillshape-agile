import React from 'react';
import FooterBase from './footerBase';
import FooterRender from './footerRender';

export default class Footer extends FooterBase{

  render() {
    return FooterRender.call(this, this.props, this.state);
  }
}
