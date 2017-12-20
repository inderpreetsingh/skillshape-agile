import React from 'react';
import { findIndex } from 'lodash';
import { ContainerLoader } from '/imports/ui/loading/container';
import AutoComplete from 'material-ui/AutoComplete';
import { imageRegex, formStyles } from '/imports/util';
import RaisedButton from 'material-ui/RaisedButton';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import config from '/imports/config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import ClassTimeDetails from './classTimes';

const formId = "create-class-type";

export default class ClassTypeForm extends React.Component {

	constructor(props){
	    super(props);
	    this.state = this.initializeFields();
	    // this.onUpdateSkillCategoryInput = _.debounce(this.onUpdateSkillCategoryInput, 500);
  	}

  	initializeFields = () => {
  		const { data, locationData } = this.props;
  		// console.log("initializeFields data -->>",data)
  		let state = {
  			gender: "Any",
	      	skillCategoryData: [],
	      	skillSubjectData: [],
	      	skillCategoryId: null,
	      	selectedSkillSubject: null,
	      	selectedLocation: null,
	      	searchSkillCategoryText: "",
	    }
  		if(data  && _.size(data) > 0) {
  			if(data.selectedSkillCategory && _.size(data.selectedSkillCategory) > 0) {
  				state.searchSkillCategoryText = data.selectedSkillCategory.name;
  			}
  			
  			return {
  				...state, 
  				...data, 
  				skillCategoryData: [data.selectedSkillCategory],
  				location: data.locationId,
  				selectedLocation: locationData && _.find(locationData, function(location) { return data.locationId === location._id })
  			}
  		}
  		return state
  	}


  	onSkillSubjectChange = (values)=> this.setState({selectedSkillSubject: values})
  	
  	onSkillCategoryChange = (values)=> {

  		const selectedSkillSubject = this.state.selectedSkillSubject && this.state.selectedSkillSubject.filter((data) => {
  			return findIndex(values, {_id: data.skillCategoryId}) > -1
  		})
  		console.log("selectedSkillSubject -->>",selectedSkillSubject)
  		this.setState({selectedSkillCategory: values, selectedSkillSubject});
  	}

    handleInputChange = (fieldName, event) => this.setState({[fieldName]: event.target.value})
    	
    handleSelectChange = (fieldName, event, index, value) => this.setState({[fieldName]: value})
    
    handleSkillCategoryInputChange = (value) => {
    	console.log("handleSkillCategoryInputChange -->>",value)
    	Meteor.call("getSkillCategory",{textSearch: value}, (err,res) => {
    	    console.log("getSkillCategory res -->>",res)
    	    if(res) {
	    	    this.setState({
	    	      skillCategoryData: res || [],
	    	    })
    	    }
        })
    }

    handleSkillSubjectInputChange = (value) => {
    	console.log("handleSkillSubjectInputChange -->>",value)
    	if(!_.isEmpty(this.state.selectedSkillCategory)) {
	    	let skillCategoryIds = this.state.selectedSkillCategory.map((data) => data._id)
	    	Meteor.call("getSkillSubjectBySkillCategory",{skillCategoryIds: skillCategoryIds, textSearch: value}, (err,res) => {
	    	    if(res) {
		    	    this.setState({
		    	      skillSubjectData: res || [],
		    	    })
	    	    }
	        })
    	} else {
    		toastr.error("Please select skill category first","Error");
    	}
    }

    onSubmit = (event) => {
    	console.log("--------------------- ClassType from submit----------------")
    	event.preventDefault()
    	event.stopPropagation();
    	const imageFile = this.refs.classTypeImage.files[0];
	    if(imageFile) {
	    	if(!imageRegex.image.test(imageFile.name)) {
	  			toastr.error("Please enter valid Image file","Error");
	  			return 
	  		}
    		this.setState({isBusy: true});
	  		S3.upload({files: { "0": imageFile}, path:"schools"}, (err, res) => {
	  			if(err) {
	  				console.error("err ",err)
	  			}
	  			if(res) {
	  				this.handleFormData(res)
	  			}
	  		})
    	} else {
    		this.handleFormData()
    	}
    }

    handleFormData = (imageUpload) => {
    	const { schoolId, locationData, data } = this.props;
    	const {
    		methodName, 
    		skillCategoryId, 
    		selectedSkillSubject, 
    		selectedSkillCategory,
    		name,
    		desc,
    		gender,
    		ageMin,
    		ageMax,
    		location,
    		experienceLevel,
    	} = this.state;
    	const payload = {
    		name: name,
    		desc: desc,
    		skillCategoryId: selectedSkillCategory && selectedSkillCategory.map(data => data._id),
    		schoolId: schoolId,
    		skillSubject: selectedSkillSubject && selectedSkillSubject.map(data => data._id),
    		gender: gender,
    		experienceLevel: experienceLevel,
    		ageMin: ageMin,
    		ageMax: ageMax,
    		locationId: location,
    	}

    	if(imageUpload) {
	  		payload.classTypeImg = imageUpload.secure_url
	  	}

    	if(payload.locationId) {
    		const temp = locationData.filter((data)=>{
    			return payload.locationId === data._id
    		});
    		payload.filters = {
    			location: temp[0].loc
    		}
    	}
    	console.log("onSubmit payload 2-->>",payload)
    	
    	if(schoolId && payload.name) {
    		this.setState({isBusy: true});
	    	if(data && data._id && _.size(data) > 0) {
	    		this.editClassType(data._id, payload)
	    	}
	    	else {
	    		this.addClassType(payload)
	    	}

    	} else {
    		toastr.error("Missing required fields","Error");
    	}
    }

    addClassType = (payload) => {
    	Meteor.call("classType.addClassType", payload, (err,res) => {
    	    if(res) {
    	   		this.props.hideAddClassTypeForm()
    	    }
    	    this.setState({isBusy: false});
    	})
    }

    editClassType = (updatekey, payload) => {
    	Meteor.call("classType.editClassType", updatekey, payload, (err,res) => {
    	    this.setState({isBusy: false});
    	    this.props.disableEditMode()
    	})
    }

	render() {
		console.log("ClassTypeForm state -->>",this.state);
		console.log("ClassTypeForm props -->>",this.props);
		const { locationData, data, editMode } = this.props;
		const { skillCategoryData, skillSubjectData, searchSkillCategoryText } = this.state;
		const styles = formStyles();
		return (
			<div className="content">
				<div>
				<form id={formId} onSubmit={this.onSubmit}>
					{ this.state.isBusy && <ContainerLoader/> }
	      			<div style={styles.row}>
	      				<div style={styles.col}>
	      					<div style={styles.formControl}>
				               	<div style={styles.formControlInput}>
				                    <TextField
				                    	floatingLabelText="Class Type Name *"
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
	      					<div style={styles.formControl}>
				               	<div style={styles.formControlInput}>
				               		<SelectArrayInput
		      							disabled={editMode}
		      							floatingLabelText="Skill Category"  
		      							optionValue="_id" 
		      							optionText="name" 
		      							input={{ value: this.state.selectedSkillCategory ,onChange: this.onSkillCategoryChange}} 
		      							onChange={this.onSkillCategoryChange} 
		      							setFilter={this.handleSkillCategoryInputChange}
		      							dataSourceConfig={{ text: 'name', value: '_id' }} 
		      							choices={skillCategoryData} 
		      						/>
	      						</div>
	      					</div>
	      					<div style={styles.formControl}>
				               	<div style={styles.formControlInput}>
		      						<SelectArrayInput
		      							disabled={editMode}
		      							floatingLabelText="Skill Subject"  
		      							optionValue="_id" 
		      							optionText="name" 
		      							input={{ value: this.state.selectedSkillSubject ,onChange: this.onSkillSubjectChange}} 
		      							onChange={this.onSkillSubjectChange} 
		      							setFilter={this.handleSkillSubjectInputChange}
		      							dataSourceConfig={{ text: 'name', value: '_id' }} 
		      							choices={skillSubjectData} 
		      						/>
	      						</div>
	      					</div>
	      					<div style={styles.formControlInline}>
	      						<div style={styles.formControl}>
							        <div style={styles.formControlInput}>
							            <SelectField 
							            	hintText="Select Gender" 
							            	floatingLabelText="Gender" 
							            	disabled={editMode}
							            	fullWidth={true} 
							            	value={this.state.gender} 
							            	onChange={this.handleSelectChange.bind(this, "gender")}
							            >
							                { 
							                	config.gender.map((data, index) => { 
							                		return <MenuItem key={index} value={data.value} primaryText={data.label} /> 
							                	}) 
							            	}
							            </SelectField>
							        </div>
							    </div>
							    <div style={styles.formControl}>
								    <div style={styles.formControlInput}>
								        <SelectField 
									        floatingLabelText="Experience Level" 
									        hintText="Experience Level" 
									        disabled={editMode}
									        fullWidth={true} 
									        value={this.state.experienceLevel} 
									        onChange={this.handleSelectChange.bind(this, "experienceLevel")}
								        >
								            { 
								            	config.experienceLevel.map((data, index) => { 
								            		return <MenuItem key={index} value={data.value} primaryText={data.label} /> 
								            	}) 
								            }
								        </SelectField>
								    </div>
								</div>
	      					</div>
	      					<div style={styles.formControlInline}>
	      						<div style={styles.formControl}>
							        <div style={styles.formControlInput}>
							            <TextField 
							            	floatingLabelText="Age From" 
							            	disabled={editMode}
							            	type="number"
							            	fullWidth={true} 
							            	value={this.state.ageMin} 
							            	onChange={this.handleInputChange.bind(this, "ageMin")} 
							            />
							        </div>
							    </div>
							    <div style={styles.formControl}>
							        <div style={styles.formControlInput}>
							            <TextField
							            	floatingLabelText="To" 
							            	disabled={editMode}
							            	type="number" 
							            	fullWidth={true} 
							            	value={this.state.ageMax} 
							            	onChange={this.handleInputChange.bind(this, "ageMax")} 
							            />
							        </div>
							    </div>
	      					</div>
				            <div style={styles.formControl}>
				               	<div style={styles.formControlInput}>
				               		<SelectField
				               			floatingLabelText="Location"
								        hintText="Select Location"
				               			disabled={editMode}
				               			fullWidth={true}
								        value={this.state.location}
								        onChange={this.handleSelectChange.bind(this, "location")}
								    >
							        	{
							        		locationData.map((data, index) => {
								        		return <MenuItem key={index} value={data._id} primaryText={`${data.address}, ${data.city}, ${data.country}`} />
							        		})
							        	}
								     </SelectField>
				               	</div>
	      					</div>   		
	      				</div>	
	      				<div style={{...styles.col, ...styles.center}}>
	      					<div className="fileinput fileinput-new card-button text-center" data-provides="fileinput">
							    <div className="fileinput-new card-button thumbnail">
							        <img className="" src={data.classTypeImg || config.defaultSchoolImage} alt="Profile Image" id="pic" />
							    </div>
							    <div className="fileinput-preview fileinput-exists thumbnail"></div>
							    <div>
							        <span className="btn btn-warning btn-sm btn-file">
					                    <span className="fileinput-new">Upload New Image</span>
							        	<span className="fileinput-exists">Change</span>
							        	<input type="hidden" />
							        	<input type="file" name="..." accept="image/*" ref="classTypeImage" />
							        </span>
							        <a href="#" className="btn btn-danger  fileinput-exists" data-dismiss="fileinput">
					                    <i className="fa fa-times"></i>
				                      	Remove
				                  </a>
							    </div>
							</div>
	      				</div>
	      			</div>
      					<RaisedButton
      						label="Save"
      						form={formId}
      						type="submit"
      						disabled={editMode} 
      						primary={true} 
      						style={{margin: 12}}
      					/>
      			</form>	
      			</div>
      			{
      				!_.isEmpty(data) && (
	      				<ClassTimeDetails
		      				classTypeId={data._id} 
		      				selectedLocation={this.state.selectedLocation}
		      				{...this.props}
	      				/>
      				)
      			}
      		</div>	
		)
	}
}