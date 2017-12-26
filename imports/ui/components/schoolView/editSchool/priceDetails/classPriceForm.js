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

const formId = "LocationForm";

const styles = theme => {
    return {
        button: {
          margin: 5,
          width: 150
        }
    }
}

class ClassPriceForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        
    }


    getActionButtons = (data)=> {
        if(data) {
            return (
                <DialogActions>
                    <Button type="submit" form={formId} color="primary">
                      Edit Location
                    </Button>
                    <Button onClick={() => this.handleSubmit(data, true)} color="primary">
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
        console.log("ClassPriceForm render props -->>>",this.props);
        console.log("ClassPriceForm render state -->>>",this.state);
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

export default withStyles(styles)(withMobileDialog()(ClassPriceForm));