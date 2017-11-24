import React from 'react';
import ModulesRender from './modulesRender';

export default class Modules extends React.Component {

    constructor(props) {
        super(props);
    }

    getChildTableData(parentData) {
  		return parentData
  	}

    render() {
        return ModulesRender.call(this, this.props, this.state)
    }
}