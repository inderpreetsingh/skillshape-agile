import React from 'react';
import ClassTypeForm from './classTypeForm';
import RaisedButton from 'material-ui/RaisedButton';
import config from '/imports/config';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, amber800 } from 'material-ui/styles/colors';

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
            editMode: !this.state.editMode,
            showForm: true,
        })
    }
	
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
                <div style={styles.panelHeader} onClick={()=> this.setState({showForm: !this.state.showForm})}>
                 	<span style={styles.panelHeaderContent}>{data.name || "Add New Class Type"}</span>
                 	{
                        !addForm && (
                            <div style={{padding: 5,fontSize: 'larger', display: 'flex'}}>
                                <div style={{margin: 5}}>
                                    <RaisedButton
                                        label="Edit"
                                        onClick={this.enableEditMode}
                                        buttonStyle={{backgroundColor:amber800}}
                                        primary={true} 
                                    />
                                </div>
                                <div style={{margin: 5}}>
                                    <RaisedButton
                                        label="Delete"
                                        buttonStyle={{backgroundColor:red500}}
                                        onClick={(event) => this.removeclassType(event, data)} 
                                        primary={true} 
                                    />
                                </div>
                                <div style={{margin: 10}}>
                                    <i className={this.state.showForm ? "fa fa-chevron-up" : "fa fa-chevron-down"} aria-hidden="true"></i>
                                </div>
                         	</div>
                        ) 
                    }
                </div>
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
                                editMode={editMode}
                    		/>
                    	}
                    </Paper>                
                }
            </div>
		)
	}
}