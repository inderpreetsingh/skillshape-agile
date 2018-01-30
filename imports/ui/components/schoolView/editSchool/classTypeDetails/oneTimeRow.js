import React from 'react';
import Grid from 'material-ui/Grid';
import isEmpty from 'lodash/isEmpty';
import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';
import { MaterialTimePicker } from '/imports/startup/client/material-ui-time-picker';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';


export class OneTimeRow extends React.Component {

	constructor(props) {
        super(props);
        this.state = this.initializeFields();
    }

    initializeFields = () => {
    	let state;
    	const { data, locationData, parentData } = this.props;

    	if(isEmpty(data)) {
    		state = {
	    		row:  [
	    			{
	    				startDate: {},
	    				startTime: {},
	    				duration: "",
	    				roomId: "",
	    			}
	    		]
	    	}
    	} else {
    		state = { row:[...data]}
    	}
    	return state;
    }

    addNewRow = ()=> {
    	const oldRow = [...this.state.row];
    	oldRow.push({ startDate: {}, startTime: {}, duration: "", roomId: ""});
    	this.setState({ row: oldRow })
    }

    removeRow = (index, event)=> {
    	const oldRow = [...this.state.row];
    	oldRow.splice(index, 1);
    	this.setState({ row: oldRow });
    }

    handleChangeDate = (index, fieldName, event, date) => {
        const oldRow = [...this.state.row];
        oldRow[index][fieldName] = date;
        this.setState({ row: oldRow });
    }

    handleSelectInputChange = (index, fieldName, event)=> {
    	const oldRow = [...this.state.row];
        if(fieldName === "duration") {
            oldRow[index][fieldName] = parseInt(event.target.value)
        } else {
    		oldRow[index][fieldName] = event.target.value
        }

        this.setState({ row: oldRow });
    }

    getRowData = ()=> {
    	return this.state.row;
    }

	render() {
		const { row } = this.state;
		console.log("OneTimeRow state -->>",this.state);
		return (
			<div>
				{
					row.map((data, index) => {
						return (
		                    <Grid style={{border: '1px solid black', marginBottom: 15,padding: 5, backgroundColor: 'antiquewhite'}} key={index} container>
		                        <Grid item sm={6} xs={12}>
		                            <MaterialDatePicker
		                                required={true}
		                                hintText={"Start Date"}
		                                floatingLabelText={"Start Date *"}
		                                value={data ? data.startDate: ""}
		                                onChange={this.handleChangeDate.bind(this, index, "startDate")}
		                                fullWidth={true}
		                            />
		                        </Grid>
		                        <Grid item sm={6} xs={12}>
		                            <MaterialTimePicker
		                                required={true}
		                                format={"ampm"}
		                                value={data ? data.startTime: ""}
		                                floatingLabelText={"Start Time *"}
		                                hintText={"Start Time"}
		                                onChange={this.handleChangeDate.bind(this, index, "startTime")}
		                                fullWidth={true}
		                            />
		                        </Grid>
		                        <Grid item sm={6} xs={12}>
		                            <TextField
		                                required={true}
		                                defaultValue={data ? data.duration: ""}
		                                margin="dense"
		                                label="Length"
		                                type="number"
		                                onChange={this.handleSelectInputChange.bind(this, index, "duration")}
		                                fullWidth
		                            />
		                        </Grid>
		                        <Grid item sm={6} xs={12}>
		                            <FormControl fullWidth margin='dense'>
		                                <InputLabel htmlFor="roomId">Room</InputLabel>
		                                <Select
		                                    input={<Input id="roomId"/>}
		                                    value={data ? data.roomId: ""}
		                                    onChange={this.handleSelectInputChange.bind(this, index, "roomId")}
		                                    fullWidth
		                                >
		                                    {
	                                            this.props.roomData && this.props.roomData.map((data, index)=> {
	                                                return <MenuItem key={index} value={data.id}>{data.name}</MenuItem>
	                                            })
	                                        }
		                                </Select>
		                            </FormControl>
		                        </Grid>
		                        <Grid  item xs={12} sm={4}>
			                        <Button onClick={this.removeRow.bind(this, index)} raised color="accent" >
			                            Delete
			                        </Button>
			                    </Grid>
		                    </Grid>
						)
					})
				}
				<div>
                    <Typography type="caption">
                        If it is required that students come to more than one class as a group, add the additional class here.
                        Unless attendance to another class is required, a separate Class Times should be created for each class.
                    </Typography>
            		<Button onClick={this.addNewRow} style={{width: 162}} raised color="secondary" >
                        Add Another Time
                    </Button>
                </div>
			</div>
		)
	}
}