import React, {Fragment} from 'react';
import moment from 'moment';
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
	const { classes, childPanelHeader, childTable, childTableData, parentKey, parentData, schoolId } = this.props;
	const FormComponent = childPanelHeader.actions.component;
	// console.log("child Table render this.props -->>",this.props)
	// console.log("child Table render this.state -->>",this.state)
	// console.log("child Table render childTableData -->>",childTableData)
	return (
		<div className="panel-child-table">
			{
          		this.state.showForm && <FormComponent
          			schoolId={schoolId}
          			parentKey={parentKey}
          			parentData={parentData}
          			data={this.state.formData}
          			open={this.state.showForm}
          			onClose={this.handleFormModal}
          		/>
          	}
			<ExpansionPanel>
				<ExpansionPanelSummary className={classes.classtimeHeader}  expandIcon={<ExpandMoreIcon style={{color: "#fff"}}/>} >
	                <Grid container >
		                <Grid  item lg={9} sm={9} xs={12} style={{color:"#fff", display: 'inline-flex',alignItems: 'center'}}>
		                    <span>
		                    	<Icon className="material-icons" style={{marginRight: 5}}>{childPanelHeader.leftIcon}</Icon>
		                    </span>
		                    <span>{childPanelHeader.notes}</span>
		                </Grid>
		                <Grid item lg={1} sm={3} xs={12}>
		                    <Button className={classes.headerBtn} onClick={() => this.setState({showForm: true, formData: null})} >
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
				                    <div className={classes.classtypeForm}>
        								<Grid container className={classes.classtypeInputContainer}>
					                    	{
												childTable && childTable.tableFields.map((field, index) => {
				        							// console.log("childTable Field Name -->>",field);
				        							return (
				        								<Fragment key={index}>
									                        <Grid  item xs={12} sm={field.labelSm ? field.labelSm : 3} md={field.lableMd ? field.lableMd : 3}>
									                        	<div> {field.label} </div>
									                        </Grid>
									                        <Grid  item xs={12} sm={field.valueSm ? field.valueSm : 9} md={field.valueMd ? field.valueMd : 9}>

								                         		{
								                         			field.nestedObjectOfArray ? (
								                         				tableData[field.key] && (Object.keys(tableData[field.key]).map((itemkey, index) => {
								                         					const itemData = tableData[field.key][itemkey];
								                         					let fields = [
								                         						{label: "Start Time", key: "startTime" },
								                         						{label: "Duration", key: "duration"},
								                         						{label: "Room", key: "roomId"}
								                         					]
								                         					if(itemkey === "oneTime") {
								                         						fields.unshift({label: "Start Date", key: "startDate"})
								                         					} else {
								                         						fields.unshift({label: "Day", value: itemkey})
								                         					}
								                         					return this.renderScheduleTypeData(classes, parentData, itemData, fields)
							                         					}))

								                         			)
								                         			:(<div className={classes.inputDisableBox}>
								                         				<span>{tableData[field.key]}</span>
								                         			</div>)
								                         		}
									                        </Grid>
									                    </Fragment>
													)
												})
				    						}
					                    </Grid>
			    						<div  style={{float: 'right',margin: 10}} >
					                        <Button onClick={() => this.setState({showForm: true, formData:tableData})} color="accent" raised dense>
					                           <Edit style = {{marginRight: 2}} />
					                          	{ childTable.actions.edit.title }
					                        </Button>
				                        </div>
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