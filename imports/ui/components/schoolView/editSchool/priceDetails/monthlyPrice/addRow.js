import React, {Fragment} from 'react';
import { get } from 'lodash';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

export default class AddRow extends React.Component {

	constructor(props) {
        super(props);
            this.state = {
                row: get(this.props, "rowData", [{month: null, cost: null}])
            }
    }
    componentWillReceiveProps(props) {
        // Change row data only if payment method changes
        if(this.props.tabValue != props.tabValue) {
            this.setState({
                row: get(props, "rowData", [{month: null, cost: null}])
            })
        }
    }
    addNewRow = ()=> {
    	const oldRow = [...this.state.row];
    	oldRow.push({ month: null, cost: null });
    	this.setState({ row: oldRow })
    }

    onChangeInput = (key, index, event)=> {
    	const oldRow = [...this.state.row];
    	console.log("onChangeInput -->>", key, index, event.target.value)
    	oldRow[index][key] = parseInt(event.target.value);
    	console.log("onChangeInput oldRow -->>",oldRow)
    	this.setState({ row: oldRow });
    }

    removeRow = (index, event)=> {
    	const oldRow = [...this.state.row];
    	oldRow.splice(index, 1);
    	this.setState({ row: oldRow });
    }

    getRowData = ()=> {
    	return this.state.row;
    }

	render() {
        const { classes, tabValue } = this.props;
		return (
			<div style={{border: '1px solid black', margin: 2, padding: 5, backgroundColor: 'antiquewhite'}}>
				{
					this.state.row.map((data, index) => {
						return (
			                <Grid key={tabValue + index} container>
			                    <Grid  item xs={12} sm={4}>
			                        <TextField
			                        	required={true}
			                            defaultValue={data && data.month}
			                            onChange={this.onChangeInput.bind(this, "month", index)}
			                            margin="dense"
			                            label="Months"
			                            type="number"
			                            fullWidth
			                        />
			                    </Grid>
			                    <Grid  item xs={12} sm={4}>
			                        <FormControl
                                  		margin="dense"
                                  		required={true}
                                  		fullWidth
                                	>
	                                    <InputLabel htmlFor="amount">Cost</InputLabel>
				                        <Input
				                            defaultValue={data && data.cost}
				                            onChange={this.onChangeInput.bind(this, "cost", index)}
				                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
				                            label="Cost"
				                            type="number"
				                            fullWidth
				                        />
			                        </FormControl>
			                    </Grid>
			                    <Grid  item xs={12} sm={4}>
			                        <Button className={classes.button} onClick={this.removeRow.bind(this, index)} raised color="accent" >
			                            Delete
			                        </Button>
			                    </Grid>
			                </Grid>
						)
					})
				}
                <Button className={classes.button} onClick={this.addNewRow} style={{width: 161}} raised color="secondary" >
                    Add Another Row
                </Button>
            </div>
		)
	}
}