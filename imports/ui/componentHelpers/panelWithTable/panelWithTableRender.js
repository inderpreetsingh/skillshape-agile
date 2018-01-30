import React, {Fragment} from "react";
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import methods from '/imports/ui/modal/formBuilderMethods';
import ChildTable from './childTable';
import {cutString} from '/imports/util';
import Collapse from 'material-ui/transitions/Collapse';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import red from 'material-ui/colors/red';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Add from 'material-ui-icons/Add';
import Edit from 'material-ui-icons/Edit';
import Delete from 'material-ui-icons/Delete';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel';
// import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import MapComponent from './mapComponent';
import MediaUpload from  '/imports/ui/componentHelpers/mediaUpload';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';


export default function () {

	const { classes, className, settings, mainTableData, schoolId, fullScreen } = this.props;
	const FormComponent = settings.mainPanelHeader.actions.component;
	// const EditForm = settings.mainTable.actions.edit.component;
	console.log("Panel with table props -->>",this.state);
	const {currentTableData} = this.state;
	// console.log("Panel with table state -->>",this.state);
	return (
		<div className={`${className} panel-table`}>
          	{
              this.state.showConfirmationModal && <ConfirmationModal
                  open={this.state.showConfirmationModal}
                  submitBtnLabel="Yes"
                  cancelBtnLabel="Cancel"
                  message="This will email all attending and interested students of the time change. Are you sure?"
                  onSubmit={()=>{this.handleExpansionPanelRightBtn(currentTableData)}}
                  onClose={this.cancelConfirmationModal}
              />
          	}
          	{
          		this.state.showForm && <FormComponent
          			schoolId={schoolId}
          			data={this.state.formData}
          			open={this.state.showForm}
          			onClose={this.handleFormModal}
          			settings={settings}
          			{...this.props}
          		/>
          	}

          	<Paper elevation={1}>
	            <Grid container className={classes.classtypeHeader}>
	              	<Grid  style={{display: 'inline-flex',alignItems: 'center', padding: 0}} item md={2} sm={3} xs={12}>
	              		<div style={{display: 'inline-flex'}} >
		                	<Icon className="material-icons" style={{marginRight: 5, lineHeight: "45px"}}>{settings.mainPanelHeader.leftIcon}</Icon>
		                	<Typography style={{lineHeight: "45px"}} className={classes.headerText} >{settings.mainPanelHeader.title || ""}</Typography>
	              		</div>
	              	</Grid>
	              	<Grid style={{margin: '10px 0'}} item sm={6} md={8} xs={12}>
		                <Typography className={classes.headerText} type="caption" >
		                	{settings.mainPanelHeader.notes || ""}
		                </Typography>
	            	</Grid>
	              	<Grid  style={{display: 'inline-flex',alignItems: 'center'}} item sm={3} md={2} xs={12}>
		                <Button className={classes.headerBtn} onClick={() => this.setState({showForm: true, formData: null})}>
		                  	{settings.mainPanelHeader.actions.buttonTitle}
		                </Button>
	                </Grid>
	            </Grid>
          	</Paper>
          	<div style={{marginTop: 10, width: '100%'}}>
	          	{
	          		_.isArray(mainTableData) &&  mainTableData.map((tableData, index) => {
	          			// console.log("tableData -->>",tableData);
						let childTableData = this.props.getChildTableData && this.props.getChildTableData(tableData);
	          			// console.log("childTableData -->>",childTableData);
	          			return (
		          				<ExpansionPanel key={index} className={classes.expansionPanel} key={index}>
			          				<ExpansionPanelSummary style={{boxShadow: '0 1px 0 rgba(0,0,0,.1)'}} expandIcon={<ExpandMoreIcon />} >
			              				<div style={{marginLeft: 15}}>
			                				<Typography className={classes.secondaryHeading}>{tableData[settings.mainPanelHeader.titleKey] || ""}</Typography>
			              				</div>
			            			</ExpansionPanelSummary>
			            			{
			            				settings.mainPanelHeader.expansionPanelRightBtnTitle && (
				              				<div className={classes.notifyExplanation}>
					          					<Typography type="caption">Pressing this button will inform students who are enrolled or interested in this class of any schedule changes. Please do not abuse this button.</Typography>
					          					<Button onClick={() => this.handleNotifyClassTime(tableData)} color="accent" raised dense>
					          					 	Notify Students of Time Change
					          					</Button>
				          					</div>
			            				)
			            			}

			            			<ExpansionPanelDetails className={classes.details}>
			            				<Grid container>
			            					<Grid  item md={(settings.mainPanelHeader.showImageUpload || settings.mainPanelHeader.showAddressOnMap) ? 8 : 12} sm={(settings.mainPanelHeader.showImageUpload || settings.mainPanelHeader.showAddressOnMap) ? 6 : 12} xs={12}>
			            						<div className={classes.classtypeForm}>
		            								<Grid  container className={classes.classtypeInputContainer}>
			            							{
			            								settings.mainTable && settings.mainTable.tableFields.map((field, index) => {
					            							// console.log("test1 Name -->>",test1);
					            							return (
					            								<Fragment key={index}>
														            <Grid item xs={12} sm={field.labelSm ? field.labelSm : 12} md={field.lableMd ? field.lableMd : 3}>
														                <div> {field.label} </div>
														            </Grid>
														            <Grid item xs={12} sm={field.valueSm ? field.valueSm : 12} md={field.valueMd ? field.valueMd : 9}>
																        <div className={classes.inputDisableBox}>
														            	{
														            		field.chipInput ? (
														            			<div style={{display: 'inline-flex', flexWrap: "wrap"}}>
															            			{
																            				tableData[field.key] && tableData[field.key].map((chipData, index)=>{
															            					return <Chip
															            						key={index}
															            						style={{marginRight: 5}}
															            						label={chipData[field.childKey]}
															            						className={classes.chip}
															            					/>
															            				})
															            			}
													            				</div>
														            		)
														            		: (
																                	<span>
																                		{ this.displayFieldValue(field, tableData)}
																                	</span>
														            		)
														            	}
																        </div>
														            </Grid>
														        </Fragment>
			            									)
			            								})
			            							}
													</Grid>
				            						<Grid  item xs={12} sm={12} style={{textAlign: 'right'}}>
					            						<Button style={{margin: 15}} onClick={() => this.setState({showForm: true, formData:tableData})} color="accent" raised dense>
								                        <Edit style = {{marginRight: 2}} />
								                        	{ settings.mainTable.actions.edit.title }
								                        </Button>
								                    </Grid>
			            						</div>
			            					</Grid>
			            					{
			            						 settings.mainPanelHeader.showAddressOnMap && (
					            					<Grid className={classes.classtypeInputContainer} item md={4} sm={6} xs={12}>
									              		<MapComponent mapData={tableData}/>
									              	</Grid>
			            						)
			            					}
			            					{
			            						settings.mainPanelHeader.showImageUpload  && (
					            					<Grid className={classes.classtypeInputContainer} item md={4} sm={6} xs={12}>
									              		<MediaUpload
									              			fullScreen={fullScreen}
									              			width={300}
									              			onChange={this.props.handleImageChange}
									              			data={tableData && {file: tableData.classTypeImg, isUrl: true}}
									              			showVideoOption={false}
									              		/>

									              		<Button onClick={()=> this.props.handleImageSave(tableData.schoolId, tableData._id)} color="accent" style={{width: 300}} dense raised>
									              			Save
									              		</Button>
									              	</Grid>
			            						)
			            					}
				            				{
				            					settings.childTable && <Grid className={classes.classtypeInputContainer} item md={8} sm={12} xs={12}>
									                <ChildTable
									                	schoolId={schoolId}
									                	childPanelHeader={settings.childPanelHeader}
									                	childTable={settings.childTable}
									                	childTableData={childTableData}
									                	parentKey={tableData._id}
									                	parentData={tableData}
									                />
									            </Grid>
									        }
			            				</Grid>
			            			</ExpansionPanelDetails>
		          				</ExpansionPanel>
	          			)
	          		})
	          	}
          	</div>
      </div>
	)
}