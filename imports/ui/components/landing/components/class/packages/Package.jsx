import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import { formatMoney, maximumClasses } from '/imports/util';
import EditButton from '/imports/ui/components/landing/components/buttons/EditButton.jsx';
import Cart from '/imports/ui/components/landing/components/icons/Cart.jsx';
import { formatDate } from '/imports/util/formatSchedule.js';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
	${helpers.flexCenter} justify-content: space-between;

	@media screen and (max-width: ${helpers.mobile}px) {
		flex-direction: column;
	}
`;

const OuterWrapper = styled.div`
	${(props) => (props.forIframes ? `box-shadow: ${helpers.inputBoxShadow}` : '')};
	padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px;
	padding-right: ${helpers.rhythmDiv * 2}px;
	border-radius: ${helpers.rhythmDiv * 6}px;
	width: 100%;
	color: ${helpers.textColor};
	z-index: 1;
	position: relative;

	@media screen and (max-width: ${helpers.mobile}px) {
		border-radius: ${helpers.rhythmDiv}px;

		max-width: 320px;
		width: 100%;
		margin: 0 auto;
	}

	&:after {
		content: "";
		position: absolute;
		z-index: -1;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: ${(props) => (props.forIframes ? props.bgColor : 'white')};
		opacity: ${(props) => (props.forIframes ? 0.1 : 1)};
		border-radius: ${helpers.rhythmDiv * 6}px;
	}
`;

const Title = styled.h3`
	font-size: 12px;
	font-family: ${helpers.commonFont};
	letter-spacing: 2px;
	font-weight: 700;
	text-transform: uppercase;
	margin: 0;
	color: rgba(0, 0, 0, 1);
	line-height: 1.2;

	@media screen and (max-width: ${helpers.mobile}px) {
		text-align: center;
	}
`;

const Body = styled.section`padding: ${helpers.rhythmDiv}px;`;

const ClassDetailsSection = styled.div`
	${helpers.flexDirectionColumn} max-width: 65%;
	padding-right: ${helpers.rhythmDiv}px;

	@media screen and (max-width: ${helpers.mobile}px) {
		max-width: 100%;
	}
`;

const ClassDetailsText = styled.p`
	margin: 0;
	font-size: 14px;
	font-family: ${helpers.specialFont};
	font-weight: 400;
	line-height: 1;
	text-transform: capitalize;

	@media screen and (max-width: ${helpers.mobile}px) {
		text-align: center;
		margin-bottom: ${helpers.rhythmDiv}px;
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

const RightSection = styled.div`${helpers.flexCenter};`;

const Status = Text.extend`
	font-weight: 500;
	color: ${(props) => (props.packageStatus === 'active' ? helpers.primaryColor : helpers.danger)};
`;

function getCovers(data) {
	let str = '';
	if (!isEmpty(data)) {
		str = data.map((classType) => classType.name);
		str = str.join(', ');
	}
	return str.toLowerCase();
}

function getPaymentType(payment) {
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

const Package = (props) => {
	if (props.forMySubscriptions) {
		return (
			<OuterWrapper forIframes={props.forIframes} bgColor={props.bgColor}>
				<Wrapper>
					<ClassDetailsSection>
						<Title>{props.packageName || props.name}</Title>
						<ClassDetailsText>
							{props.payAsYouGo ? 'Contract active until : ' : 'Expiration Date : '}{' '}
							{formatDate(props.endDate)}
						</ClassDetailsText>
					</ClassDetailsSection>
					<RightSection>
						<AddToCartSection>
							<Status packageStatus={props.packageStatus}>{props.packageStatus}</Status>
						</AddToCartSection>
					</RightSection>
				</Wrapper>
			</OuterWrapper>
		);
	}
	let BB = { backgroundColor: 'black' };
	return (
		<OuterWrapper forIframes={props.forIframes} bgColor={props.bgColor}>
			<Wrapper>
				<ClassDetailsSection>
					<Title>{props.packageName || props.name}</Title>

					{props.classPackages || props.packageType == 'EP' ? (
						<ClassDetailsText>
							<b>Expiration:</b>{' '}
							{props.expDuration && props.expPeriod && !props.noExpiration ? (
								`${props.expDuration} ${props.expPeriod}`
							) : (
								'None'
							)}
							</ClassDetailsText>
					) : (
						<ClassDetailsText>{getPaymentType(props.pymtType) || 'NA'}</ClassDetailsText>
					)}
					<ClassDetailsText><b>Covers:</b> {getCovers(props.selectedClassType)}</ClassDetailsText>
					{props.packageType == 'MP' && <ClassDetailsText>{maximumClasses(props)}</ClassDetailsText>}
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
								!isEmpty(props.pymtDetails) &&
								props.pymtDetails.map((payment, index) => {
									return (
										<PriceSection key={`${payment.cost}-${index}`}>
											<Price>
												{payment.cost &&
													`${formatMoney(
														Number.parseFloat(get(props.pymtType,'payUpFront',false) ? payment.cost*payment.month : payment.cost).toFixed(2),
														payment.currency ? payment.currency : props.schoolCurrency
													)}`}
											</Price>
											<NoOfClasses>
												{payment.month && `${get(props.pymtType,'payUpFront',false)? '' : "per month"} for ${payment.month} ${payment.month > 1 ?'months' :' month'} ${get(props.pymtType,'payUpFront',false) ? `(${formatMoney(
														Number.parseFloat(payment.cost).toFixed(2),
														payment.currency ? payment.currency : props.schoolCurrency
													)} per month)`:''}`}
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
	);
};

Package.propTypes = {
	title: PropTypes.string,
	expiration: PropTypes.string,
	price: PropTypes.string,
	noOfClasses: PropTypes.number,
	forMySubscriptions: PropTypes.bool,
	classesCovered: PropTypes.string,
	onAddToCartIconButtonClick: PropTypes.func
};

Package.defaultProps = {
	packagePerClass: false,
	forMySubscriptions: false,
	onAddToCartIconButtonClick: () => {}
};

export default Package;
