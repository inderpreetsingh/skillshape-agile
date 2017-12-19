import React from 'react';
import ClassTypeForm from './classTypeForm';
import RaisedButton from 'material-ui/RaisedButton';
import config from '/imports/config';
import Paper from 'material-ui/Paper';
import {blue500, red500, amber800 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';

const getStyles = () => {

   return {
        panelOpen: {
            maxHeight: 1400,
            order: -1,
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'max-height 800ms ease-in-out 0ms',
        },
        panelClosed: {
            maxHeight: 0,
            order: -1,
            overflowY: 'auto',
            transition: 'max-height 800ms ease-in-out 0ms',
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

export default class ClassTypeExpansionPanel extends React.Component {

	constructor(props){
	    super(props);
	    this.state = {
            showForm: _.size(this.props.data) <= 0,
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

    removeclassType = (event, classTypeData) => {
        event.stopPropagation();
        Meteor.call("classType.removeClassType", classTypeData, (err,res) => {
            if(res) {

            }
        })
    }

	render() {
        let editMode = this.state.editMode
		const styles = getStyles();
		const { data, schoolId, locationData, hideAddClassTypeForm, addForm  } = this.props;
		console.log("ClassTypeExpansionPanel props -->>",this.props);
		if(addForm) {
            editMode = addForm;
        }
        return (
			<div>
                <Toolbar style={{marginTop: 5,marginBottom: 5}}>
                    <ToolbarGroup>
                      <span style={styles.panelHeaderContent}>{data.name || "Add New Class Type"}</span>
                    </ToolbarGroup>
                    {!addForm && (
                        <ToolbarGroup>
                            <FontIcon 
                                onClick={this.enableEditMode} 
                                className="material-icons"
                                color={config.themeColor.yellow}
                            >
                                mode_edit
                            </FontIcon>
                            <FontIcon 
                                onClick={(event) => this.removeclassType(event, data)}   
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
                    )}
                </Toolbar>
                
                {
                    <Paper
                        style={this.state.showForm ? styles.panelOpen : styles.panelClosed}
                    > 
                    	{
                    		this.state.showForm && <ClassTypeForm 
                    			data={data}
                                addForm={addForm}
                    			locationData={locationData}
                    			schoolId={schoolId}
                    			hideAddClassTypeForm={hideAddClassTypeForm}
                                editMode={!editMode}
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