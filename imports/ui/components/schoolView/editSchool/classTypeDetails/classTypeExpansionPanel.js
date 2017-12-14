import React from 'react';
import ClassTypeForm from './classTypeForm';
import config from '/imports/config';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';

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
            showForm: _.size(this.props.data) <= 0 
        }
  	}

	
	render() {
		const styles = getStyles();
		const { data, schoolId, locationData, hideAddClassTypeForm  } = this.props;
		console.log("ClassTypeExpansionPanel props -->>",this.props);
		return (
			<div>
                <div style={styles.panelHeader} onClick={()=> this.setState({showForm: !this.state.showForm})}>
                 	<span style={styles.panelHeaderContent}>{data.name || "New Class Type"}</span>
                 	<div style={{padding: 16,fontSize: 'larger'}}>
	                 	<i className={this.state.showForm ? "fa fa-chevron-up" : "fa fa-chevron-down"} aria-hidden="true"></i>
                 	</div>
                </div>
                {
                    <Paper
                        style={this.state.showForm ? styles.panelOpen : styles.panelClosed}
                    > 
                    	{
                    		this.state.showForm && <ClassTypeForm 
                    			data={data}
                    			locationData={locationData}
                    			schoolId={schoolId}
                    			hideAddClassTypeForm={hideAddClassTypeForm}

                    		/>
                    	}
                    </Paper>                
                }
            </div>
		)
	}
}