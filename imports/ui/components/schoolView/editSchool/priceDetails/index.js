import React from 'react';
import PriceDetailsRender from './priceDetailsRender';

export default class PriceDetails extends React.Component {

    constructor(props) {
        super(props);

    }

    getChildTableData(parentData) {
        return parentData.rooms;
    }

    render() {
        return PriceDetailsRender.call(this, this.props, this.state)
    }
}