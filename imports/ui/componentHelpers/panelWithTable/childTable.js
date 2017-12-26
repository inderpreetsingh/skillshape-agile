import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ChildTableRender from './childTableRender';

const styles = theme => {
    console.log("theme", theme);
    return {
        input: {
            display: 'none',
        },
        classtimeHeader: {
            backgroundColor: theme.palette.secondary[100],
            padding: 5
        },
        classtimeFormOuter: {
            backgroundColor: theme.palette.secondary[100],
            borderRadius: 5,
            padding: 12,
            width: '100%'
        },
        classtimeFormContainer: {
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 5,
            marginBottom: 12
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
        }
    }
}

class ChildTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            expanded: false,
            value: '',
            showForm: false,
            classTimeModalOpen: false
        }
    }

    handleFormModal = ()=> this.setState({showForm: false, formData: null})
    
    handleChange = (event, value) => {
        if (value == 0) {
          this.uploadInput.click();
        }
        this.setState({ value });
    }

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    handleClose = () => {
        this.setState({
          open: false,
        });
    }

    handleClick = () => {
        this.setState({
          open: true,
        });
    }

    classTimeModalHandleClose = () => {
        this.setState({
          classTimeModalOpen: false,
        });
    }
    
    handleAddClassTime = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
          classTimeModalOpen: true,
        })
    }
    
    render() {
        return ChildTableRender.call(this, this.props, this.state)
    }
}

ChildTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChildTable);