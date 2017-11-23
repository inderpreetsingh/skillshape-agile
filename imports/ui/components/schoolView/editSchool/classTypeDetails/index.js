import React from 'react';
import ClassTypeDetailsRender from './classTypeDetailsRender';

export default class ClassTypeDetails extends React.Component {

	constructor(props) {
    super(props);
    
  }

  getChildTableData(parentData) {
  	return parentData.rooms;
  }
  
  render() {
    return ClassTypeDetailsRender.call(this, this.props, this.state)
  }
}  