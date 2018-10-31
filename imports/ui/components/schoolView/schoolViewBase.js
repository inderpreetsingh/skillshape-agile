import { isEmpty } from 'lodash';
import get from 'lodash/get';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import styled from 'styled-components';
import ClassPricing from '/imports/api/classPricing/fields';
// import collection definition over here
import ClassType from '/imports/api/classType/fields';
import SLocation from '/imports/api/sLocation/fields';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { capitalizeString, checkSuperAdmin, createMarkersOnMap, formatMoney } from '/imports/util';
import Events from '/imports/util/events';
import { getUserFullName } from '/imports/util/getUserData';
import { openMailToInNewTab } from '/imports/util/openInNewTabHelpers';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';

const ButtonsWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
`;
const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;

export default class SchoolViewBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chargeResult: null, currency: null, bestPriceDetails: null };
	}

	componentWillMount() {
		if (this.props && this.props.params) {
			let { slug } = this.props.params;
			Meteor.call('school.getBestPrice', { slug }, (error, result) => {
				this.setState({ bestPriceDetails: result });
			});
		}

		// Meteor.call('school.findSchoolById',slug,(err,res)=>{
		//   res&&this.setState({currency:res})
		// })
	}

	componentDidUpdate() {
		if (!_.isEmpty(this.props.schoolLocation) && this.props.route.name !== 'SchoolViewDeveloping') {
			createMarkersOnMap('schoolLocationMap', this.props.schoolLocation);
		}
	}

	validateString = (value) => {
		if (value) return value;
		return '';
	};

	// checkUserAccess = (currentUser,schoolId) => {
	//   return checkMyAccess({user: currentUser,schoolId});
	// }

	handleGiveReview = () => {
		//const { toastr } = this.props;
		if (Meteor.userId()) {
			this.handleDialogState('giveReviewDialog', true);
		} else {
			this.handleDefaultDialogBox('Login to give review', true);
		}
	};

	getReviewTitle = (name) => {
		return `Give review for ${capitalizeString(name)}`;
	};

	handleDialogState = (dialogName, state) => {
		const currentState = { ...this.state };
		currentState[dialogName] = state;
		this.setState(currentState);
	};

	handleDefaultDialogBox = (title, state) => {
		const newState = {
			...state,
			defaultDialogBoxTitle: title,
			nonUserDefaultDialog: state
		};
		this.setState(newState);
	};

	claimASchool = (currentUser, schoolData) => {
		if (currentUser) {
			setTimeout(() => {
				if (checkSuperAdmin(currentUser)) {
				} else {
					if (
						currentUser.profile &&
						currentUser.profile.schoolId &&
						currentUser.profile.schoolId.length > 1
					) {
						toastr.error(
							'You already manage a school. You cannot claim another School. Please contact admin for more details',
							'Error'
						);
					} else {
						let claimRequest = ClaimRequest.find().fetch();
						if (claimRequest && claimRequest.length > 0) {
							toastr.info(
								'We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.',
								''
							);
							return;
						}
						if (schoolData.claimed == 'Y') {
							this.setState({ claimRequestModal: true });
							// show modal over here
							return;
						} else {
							this.setState({ claimSchoolModal: true });
							return;
							// show modal over here
						}
					}
				}
			}, 1000);
		} else {
			toastr.error('Please register yourself as an individual member before claiming your school', 'Error');
			Meteor.setTimeout(() => {
				Events.trigger('join_school', {
					studentRegister: false,
					schoolRegister: true
				});
			}, 1000);
		}
	};

	claimBtnCSS = (currentUser, claimed) => {
		if ( currentUser && currentUser.profile && currentUser.profile.schoolId && currentUser.profile.schoolId.length > 1 ) {
			return 'btn-default';
		} else if (claimed == 'Y') {
			return 'btn-danger';
		} else {
			return 'btn-success';
		}
	};

	getClassImageUrl = (classType, classImagePath) => {
		let image = ClassType.findOne({ _id: classType }).classTypeImg;
		if (image && image.length) {
			return image;
		} else if (classImagePath && classImagePath.length > 1) {
			return classImagePath;
		} else {
			return 'http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg';
		}
	};

	viewSchedule = (skillclass) => {
		let str = '';
		if (skillclass.isRecurring == 'true' && skillclass.repeats) {
			let repeats = JSON.parse(skillclass.repeats);
			let repeat_details = repeats.repeat_details || [];
			str = 'Start from ' + repeats.start_date + '</br>';
			for (let i = 0; i < repeat_details.length; i++) {
				const classLocation = SLocation.findOne({
					_id: repeat_details[i].location
				});
				str +=
					'<b>' +
					repeat_details[i].day +
					'</b> ' +
					repeat_details[i].start_time +
					' to ' +
					repeat_details[i].end_time +
					' at ' +
					this.validateString(classLocation.neighbourhood) +
					', ' +
					classLocation.city +
					'</br>';
			}
		} else {
			const classLocation = SLocation.findOne({ _id: skillclass.locationId });
			str =
				'Start from ' +
				this.validateString(skillclass.plannedStart) +
				'  to ' +
				this.validateString(skillclass.plannedEnd) +
				'</br>' +
				this.validateString(skillclass.planEndTime) +
				' to ' +
				this.validateString(skillclass.planStartTime) +
				' at ' +
				this.validateString(classLocation.neighbourhood) +
				', ' +
				classLocation.city;
		}
		return str;
	};

	getClassPrice = (classTypeId) => {
		const classPrice = ClassPricing.findOne({
			classTypeId: { $regex: '' + classTypeId + '', $options: 'i' }
		});
		if (classPrice && classPrice.cost) {
			return `$${classPrice.cost}/Month`;
		}
		return '';
	};

	getClassName = (classTypeId) => {
		if (_.isArray(classTypeId)) {
			let str_name = [];
			// let classTypeIds = classTypeId.split(",")
			let classTypeList = ClassType.find({ _id: { $in: classTypeId } }).fetch();
			classTypeList.map((a) => {
				str_name.push(a.name);
			});
			return str_name.join(',');
		} else {
			return '';
		}
	};

	getImageMediaList = (mediaList, type) => {
		if (!mediaList) {
			return [];
		} else {
			let size = 1;
			let imageList = [];
			let return_list = [];

			if (type == 'Image') {
				mediaList.map((a) => {
					if (a && a.mediaType) {
						if (a.mediaType.toLowerCase() == 'Image'.toLowerCase()) {
							imageList.push(a);
						}
					}
				});
			} else {
				mediaList.map((a) => {
					if (a && a.mediaType) {
						if (a.mediaType.toLowerCase() != 'Image'.toLowerCase()) {
							imageList.push(a);
						}
					}
				});
			}

			for (var i = 0; i < imageList.length; i += size) {
				var smallarray = imageList.slice(i, i + size);
				return_list.push({ item: smallarray });
			}
			return return_list;
		}
	};

	checkClaim = (currentUser, schoolId) => {
		if (currentUser && currentUser.profile && currentUser.profile.schoolId === schoolId) return false;
		return true;
	};

	getPublishStatus = (isPublish) => {
		if (isPublish) return true;
		return false;
	};

	handlePublishStatus = (schoolId, event) => {
		const { toastr } = this.props;
		if (schoolId) {
			let isPublish = event.target.checked;
			this.setState({ isLoading: true });

			Meteor.call('school.publishSchool', { schoolId, isPublish }, (error, result) => {
				this.setState({ isLoading: false }, (_) => {
					if (error) {
						toastr.error(error.reason || error.message, 'Error');
					}
					if (result) {
						let msg;
						if (isPublish) {
							msg = 'This School and all his Class Types of this has been published.';
						} else {
							msg = 'This School and all his Class Types of this has been unpublished.';
						}
						toastr.success(msg, 'success');
					}
				});
			});
		} else {
			toastr.error('Something went wrong. Please try after sometime!!', 'Error');
		}
	};

	getClaimSchoolModalTitle = () => {
		const { claimSchoolModal, claimRequestModal, successModal } = this.state;
		if (claimSchoolModal) {
			return 'Are you sure You Claim this school?';
		} else if (claimRequestModal) {
			return 'This school is already claimed. Do you want to continue?';
		} else if (successModal) {
			return 'Claim Status';
		}
	};

	modalClose = () => {
		this.setState({
			claimRequestModal: false,
			claimSchoolModal: false,
			successModal: false
		});
	};

	modalSubmit = () => {
		const { claimSchoolModal, claimRequestModal, successModal } = this.state;
		const { currentUser, schoolId, schoolData } = this.props;

		if (claimSchoolModal && currentUser && currentUser._id && schoolId) {
			Meteor.call('school.claimSchool', currentUser._id, schoolId, (error, result) => {
				if (error) {
				}
				if (result) {
					this.setState({ successModal: true, claimSchoolModal: false });
				}
			});
		} else if (claimRequestModal && currentUser && currentUser._id && schoolId && schoolData) {
			const payload = {
				userId: currentUser._id,
				schoolId: schoolId,
				currentUserId: schoolData.userId,
				schoolName: schoolData.name,
				Status: 'new'
			};

			Meteor.call('addClaimRequest', payload, (error, result) => {
				if (error) {
				}
				if (result) {
					toastr.success(
						'You have requested to manage a school that has already been claimed. We will investigate this double claim and inform you as soon as a decision has been made. If you are found to be the rightful manager of the listing, you will be able to edit the school listing.',
						'Success'
					);
				}
			});
		} else if (successModal && schoolId) {
			this.setState({ successModal: false });
			browserHistory.push(`/schoolAdmin/${schoolId}/edit`);
		}
	};

	checkOwnerAccess = (currentUser, userId) => {
		if (currentUser) return currentUser._id == userId;
		return false;
	};

	checkForJoin = (currentUser, classId) => {
		if (currentUser && currentUser.profile && currentUser.profile.classIds)
			return currentUser.profile.classIds.includes(classId);
		return false;
	};

	scrollToTop = (ref) => {
		const node = ReactDOM.findDOMNode(ref);
		node.scrollIntoView({ behavior: 'smooth' });
	};
	// ADDING A NEW FLOW FOR REQUEST PRICING
	// // This function is used to Open pricing info request Modal
	// handlePricingInfoRequestModal = () => {
	//     // Set state for opening Price info Request Modal.
	//     this.setState({
	//         showConfirmationModal: true,
	//     });
	// }

	getOurEmail = () => {
		return this.props.schoolData.email;
	};

	cancelConfirmationModal = () => this.setState({ showConfirmationModal: false });

	handleRequest = (text = 'pricing') => {
		const { toastr, schoolData } = this.props;

		if (!isEmpty(schoolData)) {
			let emailBody = '';
			let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
			let subject = '',
				message = '';
			let currentUserName = getUserFullName(Meteor.user());
			emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text
				? text
				: pricing}%3F %0D%0A%0D%0A Thanks`;
			const mailTo = `mailto:${this.getOurEmail()}?subject=${subject}&body=${emailBody}`;

			// const mailToNormalized = encodeURI(mailTo);
			// window.location.href = mailToNormalized;
			openMailToInNewTab(mailTo);
		}
	};

	handlePricingRequest = () => {
		const { toastr, schoolData } = this.props;
		if (!Meteor.userId()) {
			this.handleDialogState('manageRequestsDialog', true);
		} else {
			const data = {
				schoolId: schoolData._id
			};

			Meteor.call('pricingRequest.addRequest', data, schoolData, (err, res) => {
				this.setState({ isBusy: false }, () => {
					if (err) {
						toastr.error(err.reason || err.message, 'Error', {}, false);
					} else if (res.message) {
						toastr.error(res.message, 'Error');
					} else if (res) {
						toastr.success('Your request has been processed', 'success');
						this.handleRequest('pricing');
					}
				});
			});
		}
	};

	// Request Pricing info using this function
	requestPricingInfo = (schoolData) => {
		this.setState({ showConfirmationModal: false });
		if (!isEmpty(schoolData)) {
			let emailBody = '';
			let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
			let subject = '',
				message = '';
			let currentUserName = getUserFullName(Meteor.user());
			emailBody = `Hi, %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend.%0D%0A%0D%0ACan you update your pricing%3F %0D%0A%0D%0A Thanks`;
			const mailTo = `mailto:${this.getOurEmail()}?subject=${subject}&body=${emailBody}`;
			const mailToNormalized = mailTo;
			// window.location.href = mailToNormalized;
			openMailToInNewTab(mailToNormalized);
		}
		// Close Modal and Do request for pricing info.
		// const { toastr } = this.props;
		// Meteor.call('school.requestPricingInfo',schoolData, (err,res)=> {
		//   // Check sucess method in response and send confirmation to user using a toastr.
		//     if(err) {
		//       toastr.error(err.reason || err.message, "Error")
		//     }
		//     if(res && res.emailSent) {
		//       toastr.success('Your request for pricing info has been sent. We will notify you when we will update Pricing for our school','success')
		//     }
		// });
	};
	contractLengthFinder = (res, monthlyPymtDetails) => {
		let oldContractLength, newContractLength;
		oldContractLength = get(res, 'contractLength', 0);
		newContractLength = get(monthlyPymtDetails[0], 'month', 0);
		if (oldContractLength && newContractLength > oldContractLength) {
			return { contractLength: 'longer', oldContractLength, newContractLength };
		}
		return { contractLength: 'shorter', oldContractLength, newContractLength };
	};
	schoolLogoFinder = (schoolData) => {
		return get(
			schoolData,
			'logoImgMedium',
			get(schoolData, 'logoImg', get(schoolData, 'mainImage', config.defaultSchoolLogo))
		);
	};
	noThanksButton = () => <FormGhostButton label={'No, thanks'} onClick={() => {}} greyColor applyClose />;
	purchaseButton = ( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self ) => ( <FormGhostButton
			label={'Purchase Now'}
			onClick={() => {
				this.handleChargeAndSubscription( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self );
			}}
			applyClose
		/>
	);
	purchaseOldContract = ( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self ) => (
		<FormGhostButton
			label={'Continue Old Contract'}
			onClick={() => {
				this.handleChargeAndSubscription( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self, 'useOldContract' );
			}}
			applyClose
		/>
	);
	purchaseNewContract = ( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self ) => (
		<FormGhostButton
			label={'Purchase New Contract'}
			onClick={() => {
				this.handleChargeAndSubscription( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self );
			}}
			applyClose
		/>
	);
	pastSubscriptionButton = () => (
		<FormGhostButton
			label={'Past Subscriptions'}
			onClick={() => {
				browserHistory.push(`/mySubscription/${Meteor.userId()}`);
			}}
			applyClose
		/>
	);
	//handle PayUpfront case
	handlePayUpFront = ( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self, title, content ) => {
		amount = amount * monthlyPymtDetails[0].month || 1;
		expDuration = monthlyPymtDetails[0].month;
		const { popUp } = this.props;
		popUp.appear(
			'inform',
			{
				title: 'Pay Up Front',
				content: 'When you pay for a number of monthly subscription fees at once.',
				RenderActions: (
					<ButtonsWrapper>
						<ButtonWrapper>{this.noThanksButton()}</ButtonWrapper>
						<ButtonWrapper>
							{this.purchaseButton( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
						</ButtonWrapper>
						<ButtonWrapper>{this.pastSubscriptionButton()}</ButtonWrapper>

						{/* Please select one of the method of payment.Online if you want to pay all at once using stripe or Offline if you want to pay at school. */}
						{/* <Button onClick={() => { this.handlePayAsYouGo(planId, schoolId, packageName, packageId, monthlyPymtDetails, title, content) }} applyClose>
            Offline
          </Button> */}
					</ButtonsWrapper>
				)
			},
			true
		);
	};
	//handle payAsYouGo case
	handlePayAsYouGo = ({ packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self, title, content }) => {
		const { popUp } = this.props;
		popUp.appear('inform', {
			title: title,
			content: content,
			RenderActions: (
				<ButtonsWrapper>
					{this.noThanksButton()}
					{this.purchaseButton( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
					{this.pastSubscriptionButton()}
				</ButtonsWrapper>
			)
		});
		{
			/* Please select one of the method of payment.Online if you want to pay all at once using stripe or Offline if you want to pay at school. */
		}
		{
			/* <Button onClick={() => { this.handlePayAsYouGo(planId, schoolId, packageName, packageId, monthlyPymtDetails, title, content) }} applyClose>
            Offline
          </Button> */
		}
	};
	//This function is used to find out if a user is already purchased an package or not
	isAlreadyPurchased = ({ userId, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self }) => {
		return new Promise((resolve, reject) => {
			if ((userId && planId) || packageId) {
				Meteor.call(
					'purchases.isAlreadyPurchased',
					{ userId, planId, packageId, packageType, pymtType },
					async (err, res) => {
						if (res) {
							const { popUp, schoolData } = this.props;
							let schoolName = get(schoolData, 'name', 'School Name');
							let purchaseId = res._id;
							if (packageType == 'EP') {
								popUp.appear('success', {
									title: 'Already Purchased',
									content:
										'You already have paid this Enrolment fee. No payment is needed at this time.'
								});
							}
							if (packageType == 'CP') {
								let classesLeft = get(res, 'noClasses', 0);
								if (classesLeft) {
									popUp.appear(
										'inform',
										{
											title: 'Already Purchased',
											content: `You already have ${classesLeft} Classes left. Would you like to purchases this package to add on to your Existing Classes ?`,
											RenderActions: (
												<ButtonsWrapper>
													{this.noThanksButton()}
													{this.purchaseButton( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
													{this.pastSubscriptionButton()}
												</ButtonsWrapper>
											)
										},
										true
									);
								} else {
									this.handleChargeAndSubscription( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, this, purchaseId );
								}
							} else if (packageType == 'MP') {
								let expiry, nextExpiry, endDate, inActivePurchases, monthPack, details, oldRate, newRate, newNextExpiryDate;
								inActivePurchases = get(res, 'inActivePurchases', 0);
								endDate = get(res, 'endDate', new Date());

								if (get(pymtType, 'autoWithDraw', false)) {
									popUp.appear('success', {
										title: 'Already Subscribed',
										content: `You already have a subscription for this package that automatically renews on ${moment(
											get(res, 'endDate', new Date())
										).format('Do MMMM YYYY')}. No payment is needed at this time.`
									});
								} else if (get(pymtType, 'payAsYouGo', false)) {
									expiry = moment(endDate).add(inActivePurchases, 'M').format('Do MMMM YYYY');
									nextExpiry = moment(endDate).add(inActivePurchases + 1, 'M').format('Do MMMM YYYY');
									this.setState({ payAsYouGo: true });
									details = this.contractLengthFinder(res, monthlyPymtDetails);
									if (details.contractLength == 'shorter') {
										popUp.appear(
											'inform',
											{
												title: 'Already Purchased',
												content: `You have one or more  Monthly Subscriptions at ${schoolName} including Pay As You Go plan that expires on ${expiry}. Would you like to pay up until ${nextExpiry}?`,
												RenderActions: (
													<ButtonsWrapper>
														{this.noThanksButton()}
														{this.purchaseButton( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
														{this.pastSubscriptionButton()}
													</ButtonsWrapper>
												)
											},
											true
										);
									} else {
										oldRate = formatMoney(get(res, 'amount', 0), get(res, 'currency', '$'));
										newRate = formatMoney(
											get(monthlyPymtDetails[0], 'cost', 0),
											get(monthlyPymtDetails[0], 'currency', '$')
										);
										newNextExpiryDate = moment(new Date())
											.add(details.newContractLength, 'M')
											.format('Do MMMM YYYY');
										popUp.appear(
											'inform',
											{
												title: 'Already Purchased',
												content: `You have one or more Monthly Subscriptions at ${schoolName}, including an existing Pay As You Go contract which is active until ${expiry}. The rate is ${oldRate}. Would you like to make a payment on the existing plan, extend the length of your contract to ${newNextExpiryDate} and have the new monthly rate of ${newRate}, or purchase an additional plan?`,
												RenderActions: (
													<ButtonsWrapper>
														{this.noThanksButton()}
														{this.purchaseNewContract( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
														{this.purchaseOldContract( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
														{this.pastSubscriptionButton()}
													</ButtonsWrapper>
												)
											},
											true
										);
									}
								} else {
									monthPack = get(monthlyPymtDetails[0], 'month', 1);
									expiry = moment(endDate)
										.add(monthPack * inActivePurchases, 'M')
										.format('Do MMMM YYYY');
									nextExpiry = moment(endDate)
										.add(monthPack * (inActivePurchases + 1), 'M')
										.format('Do MMMM YYYY');
									this.setState({ payUpFront: true });
									popUp.appear(
										'inform',
										{
											title: 'Already Purchased',
											content: `You have one or more  Monthly Subscriptions at ${schoolName} including an existing Pay Up Front plan which is good until ${expiry}.Would you like to pay ahead until ${nextExpiry} on this plan?`,
											RenderActions: (
												<ButtonsWrapper>
													{this.noThanksButton()}
													{this.purchaseButton( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
													{this.pastSubscriptionButton()}
												</ButtonsWrapper>
											)
										},
										true
									);
								}
							}
							this.setState({ isAlreadyPurchased: true });
							// check payment type  and take required action
							resolve();
						} else {
							this.setState({ isAlreadyPurchased: false });
							// check payment type  and take required action
							if (packageType == 'MP') {
								await this.checkPymtType({ userId, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType });
								resolve();
							} else {
								resolve();
							}
						}
					}
				);
			}
		});
	};
	//check payment type and take action then
	checkPymtType = ({ userId, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType }) => {
		return new Promise((resolve, reject) => {
			const { popUp } = this.props;
			if ((pymtType && pymtType.payAsYouGo) || pymtType.payUpFront) {
				Meteor.call('classSubscription.isAlreadyMarked', { userId, planId }, (err, res) => {
					if (res) {
						popUp.appear(
							'inform',
							{
								title: 'Waiting for Payment',
								content: `We are waiting for payment of ${packageName}. You can Pay Now via online payment now or go to the school to complete the payment.`,
								RenderActions: (
									<ButtonsWrapper>
										{this.noThanksButton()}
										{this.purchaseButton( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self )}
										{this.pastSubscriptionButton()}
									</ButtonsWrapper>
								)
							},
							true
						);
						this.setState({ isAlreadyPurchased: true, payAsYouGo: true });
						resolve();
					} else {
						this.setState({ isAlreadyPurchased: false });
						if (pymtType.payAsYouGo) {
							this.setState({ payAsYouGo: true, payUpFront: false });
						} else if (pymtType.payUpFront) {
							this.setState({ payUpFront: true, payAsYouGo: false });
						}
						resolve();
					}
				});
			} else {
				resolve();
			}
		});
	};
	// resetStates
	resetStates = () => {
		this.setState({ isAlreadyPurchased: false, payAsYouGo: false, payUpFront: false });
	};
	//handle monthly subscription
	handleSubscription = (token, planId, schoolId, packageName, packageId, monthlyPymtDetails, self) => {
		const { popUp } = self.props;

		Meteor.call( 'stripe.handleCustomerAndSubscribe', token.id, planId, schoolId, packageName, packageId, monthlyPymtDetails, (err, res) => {
				if (res) {
					popUp.appear(
						'success',
						{
							title: 'Processing',
							content: `Your Subscription is being set up. You can check the status here:`,
							RenderActions: (
								<ButtonsWrapper>
									<FormGhostButton
										label={'My Subscriptions'}
										onClick={() => {
											browserHistory.push(`/mySubscription/${Meteor.userId()}`);
										}}
										applyClose
									/>
								</ButtonsWrapper>
							)
						},
						true
					);
					this.resetStates();
				} else {
					popUp.appear('warning', {
						title: 'Error',
						content: (err && err.message) || 'something went wrong'
					});
				}
			}
		);
	};
	//handle single charge for cp,ep,payupfront online
	handleCharge = ( token, packageName, packageId, packageType, schoolId, expDuration, expPeriod, noClasses, planId, self, contract ) => {
		const { popUp } = self.props;
		Meteor.call( 'stripe.chargeCard', token.id, packageName, packageId, packageType, schoolId, expDuration, expPeriod, noClasses, planId, contract, (error, result) => {
				if (result) {
					if (result == 'Payment Successfully Done') {
						let x = new Date().getTime();
						let memberData = {
							firstName: self.props.currentUser.profile.name || self.props.currentUser.profile.firstName,
							lastName: self.props.currentUser.profile.firstName || '',
							email: self.props.currentUser.emails[0].address,
							phone: '',
							schoolId: self.props.schoolId,
							classTypeIds: self.props.classType._id,
							birthYear: '',
							studentWithoutEmail: false,
							sendMeSkillShapeNotification: true,
							activeUserId: self.props.currentUser._id,
							createdBy: '',
							inviteAccepted: false,
							packageDetails: {
								[x]: {
									packageName: packageName,
									createdOn: new Date(),
									packageType: packageType,
									packageId: packageId,
									expDuration: expDuration,
									expPeriod: expPeriod,
									noClasses: noClasses
								}
							}
						};
						Meteor.call('schoolMemberDetails.addNewMember', memberData);
						popUp.appear(
							'success',
							{
								title: 'Success',
								content: `Your Payment is received successfully.`,
								RenderActions: (
									<ButtonsWrapper>
										<FormGhostButton
											label={'My Subscriptions'}
											onClick={() => {
												browserHistory.push(`/mySubscription/${Meteor.userId()}`);
											}}
											applyClose
										/>
									</ButtonsWrapper>
								)
							},
							true
						);
						this.resetStates();
					} else {
						popUp.appear('success', { title: 'Success', content: result.message });
					}
				} else {
					popUp.appear('success', { title: 'Error', content: error.message });
				}
			}
		);
	};
	// handleChargeAndSubscription
	handleChargeAndSubscription = ( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self, contract ) => {
		self.setState({ closed: false });
		const { popUp, schoolData } = this.props;
		let { payUpFront, payAsYouGo } = this.state;
		popUp.appear('success', {
			title: 'Wait',
			content: 'Please Wait One Sec...',
			RenderActions: <span />
		}); /* , true, { autoClose: true, autoTimeout: 4000 } */
		Meteor.call('stripe.findAdminStripeAccount', this.props.schoolData.superAdmin, (error, result) => {
			if (result && Meteor.settings.public.paymentEnabled) {
				let handler = StripeCheckout.configure({
					key: Meteor.settings.public.stripe.PUBLIC_KEY,
					image: this.schoolLogoFinder(schoolData),
					currency: currency,
					locale: 'auto',
					closed: function() {
						if (!self.state.closed)
							popUp.appear('alert', {
								title: 'Canceled ',
								content: 'The transaction is canceled by the user.',
								RenderActions: <span />
							});
					},
					token: function(token) {
						self.setState({ closed: true });
						popUp.appear('success', {
							title: 'Wait',
							content: 'Please wait transaction in Progress',
							RenderActions: <span />
						});
						//toastr.success("Please wait transaction in Progress", "Success");
						if (packageType == 'CP' || packageType == 'EP' || payUpFront || payAsYouGo) {
							self.handleCharge( token, packageName, packageId, packageType, schoolId, expDuration, expPeriod, noClasses, planId, self, contract );
						} else if (packageType == 'MP' && pymtType && pymtType.autoWithDraw) {
							self.handleSubscription( token, planId, schoolId, packageName, packageId, monthlyPymtDetails, self );
						}
					}
				});

				// Open Checkout with further options:
				handler.open({
					name: get(this.props.schoolData, 'name', 'School Name'),
					description: packageName,
					zipCode: true,
					amount: amount
				});
				// Close Checkout on page navigation:
				window.addEventListener('popstate', function() {
					handler.close();
				});
				// }
			} else {
				if (Meteor.userId()) {
					this.setState({ isLoading: true });
					Meteor.call(
						'packageRequest.addRequest',
						{ typeOfTable: packageType, tableId: packageId, schoolId: schoolId },
						(err, res) => {
							self.setState({ isLoading: false });
							if (err) {
								popUp.appear('success', { title: 'Message', content: err.error });
							} else if (res) {
								popUp.appear('success', { title: 'Message', content: res });
							}
						}
					);
				} else {
					Events.trigger('loginAsUser');
				}
			}
		});
	};
	// whenever user click cart button request come here.
	handlePurchasePackage = async ( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType ) => {
		try {
			this.resetStates();
			const { popUp } = this.props;
			popUp.appear('success', {
				title: 'Wait',
				content: 'Please Wait One Sec...',
				RenderActions: <span />
			}); /* , true, { autoClose: true, autoTimeout: 4000 } */
			config.currency.map((data, index) => {
				if (data.value == currency) {
					currency = data.label;
					amount = amount * data.multiplyFactor;
				}
			});
			let self = this;
			let userId = this.props.currentUser._id;
			//check is package is already purchased

			await this.isAlreadyPurchased({ userId, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self });

			if (this.state.isAlreadyPurchased) {
				return;
			}
			if (this.state.payAsYouGo) {
				let money = formatMoney(amount / 100, get(monthlyPymtDetails[0], 'currency', '$'));
				let months = get(monthlyPymtDetails[0], 'month', 0);
				let title = 'Pay As You Go ';
				let content = (
					<div>
						{' '}
						With this Payment type, you agree to pay the monthly fee for the length of the period you sign
						up for. You are not signing up for Automatic Withdrawal, and are expected to initiate your own
						payment each month.
						<br />
						<br />Do you agree to sign up for <b> {packageName} </b> and pay{' '}
						<b>
							{' '}
							{money} per month for {months} {months > 1 ? 'months' : 'month'}
						</b>? If so, you can pay for the first month now.
					</div>
				);
				this.handlePayAsYouGo({ packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self, title, content });
				return;
			}

			if (this.state.payUpFront) {
				let title = 'Pay Up Front Package';
				let content = 'This is Pay Up Front package.We will mark you. You have to pay your fees at School.';
				this.handlePayUpFront( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self, title, content );
				return;
			}
			//this will handle charge and subscription both
			this.handleChargeAndSubscription( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self );
		} catch (error) {
			console.log('Error in handlePurchasePackage', error);
		}
	};

	checkForHtmlCode = (data) => {
		if (data && data != '<p><br></p>') {
			return true;
		}
		return false;
	};
}
