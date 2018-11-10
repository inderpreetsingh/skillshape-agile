import React from "react";
import PanelHeader from '../panelHeader';
import MonthlyPriceForm from './monthlyPriceForm';
import PackageList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';
import { normalizeMonthlyPricingData } from "/imports/util";
export default function () {


    const { classes, schoolId, monthlyPricingData, schoolData, currency } = this.props;
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
            <PanelHeader btnText="Add Per Month Package" title="Per Month Packages" caption="Different Payment Packages can cover different payment methods, Class Types, or Durations" icon="assignment" onAddButtonClicked={() => { this.setState({ showForm: true, formData: null }) }} />

            {/* <Grid container className={classes.monthlyPriceContainer}>
               	{
               		monthlyPricingData && monthlyPricingData.map((monthPrice, index)=> {
                             
               			return (
                            
                        )
               		})
               	}
               </Grid> */}
            <PackageList
                monthlyPackagesData={normalizeMonthlyPricingData(monthlyPricingData)}
                currency={currency}
                onSchoolEdit={true}
                onEditClick={() => this.setState({ showForm: true })}
                setFormData={(packageData) => { this.setFormData(packageData) }}
                onPriceEdit={true}
            />
        </div>
    )
}