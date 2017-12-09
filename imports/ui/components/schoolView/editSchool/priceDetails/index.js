import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PriceDetailsRender from './priceDetailsRender';

import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import ClassPricing from "/imports/api/classPricing/fields";

class PriceDetails extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return PriceDetailsRender.call(this, this.props, this.state)
    }
}

export default createContainer(props => {
 	const { schoolId } = props;

 	Meteor.subscribe("monthlyPricing.getMonthlyPricing", {schoolId});
  	Meteor.subscribe("classPricing.getClassPricing", {schoolId});
 	
  	const classPricingData = ClassPricing.find({schoolId}).fetch();
  	const monthlyPricingData = MonthlyPricing.find({schoolId}).fetch();

 	return {
 		...props,
 		classPricingData,
 		monthlyPricingData,
 	}
}, PriceDetails);