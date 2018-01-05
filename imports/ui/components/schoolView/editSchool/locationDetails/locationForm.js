import React from 'react';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import '/imports/api/sLocation/methods';

const formId = "LocationForm";

const styles = theme => {
  	return {
	    button: {
	      margin: 5,
	      width: 150
	    }
    }
}

class LocationForm extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
    		isBusy: false
    	}
    }

	onSubmit = (event) => {
		event.preventDefault();
		const payload = {
			createdBy: Meteor.userId(),
			schoolId: this.props.schoolId,
			title: this.locationName.value,
			address: this.streetAddress.value,
			city: this.city.value,
			state: this.locState.value,
			zip: this.zipCode.value,
			country: this.country.value,
		}
		this.setState({isBusy: true});
        const sLocationDetail = payload.address + "," + payload.city + "," + payload.zip + "," + payload.country;
        
        getLatLong(sLocationDetail, (data) => {
        	console.log("getLatLong result -->>",data);
	        if(data) {
	            payload.geoLat = data.lat
	            payload.geoLong = data.lng
	            payload.loc = [data.lat, data.lng]
	          	console.log("Final payload 3-->>",payload)
	          	this.handleSubmit(payload);
	        } else {
	            const getLatLongPayload = payload.city + "," + payload.zip + "," + payload.country
	            getLatLong(getLatLongPayload, (data) => {
	            
		            if (data == null) {
		              console.error("Please enter valid address details");
		              return false;
		            } else {
		                payload.geoLat = data.lat
		              	payload.geoLong = data.lng
		              	payload.loc = [data.lat, data.lng]
		              	this.handleSubmit(payload);
		            }
	            });
	        }
        });
	}

	handleSubmit = (payload, deleteObj)=> {
		console.log("addLocation payload -->>",payload)
		const { data } = this.props;
		let methodName;
		let docObj = {};
		if(data && data._id) {
			docObj.doc = payload;
			if(deleteObj) {
				methodName = "location.removeLocation";
			} else {
				methodName = "location.editLocation";
				docObj.doc_id = data._id;
			}
		} else {
			methodName = "location.addLocation";
			docObj.doc = payload;
		}
		Meteor.call(methodName, docObj, (error, result) => {
	      if (error) {
	        console.error("error", error);
	      }
	      if (result) {
	        this.props.onClose()
	      }
	      this.setState({isBusy: false, error});
	    });
	}

	getActionButtons = (data)=> {
		if(data) {
			return (
				<DialogActions>
		            <Button onClick={() => this.handleSubmit(data, true)} color="primary">
		              Delete
		            </Button>
		            <Button type="submit" form={formId} color="primary">
		              Edit Location
		            </Button>
	            </DialogActions>
		    )
		} else {
			return (
				<DialogActions>
		            <Button type="submit" form={formId} color="primary">
		              Submit
		            </Button>
		            <Button onClick={() => this.props.onClose()} color="primary">
		              Cancel
		            </Button>
	            </DialogActions>
		    )
		}
	}

	render() {
		// console.log("AddLocation render props -->>>",this.props);
		// console.log("AddLocation render state -->>>",this.state);
		const { fullScreen, data } = this.props;
		return (
			<div>
				<Dialog
		          open={this.props.open}
		          onClose={this.props.onClose}
		          aria-labelledby="form-dialog-title"
		          fullScreen={fullScreen}
		        >
		        	<DialogTitle id="form-dialog-title">Add Location</DialogTitle>
		        	{ this.state.isBusy && <ContainerLoader/>}
		        	{ 
	                    this.state.showConfirmationModal && <ConfirmationModal
	                        open={this.state.showConfirmationModal}
	                        submitBtnLabel="Yes, Delete"
	                        cancelBtnLabel="Cancel"
	                        message="You will delete this location, Are you sure?"
	                        onSubmit={() => this.handleSubmit(data, true)}
	                        onClose={() => this.setState({showConfirmationModal: false})}
	                    />
	                }
		        	{ 
                        this.state.error ? <div style={{color: 'red'}}>{this.state.error}</div> : (
				        	<DialogContent>
				        		<form id={formId} onSubmit={this.onSubmit}>
					        		<TextField
					        			required={true}
						                defaultValue={data && data.title}
						                margin="dense"
						                inputRef={(ref)=> this.locationName = ref}
						                label="Location Name"
						                type="text"
						                fullWidth
						            />
						            <TextField
						            	defaultValue={data && data.address}
						                margin="dense"
						                inputRef={(ref)=> this.streetAddress = ref}
						                label="Street Address"
						                type="text"
						                fullWidth
						            />
						            <TextField
						            	required={true}
						            	defaultValue={data && data.city}
						                margin="dense"
						                inputRef={(ref)=> this.city = ref}
						                label="City"
						                type="text"
						                fullWidth
						            />
						            <TextField
						            	defaultValue={data && data.state}
						                margin="dense"
						                inputRef={(ref)=> this.locState = ref}
						                label="State"
						                type="text"
						                fullWidth
						            />
						            <TextField
						            	required={true}
						            	defaultValue={data && data.zip}
						                margin="dense"
						                inputRef={(ref)=> this.zipCode = ref}
						                label="Zip Code"
						                type="text"
						                fullWidth
						            />
						            <TextField
						            	required={true}
						            	defaultValue={data && data.country}
						                margin="dense"
						                inputRef={(ref)=> this.country = ref}
						                label="Country"
						                type="text"
						                fullWidth
						            />
				        		</form>
				        	</DialogContent>
                        
                        )
                    }
	        		<DialogActions>
                    {
                        data && (
                            <Button onClick={() => this.setState({showConfirmationModal: true})} color="accent">
                                Delete
                            </Button>
                        )
                    }
                    <Button onClick={() => this.props.onClose()} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" form={formId} color="primary">
                      { data ? "Save" : "Submit" } 
                    </Button>
                </DialogActions>
		        </Dialog>
			</div>
		)
	}
}  

export default withStyles(styles)(withMobileDialog()(LocationForm));