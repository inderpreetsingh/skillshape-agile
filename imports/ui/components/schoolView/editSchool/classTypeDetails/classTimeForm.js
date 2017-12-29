import React from 'react';
import { ContainerLoader } from '/imports/ui/loading/container';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import config from '/imports/config';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import '/imports/api/sLocation/methods';

const formId = "classTypeForm";

const styles = theme => {
  	return {
	    button: {
	        margin: 5,
	        width: 150
	    },
	    classtypeInputContainer: {
		    alignItems: 'center',
		    textAlign: 'left'
		}
    }
}

class ClassTimeForm extends React.Component {

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
    	console.log("onSubmit state -->>",this.state);
    	const { schoolId, data } = this.props;
    	
    	const payload = {
    		schoolId: schoolId,
    		name: this.classTypeName.value,
    		desc: this.desc.value,
    		skillCategoryId: this.state.selectedSkillCategory && this.state.selectedSkillCategory.map(data => data._id),
    		skillSubject: this.state.selectedSkillSubject && this.state.selectedSkillSubject.map(data => data._id),
    		gender: this.state.gender,
    		experienceLevel: this.state.experienceLevel,
    		ageMin: this.ageMin.value,
    		ageMax: this.ageMax.value,
    		locationId: this.state.location,
    	}

    	if(data && data._id) {
            this.handleSubmit({ methodName: "classType.editClassType", doc: payload, doc_id: data._id })
        } else {
            this.handleSubmit({ methodName: "classType.addClassType", doc: payload })
        }
    	
    }

    handleSubmit = ({ methodName, doc, doc_id })=> {
    	console.log("handleSubmit methodName-->>",methodName)
        console.log("handleSubmit doc-->>",doc)
        console.log("handleSubmit doc_id-->>",doc_id)
        Meteor.call(methodName, { doc, doc_id }, (error, result) => {
            if (error) {
              console.error("error", error);
            }
            if (result) {
                this.props.onClose()
            }
            this.setState({isBusy: false, error});
        });
    }

	render() {
		const { fullScreen, data, classes, locationData } = this.props;
		const { skillCategoryData, skillSubjectData } = this.state;

		return (
			<div>
				<Dialog
		          open={this.props.open}
		          onClose={this.props.onClose}
		          aria-labelledby="form-dialog-title"
		          fullScreen={fullScreen}
		        >
		        	<DialogTitle id="form-dialog-title">Add and edit Class Times functionality not yet implemented!!!!</DialogTitle>
		        	
		        </Dialog>
			</div>
		)
	}
}  

export default withStyles(styles)(withMobileDialog()(ClassTimeForm));