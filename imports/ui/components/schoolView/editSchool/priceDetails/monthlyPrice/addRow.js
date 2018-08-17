import React, { Fragment } from 'react';
import { get } from 'lodash';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
export default class AddRow extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			row: get(this.props, "rowData", [{ month: null, cost: null, currency: this.props.currency }])
		}
	}
	componentWillReceiveProps(props) {
		// Change row data only if payment method changes
		if (this.props.tabValue != props.tabValue) {
			this.setState({
				row: get(props, "rowData", [{ month: null, cost: null, currency: this.props.currency }])
			})
		}
	}
	addNewRow = () => {
		const oldRow = [...this.state.row];
		oldRow.push({ month: null, cost: null, currency: this.props.currency });
		this.setState({ row: oldRow })
	}

	onChangeInput = (key, index, event) => {
		const oldRow = [...this.state.row];
		oldRow[index][key] = parseInt(event.target.value);
		this.setState({ row: oldRow });
	}

	removeRow = (index, event) => {
		const oldRow = [...this.state.row];
		oldRow.splice(index, 1);
		this.setState({ row: oldRow });
	}

	getRowData = () => {
		return this.state.row;
	}

	render() {
		const { classes, tabValue, currency } = this.props;

		return (
			<div style={{ border: '1px solid black', margin: 2, padding: 5, backgroundColor: 'antiquewhite' }}>
				{
					this.state.row.map((data, index) => {
						return (
							<Grid key={tabValue + index} container>
								<Grid item xs={12} sm={4}>
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
								{/* 1.Currency selection will align with the cost field.(Done)
                                    2.School Default currency will be selected as default. (Done)
                                    or in case of edit package already selected currency will be become default currency.(Done)
                                    3.New field currency need to be created  in the classPricing collection. (Done)
                                    4.User selected currency name and symbol store in the state.(Done)
                                    5.On Save store in the collection.(Done)
                                */}
								<Grid item xs={12} sm={4}>
									<FormControl
										margin="dense"
										required={true}
										fullWidth
									>
										<InputLabel htmlFor="amount">Cost</InputLabel>
										<Input
											defaultValue={data && data.cost}
											onChange={this.onChangeInput.bind(this, "cost", index)}
											startAdornment={<Select
												required={true}
												input={<Input id="currency" />}
												value={data && data.currency || currency}
												onChange={(event) => {

													const oldRow = [...this.state.row];
													oldRow[index]['currency'] = event.target.value;
													this.setState({ row: oldRow });

												}
												}
											>
												{config.currency.map((data, index) => {
													return <MenuItem
														key={data.label}
														value={data.value}>
														{data.value}
													</MenuItem>
												})}
											</Select>}
											label="Cost"
											type="number"
											fullWidth
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={4}>
									{/* <Button className={classes.button} onClick={this.removeRow.bind(this, index)} raised color="accent" >
			                            Delete
			                        </Button> */}
									<FormGhostButton
										alertColor
										onClick={this.removeRow.bind(this, index)}
										label="Delete"
									/>
								</Grid>
							</Grid>
						)
					})
				}
				{/* <Button className={classes.button} onClick={this.addNewRow} style={{width: 161}} raised color="secondary" >
                    Add Another Row
                </Button> */}
				<FormGhostButton
					darkGreyColor
					onClick={this.addNewRow}
					label="Add Another Row"
				/>
			</div>
		)
	}
}