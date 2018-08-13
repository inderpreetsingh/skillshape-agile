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
import PackageList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';

import EnrollmentFeeForm from './enrollmentFeeForm';
import PanelHeader from '../panelHeader';

export default function () {

	const { classes, schoolId, enrollmentFeeData, schoolData, currency } = this.props;

	return (
		<div className="class-price-details">
			{
				this.state.showForm && <EnrollmentFeeForm
					schoolId={schoolId}
					data={this.state.formData}
					open={this.state.showForm}
					onClose={this.handleFormModal}
					classTypeData={this.props.classTypeData}
					schoolData={schoolData}
					currency={currency}
				/>
			}
			<PanelHeader btnText="Add Enrollment Fee" title="Enrollment Fee Cost" caption="Cost of Enrollment" icon="assignment" onAddButtonClicked={() => { this.setState({ showForm: true, formData: null }) }} />

			{/* <Grid container className={classes.enrollmentFeeContainer}>
	          	{
	          		enrollmentFeeData && enrollmentFeeData.map((enrollmentFee, index)=> {
	          			return (
							
	          			)
	          		})
	          	}
			  </Grid>  */}
			<PackageList
				enrollMentPackagesData={enrollmentFeeData}
				enrollMentPackages={true}
				currency={currency}
				onSchoolEdit={true}
				onEditClick={() => this.setState({ showForm: true })}
				setFormData={(packageData) => { this.setFormData(packageData) }}
				onPriceEdit={true}
			/>
		</div>
	)
}