import React from 'react';
import { get } from 'lodash';
import { ContainerLoader } from '/imports/ui/loading/container';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
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
            selectedClassType: get(this.props, 'data.selectedClassType', null)
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { selectedClassType, pymtType } = this.state;
        const { data, schoolId } = this.props;
        const payload = {
            schoolId: schoolId,
            packageName: this.packageName.value,
            classTypeId: selectedClassType && selectedClassType.map(data => data._id),
            pymtType: pymtType,
            oneMonCost: this.oneMonCost.value && parseInt(this.oneMonCost.value),
            threeMonCost: this.threeMonCost.value && parseInt(this.threeMonCost.value),
            sixMonCost: this.sixMonCost.value && parseInt(this.sixMonCost.value),
            annualCost: this.annualCost.value && parseInt(this.annualCost.value),
            lifetimeCost: this.lifetimeCost.value && parseInt(this.lifetimeCost.value),
        }
        this.setState({isBusy: true});
        if(data && data._id) {
            this.handleSubmit({ methodName: "monthlyPricing.editMonthlyPricing", doc: payload, doc_id: data._id})
        } else {
            this.handleSubmit({ methodName: "monthlyPricing.addMonthlyPricing", doc: payload })
        }
        console.log("onSubmit payload-->>",payload)
    }

    handleSubmit = ({methodName, doc, doc_id})=> {
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

    handleSelectOnChange = event => {
        this.setState({ pymtType: event.target.value });
    };

    getActionButtons = (data)=> {
        if(data) {
            return (
                <DialogActions>
                    <Button type="submit" form={formId} color="primary">
                      Save 
                    </Button>
                    <Button onClick={() => this.handleSubmit({ methodName: "monthlyPricing.removeMonthlyPricing", doc: data})} color="primary">
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

    handleClassTypeInputChange = (value) => {
        console.log("handleClassTypeInputChange -->>",value)
        Meteor.call("classType.getClassTypeByTextSearch",{schoolId:this.props.schoolId, textSearch: value}, (err,res) => {
            console.log("classType.getClassTypeByTextSearch res -->>",res)
            this.setState({
                classTypeData: res || [],
            })
        })
    }

    onClassTypeChange = (values)=> {
        console.log("onClassTypeChange values-->>",values)
        this.setState({selectedClassType: values})
    }

    render() {
        console.log("MonthlyPriceForm render props -->>>",this.props);
        console.log("MonthlyPriceForm render state -->>>",this.state);
        const { fullScreen, data } = this.props;
        const { classTypeData } = this.state;
        return (
            <div>
                <Dialog
                  open={this.props.open}
                  onClose={this.props.onClose}
                  aria-labelledby="form-dialog-title"
                  fullScreen={fullScreen}
                >
                    <DialogTitle id="form-dialog-title">Add Monthly Pricing</DialogTitle>
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
                                    <SelectArrayInput
                                        disabled={false}
                                        floatingLabelText="Class Type *"  
                                        optionValue="_id" 
                                        optionText="name" 
                                        input={{ value: this.state.selectedClassType ,onChange: this.onClassTypeChange}} 
                                        onChange={this.onClassTypeChange} 
                                        setFilter={this.handleClassTypeInputChange}
                                        dataSourceConfig={{ text: 'name', value: '_id' }} 
                                        choices={classTypeData} 
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