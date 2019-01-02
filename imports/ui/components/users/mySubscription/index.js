import concat from 'lodash/concat';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import { browserHistory } from 'react-router';
import styled from 'styled-components';
import MySubscriptionRender from './MySubscriptionRender.jsx';
import ClassSubscription from '/imports/api/classSubscription/fields';
import Purchases from '/imports/api/purchases/fields';
import School from '/imports/api/school/fields';
import { FormGhostButton } from '/imports/ui/components/landing/components/buttons/';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { packageCoverProvider, withPopUp,confirmationDialog,formatDate } from '/imports/util';



const Wrapper = styled.div`background: white;`;
const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;

class MySubscription extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subscriptionsData: []
		};
	}

	getContactNumbers = (data) => {
		// console.info('data for phones', data);
		return (data.phone && data.phone.split(/[\|\,\\]/));
	};


	classDataFinder = (schoolData) => {
		let {  currentUser } = this.props;
		let schoolId = get(schoolData, '_id', null);
		let userId = get(currentUser, '_id', null);
		Meteor.call('classInterest.findClassTypes', schoolId, userId, (err, res) => {
			if (res)
				this.setState({ subscriptionsData: res })
			else
				this.setState({ subscriptionsData: [] })
		})
	}
	getOurEmail = (data) => {
		return data.email;
	};

	handleCall = (phone) => (e) => {
		e.preventDefault();
		// console.info('data.....', data);
		this.setState((state) => {
			return {
				...state,
				callUsDialog: true,
				phone,
			};
		});
	};

	handleEmail = (email, schoolData) => (e) => {
		e.preventDefault();
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

	handleManageMemberShipDialogBox = (modelState, schoolData) => (e) => {
		e.stopPropagation();
		this.classDataFinder(schoolData);
		this.setState(state => {
			return {
				...state,
				manageMemberShipDialog: modelState,
				selectedSchool: schoolData
			}
		});
	}
	purchasePackageDataChecker = (classTimes, classTypeName,_id,schoolId) => {
		Meteor.call('enrollment.checkPackagesFromClassTypeAndSchoolId',{classTypeId:_id,schoolId},(err,res)=>{
			const {popUp} = this.props;
			if(!isEmpty(res)){
				let data = {},latestExpirationDate = get(res[0],'endDate',new Date());
				data = {
					popUp,
					title: 'Confirmation',
					type: 'inform',
				}
				if(_id){
				data.content = `You have one or more active subscriptions until ${formatDate(latestExpirationDate)}. Do you want to remove this class from your calendar? If you join again before the expiration, your Packages will still be active.`
				data.buttons = [{label:'Leave Class',onClick:()=>{this.removeAll(classTimes, classTypeName,_id)},alert:true},{label:'Cancel' , onClick:()=>{},greyColor:true}];
				}
				else{
				data.content = `You have one or more active subscriptions until ${formatDate(latestExpirationDate)}. Do you want to remove the school and all classes from your calendar? If you join again before the expiration, your Packages will still be active.`
				data.buttons = [{label:'Leave School',onClick:()=>{this.leaveSchoolHandler()},alert:true},{label:'Cancel' , onClick:()=>{},greyColor:true}];
				}
				confirmationDialog(data);
			}
			else{
				_id ? this.removeAll(classTimes, classTypeName,_id) : this.leaveSchoolHandler();
			}
		})
	}
	removeAll = (classTimes, classTypeName,_id) => {
		const { currentUser } = this.props;
		let userId = get(currentUser, '_id', null), data = {};
		this.setState({ all: true });
		classTimes.map((obj, index) => {
			data.userId = userId;
			data.classTimeId = obj._id;
			data.classTypeName = classTypeName;
			data.classTimeName = obj.name;
			data.all = true;
			this.removeFromCalendar(data);
		})
	}
	leaveSchool = () => {
		let { popUp, currentUser,schoolData } = this.props;
		let {_id:schoolId} = schoolData[0];
		let studentName = get(currentUser, 'profile.firstName', get(currentUser, 'profile.name', 'Old Data'));
		popUp.appear(
			'inform',
			{
				title: 'Confirmation',
				content: `You are about to remove ${studentName} from all class types at your school. The classes will no longer appear in their calendar. Are you sure?`,
				RenderActions: (
					<ButtonWrapper>
						<FormGhostButton
							label={'Cancel'}
							applyClose
						/>
						<FormGhostButton
							label={'Yes'}
							onClick={()=>{this.purchasePackageDataChecker(null,null,null,schoolId)}}
							applyClose
						/>
					</ButtonWrapper>
				)
			},
			true
		);
	}
	leaveSchoolHandler = () => {
		let { subscriptionsData } = this.state;
		this.setState({ all: true });
		if (!isEmpty(subscriptionsData)) {
			subscriptionsData.map((obj, index) => {
				this.removeAll(obj.classTimes, obj.name,obj._id);
			})
		}
	}
	okClick = () => {
		this.classDataFinder(this.state.selectedSchool);
	}

	removeFromCalendar = (data) => {
		let { schoolData } = this.props;
		let { classTimeName, classTypeName } = data;
		let schoolName = get(schoolData[0], 'name', 'Hidden Leaf');
		this.setState({ isBusy: true });
		Meteor.call(
			"classInterest.removeClassInterestByClassTimeId",
			data,
			(error, res) => {
				if (res) {
					this.setState({ isBusy: false });
					const { popUp } = this.props;
					popUp.appear(
						'success',
						{
							title: 'Success',
							content: `${data.all ? `Successfully removed all classes from ${schoolName}.` : `Successfully removed from ${classTypeName} : ${classTimeName}.`}.`,
							RenderActions: (
								<ButtonWrapper>
									<FormGhostButton
										label={'Ok'}
										onClick={this.okClick}
										applyClose
									/>
								</ButtonWrapper>
							)
						},
						true
					);

				}

			}
		);
	}
	stopNotification = (payload) => {
		this.setState({ isBusy: true });
		let data = {};
		data.classTypeId = payload.classTypeId;
		data.userId = payload.userId;
		data.notification = !payload.notification;
		Meteor.call("classTypeLocationRequest.updateRequest", data, (err, res) => {
			const { popUp } = this.props;
			if (res) {
				Meteor.call("classTimesRequest.updateRequest", data, (err1, res1) => {
					if (res1) {
						this.setState({ isBusy: false });
						popUp.appear(
							'success',
							{
								title: 'Success',
								content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`,
								RenderActions: (
									<ButtonWrapper>
										<FormGhostButton
											label={'Ok'}
											onClick={this.okClick}
											applyClose
										/>
									</ButtonWrapper>
								)
							},
							true
						);

					}
				});
			}
			else {
				this.setState({ isBusy: false });
				popUp.appear(
					'success',
					{
						title: 'Success',
						content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`,
						RenderActions: (
							<ButtonWrapper>
								<FormGhostButton
									label={'Ok'}
									onClick={this.okClick}
									applyClose
								/>
							</ButtonWrapper>
						)
					},
					true
				);
			}
		});
	}
	render() {
		const { callUsDialog, phone, emailUsDialog, manageMemberShipDialog, email, selectedSchool, isBusy, subscriptionsData } = this.state;
		let { isLoading, schoolData, purchaseData, currentUser } = this.props;
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
					currentUser={currentUser}
					selectedSchool={selectedSchool}
					schoolData={schoolData}
					purchaseData={purchaseData}
					callUsDialog={callUsDialog}
					emailUsDialog={emailUsDialog}
					manageMemberShipDialog={manageMemberShipDialog}
					handleManageMemberShipDialogBox={this.handleManageMemberShipDialogBox}
					handleModelState={this.handleModelState}
					handleEmail={this.handleEmail}
					handleCall={this.handleCall}
					isBusy={isBusy}
					subscriptionsData={subscriptionsData}
					handleSchoolVisit={this.handleSchoolVisit}
					removeAll={this.purchasePackageDataChecker}
					stopNotification={this.stopNotification}
					leaveSchool={this.leaveSchool}
					removeFromCalendar={this.removeFromCalendar}
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
		packagesDataSubscription,
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
		// console.log(purchaseData, classSubscription, ' in purchase subscription');

		if (!isEmpty(purchaseData)) {
			purchaseData.map((current) => {
				schoolIds.push(current.schoolId);
			});

			const packagesData = purchaseData.map(data => {
				return {
					packageId: data.packageId,
					packageType: data.packageType
				}
			});

			if (!isEmpty(classSubscriptionData)) {
				classSubscriptionData.map((current) => {
					schoolIds.push(current.schoolId);
				});
			}
			schoolSubscription = Meteor.subscribe('school.findSchoolByIds', uniq(schoolIds));
			// NOTE: not working as returning array of cursors seems causing issue with parek:join package.
			// packagesDataSubscription = Meteor.subscribe('packages.findPackagesByData', packagesData);
			if (
				schoolSubscription &&
				classSubscription.ready() &&
				purchaseSubscription.ready() &&
				schoolSubscription.ready()
			) {
				schoolData = School.find().fetch();
				// console.log(purchaseData, classSubscriptionData, schoolData, '________________ IS LOADING FALSE NOW');
				isLoading = false;
			}
		} else {
			// console.log(purchaseData, classSubscriptionData, '---- isLOADING false in else block');
			isLoading = false;
		}
	}

	purchaseData = concat(purchaseData, classSubscriptionData);
	purchaseData = packageCoverProvider(purchaseData);

	return {
		currentUser,
		isLoading,
		schoolData,
		purchaseData
	};
}, withPopUp(MySubscription));
