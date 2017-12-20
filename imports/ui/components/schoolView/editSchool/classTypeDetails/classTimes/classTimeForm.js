import React, {Fragment} from 'react';
import { ContainerLoader } from '/imports/ui/loading/container';
import AutoComplete from 'material-ui/AutoComplete';
import { imageRegex, formStyles } from '/imports/util';
import RaisedButton from 'material-ui/RaisedButton';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import config from '/imports/config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { ScheduleTypeTable, scheduleDetails } from './ScheduleTypeTable';
import { TableRow, TableRowColumn } from "material-ui/Table";
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import {Tabs, Tab} from 'material-ui/Tabs';

const formId = "create-class-times";
const styles = formStyles();

export default class ClassTimeForm extends React.Component {

	constructor(props){
	    super(props);
	    this.state = this.initializeFields();
  	}

  	initializeFields = () => {
  		const { classTimesData } = this.props;
  		let state = {
  			name: '',
  			desc: '',
  			duration: "",
  			roomId: null,
  			scheduleType: "oneTime",
  			scheduleDetails: {...scheduleDetails},
  		}
  		if(classTimesData) {
  			return { 
  				...state, 
  				...classTimesData, 
  				scheduleDetails: {...scheduleDetails, ...classTimesData.scheduleDetails}
  			}
  		}
  		console.log("initializeFields --->>>",state)
  		return state;
  	}

  	handleInputChange = (fieldName, event) => this.setState({[fieldName]: event.target.value})

  	handleSelectChange = (fieldName, event, index, value) => {
  		this.setState({[fieldName]: value})
  	}

  	handleChangeDate = (fieldName, event, date) => {
  		this.setState({[fieldName]: date})
  	}

  	handleChangeTimePicker = (key, fieldName, event, date) => {
	    const { scheduleDetails } = this.state;
	    scheduleDetails[key][fieldName] = date
	    this.setState({scheduleDetails});
	};

	handleChangeRoom = (key, fieldName, event, index, value) => {
		const { scheduleDetails } = this.state;
	    scheduleDetails[key][fieldName] = value
	    this.setState({scheduleDetails});
	}

	handleChangeTimeLength = (key, fieldName, event) => {
	    const { scheduleDetails } = this.state;
	    scheduleDetails[key][fieldName] = parseInt(event.target.value)
	    this.setState({scheduleDetails});
	};

	handleChangeDaySelect = (key, fieldName, event, isInputChecked) => {
		const { scheduleDetails } = this.state;
	    scheduleDetails[key][fieldName] = isInputChecked;
	    this.setState({scheduleDetails});
	}

	handleChangeTab = (value) => {
	    this.setState({
	      scheduleType: value,
	    });
	};

	getScheduleDetails = (scheduleDetails) => {
		let temp = {...scheduleDetails}
		Object.keys(temp).map((key, index)=> {
			if(!temp[key].isSeleted) {
				delete temp[key];
			} else {
				console.log("getScheduleDetails temp[key] -->>",temp[key].duration)
				if(!_.isDate(temp[key].startTime)) {
					toastr.error("Please enter start Time *","Error");
					temp = null
					return
				}
				if(!temp[key].duration) {
					toastr.error("Please enter duration *","Error");
					temp = null
					return
				}
			}
		})
		console.log("getScheduleDetails after -->>",temp)
		return temp;
	}

	validateObject = (obj) => {
		console.log("validateObject -->>",obj)
		for (var key in obj) {
		    
		    if (obj.hasOwnProperty(key) && !obj[key] && key != "desc") {
		        console.log(key + " -> " + obj[key]);
		        toastr.error(`Please fill all the required fields *`,"Error");
		        return null;
		    }
		}
		return "success"
	}

  	onSubmit = (event) => {
    	event.preventDefault()
    	console.log("classTimes from onSubmit --->>>",this.state);
    	console.log("classTimes from props --->>>",this.props);
    	const {  classTypeId, schoolId, addForm, classTimesData, selectedLocation } = this.props;
    	const payload = {
    		name: this.state.name,
    		desc: this.state.desc,
    		scheduleType: this.state.scheduleType,
    		schoolId: schoolId,
    		classTypeId: classTypeId,
    		locationId: selectedLocation && selectedLocation._id,
    	}


		if(payload.scheduleType === "onGoing" || payload.scheduleType === "recurring") {
			payload.scheduleDetails = this.getScheduleDetails(this.state.scheduleDetails);
			payload.startDate = new Date();
			if(payload.scheduleType === "recurring") {
				
				payload.startDate = this.state.startDate;
				payload.endDate = this.state.endDate;
			}

		} else if(payload.scheduleType === "oneTime") {
			
			payload.startDate = this.state.startDate;
			payload.startTime = this.state.startTime;
			payload.roomId = this.state.roomId;
			payload.duration = this.state.duration && parseInt(this.state.duration);
		}
		console.log("Final payload --->>>",payload);
		console.log("Final validateObject --->>>",this.validateObject(payload));
    	if(this.validateObject(payload)) {
			this.setState({isBusy: true});
	    	if(addForm) {
	    		this.addClassTimes(payload)
	    	} else {
	    		this.editClassTimes(classTimesData._id, payload)
	    	}
    	}
    	
    }

    addClassTimes = (payload) => {
    	console.log("addClassTimes payload-->>>",payload)
    	Meteor.call("classTimes.addClassTimes", payload, (err,res) => {
    	    if(res) {
    	   		this.props.hideAddClassTimesForm()
    	    }
    	    this.setState({isBusy: false});
    	})
    }

    editClassTimes = (updatekey, payload) => {
    	Meteor.call("classTimes.editClassTimes", updatekey, payload, (err,res) => {
    	    this.setState({isBusy: false});
    	    this.props.disableEditMode()
    	})
    }

    renderScheduleTable = () => {
    	const {  classTimesData, editMode, selectedLocation } = this.props;
		const { scheduleDetails } = this.state;
		if(this.state.scheduleType === "onGoing" || this.state.scheduleType === "recurring") {

			return <Fragment>	
				{ 
					this.state.scheduleType === "recurring" && (
						<div style={styles.formControlInline}>
							<div style={styles.formControl}>
								<div style={styles.formControlInput}>
									<DatePicker
										disabled={editMode} 
										hintText="Start Date *"
										value={this.state.startDate}
										onChange={this.handleChangeDate.bind(this, "startDate")}
									/>
								</div>
							</div>	
							<div style={styles.formControl}>
								<div style={styles.formControlInput}>
									<DatePicker
										disabled={editMode} 
										hintText="End Date *"
										value={this.state.endDate}
										onChange={this.handleChangeDate.bind(this, "endDate")} 
									/>
								</div>
							</div>
						</div>
					)
				}
				<ScheduleTypeTable>
					{
						Object.keys(scheduleDetails).map((key,index) => {
							let { startTime, duration, roomId, isSeleted } = scheduleDetails[key];
							return (
								<TableRow key={index} selectable={false} displayBorder={false}>
									<TableRowColumn style={{width: 50}}>
										<Checkbox
											disabled={editMode}
											checked={isSeleted}
											onCheck={this.handleChangeDaySelect.bind(this, key, "isSeleted")}
										/>
									</TableRowColumn>
									<TableRowColumn style={{width: 100}}>{key}</TableRowColumn>
									<TableRowColumn style={{width: 100}}>
										<TimePicker
							          format="ampm"
							          hintText=""
							          disabled={editMode}
							          value={startTime}
							          onChange={this.handleChangeTimePicker.bind(this, key, "startTime")}
							        />
							    </TableRowColumn>
									<TableRowColumn style={{width: 150}}>
										<TextField
											type="number"
				                    	disabled={editMode}
				                    	hintText="minutes"
				                    	fullWidth={true}
							            value={duration}
							            onChange={this.handleChangeTimeLength.bind(this, key, "duration")}
							        />
									</TableRowColumn>
									<TableRowColumn style={{width: 211}}>
										<SelectField
				               			disabled={editMode}
				               			fullWidth={true}
								        value={roomId}
								        onChange={this.handleChangeRoom.bind(this, key, "roomId")}
								    >
								        {
								        	selectedLocation && selectedLocation.rooms && selectedLocation.rooms.map((room, index)=>{
								        		return <MenuItem key={index} value={room.id} primaryText={room.name} />
								        	})
								        }
								     </SelectField>
									</TableRowColumn>
								</TableRow>
							)
						})
					}
				</ScheduleTypeTable>
			</Fragment>	
		}
    }

	render() {
		console.log("ClassTimeForm state -->>",this.state);
		console.log("ClassTimeForm props -->>",this.props);
		// console.log("ClassTimeForm props -->>",this.props);
		const {  classTimesData, editMode, selectedLocation } = this.props;
		return (
			<div>
				<form id={formId} onSubmit={this.onSubmit}  style={styles.colPadding}>
					{ this.state.isBusy && <ContainerLoader/> }
					<div style={styles.formControl}>
		               	<div style={styles.formControlInput}>
		                    <TextField
		                    	floatingLabelText="Class Name *"
		                    	disabled={editMode}
		                    	fullWidth={true}
					            value={this.state.name}
					            onChange={this.handleInputChange.bind(this, "name")}
					        />
	                	</div>
  					</div>
  					<div style={styles.formControl}>
		               	<div style={styles.formControlInput}>
		               		<TextField
		               			floatingLabelText="Brief Description"
		               			disabled={editMode}
		               			fullWidth={true}
		               			multiLine={true}
		               			row={3}
					            value={this.state.desc}
					            onChange={this.handleInputChange.bind(this, "desc")}
					        />
	                	</div>
  					</div>
  					<Tabs
				        value={this.state.scheduleType}
				        onChange={this.handleChangeTab}
				      >
				        <Tab label="One Time" value="oneTime">
				          	{
	      						this.state.scheduleType === "oneTime" && (
	      							<Fragment>
		      							<div style={styles.formControlInline}>
		      								<div style={styles.formControl}>
												<div style={styles.formControlInput}>
													<DatePicker
														disabled={editMode} 
														hintText="Start Date"
														floatingLabelText="Date *"
														value={this.state.startDate}
														onChange={this.handleChangeDate.bind(this, "startDate")} 
													/>
												</div>
											</div>
											<div style={styles.formControl}>
												<div style={styles.formControlInput}>
													<TimePicker
														disabled={editMode}
											            format="ampm"
											            value={this.state.startTime}
											            floatingLabelText="Start Time *" 
											            hintText="Start Time"
											            disabled={editMode}
											            onChange={this.handleChangeDate.bind(this, "startTime")}
											        />
												</div>
											</div>
										</div>
										<div style={styles.formControlInline}>
											<div style={styles.formControl}>
												<div style={styles.formControlInput}>
													<TextField
														floatingLabelText="Length *"
	  													type="number"
								                    	disabled={editMode}
								                    	fullWidth={true}
											            value={this.state.duration}
											            onChange={this.handleInputChange.bind(this, "duration")}
											        />
												</div>
											</div>
											<div style={styles.formControl}>
												<div style={styles.formControlInput}>
													<SelectField
														floatingLabelText="Room *"
								               			disabled={editMode}
								               			fullWidth={true}
												        value={this.state.roomId}
												        onChange={this.handleSelectChange.bind(this, "roomId")}
												    >
												        {
												        	selectedLocation && selectedLocation.rooms && selectedLocation.rooms.map((room, index)=>{
												        		return <MenuItem key={index} value={room.id} primaryText={room.name} />
												        	})
												        }
												    </SelectField>
												</div>
											</div>
										</div>
									</Fragment>
	      						)
	      					}
				        </Tab>
				        <Tab label="On Going" value="onGoing">
				          {this.renderScheduleTable()}
				        </Tab>
				        <Tab label="Repeating Class" value="recurring">
				          {this.renderScheduleTable()}
				        </Tab>
				    </Tabs>
					<div >
      					<RaisedButton
      						className="pull-right" 
      						label="Save"
      						form={formId}
      						type="submit"
      						disabled={editMode} 
      						primary={true} 
      						style={{margin: 12}}
      					/>
      				</div>
				</form>	
      		</div>	
		)
	}
}