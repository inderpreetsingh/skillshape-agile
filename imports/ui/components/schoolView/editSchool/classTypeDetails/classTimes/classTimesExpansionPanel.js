import React,{Fragment} from 'react';
import ClassTimeForm from './classTimeForm';
import RaisedButton from 'material-ui/RaisedButton';
import config from '/imports/config';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, amber800 } from 'material-ui/styles/colors';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';

const getStyles = () => {

   return {
        panelOpen: {
            maxHeight: 14000,
            order: -1,
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'max-height 800ms ease-in-out 0ms',
            marginRight: 15,
            marginLeft: 15,
            marginBottom: 5,
        },
        panelClosed: {
            maxHeight: 0,
            order: -1,
            overflowY: 'auto',
            transition: 'max-height 800ms ease-in-out 0ms',
            marginRight: 15,
            marginLeft: 15,
            marginBottom: 5,
        },
        panelHeaderContent: {
        	display: 'flex',
        	alignItems: 'center',
        },
        panelHeader: {
        	display: 'flex',
        	boxSizing: 'border-box',
    		backgroundColor: 'rgb(232, 232, 232)',
    		height: 56,
    		paddingLeft: 25,
    		fontSize: 'larger',
    		fontWeight: 500,
    		cursor: 'pointer',
    		justifyContent: 'space-between',
    		marginBottom: 5,
        }
    };
};

export default class ClassTimesExpansionPanel extends React.Component {

	constructor(props){
	    super(props);
	    this.state = {
            showForm: !this.props.classTimesData,
            editMode: false,
        }
  	}

    enableEditMode = (event) => {
        event.stopPropagation();
        this.setState({
            editMode: true,
            showForm: true,
        })
    }
	
    disableEditMode = () => this.setState({editMode: false})

    removeclassType = (event, classTimesData) => {
        event.stopPropagation();
        Meteor.call("classTimes.removeClassTimes", classTimesData, (err,res) => {
            if(res) {

            }
        })
    }

	render() {
        let editMode = this.state.editMode
		const styles = getStyles();
		const { classTimesData, schoolId, classTypeId, hideAddClassTimesForm, addForm, selectedLocation  } = this.props;
		console.log("ClassTimesExpansionPanel props -->>",this.props);
		if(addForm) {
            editMode = addForm;
        }
        return (
			<div>
                <Toolbar style={{marginTop: 2,marginBottom: 2,marginLeft: 15, marginRight: 15}}>
                    <ToolbarGroup>
                 	  <span style={styles.panelHeaderContent}>{(classTimesData && classTimesData.name) || "Add New Class Times"}</span>
                    </ToolbarGroup>
                    {
                        !addForm ? (
                            <ToolbarGroup>
                                <FontIcon 
                                    onClick={this.enableEditMode} 
                                    className="material-icons"
                                    color={config.themeColor.yellow}
                                >
                                    mode_edit
                                </FontIcon>
                                <FontIcon 
                                    onClick={(event) => this.removeclassType(event, classTimesData)}  
                                    className="material-icons"
                                    color={config.themeColor.red}
                                >
                                    delete_forever
                                </FontIcon>
                                <FontIcon 
                                    onClick={()=> this.setState({showForm: !this.state.showForm, editMode: false})} 
                                    className="material-icons"
                                >
                                    {this.state.showForm ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                                </FontIcon>
                            </ToolbarGroup>
                        ) : (
                            <ToolbarGroup>
                                <FontIcon 
                                    onClick={() => hideAddClassTimesForm()}   
                                    className="material-icons"
                                    color={config.themeColor.red}
                                >
                                    cancel
                                </FontIcon>
                            </ToolbarGroup>
                        )
                    }
                </Toolbar>
          
                {
                    <Paper
                        style={this.state.showForm ? styles.panelOpen : styles.panelClosed}
                    > 
                    	{
                    		this.state.showForm && <ClassTimeForm 
                    			classTimesData={classTimesData}
                                addForm={addForm}
                    			schoolId={schoolId}
                                classTypeId={classTypeId}
                    			hideAddClassTimesForm={hideAddClassTimesForm}
                                editMode={!editMode}
                                selectedLocation={selectedLocation}
                                disableEditMode={this.disableEditMode}
                    		/>
                    	}
                    </Paper>                
                }
            <Divider />
            </div>
		)
	}
}