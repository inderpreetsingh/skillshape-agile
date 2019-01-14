import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import { EditButton, SecondaryButton } from '/imports/ui/components/landing/components/buttons/';
import { SubscriptionsDetailsDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import Cart from '/imports/ui/components/landing/components/icons/Cart.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { packageStatus } from '/imports/ui/components/landing/constants/packages/packageStatus';
import { calcRenewalDate, capitalizeString, formatDate, formatMoney, maximumClasses } from '/imports/util';






const ADMIN_SUBSCRIPTIONS = 'adminSubscriptions';
const MY_SUBSCRIPTIONS = 'mySubscriptions';

// NOTE: Added small styles for appearance=small
const packageStyles = {
	light: {
		bgColor: helpers.panelColor,
	}
}

const outerWrapperMobileStyles = `
	border-radius: ${helpers.rhythmDiv}px;
	max-width: 320px;
	width: 100%;
	margin: 0 auto;
`;

const outerWrapperSmallStyles = `
	${outerWrapperMobileStyles}
	max-width: 220px;
	padding: ${helpers.rhythmDiv * 2}px;

	:after {
		border-radius: ${helpers.rhythmDiv}px;
	}
`

const OuterWrapper = styled.div`
	${(props) => (props.variant ? `box-shadow: ${helpers.inputBoxShadow}` : '')};
	padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px;
	padding-right: ${helpers.rhythmDiv * 2}px;
	width: 100%;
	border-radius: ${helpers.rhythmDiv * 6}px;
	color: ${helpers.textColor};
	z-index: 1;
	position: relative;

	&:after {
		content: "";
		position: absolute;
		z-index: -1;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: ${(props) => (props.bgColor || 'white')};
		opacity: ${(props) => (props.variant === 'light' ? 0.1 : 1)};
		border-radius: ${props => props.roundness || helpers.rhythmDiv * 6}px;
		/* overriding the opacity for the subscription, variant*/
		${props => props.variant && props.variant !== 'normal' && `background-color: ${packageStyles[props.variant].bgColor}`}
		${(props) => props.usedFor === 'subscriptions' && `opacity: ${props.opacity || 1}`}; 
		${props => props.packageSelected && `opacity: 0.1; background-color: ${helpers.primaryColor};`}	
	}

	${props => props.appearance === 'small' && outerWrapperSmallStyles}

	@media screen and (max-width: ${helpers.mobile}px) {
		${outerWrapperMobileStyles}	
		${props => props.appearance === 'small' && outerWrapperSmallStyles}
	}
`;

const wrapperSmallStyles = `
	flex-direction: column;
`;

const Wrapper = styled.div`
	${helpers.flexCenter} justify-content: space-between;

	${props => props.appearance === 'small' && wrapperSmallStyles}

	@media screen and (max-width: ${helpers.mobile}px) {
		${wrapperSmallStyles}	
	}
`;

const titleMobileStyles = `
	text-align: center;
`;

const titleSmallStyles = `
	text-align: left;
`

const Title = styled.h3`
	font-size: 12px;
	font-family: ${helpers.commonFont};
	letter-spacing: 2px;
	font-weight: 700;
	text-transform: uppercase;
	margin: 0;
	color: rgba(0, 0, 0, 1);
	line-height: 1.2;

	${props => props.appearance === 'small' && titleSmallStyles}

	@media screen and (max-width: ${helpers.mobile}px) {
		${titleMobileStyles}
		${props => props.appearance === 'small' && titleSmallStyles}	
	}
`;

const classDetailsSmallStyles = `
	max-width: 100%;
`

const ClassDetailsSection = styled.div`
	${helpers.flexDirectionColumn} max-width: 65%;
	padding-right: ${helpers.rhythmDiv}px;

	${props => props.appearance === 'small' && classDetailsSmallStyles}

	@media screen and (max-width: ${helpers.mobile}px) {
		${classDetailsSmallStyles}	
	}
`;

const cdTextSmallStyles = `
	margin-bottom: ${helpers.rhythmDiv}px;
	text-align: left;
`;

const cdTextMobileStyles = `
	${cdTextSmallStyles}
	text-align: center;
`

const CdText = styled.p`
	margin: 0;
	font-size: 14px;
	font-family: ${helpers.specialFont};
	font-weight: 400;
	line-height: 1;

	${props => props.appearance === 'small' && cdTextSmallStyles}

	@media screen and (max-width: ${helpers.mobile}px) {
		${cdTextMobileStyles}
		${props => props.appearance === 'small' && cdTextSmallStyles}
	}
`;

const PriceSection = styled.div`
	${helpers.flexDirectionColumn} margin: 0;
	padding-right: ${helpers.rhythmDiv}px;
	padding-bottom: ${helpers.rhythmDiv / 2}px;
`;

const Price = styled.p`
	margin: 0;
	font-family: ${helpers.specialFont};
	font-weight: 300;
	color: ${helpers.primaryColor};
	font-size: 28px;
	line-height: 1;
`;

const NoOfClasses = styled.p`
	font-style: italic;
	font-family: ${helpers.specialFont};
	font-weight: 400;
	font-size: 14px;
	margin: 0;
	line-height: 1;
`;

const AddToCartSection = styled.div`
	margin-left: ${helpers.rhythmDiv * 2}px;
	cursor: pointer;
`;

const RightSection = styled.div`
	${helpers.flexCenter};
	@media screen and (max-width: ${helpers.mobile}px) {
		width: 100%; 
	}
`;

const statusSmallStyles = `
	flex-direction: row;
	width: 100%;
	justify-content: space-evenly;
`

const StatusWrapper = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	
	${props => props.appearance === 'small' && statusSmallStyles}

	@media screen and (max-width: ${helpers.mobile}px) {
		${statusSmallStyles}	
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
`;

const Status = Text.extend`
	font-weight: 500;
	color: ${(props) => packageStatus[props.packageStatus]};
`;

class Package extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subscriptionsDetailsDialog: false
		}
	}

	getPaymentType(payment) {
		let paymentType = '';
		if (payment) {
			if (payment['autoWithDraw'] && payment['payAsYouGo']) {
				paymentType += 'Automatic Withdrawal and Pay As You Go';
			} else if (payment['autoWithDraw']) {
				paymentType += 'Automatic Withdrawal';
			} else if (payment['payAsYouGo']) {
				paymentType += 'Pay As You Go';
			} else if (payment['payUpFront']) {
				paymentType += 'Pay Up Front';
			}
		}
		return paymentType;
	}

	getPaymentTypeName = (props) => {
		if (props.autoWithdraw) {
			return `  (AutoWithdraw Payment)`;
		}
		else if (props.payAsYouGo) {
			return ` (Pay As You Go)`;
		}
		else if (props.payUpFront) {
			return ` (Pay Up Front)`;
		}
		else if (props.packageType == 'CP') {
			return ` (Per Class Package)`;
		}
		else {
			return ` (Enrollment Package)`;
		}
	}

	getCovers = (data) => {
		let str = ""
		if (!isEmpty(data)) {
			str = data.map(classType => classType.name);
			str = str.join(", ");
		}
		return str.toLowerCase();
	}

	getDateForSubscriptions = (props) => {
		let stringToPrint = '';
		let fee = get(props, 'amount', 0).toFixed(2);
		let currency = get(props, 'currency', '$')
		if (get(props, 'payUpFront', false)) {
			stringToPrint += `<b>Paid until:</b> `;
			let contractLength = get(props, 'contractLength', 0);
			contractLength = props.combinedData.length > 1 ? contractLength * props.combinedData.length - 1 : 0
			return stringToPrint += calcRenewalDate(props.endDate, props.packageType === 'MP', contractLength);
		}
		if (get(props, 'payAsYouGo', false)) {
			return `Payment of ${formatMoney(fee, currency)} is due on ${calcRenewalDate(props.endDate, props.packageType === 'MP', props.combinedData.length - 1)}`
		}
		if (get(props, 'autoWithdraw', false) || get(props,'packageType',null) == 'MP') {
			return stringToPrint += `<b>Automatic Payment</b> of ${formatMoney(fee, currency)} will process ${calcRenewalDate(props.endDate, props.packageType === 'MP', 0)}.`
		}
		if (props.subsType === ADMIN_SUBSCRIPTIONS) {
			return (stringToPrint += `Renewal Date : ` + calcRenewalDate(props.endDate, props.packageType === 'MP', 1));
		} else if (props.payAsYouGo) {
			stringToPrint += `Contract active : `;
		} else {
			if (props.packageType == 'CP') {
				// props.combinedData.map((obj,index)=>{
				// 	stringToPrint += ` ${obj.noClasses} Classes : ${formatDate(obj.endDate)} <br/>`;
				// })
				let noClasses = 0;
				props.combinedData.map((obj, index) => {
					noClasses += get(obj, "noClasses", 0);
				})
				return stringToPrint += `${noClasses} ${noClasses <= 1 ? 'Class' : 'Classes'} Remaining`;
			}
			else {
				stringToPrint += '<b>Expiration Date :</b> ';
			}
		}
		return stringToPrint + (props.packageType == 'EP' && props.expiry == 'none' ? 'None' : formatDate(props.endDate));
	};

	getExplainationBasedOnType = (props) => {
		if (props.payAsYouGo) {
			return (<React.Fragment>
				<CdText>
					<b>Contract ends:</b>  {calcRenewalDate(props.endDate, props.packageType === 'MP', props.contractLength)}
				</CdText>
			</React.Fragment>)
		}
		if (props.autoWithdraw) {
			return (<React.Fragment>
				<CdText>
					<b>Contract ends:</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', props.contractLength)}
				</CdText>
			</React.Fragment>)
		}
	}

	handleModelState = (modelName, modelState) => {
		this.setState(state => {
			return {
				...state,
				[modelName]: modelState
			}
		})
	}

	render() {
		const props = this.props;
		const { bgColor,
			packageSelected,
			onPackageClick,
			appearance,
			variant,
			opacity,
			roundness,
			usedFor
		} = this.props;
		const { subscriptionsDetailsDialog } = this.state;
		const ourPackageStatus = props.packageStatus || props.status;

		if (props.subsType === ADMIN_SUBSCRIPTIONS || props.subsType === MY_SUBSCRIPTIONS) {

			return (<Fragment>
				{subscriptionsDetailsDialog &&
					<SubscriptionsDetailsDialogBox
						{...props}
						open={subscriptionsDetailsDialog}
						onModalClose={() => this.handleModelState('subscriptionsDetailsDialog', false)}
					/>}
				<OuterWrapper
					appearance={appearance}
					roundness={roundness}
					opacity={opacity}
					usedFor={usedFor}
					variant={variant}
					bgColor={bgColor}
				>
					<Wrapper appearance={appearance}>
						<ClassDetailsSection appearance={appearance}>
							<Title appearance={appearance}>{props.packageName || props.name} {this.getPaymentTypeName(props)}</Title>
							<CdText appearance={appearance}>
								{ReactHtmlParser(this.getDateForSubscriptions(props))}
							</CdText>

							{/* <CdText>
								<b>Covers:</b> {this.getCovers(props.covers)}
							</CdText> */}
							{/* For monthly packages we need to have paid until date, some purchase data is not showing packageType*/}
							{/* {props.packageType === 'MP' && !props.autoWithdraw && !props.payAsYouGo && <CdText>
							<b>Paid Until:</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', 1)}
						</CdText>} */}
							{/* Depending upon the type of payment method */}
							{/*this.getExplainationBasedOnType(props)*/}

						</ClassDetailsSection>
						<RightSection>
							<StatusWrapper appearance={appearance}>
								<Status packageStatus={ourPackageStatus}>
									{capitalizeString(ourPackageStatus)}
								</Status>
								<ButtonWrapper>
									<SecondaryButton
										onClick={() => this.handleModelState('subscriptionsDetailsDialog', true)}
										label="Details"
									/>

								</ButtonWrapper>
							</StatusWrapper>
						</RightSection>
					</Wrapper>
				</OuterWrapper >
			</Fragment>
			);
		}
		let BB = { backgroundColor: 'black' };
		return (<Fragment>
			<OuterWrapper
				appearance={appearance}
				roundness={roundness}
				opacity={opacity}
				usedFor={usedFor}
				onClick={onPackageClick}
				packageSelected={packageSelected}
				variant={variant}
				bgColor={bgColor}>
				<Wrapper appearance={appearance}>
					<ClassDetailsSection appearance={appearance}>
						<Title appearance={appearance}>{props.packageName || props.name}</Title>

						{props.classPackages || props.packageType == 'EP' ? (
							<CdText appearance={appearance}>
								<b>Expiration:</b>{' '}
								{props.expDuration && props.expPeriod && !props.noExpiration ? (
									`${props.expDuration} ${props.expPeriod}`
								) : (
										'None'
									)}
							</CdText>
						) : (
								<CdText appearance={appearance}>{this.getPaymentType(props.pymtType) || 'NA'}</CdText>
							)}
						{usedFor !== "enrollmentPackagesDialog" && <CdText appearance={appearance}>
							<b>Covers:</b> {this.getCovers(props.selectedClassType)}
						</CdText>}
						{props.packageType == 'MP' && <CdText>{maximumClasses(props)}</CdText>}
					</ClassDetailsSection>
					<RightSection>
						{props.packageType !== 'EP' ? (
							<Fragment>
								{props.classPackages ? (
									<PriceSection>
										<Price>
											{props.cost &&
												`${formatMoney(
													Number.parseFloat(props.cost).toFixed(2),
													props.currency ? props.currency : props.schoolCurrency
												)}`}
										</Price>
										<NoOfClasses>{props.noClasses && `for ${props.noClasses} classes`}</NoOfClasses>
									</PriceSection>
								) : (
										!isEmpty(props.uiPayment) &&
										props.uiPayment.map((payment, index) => {
											return (
												<PriceSection key={`${payment.cost}-${index}`}>
													<Price>
														{payment.cost &&
															`${formatMoney(
																Number.parseFloat(
																	payment.cost
																).toFixed(2),
																payment.currency ? payment.currency : props.schoolCurrency
															)}`}
													</Price>
													<NoOfClasses>
														{payment.month &&
															`${get(props.pymtType, 'payUpFront', false)
																? ''
																: 'per month'} for ${payment.month} ${payment.month > 1
																	? 'months'
																	: ' month'} ${get(props.pymtType, 'payUpFront', false)
																		? `(${formatMoney(
																			Number.parseFloat(payment.cost / payment.month).toFixed(2),
																			payment.currency ? payment.currency : props.schoolCurrency
																		)} per month)`
																		: ''}`}
													</NoOfClasses>
												</PriceSection>
											);
										})
									)}
							</Fragment>
						) : (
								<PriceSection>
									{' '}
									{/* used for enrollment packages */}
									<Price>
										{props.cost &&
											`${formatMoney(
												Number.parseFloat(props.cost).toFixed(2),
												props.currency ? props.currency : props.schoolCurrency
											)}`}
									</Price>
									<NoOfClasses>{props.cost && 'For Enrollment'}</NoOfClasses>
								</PriceSection>
							)}
						{props.onSchoolEdit ? (
							<EditButton
								label={'Edit'}
								onClick={() => {
									props.setFormData();
									props.onEditClick();
								}}
							/>
						) : (
								<AddToCartSection>
									<Cart
										onClick={() => {
											props.onAddToCartIconButtonClick(
												props.packageType,
												props._id,
												props.schoolId,
												props.packageName || props.name,
												props.cost ? props.cost : props.pymtDetails[0].cost,
												props.pymtDetails,
												props.expDuration,
												props.expPeriod || props.duPeriod,
												props.noClasses,
												props.pymtDetails && props.pymtDetails[0].planId,
												props.currency
													? props.currency
													: props.pymtDetails ? props.pymtDetails[0].currency : props.schoolCurrency,
												props.pymtType
											);
										}}
									/>
									{/* </a> */}
								</AddToCartSection>
							)}
					</RightSection>
				</Wrapper>
			</OuterWrapper>
		</Fragment >
		);
	}
}

Package.propTypes = {
	title: PropTypes.string,
	expiration: PropTypes.string,
	price: PropTypes.string,
	noOfClasses: PropTypes.number,
	forMySubscriptions: PropTypes.bool,
	packageSelected: PropTypes.bool,
	classesCovered: PropTypes.string,
	variant: PropTypes.string,
	appearance: PropTypes.string,
	onAddToCartIconButtonClick: PropTypes.func
};

Package.defaultProps = {
	appearance: 'normal',
	packageSelected: false,
	packagePerClass: false,
	forMySubscriptions: false,
	onAddToCartIconButtonClick: () => { }
};

export default Package;
