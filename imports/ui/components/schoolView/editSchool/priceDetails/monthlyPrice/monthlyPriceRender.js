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
import { maximumClasses } from '/imports/util';
import MonthlyPriceForm from './monthlyPriceForm';
import PanelHeader from '../panelHeader';
import PackageList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';
import { normalizeMonthlyPricingData } from "/imports/util";
export default function () {


     const { classes, schoolId, monthlyPricingData,schoolData ,currency} = this.props;
     const data = this.state.formData;
	return (
		<div className="class-price-details">
			{
          		this.state.showForm && <MonthlyPriceForm
          			schoolId={schoolId}
          			data={data}
          			open={this.state.showForm}
                    onClose={this.handleFormModal}
                    classTypeData={this.props.classTypeData}
                    schoolData={schoolData}
                    currency={currency}   
          		/>
          	}
               <PanelHeader btnText="Add Per Month Package" title="Per Month Packages" caption="Different Payment Packages can cover different payment methods, Class Types, or Durations" icon="assignment" onAddButtonClicked={()=> {this.setState({showForm: true, formData: null})}} />

               {/* <Grid container className={classes.monthlyPriceContainer}>
               	{
               		monthlyPricingData && monthlyPricingData.map((monthPrice, index)=> {
                              let paymentType = '';
                              if(monthPrice.pymtType) {
                                   if(monthPrice.pymtType['autoWithDraw'] && monthPrice.pymtType['payAsYouGo']) {
                                        paymentType += 'Automatic Withdrawal and Pay As You Go';
                                   } else if(monthPrice.pymtType['autoWithDraw']) {
                                        paymentType += 'Automatic Withdrawal';

                                   } else if(monthPrice.pymtType['payAsYouGo']) {
                                        paymentType += 'Pay As You Go';

                                   } else if(monthPrice.pymtType['payUpFront']) {
                                        paymentType += 'Pay Up Front';
                                   }
                              }
               			return (
                                   <Grid item xs={12} md={3} sm={4}>
                    				<Card key={index} className={classes.card}>
                    					<CardContent className={classes.content}>
                           					<Typography align="center" type="headline">
                           						{monthPrice.packageName}
                           					</Typography>
                                                  <br></br>
                                                  <Typography component="p">
                                                      <b>Payment Type:</b> {paymentType}
                                                  </Typography>
                                                  <br></br>
                                                
                    						<Typography component="p">
                    							<b>Class Types Covered:</b> {
                    								_.isEmpty(monthPrice.selectedClassType) ? "None" :
                    								monthPrice.selectedClassType.map((classType) => {
                    									return <span>{classType.name} </span>
                    								})
                    							}
                    						</Typography>
                                                  <br></br>
                                                  <Typography component="p">
                                                <b>Maximum classes:</b> 
                                               
                                                {maximumClasses(monthPrice)}
                    						</Typography>
                                                  <br></br>
                                                  {
                                                       _.isEmpty(monthPrice.pymtDetails) ? "None" :
                                                       monthPrice.pymtDetails.map((payment) => {
                                                            return <Fragment>
                                                                 <Typography component="p">
                                                                { payment.currency ? payment.currency : currency}{payment.cost} per month for {payment.month} months
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
                                   </Grid>
               			)
               		})
               	}
               </Grid> */}
               <PackageList 
			   monthlyPackagesData={normalizeMonthlyPricingData(monthlyPricingData)}
               currency={currency}
               onSchoolEdit={true}
			   /> 
		</div>
	)
}