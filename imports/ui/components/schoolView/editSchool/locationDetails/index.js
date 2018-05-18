import React from 'react';
import LocationDetailsRender from './locationDetailsRender';

export default class LocationDetails extends React.Component {

  constructor(props) {
    super(props);
  }

  getChildTableData(parentData) {
  	return parentData.rooms;
  }
  moveToNextTab = () => {
    this.props.moveToNextTab(2);
  }

  render() {
    return LocationDetailsRender.call(this, this.props, this.state)
  }
}