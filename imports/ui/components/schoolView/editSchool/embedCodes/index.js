import React from 'react';
import EmbedCodesRender from './embedCodesRender';

export default class EmbedCodes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return EmbedCodesRender.call(this, this.props, this.state)
    }
}