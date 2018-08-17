import React, { Fragment } from "react";
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