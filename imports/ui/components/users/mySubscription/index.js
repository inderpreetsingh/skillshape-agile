import React from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';

import School from '/imports/api/school/fields';
import Purchases from '/imports/api/purchases/fields';
import ClassSubscription from '/imports/api/classSubscription/fields';

import SchoolBox from '/imports/ui/componentHelpers/boxes/schoolBox.js';
import MySubscriptionRender from './MySubscriptionRender.jsx';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { withPopUp } from '/imports/util';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`background: white;`;

class MySubscription extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	getContactNumbers = (data) => {
		// console.info('data for phones', data);
		return (data.phone && data.phone.split(/[\|\,\\]/));
	};

	getOurEmail = (data) => {
		return data.email;
	};

	handleCall = (phone) => () => {
		// console.info('data.....', data);
		this.setState((state) => {
			return {
				...state,
				callUsDialog: true,
				phone,
			};
		});
	};

	handleEmail = (email, schoolData) => () => {
		this.setState((state) => {
			return {
				...state,
				selectedSchool: schoolData,
				email,
				emailUsDialog: true,
			};
		});
	};

	handleSchoolVisit = (slug) => () => {
		browserHistory.push(`/schools/${slug}`);
	};

	handleModelState = (modelName, modelState) => () => {
		this.setState((state) => {
			return {
				...state,
				[modelName]: modelState
			};
		});
	};

	render() {
		const { callUsDialog, phone, emailUsDialog, email, selectedSchool } = this.state;
		const { isLoading, schoolData, purchaseData } = this.props;
		// console.group('My Subscriptions');
		// console.log(schoolData, purchaseData, isLoading);
		// console.groupEnd();

		if (isLoading) {
			return <ContainerLoader />;
		}

		return (
			<Wrapper>
				{/*<SchoolBox schoolData={schoolData} purchaseData={purchaseData} />*/}
				<MySubscriptionRender
					getContactNumbers={this.getContactNumbers}
					getOurEmail={this.getOurEmail}
					email={email}
					phone={phone}
					selectedSchool={selectedSchool}
					schoolData={schoolData}
					purchaseData={purchaseData}
					callUsDialog={callUsDialog}
					emailUsDialog={emailUsDialog}
					handleModelState={this.handleModelState}
					handleEmail={this.handleEmail}
					handleCall={this.handleCall}
					handleSchoolVisit={this.handleSchoolVisit}
				/>
			</Wrapper>
		);
	}
}

export default createContainer((props) => {
	const { currentUser } = props;
	let userId,
		filter,
		schoolIds = [],
		schoolData = [],
		purchaseData = [],
		isLoading = true,
		schoolSubscription,
		classSubscription,
		purchaseSubscription,
		adminsDataSubscriptions,
		classSubscriptionData;
	userId = get(currentUser, '_id', null);
	filter = { userId };
	purchaseSubscription = Meteor.subscribe('purchases.getPurchasesListByMemberId', filter);
	classSubscription = Meteor.subscribe('classSubscription.findDataById', filter);

	if (purchaseSubscription && purchaseSubscription.ready() && classSubscription && classSubscription.ready()) {
		purchaseData = Purchases.find().fetch();
		classSubscriptionData = ClassSubscription.find().fetch();
		console.log(purchaseData, classSubscription, ' in purchase subscription');

		if (!isEmpty(purchaseData)) {
			purchaseData.map((current) => {
				schoolIds.push(current.schoolId);
			});
			if (!isEmpty(classSubscriptionData)) {
				classSubscriptionData.map((current) => {
					schoolIds.push(current.schoolId);
				});
			}
			schoolSubscription = Meteor.subscribe('school.findSchoolByIds', uniq(schoolIds));
			if (
				schoolSubscription &&
				classSubscription.ready() &&
				purchaseSubscription.ready() &&
				schoolSubscription.ready()
			) {
				schoolData = School.find().fetch();
				console.log(purchaseData, classSubscriptionData, schoolData, '________________ IS LOADING FALSE NOW');
				isLoading = false;
			}
		} else {
			console.log(purchaseData, classSubscriptionData, '---- isLOADING false in else block');
			isLoading = false;
		}
	}

	purchaseData = concat(purchaseData, classSubscriptionData);

	return {
		isLoading,
		schoolData,
		purchaseData
	};
}, withPopUp(MySubscription));
