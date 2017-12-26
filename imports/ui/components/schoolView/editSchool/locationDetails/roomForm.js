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

const formId = "RoomForm";

const styles = theme => {
  	return {
	    button: {
	      margin: 5,
	      width: 150
	    }
    }
}

class RoomForm extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
    		isBusy: false
    	}
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { data, parentKey } = this.props;
        const payload = {
            name: this.roomName.value,
            capicity: this.capicity.value,
        }
        this.setState({isBusy: true});
        if(data) {
            payload.id = data.id;
            this.handleSubmit({ methodName: "location.editRoom", data: payload, locationId: parentKey})
        } else {
            this.handleSubmit({ methodName: "location.addRoom", data: payload, locationId: parentKey})
        }
    }

    handleSubmit = ({methodName, data, locationId})=> {
        console.log("handleSubmit methodName-->>",methodName)
        console.log("handleSubmit data-->>",data)
        console.log("handleSubmit locationId-->>",locationId)
        Meteor.call(methodName, { locationId, data }, (error, result) => {
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
                    <Button type="submit" form={formId} color="primary">
                      Edit Location
                    </Button>
                    <Button onClick={() => this.handleSubmit({ methodName: "location.roomRemove", data: data, locationId: this.props.parentKey})} color="primary">
                      Delete
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
        console.log("RoomForm render props -->>>",this.props);
        console.log("RoomForm render state -->>>",this.state);
        const { fullScreen, data } = this.props;
        return (
            <div>
                <Dialog
                  open={this.props.open}
                  onClose={this.props.onClose}
                  aria-labelledby="form-dialog-title"
                  fullScreen={fullScreen}
                >
                    <DialogTitle id="form-dialog-title">Add Room</DialogTitle>
                    { this.state.isBusy && <ContainerLoader/>}
                    { 
                        this.state.error ? <div style={{color: 'red'}}>{this.state.error}</div> : (
                            <DialogContent>
                                <form id={formId} onSubmit={this.onSubmit}>
                                    <TextField
                                        required={true}
                                        defaultValue={data && data.name}
                                        margin="dense"
                                        inputRef={(ref)=> this.roomName = ref}
                                        label="Name"
                                        type="text"
                                        fullWidth
                                    />
                                    <TextField
                                        required={true}
                                        defaultValue={data && data.capicity}
                                        margin="dense"
                                        inputRef={(ref)=> this.capicity = ref}
                                        label="Capicity"
                                        type="text"
                                        fullWidth
                                    />
                                </form>
                            </DialogContent>
                        )
                    }
                   
                    {this.getActionButtons(data)}
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(withMobileDialog()(RoomForm));