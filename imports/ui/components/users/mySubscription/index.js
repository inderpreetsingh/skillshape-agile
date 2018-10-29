import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { withPopUp } from '/imports/util';
import SchoolBox from '/imports/ui/componentHelpers/boxes/schoolBox.js';

import get from 'lodash/get';
import School from '/imports/api/school/fields';
import Purchases from '/imports/api/purchases/fields';
import ClassSubscription from '/imports/api/classSubscription/fields';

import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';

import MySubscriptionRender from './MySubscriptionRender.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

class MySubscription extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleCall = (schoolData) => () => {
		this.setState((state) => {
			return {
				...state,
				callUsDialog: true,
				phone: get(schoolData, 'phone', 99999999)
			};
		});
	};

	handleEmail = (data) => () => {
		this.setState((state) => {
			return {
				...state,
				emailUsDialog: true,
				email: get(data, 'email', 'fake@email.com')
			};
		});
	};

	handleSchoolVisit = (schoolData) => () => {
		browserHistory.push('/');
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
		const { callUsDialog, phone, emailUsDialog, email } = this.state;
		const { schoolData, purchaseData } = this.props;
		console.group('My Subscriptions');
		console.log(schoolData, purchaseData);
		console.groupEnd();
		return (
			<div>
				{/*<SchoolBox schoolData={schoolData} purchaseData={purchaseData} />*/}
				<MySubscriptionRender
					email={email}
					phone={phone}
					callUsDialog={callUsDialog}
					emailUsDialog={emailUsDialog}
					handleEmail={this.handleEmail}
					handleCall={this.handleCall}
					handleSchoolVisit={this.handleSchoolVisit}
				/>
			</div>
		);
	}
}

export default createContainer((props) => {
	const { currentUser } = props;
	let userId,
		purchaseData = [],
		purchaseSubscription,
		filter,
		schoolIds = [],
		schoolSubscription,
		schoolData = [],
		classSubscription,
		classSubscriptionData;
	userId = get(currentUser, '_id', null);
	filter = { userId };
	purchaseSubscription = Meteor.subscribe('purchases.getPurchasesListByMemberId', filter);
	classSubscription = Meteor.subscribe('classSubscription.findDataById', filter);
	if (purchaseSubscription && purchaseSubscription.ready() && classSubscription && classSubscription.ready()) {
		purchaseData = Purchases.find().fetch();
		classSubscriptionData = ClassSubscription.find().fetch();
	}
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
	}
	if (schoolSubscription && schoolSubscription.ready()) {
		schoolData = School.find().fetch();
	}
	purchaseData = concat(purchaseData, classSubscriptionData);
	return {
		schoolData,
		purchaseData
	};
}, withPopUp(MySubscription));
