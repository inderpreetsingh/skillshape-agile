import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ChildTableRender from './childTableRender';

const styles = theme => {
    // console.log("theme", theme);
    return {
        input: {
            display: 'none',
        },
        classtimeHeader: {
            backgroundColor: theme.palette.grey[400],
            padding: theme.spacing.unit,
            paddingLeft: theme.spacing.unit * 2,
            color: "#fff"
        },
        headerBtn: {
            color: "#fff",
            fontSize: 13,
            border: "solid 1px #fff",
            whiteSpace: "nowrap"
        },
        headerText: {
            color: "#fff",
        },
        classtimeFormOuter: {
            // backgroundColor: theme.palette.secondary[500],
            borderRadius: 5,
            width: '100%'
        },
        classtimeFormContainer: {
            backgroundColor: "#fff",
            padding: theme.spacing.unit,
            borderRadius: 5,
            marginBottom: 12
        },
        inputDisableBox: {
            textAlign: 'left',
            border: '1px solid #ccc',
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
            marginRight: 6,
            padding: theme.spacing.unit,
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