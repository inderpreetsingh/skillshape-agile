import React from 'react';
import MediaDetailsRender from './mediaDetailsRender';

export default class MediaDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    
    render() {
        return MediaDetailsRender.call(this, this.props, this.state)
    }
}