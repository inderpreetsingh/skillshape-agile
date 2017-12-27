import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '/imports/util';
import MonthlyPriceRender from './monthlyPriceRender';

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

class MonthlyPrice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showForm: false,
        }  
    }

    handleFormModal = ()=> this.setState({showForm: false, formData: null})
    
    render() {
        return MonthlyPriceRender.call(this, this.props, this.state)
    }
}

MonthlyPrice.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MonthlyPrice);