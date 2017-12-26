import React from 'react';
import { get } from 'lodash';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
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

class MonthlyPriceForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            pymtType: get(this.props, 'data.pymtType', ''),
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        
    }

    handleSelectOnChange = event => {
        this.setState({ pymtType: event.target.value });
    };

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
        console.log("MonthlyPriceForm render props -->>>",this.props);
        console.log("MonthlyPriceForm render state -->>>",this.state);
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
                                        defaultValue={data && data.packageName}
                                        margin="dense"
                                        inputRef={(ref)=> this.packageName = ref}
                                        label="Package Name"
                                        type="text"
                                        fullWidth
                                    />
                                    <Select
                                        native={false}
                                        margin="dense"
                                        value={this.state.pymtType}
                                        onChange={this.handleSelectOnChange}
                                        fullWidth
                                    >
                                        <MenuItem value={"Automatic Withdrawal"}>Automatic Withdrawal</MenuItem>
                                        <MenuItem value={"Pay As You Go"}>Pay As You Go</MenuItem>
                                    </Select>
                                    <TextField
                                        defaultValue={data && data.oneMonCost}
                                        margin="dense"
                                        inputRef={(ref)=> this.oneMonCost = ref}
                                        label="1 Month Package"
                                        type="number"
                                        fullWidth
                                    />
                                    <TextField
                                        defaultValue={data && data.threeMonCost}
                                        margin="dense"
                                        inputRef={(ref)=> this.threeMonCost = ref}
                                        label="3 Month Package"
                                        type="number"
                                        fullWidth
                                    />
                                    <TextField
                                        defaultValue={data && data.sixMonCost}
                                        margin="dense"
                                        inputRef={(ref)=> this.sixMonCost = ref}
                                        label="6 Month Package"
                                        type="number"
                                        fullWidth
                                    />
                                    <TextField
                                        defaultValue={data && data.annualCost}
                                        margin="dense"
                                        inputRef={(ref)=> this.annualCost = ref}
                                        label="1 Year Rate"
                                        type="number"
                                        fullWidth
                                    />
                                    <TextField
                                        defaultValue={data && data.lifetimeCost}
                                        margin="dense"
                                        inputRef={(ref)=> this.lifetimeCost = ref}
                                        label="LifeTime Cost"
                                        type="number"
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

export default withStyles(styles)(withMobileDialog()(MonthlyPriceForm));