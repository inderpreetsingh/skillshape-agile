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

import ClassPriceForm from './classPriceForm';

export default function () {

	console.log("classPrice render props -->>",this.props)
	const { classes, schoolId, classPricingData } = this.props;
	console.log("classPrice classes -->>",classes)

	return (
		<div className="class-price-details">
			{
          		this.state.showForm && <ClassPriceForm 
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
	                		Per Class Packages
	                	</span>
	              	</Grid>
	              	<Grid item sm={7} xs={12}>
		                <Typography type="caption" >
		                </Typography>
	            	</Grid>
	              	<Grid style={{display: 'inline-flex',alignItems: 'center',justifyContent: 'center'}} item sm={3} xs={12}>
		                <Button onClick={() => this.setState({showForm: true, formData: null})} color="primary" raised dense>
		                  <Add style = {{marginRight: 2}} />
		                  	Add Per Class Package
		                </Button>
	                </Grid>
	            </Grid>
          	</Paper>
               <div style={{display: 'inline-flex', flexWrap: 'wrap'}}>
               	{
               		classPricingData && classPricingData.map((classPrice, index)=> {
               			return (
               				<Card key={index} className={`${classes.card} price-card-container`}>
               					<CardContent className={classes.content}>
                      					<Typography align="center" type="headline">
                      						{classPrice.packageName}
                      					</Typography>
                                             <br></br>
               						<Typography component="p">
               							{classPrice.cost}$  for {classPrice.noClasses} class
               						</Typography>
                                             <br></br>
               						<Typography component="p">
               							Expiration: {(classPrice.expDuration && classPrice.expPeriod) ? `${classPrice.expDuration} ${classPrice.expPeriod}` : "None"}
               						</Typography>
                                             <br></br>
               						<Typography component="p">
               							Covers: {
               								_.isEmpty(classPrice.selectedClassType) ? "None" : 
               								classPrice.selectedClassType.map((classType) => {
               									return <span>{classType.name} </span>
               								})
               							}
               						</Typography>
                                        </CardContent>
          						<CardActions>
						              <Button onClick={() => this.setState({showForm: true, formData: classPrice})} color="primary" style={{width: '100%'}} dense>
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