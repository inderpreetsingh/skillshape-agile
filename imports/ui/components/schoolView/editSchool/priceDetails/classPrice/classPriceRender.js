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
import PackageList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';

export default function () {

	const { classes, schoolId, classPricingData, schoolData, currency } = this.props;
	return (
		<div className="class-price-details">
			{
				this.state.showForm && <ClassPriceForm
					schoolId={schoolId}
					data={this.state.formData}
					open={this.state.showForm}
					onClose={this.handleFormModal}
					classTypeData={this.props.classTypeData}
					schoolData={schoolData}
					currency={currency}
				/>
			}
			<div className={classes.notifyExplanation}>
				<Typography type="caption">Click here to notify students and potential students of your updates to prices!</Typography>
				<Button onClick={() => this.handleUpdateClassTime()} color="accent" raised dense>
					Update Students
                    </Button>
			</div>
			<PanelHeader btnText="Add Per Class Package" title="Per Class Packages" caption="Different Payment Packages can cover different payment methods, Class Types, or Durations" icon="assignment" onAddButtonClicked={() => { this.setState({ showForm: true, formData: null }) }} />

			{/* <Grid container className={classes.paddingLeft}>
               	{
               		classPricingData && classPricingData.map((classPrice, index)=> {
               			return (
							    
               			)
               		})
               	}
			   </Grid> */}
			<PackageList
				perClassPackagesData={classPricingData}
				currency={currency}
				onSchoolEdit={true}
				onEditClick={() => this.setState({ showForm: true})}
				setFormData={(packageData) => { this.setFormData(packageData) }}
				onPriceEdit={true}
			/>
		</div>
	)
}