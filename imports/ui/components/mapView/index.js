import React from 'react';
import MapBase from './mapBase';
import MapRender from './mapRender';

export default class MapView extends MapBase {

  render() {
    return MapRender.call(this, this.props, this.state);
  }
}
