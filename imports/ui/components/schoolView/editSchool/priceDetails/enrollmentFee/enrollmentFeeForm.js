import React from 'react';
import { get } from 'lodash';
import { ContainerLoader } from '/imports/ui/loading/container';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import { withStyles } from '/imports/util';
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
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import '/imports/api/enrollmentFee/methods';

const formId = "ClassPriceForm";


const styles = theme => {
    return {
        button: {
          margin: 5,
          width: 150
        }
    }
}

class EnrollmentFeeForm extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            pymtType: get(this.props, 'data.pymtType', ''),
            selectedClassType: get(this.props, 'data.selectedClassType', null)
        }
    }

    handleClassTypeInputChange = (value) => {
        console.log("ClassPriceForm handleClassTypeInputChange -->>",value)
        Meteor.call("classType.getClassTypeByTextSearch",{schoolId:this.props.schoolId, textSearch: value}, (err,res) => {
            console.log("ClassPriceForm classType.getClassTypeByTextSearch res -->>",res)
            this.setState({
                classTypeData: res || [],
            })
        })
    }

    onClassTypeChange = (values)=> {
        console.log("ClassPriceForm onClassTypeChange values-->>",values)
        this.setState({selectedClassType: values})
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { selectedClassType } = this.state;
        const { data, schoolId } = this.props;
        const payload = {
            schoolId: schoolId,
            name: this.enrollmentName.value,
            classTypeId: selectedClassType && selectedClassType.map(data => data._id),
            cost: this.enrollmentCost.value && parseInt(this.enrollmentCost.value),
        }
        this.setState({isBusy: true});
        if(data && data._id) {
            this.handleSubmit({ methodName: "enrollmentFee.editEnrollmentFee", doc: payload, doc_id: data._id})
        } else {
            this.handleSubmit({ methodName: "enrollmentFee.addEnrollmentFee", doc: payload })
        }
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

    cancelConfirmationModal = ()=> this.setState({showConfirmationModal: false})
	
    render() {
		const { fullScreen, data } = this.props;
        const { classTypeData } = this.state;
        console.log("enrollmentFee form state -->>",this.state);
		return (
			<Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title"
                fullScreen={fullScreen}
            >
            	<DialogTitle id="form-dialog-title">Add Enrollment Fee</DialogTitle>
            	{ 
                    this.state.showConfirmationModal && <ConfirmationModal
                        open={this.state.showConfirmationModal}
                        submitBtnLabel="Yes, Delete"
                        cancelBtnLabel="Cancel"
                        message="You will delete this Enrollment Fee, Are you sure?"
                        onSubmit={() => this.handleSubmit({ methodName: "enrollmentFee.removeEnrollmentFee", doc: data})}
                        onClose={this.cancelConfirmationModal}
                    />
                }
                { this.state.isBusy && <ContainerLoader/>}
            	{ 
                    this.state.error ? <div style={{color: 'red'}}>{this.state.error}</div> : (
                        <DialogContent>
                            <form id={formId} onSubmit={this.onSubmit}>
                                <TextField
                                    required={true}
                                    defaultValue={data && data.name}
                                    margin="dense"
                                    inputRef={(ref)=> this.enrollmentName = ref}
                                    label="Enrollment Fee Name"
                                    type="text"
                                    fullWidth
                                />
                                <SelectArrayInput
                                    disabled={false}
                                    floatingLabelText="Class Types"  
                                    optionValue="_id" 
                                    optionText="name" 
                                    input={{ value: this.state.selectedClassType ,onChange: this.onClassTypeChange}} 
                                    onChange={this.onClassTypeChange} 
                                    setFilter={this.handleClassTypeInputChange}
                                    dataSourceConfig={{ text: 'name', value: '_id' }} 
                                    choices={classTypeData} 
                                />
                                <TextField
                                    required={true}
                                    defaultValue={data && data.cost}
                                    margin="dense"
                                    inputRef={(ref)=> this.enrollmentCost = ref}
                                    label="Cost"
                                    type="number"
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
		)
	}
}

export default withStyles(styles)(withMobileDialog()(EnrollmentFeeForm));