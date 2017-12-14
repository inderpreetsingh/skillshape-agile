import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import config from '/imports/config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

export default class ClassTypeForm extends React.Component {

	constructor(props){
	    super(props);
	    this.state = this.initializeFields();
	    this.onUpdateSkillCategoryInput = _.debounce(this.onUpdateSkillCategoryInput, 500);
  	}

  	initializeFields = () => {
  		const { data, locationData } = this.props;
  		console.log("initializeFields data -->>",data)
  		let state = {
	      	skillCategoryData: [],
	      	skillSubjectData: [],
	      	skillCategoryId: null,
	      	selectedSkillSubject: null,
	    }
  		if(data  && _.size(data) > 0) {
  			// const temp = [];
  			// if(data.locationId) {
	  		// 	temp = locationData.filter((location)=>{
	    // 			return data.locationId === location._id
	    // 		});
  				
  			// }
  			return {
  				...state, 
  				...data, 
  				skillCategoryData: [data.selectedSkillCategory],
  				location: data.locationId
  			}
  		}
  		return state
  	}

	onSkillCategorySelect = (selectItem, index) => {
		console.log("selectItem index -->>",selectItem, index)
		if(selectItem && selectItem._id) {
			Meteor.call("getSkillSubjectBySkillCategory",{skillCategoryId: selectItem._id}, (err,res) => {
	    	    if(res) {
		    	    this.setState({
		    	      skillSubjectData: res || [],
		    	      selectedSkillSubject: [],
		    	      skillCategoryId: selectItem._id,
		    	    })
	    	    }
	        })
		}
	}

	onUpdateSkillCategoryInput = (text, dataSource) => {
  		console.log("changeSkillCategoryData -->>",text, dataSource)
  		Meteor.call("getSkillCategory",{textSearch: text}, (err,res) => {
    	    if(res) {
	    	    this.setState({
	    	      skillCategoryData: res || [],
	    	    })
    	    }
        })
  	}

  	onChange = (values)=> {
        console.log("value", values);
        this.setState({selectedSkillSubject: values})
    }

    onSubmit = (event) => {
    	event.preventDefault()
    	const { skillCategoryId, selectedSkillSubject} = this.state;
    	const { schoolId, locationData, data, hideAddClassTypeForm } = this.props;
    	
    	const payload = {
    		name: this.state.name,
    		desc: this.state.desc,
    		skillCategoryId: skillCategoryId,
    		schoolId: schoolId,
    		skillSubject: selectedSkillSubject && selectedSkillSubject.map(data => data._id),
    		gender: this.state.gender,
    		experienceLevel: this.state.experienceLevel,
    		ageMin: this.state.ageMin,
    		ageMax: this.state.ageMax,
    		locationId: this.state.location,
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
    	
    	if(schoolId && payload.name && payload.locationId && payload.skillCategoryId) {

    		Meteor.call("classType.addClassType", payload, (err,res) => {
	    	    if(res) {
		    	   if(data && _.size(data) <= 0) {
		    	   		hideAddClassTypeForm()
		    	   }
	    	    }
        	})
    	} else {
    		toastr.error("Missing required fields","Error");
    	}
    }

    handleInputChange = (fieldName, event) => this.setState({[fieldName]: event.target.value})
    	
    handleSelectChange = (fieldName, event, index, value) => {
    	this.setState({[fieldName]: value})
    }

	render() {
		console.log("ClassTypeForm state -->>",this.state);
		console.log("ClassTypeForm props -->>",this.props);
		const { locationData } = this.props;
		const { skillCategoryData, skillSubjectData } = this.state;
		return (
			<div className="content">
				<form onSubmit={this.onSubmit}>
	      			<div className="container-fluid no-padding">
	      				<div className="col-sm-8 col-sm-8 col-xs-12">
	      					<div className="form-group row">
				               	<label for="example-text-input" className="col-md-4 col-form-label">
				               		Class Type Name *
				               	</label>
				               	<div className="col-md-8">
				                    <TextField
				                    	fullWidth={true}
							            id="text-field-controlled"
							            value={this.state.name}
							            onChange={this.handleInputChange.bind(this, "name")}
							        />
				                    
			                	</div>
	      					</div>
	      					<div className="form-group row">
				               	<label for="example-text-input" className="col-md-4 col-form-label">
				               		Brief Description
				               	</label>
				               	<div className="col-md-8">
				               		<TextField
				               			fullWidth={true}
				               			multiLine={true}
							            id="text-field-controlled"
							            value={this.state.desc}
							            onChange={this.handleInputChange.bind(this, "desc")}
							        />
			                	</div>
	      					</div>
	      					<div className="form-group row">
	      						<label for="example-text-input" className="col-md-4 col-form-label">
				               		Skill Category *
				               	</label>
				               	<div className="col-md-8">
		      						<AutoComplete
		      							openOnFocus={true}
		      							fullWidth={true}
								      	dataSource={skillCategoryData}
								      	dataSourceConfig={{text: "name", value: "_id"}}
								      	filter={AutoComplete.caseInsensitiveFilter}
								      	onNewRequest={this.onSkillCategorySelect}
	                      				onUpdateInput={this.onUpdateSkillCategoryInput}
								    />
	      						</div>
	      					</div>
	      					<div className="form-group row">
	      						<label for="example-text-input" className="col-md-4 col-form-label">
				               		Skill Subject
				               	</label>
				               	<div className="col-md-8">
		      						<SelectArrayInput  
		      							optionValue="_id" 
		      							optionText="name" 
		      							input={{ value: this.state.selectedSkillSubject ,onChange: this.onChange}} 
		      							onChange={this.onChange} 
		      							source=""
		      							dataSourceConfig={{ text: 'name', value: '_id' }} 
		      							choices={skillSubjectData} />
	      						</div>
	      					</div>
	      					<div className="form-group row">
	      						<label for="example-text-input" className="col-md-4 col-form-label">
				               		Gender
				               	</label>
				               	<div className="col-md-8">
				               		<SelectField
				               			fullWidth={true}
								        hintText="Select Gender"
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
	      					<div className="form-group row">
	      						<label for="example-text-input" className="col-md-4 col-form-label">
				               		Experience Level
				               	</label>
				               	<div className="col-md-8">
				               		<SelectField
				               			fullWidth={true}
								        hintText="Experience Level"
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
	      					<div className="row">
	      						<div className="form-group col-md-6">
		      						<label for="example-text-input" className="col-md-4 col-form-label">
					               		<span>Age</span>
					               	</label>
					               	<div className="col-md-8">
					                    <TextField
					                    	fullWidth={true}
								            id="text-field-controlled"
								            value={this.state.ageMin}
								            onChange={this.handleInputChange.bind(this, "ageMin")}
								        />
   					               	</div>
	      						</div>
	      						<div className="form-group col-md-6">
		      						<label for="example-text-input" className="col-md-4 col-form-label">
					               		<span>To</span>
					               	</label>
					               	<div className="col-md-8">
					                    <TextField
					                    	fullWidth={true}
								          id="text-field-controlled"
								          value={this.state.ageMax}
								          onChange={this.handleInputChange.bind(this, "ageMax")}
								        />
					               	</div>
	      						</div>
				            </div>
				            <div className="form-group row">
	      						<label for="example-text-input" className="col-md-4 col-form-label">
				               		Location *
				               	</label>
				               	<div className="col-md-8">
				               		<SelectField
				               			fullWidth={true}
								        hintText="Select Location"
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
	      				<div className="col-sm-4 col-sm-4 col-xs-12">
	      					<div className="fileinput fileinput-new card-button text-center" data-provides="fileinput">
							    <div className="fileinput-new card-button thumbnail">
							        <img className="" src={config.defaultSchoolImage} alt="Profile Image" id="pic" />
							    </div>
							    <div className="fileinput-preview fileinput-exists thumbnail"></div>
							    <div>
							        <span className="btn btn-warning btn-sm btn-file">
					                    <span className="fileinput-new">Upload New Image</span>
							        	<span className="fileinput-exists">Change</span>
							        	<input type="hidden" />
							        	<input type="file" name="..." accept="image/*" id="ProfileImage" ref="ProfileImage" />
							        </span>
							        <a href="#" className="btn btn-danger  fileinput-exists" data-dismiss="fileinput">
					                    <i className="fa fa-times"></i>
				                      	Remove
				                  </a>
							    </div>
							</div>
	      				</div>
	      			</div>
      				<div className="row">
      					<RaisedButton
      						className="pull-right" 
      						label="Save"
      						type="submit" 
      						primary={true} 
      						style={{margin: 12}}
      					/>
      				</div>
      			</form>	
      		</div>	
		)
	}
}