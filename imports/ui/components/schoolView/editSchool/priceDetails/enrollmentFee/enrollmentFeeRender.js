import React from "react";
import PanelHeader from '../panelHeader';
import EnrollmentFeeForm from './enrollmentFeeForm';
import PackageList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';


export default function () {

	const { classes, schoolId, enrollmentFeeData, schoolData, currency,isSaved, handleIsSavedState } = this.props;

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
					isSaved={isSaved}
					handleIsSavedState={handleIsSavedState}
				/>
			}
			<PanelHeader btnText="Add Enrollment Fee" title="Enrollment Fee Cost" caption=" If you add a Class Type to an enrollment fee, students will need to purchase the Enrollment Fee before they can purchase Per Class or Monthly packages for that Class Type, or sign in to that class." icon="assignment" onAddButtonClicked={() => { this.setState({ showForm: true, formData: null }) }} />

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