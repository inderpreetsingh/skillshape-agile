import React from 'react';
import PropTypes from 'prop-types';
import PanelWithTableRender from './panelWithTableRender';
import { withStyles } from 'material-ui/styles';

const styles = theme => {
      // console.log("theme", theme);
      return {
        input: {
            display: 'none',
        },
        classtypeHeader: {
            backgroundColor: theme.palette.primary[500],
            padding: "0 20px",
            color: "#fff"
        },
        headerBtn: {
            color: "#fff",
            fontSize: 13,
            border: "solid 1px #fff"
        },
        headerText: {
            color: "#fff",
        },
        classtypeForm: {
            backgroundColor: theme.palette.grey[100],
            borderRadius: 5,
            padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px`
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
        },
        expansionPanel : {
            marginTop: theme.spacing.unit,
        }
    }
}



class PanelWithTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            expanded: false,
            value: '',
            showForm: false,
            showEditForm: false,
        }
    }

    handleFormModal = ()=> this.setState({showForm: false, formData: null})

    handleChange = (event, value) => {
        if(value == 0) {
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
    };

    handleClick = () => {
        this.setState({
          open: true,
        });
    };

    displayFieldValue = (field, tableData) => {
        if(field.childKeys) {
            let str = ""
            for(key of field.childKeys) {
                if(tableData[field.key][key]) {
                    str = str + tableData[field.key][key]+ " ";
                }
            }
            return str
        } else {
            return tableData[field.key]
        }
    }

    handleExpansionPanelRightBtn = (data) => {
        Meteor.call("classType.notifyToStudentForClassTimes", {schoolId: data.schoolId, classTypeId: data._id, classTypeName: data.name}, (error, result)=> {
            console.log("classType.notifyToStudentForClassTimes",error, result)
        })
    }

    render() {
        return PanelWithTableRender.call(this, this.props, this.state)
  }
}

PanelWithTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PanelWithTable);
