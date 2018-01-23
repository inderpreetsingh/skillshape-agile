import React from 'react';
import Grid from 'material-ui/Grid';
import { MaterialTimePicker } from '/imports/startup/client/material-ui-time-picker';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';

const scheduleDetails = [
	"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

export class WeekDaysRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initializeFields();
    }

    initializeFields = ()=> {
    	const { data, locationData, parentData } = this.props;
    	const state = {
    		row:  []
    	}
    	if(!_.isEmpty(data)) {
            // console.log("WeekDaysRow initializeFields -->>",data);
    		for(let key in data) {
                for(let obj of data[key]) {
        			state.row.push({
        				key: key,
        				startTime: obj.startTime,
        				duration: obj.duration,
        				day: obj.day,
        				roomId: obj.roomId,
        			})
                }
    		}
    	} else {
    		state.row.push({ key: null, startTime: {}, duration: "", day: null, roomId: null})
    	}
    	// console.log("WeekDaysRow initializeFields -->>",state)
    	return state;
    }

    handleChangeDate = (index, fieldName, event, date) => {
        // console.log("handleChangeDate -->>", fieldName, date)
        const oldRow = [...this.state.row];
       	oldRow[index][fieldName] = date;
       	this.setState({ row: oldRow });
    }

    addNewRow = ()=> {
    	const oldRow = [...this.state.row];
    	oldRow.push({ key: null, startTime: {}, duration: "", day: null, roomId: null});
    	this.setState({ row: oldRow })
    }

    removeRow = (index, event)=> {
    	const oldRow = [...this.state.row];
    	oldRow.splice(index, 1);
    	this.setState({ row: oldRow });
    }

    handleSelectInputChange = (index, fieldName, event)=> {
    	const oldRow = [...this.state.row];
    	// console.log("handleSelectInputChange -->>",event.target.value)
    	oldRow[index][fieldName] = event.target.value

        if(fieldName === "key") {
            oldRow[index].day = 1+scheduleDetails.indexOf(event.target.value);
        }

        if(fieldName === "duration") {
            oldRow[index][fieldName] = parseInt(event.target.value)
        }

        this.setState({ row: oldRow });
    }

    getRowData = ()=> {
        let rowData  = this.state.row.filter((data) => { return data.key})
        const grouped = _.groupBy(rowData, function(item) {
            return item.key;
        });
        // console.log("getRowData grouped", grouped)
        return grouped;
    }

    render() {
    	const { row } = this.state;
    	console.log("WeekDaysRow state -->>",this.state);
    	console.log("WeekDaysRow props -->>",this.props);
        return (
        	<div >
        		{
        			row.map((data, index) => {
		        		return (<Grid style={{border: '1px solid black', marginBottom: 15,padding: 5, backgroundColor: 'antiquewhite'}} key={index} container>
		                    <Grid item sm={6} xs={12}>
		                		<FormControl fullWidth margin='dense'>
                                    <InputLabel htmlFor="weekDay">WeekDay</InputLabel>
                                    <Select
    								    input={<Input id="weekDay"/>}
    								    value={data ? data.key : ""}
    								    onChange={this.handleSelectInputChange.bind(this, index, "key")}
    								    fullWidth
    								>
    								    {
    								        scheduleDetails.map((day,key) => {
    								            return <MenuItem key={key} value={day}>{day}</MenuItem>
    								        })
    								    }
    								</Select>
                                </FormControl>
		                	</Grid>
		                	<Grid item sm={6} xs={12}>
		                		<MaterialTimePicker
                                    required={true}
                                    format={"ampm"}
                                    value={data && data.startTime}
                                    floatingLabelText={"Start Time *"}
                                    hintText={"Start Time"}
                                    onChange={this.handleChangeDate.bind(this, index, "startTime")}
                                    fullWidth={true}
                                />
		                	</Grid>
		                	<Grid item sm={6} xs={12}>
		                		<TextField
		                		    defaultValue={data && data.duration}
                                    margin="dense"
                                    onChange={this.handleSelectInputChange.bind(this, index, "duration")}
                                    label="Duration"
                                    type="number"
                                    fullWidth
                                />
		                	</Grid>
		                	<Grid item sm={6} xs={12}>
		                		<FormControl fullWidth margin='dense'>
                                    <InputLabel htmlFor="roomId">Room</InputLabel>
                                    <Select
    								    value={data ? data.roomId: ""}
    								    input={<Input id="roomId"/>}
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
		                </Grid>)
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