import React, { Component, Fragment } from 'react';
import { isEmpty } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import Typography from 'material-ui/Typography';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ContactUsBar from '/imports/ui/components/landing/components/ContactUsBar';
import TopSearchBar from '/imports/ui/components/landing/components/TopSearchBar';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import NotFound from '/imports/ui/components/landing/components/helpers/NotFound.jsx';
import config from '/imports/config';
import Reviews from '/imports/api/review/fields';
import School from '/imports/api/school/fields';
import ClassType from '/imports/api/classType/fields';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassPricing from '/imports/api/classPricing/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import Media from '/imports/api/media/fields';
import EnrollmentFees from '/imports/api/enrollmentFee/fields';
import ClassInterest from '/imports/api/classInterest/fields';
import ClassTypeContent from './ClassTypeContent';

const Wrapper = styled.div`
	width: 100%;

	${(props) =>
		props.isEmpty &&
		`display: flex;
     min-height: 100vh;
     flex-direction: column;
     justify-content: space-between;`};
`;

class ClassTypeView extends Component {
	render() {
		// console.log("ClassTypeView .props-->>",this.props)
		const emptyClassTypeData = isEmpty(this.props.classTypeData);
		return (
			<Wrapper isEmpty={emptyClassTypeData} className="classtype-page">
				{/*<DocumentTitle title={get(this.props,"params.classTypeName","untitled")}> */}
				<div>
					<TopSearchBar {...this.props} />
				</div>
				{emptyClassTypeData ? <NotFound title={'No Class Found'} /> : <ClassTypeContent {...this.props} />}
				<Footer />
				{/*  </DocumentTitle> */}
			</Wrapper>
		);
	}
}

ClassTypeView.propsTypes = {
	className: PropTypes.string
};

ClassTypeView.defaultProps = {
	className: 'naam yoga'
};

export default createContainer((props) => {
	// console.log("ClassType createContainer props -->>",props);
	const { classTypeId } = props.params;
	let subscription;
	let classTimesSubscription;
	let reviewsSubscription;
	let isLoading = true;
	let classInterestData = [];
	let currency;
	let schoolData;
	if (classTypeId) {
		subscription = Meteor.subscribe('classType.getClassTypeWithClassTimes', {
			classTypeId
		});
		// added cause sLocation field was giving empty response with 2 publishJoinedCursors
		classTimesSubscription = Meteor.subscribe('classType.getClassTimesWithId', {
			classTypeId
		});

		reviewsSubscriptions = Meteor.subscribe('review.getReviews', {
			reviewForId: classTypeId
		});
	}

	const sub1Ready = subscription && subscription.ready();
	const sub2Ready = reviewsSubscriptions && reviewsSubscriptions.ready();
	if (sub1Ready && sub2Ready) {
		isLoading = false;
	}
	Meteor.subscribe('classInterest.getClassInterest');
	Meteor.subscribe('enrollmentFee.getClassTypeEnrollMentFree', { classTypeId });
	classInterestData = ClassInterest.find({}).fetch();
	let classTypeData = ClassType.findOne({ _id: classTypeId });
	schoolData = School.findOne();
	currency = schoolData && schoolData.currency ? schoolData.currency : config.defaultCurrency;

	let classTimesData = ClassTimes.find({ classTypeId: classTypeId }).fetch();
	let classPricingData = ClassPricing.find().fetch();
	let monthlyPricingData = MonthlyPricing.find().fetch();
	let mediaData = Media.find().fetch();
	let reviewsData = Reviews.find().fetch();
	let enrollmentFeeData = EnrollmentFees.find().fetch();
	// console.log("ClassType classTypeData -->>>",classTypeData)
	// console.log("ClassType classTimesData -->>>",classTimesData)
	// console.log("ClassType schoolData -->>>",schoolData)
	// console.log("ClassType classPricingData -->>>",classPricingData)
	// console.log("ClassType monthlyPricingData -->>>",monthlyPricingData)
	return {
		...props,
		isLoading,
		reviewsData,
		classTypeData,
		classTimesData,
		schoolData,
		classPricingData,
		monthlyPricingData,
		enrollmentFeeData,
		mediaData,
		classInterestData,
		currency
	};
}, ClassTypeView);
