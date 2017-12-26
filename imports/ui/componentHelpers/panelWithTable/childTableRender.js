import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import Add from 'material-ui-icons/Add';
import Edit from 'material-ui-icons/Edit';
import Delete from 'material-ui-icons/Delete';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel';
import Divider from 'material-ui/Divider';

export default function (props) {
	const { classes, childPanelHeader, childTable, childTableData, parentKey } = this.props;
	const FormComponent = childPanelHeader.actions.component;
	console.log("child Table render this.props -->>",this.props)
	// console.log("child Table render childTableData -->>",childTableData)
	return (
		<div className="panel-child-table">
			{
          		this.state.showForm && <FormComponent
          			parentKey={parentKey} 
          			data={this.state.formData} 
          			open={this.state.showForm} 
          			onClose={this.handleFormModal}
          		/>	
          	}
			<ExpansionPanel>
				<ExpansionPanelSummary className={classes.classtimeHeader} color="primary" expandIcon={<ExpandMoreIcon />} >
	                <Grid container >
		                <Grid  item sm={7} xs={12} style={{display: 'inline-flex',alignItems: 'center'}}>
		                    <span> 
		                    	<Icon className="material-icons" style={{marginRight: 5}}>{childPanelHeader.leftIcon}</Icon>
		                    </span> 
		                    <span>{childPanelHeader.notes}</span>
		                </Grid>
		                <Grid style={{display: 'inline-flex',alignItems: 'center',justifyContent: 'center'}} item sm={5} xs={12}>
		                    <Button raised dense onClick={() => this.setState({showForm: true, formData: null})} >
		                    	<Add style = {{marginRight: 2}} />
		                   		   {childPanelHeader.actions.buttonTitle}
		                  	</Button>
		                </Grid>
	                </Grid>
            	</ExpansionPanelSummary>
				{
					_.isArray(childTableData) && childTableData.map((tableData, index)=>{
						return (
							<ExpansionPanelDetails key={index} className={classes.details}>
								<div className={classes.classtimeFormOuter}>
				                    <div className={classes.classtimeFormContainer}>
				                    	{
											childTable && childTable.tableFields.map((field, index) => {
			        							// console.log("childTable Field Name -->>",field);
			        							return (
			        								<Grid container key={index} className={classes.classtypeInputContainer}>
								                        <Grid  item xs={12} sm={3}>
								                        	<div> {field.label} </div>
								                        </Grid>
								                        <Grid  item xs={12} sm={9}>
								                         	<div className={classes.inputDisableBox}> <span>{tableData[field.key]}</span> </div>
								                        </Grid>
								                    </Grid>
												)
											})
			    						}
			    						<Grid  item xs={12} sm={5} >
					                        <Button onClick={() => this.setState({showForm: true, formData:tableData})} color="accent" raised dense>
					                           <Edit style = {{marginRight: 2}} />
					                          	{ childTable.actions.edit.title }
					                        </Button>
				                        </Grid>
				                	</div>  
				                </div>  
							</ExpansionPanelDetails>
						)
					})
				}
			</ExpansionPanel>
		</div>
	)
}