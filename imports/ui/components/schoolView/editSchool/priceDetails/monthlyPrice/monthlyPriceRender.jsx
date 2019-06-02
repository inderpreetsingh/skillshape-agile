/* eslint-disable react/no-this-in-sfc */
import React from 'react';
import PanelHeader from '../panelHeader';
import MonthlyPriceForm from './monthlyPriceForm';
import PackageList from '/imports/ui/components/landing/components/class/packages/PackagesList';
import { normalizeMonthlyPricingData } from '/imports/util';

export default function () {
  const {
    schoolId, monthlyPricingData, schoolData, currency, isSaved, handleIsSavedState, classTypeData,
  } = this.props;
  const { formData: data, showForm } = this.state;
  return (
    <div className="class-price-details">
      {
                showForm && (
                <MonthlyPriceForm
                  schoolId={schoolId}
                  data={data}
                  open={showForm}
                  onClose={this.handleFormModal}
                  classTypeData={classTypeData}
                  schoolData={schoolData}
                  currency={currency}
                  isSaved={isSaved}
                  handleIsSavedState={handleIsSavedState}
                />
                )
            }
      <PanelHeader btnText="Add Per Month Package" title="Per Month Packages" caption="Different Payment Packages can cover different payment methods, Class Types, or Durations" icon="assignment" onAddButtonClicked={() => { this.setState({ showForm: true, formData: null }); }} />


      <PackageList
        monthlyPackagesData={normalizeMonthlyPricingData(monthlyPricingData)}
        currency={currency}
        onSchoolEdit
        onEditClick={() => this.setState({ showForm: true })}
        setFormData={(packageData) => { this.setFormData(packageData); }}
        onPriceEdit
      />
    </div>
  );
}
