import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '/imports/util';
import EnrollmentFeeRender from './enrollmentFeeRender';

const styles = theme => {
    return {
        card: {
            minWidth: 275,
            maxWidth: 275,
            margin: 15,
          },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            marginBottom: 16,
            fontSize: 14,
            color: theme.palette.text.secondary,
        },
        pos: {
            marginBottom: 12,
            color: theme.palette.text.secondary,
        },
    }
}

class EnrollmentFee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showForm: false,
        }  
    }

    handleFormModal = ()=> this.setState({showForm: false, formData: null})
    
    render() {
        return EnrollmentFeeRender.call(this, this.props, this.state)
    }
}

EnrollmentFee.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnrollmentFee);