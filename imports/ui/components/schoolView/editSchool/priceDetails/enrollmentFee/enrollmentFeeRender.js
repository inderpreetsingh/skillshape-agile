import React from "react";
import Icon from 'material-ui/Icon';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Add from 'material-ui-icons/Add';
import Edit from 'material-ui-icons/Edit';
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/Delete';

import EnrollmentFeeForm from './enrollmentFeeForm';
import PanelHeader from '../panelHeader';

export default function () {

	console.log("EnrollmentFee render props -->>",this.props)
	const { classes, schoolId, enrollmentFeeData } = this.props;

	return (
		<div className="class-price-details">
			{
          		this.state.showForm && <EnrollmentFeeForm
          			schoolId={schoolId}
          			data={this.state.formData}
          			open={this.state.showForm}
					onClose={this.handleFormModal}
					classTypeData={this.props.classTypeData}  
          		/>
          	}
          	<PanelHeader btnText="Add Enrollment Fee" title="Enrollment Fee Cost" caption="Cost of Enrollment" icon="assignment" onAddButtonClicked={()=> {this.setState({showForm: true, formData: null})}} />

          	<Grid container className={classes.enrollmentFeeContainer}>
	          	{
	          		enrollmentFeeData && enrollmentFeeData.map((enrollmentFee, index)=> {
	          			return (
	          				<Grid item xs={12} md={3} sm={4} className={classes.paddingTopAndBottom}>
	          				<Card key={index} style ={{height:'100%'}} className={`${classes.card} price-card-container`}>
	          					<CardContent className={classes.content}>
	             					<Typography align="center" type="headline">
	             						{enrollmentFee.name}
	             					</Typography>
	             					<br></br>
	                                <Typography component="p">
	                                    <b>Cost:</b> ${enrollmentFee.cost}
	                                </Typography>
	                                <br></br>
	          						<Typography component="p">
	          							<b>Class Types Covered:</b> {
	          								_.isEmpty(enrollmentFee.selectedClassType) ? "None" :
	          								enrollmentFee.selectedClassType.map((classType) => {
	          									return <span>{classType.name} </span>
	          								})
	          							}
	          						</Typography>
	          					</CardContent>
          						<CardActions>
						            <Button onClick={() => this.setState({showForm: true, formData: enrollmentFee})} color="primary" style={{width: '100%'}} dense>
						          		Edit
						            </Button>
						        </CardActions>
	          				</Card>
	          				</Grid>
	          			)
	          		})
	          	}
          	</Grid>
		</div>
	)
}