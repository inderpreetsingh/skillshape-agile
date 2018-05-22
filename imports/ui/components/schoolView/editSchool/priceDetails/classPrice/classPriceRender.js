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
import PanelHeader from '../panelHeader';

export default function () {

	console.log("classPrice render props -->>",this)
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
                         classTypeData={this.props.classTypeData}
          		/>
          	}
               <div className={classes.notifyExplanation}>
                    <Typography type="caption">Click here to notify students and potential students of your updates to prices!</Typography>
                    <Button onClick={() => this.handleUpdateClassTime()} color="accent" raised dense>
                         Update Students
                    </Button>
               </div>
               <PanelHeader btnText="Add Per Class Package" title="Per Class Packages" caption="Different Payment Packages can cover different payment methods, Class Types, or Durations" icon="assignment" onAddButtonClicked={()=> {this.setState({showForm: true, formData: null})}} />

               <Grid container className={classes.paddingLeft}>
               	{
               		classPricingData && classPricingData.map((classPrice, index)=> {
               			return (
                                   <Grid item xs={12} md={3} sm={4} className={classes.paddingTopAndBottom}>
                    				<Card key={index} style ={{height:'100%'}} className={`${classes.card} price-card-container`}>
                    					<CardContent className={classes.content}>
                           					<Typography align="center" type="headline">
                           						{classPrice.packageName}
                           					</Typography>
                                                  <br></br>
                    						<Typography component="p">
                    							${classPrice.cost} for {classPrice.noClasses} class
                    						</Typography>
                                                  <br></br>
                    						<Typography component="p">
                    							<b>Expiration:</b> {(classPrice.expDuration && classPrice.expPeriod) ? `${classPrice.expDuration} ${classPrice.expPeriod}` : "None"}
                    						</Typography>
                                                  <br></br>
                    						<Typography component="p">
                    							<b>Class Types Covered:</b> {
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
                                   </Grid>
               			)
               		})
               	}
               </Grid>
		</div>
	)
}