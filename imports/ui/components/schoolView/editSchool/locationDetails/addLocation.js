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
import '/imports/api/sLocation/methods';

const formId = "addLocation";

const styles = theme => {
  	return {
	    button: {
	      margin: 5,
	      width: 150
	    }
    }
}

class AddLocation extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
        }  
    }

	onSubmit = (event) => {
		event.preventDefault();
		const payload = {
			createdBy: Meteor.userId(),
			schoolId: this.props.schoolId,
			title: this.refs.locationName,
			address: this.refs.streetAddress,
			city: this.refs.city,
			state: this.refs.state,
			zip: this.refs.zipCode,
			country: this.refs.country,
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
	          	this.addLocation(payload);
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
		              	
		              	this.addLocation(payload);
		            }
	            });
	        }
        });
	}

	addLocation = (payload)=> {
		console.log("addLocation payload -->>",payload)
		Meteor.call("location.addLocation", payload, (error, result) => {
	      if (error) {
	        console.error("error", error);
	      }
	      if (result) {
	        this.props.onClose()
	      }
	      this.setState({isBusy: false});
	    });
	}

	render() {
		const { fullScreen } = this.props;
		console.log("AddLocation render props -->>>",this.props);
		return (
			<div>
				<Dialog
		          open={this.props.open}
		          onClose={this.props.onClose}
		          aria-labelledby="form-dialog-title"
		          fullScreen={fullScreen}
		        >
		        	{ this.state.isBusy && <ContainerLoader/>}
		        	<DialogTitle id="form-dialog-title">Add Location</DialogTitle>
		        	<DialogContent>
		        		<form id={formId} onSubmit={this.onSubmit}>
			        		<TextField
			        			required={true}
				                margin="dense"
				                ref="locationName"
				                label="Location Name"
				                type="text"
				                fullWidth
				            />
				            <TextField
				                margin="dense"
				                ref="streetAddress"
				                label="Street Address"
				                type="text"
				                fullWidth
				            />
				            <TextField
				            	required={true}
				                margin="dense"
				                ref="city"
				                label="City"
				                type="text"
				                fullWidth
				            />
				            <TextField
				                margin="dense"
				                ref="state"
				                label="State"
				                type="text"
				                fullWidth
				            />
				            <TextField
				            	required={true}
				                margin="dense"
				                ref="zipCode"
				                label="Zip Code"
				                type="text"
				                fullWidth
				            />
				            <TextField
				            	required={true}
				                margin="dense"
				                ref="country"
				                label="Country"
				                type="text"
				                fullWidth
				            />
		        		</form>
		        	</DialogContent>
		        	<DialogActions>
			            <Button type="submit" form={formId} color="primary">
			              Submit
			            </Button>
			            <Button onClick={this.props.onClose} color="primary">
			              Cancel
			            </Button>
		            </DialogActions>
		        </Dialog>
			</div>
		)
	}
}  

export default withStyles(styles)(withMobileDialog()(AddLocation));