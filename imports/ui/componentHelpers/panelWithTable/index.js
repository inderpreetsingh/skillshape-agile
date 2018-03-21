import React from 'react';
import isArray from 'lodash/isArray';
import filter from 'lodash/filter';
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
            color: "#fff",
        },
        headerBtn: {
            color: "black",
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
            margin: 5,
            border: '2px solid #bdbdbd',
            boxShadow: '5px 5px 5px 1px #bdbdbd'
        },
        expansionPanelContainer: {
            padding: `${theme.spacing.unit * 2}px`,
            width: '100%',
        },
        notifyExplanation: {
            display: 'flex',
            justifyContent: 'space-between',
            margin: '24px',
            padding: '10px',
            border: '1px solid rgb(221, 221, 221)',
            alignItems: 'center'
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
            currentTableData:null
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
        // Show `UpdateClassTimeDialog` as a popup when user click on "Notify Student"
        Meteor.call("classType.notifyToStudentForClassTimes", {schoolId: data.schoolId, classTypeId: data._id, classTypeName: data.name}, (error, result)=> {
            console.log("classType.notifyToStudentForClassTimes",error, result)
            this.setState({showConfirmationModal: false});
        })
    }

    // This is done so that we can show confirmation modal.
    handleNotifyClassTime =(tableData) => {
        this.setState({
            showConfirmationModal: true,
            currentTableData:tableData
        });
    }

    cancelConfirmationModal = ()=> this.setState({showConfirmationModal: false})

    getExpansionPanelTitle = (data, keys) => {
        if(isArray(keys)) {
            let str = []
            for(let key of keys) {
                if(data[key]) {
                    str.push(data[key])
                }
            }
            str = str.join(", ");
            return str;
        }
        return ""
    }

    render() {
        return PanelWithTableRender.call(this, this.props, this.state)
  }
}

PanelWithTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PanelWithTable);
