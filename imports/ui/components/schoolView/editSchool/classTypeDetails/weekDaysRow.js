import React from 'react';
import Grid from 'material-ui/Grid';
import { MaterialTimePicker } from '/imports/startup/client/material-ui-time-picker';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';

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
    		for(let i in data) {
    			state.row.push({
    				key: i,
    				startTime: data[i].startTime,
    				duration: data[i].duration,
    				day: data[i].day,
    				roomId: data[i].roomId,
    			})
    		}
    	} else {
    		state.row.push({ key: null, startTime: {}, duration: "", day: null, roomId: null})
    	}
    	console.log("WeekDaysRow initializeFields -->>",state)
    	return state;
    }

    handleChangeDate = (index, fieldName, event, date) => {
        console.log("handleChangeDate -->>", fieldName, date)
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
    	console.log("handleSelectInputChange -->>",event.target.value)
    	oldRow[index][fieldName] = event.target.value
    	this.setState({ row: oldRow });
    }

    getRowData = ()=> {
    	const { row } = this.state;
    	let obj = {};
    	for(let i of row) {
    		console.log("getRowData i -->>",i)
    		if(!_.isEmpty(i.key)) {
    			obj[i.key] = {
    				startTime: i.startTime,
    				duration: i.duration && parseInt(i.duration),
    				roomId: i.roomId,
    				day: scheduleDetails.indexOf(i.key)+1,
    			}
    		}
    	}
    	return obj;
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
		                		<Select
								    native
								    margin="dense"
								    style={{padding: 16, maxWidth: '90%'}}
								    input={<Input id="day"/>}
								    value={data && data.key}
								    onChange={this.handleSelectInputChange.bind(this, index, "key")}
								    fullWidth
								>
								    <option value={""}>{"Select Day"}</option>
								    {
								        scheduleDetails.map((day,key) => {
								        	// console.log("scheduleDetails -->>",day)
								            return <option key={key} value={day}>{day}</option>
								        })
								    }
								</Select>
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
		                		<Select
								    native
								    margin="dense"
								    style={{padding: 11, maxWidth: '90%'}}
								    value={data && data.roomId}
								    input={<Input id="roomId"/>}
								    onChange={this.handleSelectInputChange.bind(this, index, "roomId")}
								    fullWidth
								>
								    <option value={null}>{"Select Room"}</option>
								    {
                                        this.props.roomData.map((data, index)=> {
                                            return <option key={index} value={data.id}>{data.name}</option>
                                        })
                                    }
								</Select>
		                	</Grid>
		                	<Grid  item xs={12} sm={4}>
		                        <Button onClick={this.removeRow.bind(this, index)} raised color="accent" >
		                            Delete
		                        </Button>
		                    </Grid>  
		                </Grid>)    
        			})
        		}
        		<Button onClick={this.addNewRow} style={{width: 162}} raised color="secondary" >
                    Add Another Time
                </Button>
        	</div> 
        )
    }
}