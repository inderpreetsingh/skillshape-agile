import React, {Fragment} from "react";
import Icon from 'material-ui/Icon';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Add from 'material-ui-icons/Add';
import Edit from 'material-ui-icons/Edit';
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/Delete';

import MonthlyPriceForm from './monthlyPriceForm';

export default function () {

	console.log("monthlyPrice render props -->>",this.props)
	const { classes, schoolId, monthlyPricingData } = this.props;

	return (
		<div className="class-price-details">
			{
          		this.state.showForm && <MonthlyPriceForm 
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
	                		Per Month Packages
	                	</span>
	              	</Grid>
	              	<Grid item sm={7} xs={12}>
		               <Typography type="caption" >
		                	
		               </Typography>
	            	</Grid>
	              	<Grid style={{display: 'inline-flex',alignItems: 'center',justifyContent: 'center'}} item sm={3} xs={12}>
		                <Button onClick={() => this.setState({showForm: true, formData: null})} color="primary" raised dense>
		                  <Add style = {{marginRight: 2}} />
		                  	Add Per Month Package
		                </Button>
	                </Grid>
	            </Grid>
          	</Paper>
               <div style={{display: 'inline-flex', flexWrap: 'wrap'}}>
               	{
               		monthlyPricingData && monthlyPricingData.map((monthPrice, index)=> {
               			console.log("monthPrice -->>",monthPrice)
               			return (
               				<Card key={index} className={`${classes.card} price-card-container`}>
               					<CardContent className={classes.content}>
                      					<Typography align="center" type="headline">
                      						{monthPrice.packageName}
                      					</Typography>
                                             <br></br>
                                             <Typography component="p">
                                                 Payment Method: {monthPrice.pymtMethod}
                                             </Typography>
                                             <br></br>
                                             {
                                                  monthPrice.pymtType && (
                                                       <Fragment>
                                                            <Typography component="p">
                                                                Payment Type: {monthPrice.pymtType}
                                                            </Typography>
                                                            <br></br>
                                                       </Fragment>
                                                  )
                                             }
               						<Typography component="p">
               							Covers: {
               								_.isEmpty(monthPrice.selectedClassType) ? "None" : 
               								monthPrice.selectedClassType.map((classType) => {
               									return <span>{classType.name} </span>
               								})
               							}
               						</Typography>
                                             <br></br>
                                             {
                                                  _.isEmpty(monthPrice.pymtDetails) ? "None" :
                                                  monthPrice.pymtDetails.map((payment) => {
                                                       return <Fragment> 
                                                            <Typography component="p">
                                                                 {payment.cost}$ per month for {payment.month} months
                                                            </Typography>
                                                            <br></br>
                                                       </Fragment> 
                                                  })
                                             }
                                        </CardContent>
          						<CardActions>
						               <Button onClick={() => this.setState({showForm: true, formData: monthPrice})} color="primary" style={{width: '100%'}} dense>
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