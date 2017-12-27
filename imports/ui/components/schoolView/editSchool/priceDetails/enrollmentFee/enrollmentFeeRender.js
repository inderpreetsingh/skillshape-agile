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
          		/>	
          	}
			<Paper elevation={4}>
	            <Grid container className={classes.classtypeHeader}>
	              	<Grid  item sm={2} xs={12} style={{display: 'inline-flex',alignItems: 'center'}}>
	                	<span> 
	                		<Icon className="material-icons" style={{marginRight: 5}}>assignment</Icon>
	                	</span> 
	                	<span>
	                		
	                	</span>
	              	</Grid>
	              	<Grid item sm={7} xs={12}>
		                <Typography type="caption" >
		                	Enrollment Fee Cost
		                </Typography>
	            	</Grid>
	              	<Grid style={{display: 'inline-flex',alignItems: 'center',justifyContent: 'center'}} item sm={3} xs={12}>
		                <Button onClick={() => this.setState({showForm: true, formData: null})} color="primary" raised dense>
		                  <Add style = {{marginRight: 2}} />
		                  	Add Enrollment Fee
		                </Button>
	                </Grid>
	            </Grid>
          	</Paper>
          	<div style={{display: 'inline-flex', flexWrap: 'wrap'}}>
	          	{
	          		enrollmentFeeData && enrollmentFeeData.map((enrollmentFee, index)=> {
	          			return (
	          				<Card key={index} className={classes.card}>
	          					<CardContent className={classes.content}>
	             					<Typography align="center" type="headline">
	             						{enrollmentFee.name}
	             					</Typography>
	             					<br></br>
	                                <Typography component="p">
	                                    Cost: {enrollmentFee.cost}$
	                                </Typography>
	                                <br></br>
	          						<Typography component="p">
	          							Covers: {
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
	          			)
	          		})
	          	}
          	</div>
		</div>
	)
}