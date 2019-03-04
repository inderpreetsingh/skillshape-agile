import React from 'react';
import EmbedCodesRender from './embedCodesRender';
import {withPopUp} from '/imports/util';
class EmbedCodes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return EmbedCodesRender.call(this, this.props, this.state)
    }
}
export default withPopUp(EmbedCodes);