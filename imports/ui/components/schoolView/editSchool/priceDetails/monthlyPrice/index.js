import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '/imports/util';
import MonthlyPriceRender from './monthlyPriceRender';

const styles = theme => {
    return {
        card: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height:'100%'
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
        input: {
            display: 'none',
        },
        classtypeHeader: {
            backgroundColor: theme.palette.primary[500],
            padding: 5
        },
        classtypeForm: {
            backgroundColor: theme.palette.grey[100],
            borderRadius: 5,
            padding: 12
        },
        inputDisableBox: {
            textAlign: 'left',
            border: '1px solid #ccc',
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
            marginRight: 6,
            padding: 10,
            borderRadius: 2,
            backgroundColor: "#fff",
            minHeight: 15,
        },
        classtypeInputContainer: {
            alignItems: 'center',
            textAlign: 'left'
        },
        monthlyPriceContainer: {
            paddingLeft: theme.spacing.unit * 2
        }
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