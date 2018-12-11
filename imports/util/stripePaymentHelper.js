import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import get from 'lodash/get';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import styled from 'styled-components';
import React from 'react';
import moment from 'moment';
import { formatMoney } from '/imports/util';
import LoginButton from "/imports/ui/components/landing/components/buttons/LoginButton.jsx";
import JoinButton from '/imports/ui/components/landing/components/buttons/JoinButton.jsx';
const ButtonsWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
`;
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;
const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;
export const stripePaymentHelper = async function (packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType) {

    resetStates(this);
    const { popUp } = this.props;
    popUp.appear('success', {
        title: 'Wait',
        content: 'Please Wait One Sec...',
        RenderActions: <span />
    }, true); /* , true, { autoClose: true, autoTimeout: 4000 } */

    config.currency.map((data, index) => {
        if (data.value == currency) {
            currency = data.label;
            amount = amount * data.multiplyFactor;
        }
    });

    let self = this;
    let userId = Meteor.userId();
    if (!userId) {
        popUp.appear("alert", {
            title: "Login Required",
            content: `To purchase any package you must be logged.`,
            RenderActions: (<Div > <LoginButton {...this.props} fromPurchase={true} />
                <JoinButton label="Sign Up" {...this.props} />
            </Div>)
        }, true, {
                purpose: 'login-alert'
            });
        return;
    }
    //check is package is already purchased

    await isAlreadyPurchased({
        userId,
        packageType,
        packageId,
        schoolId,
        packageName,
        amount,
        monthlyPymtDetails,
        expDuration,
        expPeriod,
        noClasses,
        planId,
        currency,
        pymtType,
        self
    });

    if (self.state.isAlreadyPurchased) {
        return;
    }
    if (self.state.payAsYouGo) {
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
        handlePayAsYouGo({
            packageType,
            packageId,
            schoolId,
            packageName,
            amount,
            monthlyPymtDetails,
            expDuration,
            expPeriod,
            noClasses,
            planId,
            currency,
            pymtType,
            self,
            title,
            content
        });
        return;
    }

    if (self.state.payUpFront) {
        let title = 'Pay Up Front Package';
        let content = 'This is Pay Up Front package.We will mark you. You have to pay your fees at School.';
        handlePayUpFront(
            packageType,
            packageId,
            schoolId,
            packageName,
            amount,
            monthlyPymtDetails,
            expDuration,
            expPeriod,
            noClasses,
            planId,
            currency,
            pymtType,
            self,
            title,
            content
        );
        return;
    }
    //this will handle charge and subscription both
    handleChargeAndSubscription(packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, self);
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
noThanksButton = () => (
    <ButtonWrapper>
        <FormGhostButton label={'No, thanks'} onClick={() => { }} greyColor applyClose />
    </ButtonWrapper>
);
purchaseButton = (
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self
) => (
        <ButtonWrapper>
            <FormGhostButton
                label={'Purchase Now'}
                onClick={() => {
                    handleChargeAndSubscription(
                        packageType,
                        packageId,
                        schoolId,
                        packageName,
                        amount,
                        monthlyPymtDetails,
                        expDuration,
                        expPeriod,
                        noClasses,
                        planId,
                        currency,
                        pymtType,
                        self
                    );
                }}
                applyClose
            />
        </ButtonWrapper>
    );
purchaseOldContract = (
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self
) => (
        <ButtonWrapper>
            <FormGhostButton
                label={'Make Payment on Existing Plan'}
                onClick={() => {
                    handleChargeAndSubscription(
                        packageType,
                        packageId,
                        schoolId,
                        packageName,
                        amount,
                        monthlyPymtDetails,
                        expDuration,
                        expPeriod,
                        noClasses,
                        planId,
                        currency,
                        pymtType,
                        self,
                        'useOldContract'
                    );
                }}
                applyClose
            />
        </ButtonWrapper>
    );
purchaseNewContract = (
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self
) => (
        <ButtonWrapper>
            <FormGhostButton
                label={'Purchase New Contract'}
                onClick={() => {
                    handleChargeAndSubscription(
                        packageType,
                        packageId,
                        schoolId,
                        packageName,
                        amount,
                        monthlyPymtDetails,
                        expDuration,
                        expPeriod,
                        noClasses,
                        planId,
                        currency,
                        pymtType,
                        self
                    );
                }}
                applyClose
            />
        </ButtonWrapper>
    );
pastSubscriptionButton = () => (
    <ButtonWrapper>
        <FormGhostButton
            label={'View My Subscriptions'}
            onClick={() => {
                const url = `${Meteor.absoluteUrl()}mySubscription/${Meteor.userId()}`;
                window.open(url, '_blank');
            }}
            applyClose
        />
    </ButtonWrapper>
);
//handle PayUpfront case
handlePayUpFront = (
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self,
    title,
    content
) => {
    amount = amount * monthlyPymtDetails[0].month || 1;
    expDuration = monthlyPymtDetails[0].month;
    const { popUp } = self.props;
    popUp.appear(
        'inform',
        {
            title: 'Pay Up Front',
            content: 'When you pay for a number of monthly subscription fees at once.',
            RenderActions: (
                <ButtonsWrapper>
                    {noThanksButton()}
                    {purchaseButton(
                        packageType,
                        packageId,
                        schoolId,
                        packageName,
                        amount,
                        monthlyPymtDetails,
                        expDuration,
                        expPeriod,
                        noClasses,
                        planId,
                        currency,
                        pymtType,
                        self
                    )}

                    {pastSubscriptionButton()}

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
handlePayAsYouGo = ({
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self,
    title,
    content
}) => {
    const { popUp } = self.props;
    popUp.appear('inform', {
        title: title,
        content: content,
        RenderActions: (
            <ButtonsWrapper>
                {noThanksButton()}
                {purchaseButton(
                    packageType,
                    packageId,
                    schoolId,
                    packageName,
                    amount,
                    monthlyPymtDetails,
                    expDuration,
                    expPeriod,
                    noClasses,
                    planId,
                    currency,
                    pymtType,
                    self
                )}
                {pastSubscriptionButton()}
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
isAlreadyPurchased = ({
    userId,
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self
}) => {
    return new Promise((resolve, reject) => {
        if ((userId && planId) || packageId) {
            Meteor.call(
                'purchases.isAlreadyPurchased',
                { userId, planId, packageId, packageType, pymtType },
                async (err, res) => {
                    if (res) {
                        const { popUp, schoolData } = self.props;
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
                                                {noThanksButton()}
                                                {purchaseButton(
                                                    packageType,
                                                    packageId,
                                                    schoolId,
                                                    packageName,
                                                    amount,
                                                    monthlyPymtDetails,
                                                    expDuration,
                                                    expPeriod,
                                                    noClasses,
                                                    planId,
                                                    currency,
                                                    pymtType,
                                                    self
                                                )}
                                                {pastSubscriptionButton()}
                                            </ButtonsWrapper>
                                        )
                                    },
                                    true
                                );
                            } else {
                                handleChargeAndSubscription(
                                    packageType,
                                    packageId,
                                    schoolId,
                                    packageName,
                                    amount,
                                    monthlyPymtDetails,
                                    expDuration,
                                    expPeriod,
                                    noClasses,
                                    planId,
                                    currency,
                                    pymtType,
                                    self,
                                    purchaseId
                                );
                            }
                        } else if (packageType == 'MP') {
                            let expiry,
                                nextExpiry,
                                endDate,
                                inActivePurchases,
                                monthPack,
                                details,
                                oldRate,
                                newRate,
                                newNextExpiryDate;
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
                                self.setState({ payAsYouGo: true });
                                details = contractLengthFinder(res, monthlyPymtDetails);
                                if (details.contractLength == 'shorter') {
                                    popUp.appear(
                                        'inform',
                                        {
                                            title: 'Already Purchased',
                                            content: `You have one or more  Monthly Subscriptions at ${schoolName} including Pay As You Go plan that expires on ${expiry}. Would you like to pay up until ${nextExpiry}?`,
                                            RenderActions: (
                                                <ButtonsWrapper>
                                                    {noThanksButton()}
                                                    {purchaseButton(
                                                        packageType,
                                                        packageId,
                                                        schoolId,
                                                        packageName,
                                                        amount,
                                                        monthlyPymtDetails,
                                                        expDuration,
                                                        expPeriod,
                                                        noClasses,
                                                        planId,
                                                        currency,
                                                        pymtType,
                                                        self
                                                    )}
                                                    {pastSubscriptionButton()}
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
                                                    {noThanksButton()}
                                                    {purchaseNewContract(
                                                        packageType,
                                                        packageId,
                                                        schoolId,
                                                        packageName,
                                                        amount,
                                                        monthlyPymtDetails,
                                                        expDuration,
                                                        expPeriod,
                                                        noClasses,
                                                        planId,
                                                        currency,
                                                        pymtType,
                                                        self
                                                    )}
                                                    {purchaseOldContract(
                                                        packageType,
                                                        packageId,
                                                        schoolId,
                                                        packageName,
                                                        amount,
                                                        monthlyPymtDetails,
                                                        expDuration,
                                                        expPeriod,
                                                        noClasses,
                                                        planId,
                                                        currency,
                                                        pymtType,
                                                        self
                                                    )}
                                                    {pastSubscriptionButton()}
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
                                self.setState({ payUpFront: true });
                                popUp.appear(
                                    'inform',
                                    {
                                        title: 'Already Purchased',
                                        content: `You have one or more  Monthly Subscriptions at ${schoolName} including an existing Pay Up Front plan which is good until ${expiry}.Would you like to pay ahead until ${nextExpiry} on this plan?`,
                                        RenderActions: (
                                            <ButtonsWrapper>
                                                {noThanksButton()}
                                                {purchaseButton(
                                                    packageType,
                                                    packageId,
                                                    schoolId,
                                                    packageName,
                                                    amount,
                                                    monthlyPymtDetails,
                                                    expDuration,
                                                    expPeriod,
                                                    noClasses,
                                                    planId,
                                                    currency,
                                                    pymtType,
                                                    self
                                                )}
                                                {pastSubscriptionButton()}
                                            </ButtonsWrapper>
                                        )
                                    },
                                    true
                                );
                            }
                        }
                        self.setState({ isAlreadyPurchased: true });
                        // check payment type  and take required action
                        resolve();
                    } else {
                        self.setState({ isAlreadyPurchased: false });
                        // check payment type  and take required action
                        if (packageType == 'MP') {
                            await checkPymtType({
                                userId,
                                packageType,
                                packageId,
                                schoolId,
                                packageName,
                                amount,
                                monthlyPymtDetails,
                                expDuration,
                                expPeriod,
                                noClasses,
                                planId,
                                currency,
                                pymtType,
                                self
                            });
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
checkPymtType = ({
    userId,
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self
}) => {
    return new Promise((resolve, reject) => {
        const { popUp } = self.props;
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
                                    {noThanksButton()}
                                    {purchaseButton(
                                        packageType,
                                        packageId,
                                        schoolId,
                                        packageName,
                                        amount,
                                        monthlyPymtDetails,
                                        expDuration,
                                        expPeriod,
                                        noClasses,
                                        planId,
                                        currency,
                                        pymtType,
                                        self
                                    )}
                                    {pastSubscriptionButton()}
                                </ButtonsWrapper>
                            )
                        },
                        true
                    );
                    self.setState({ isAlreadyPurchased: true, payAsYouGo: true });
                    resolve();
                } else {
                    self.setState({ isAlreadyPurchased: false });
                    if (pymtType.payAsYouGo) {
                        self.setState({ payAsYouGo: true, payUpFront: false });
                    } else if (pymtType.payUpFront) {
                        self.setState({ payUpFront: true, payAsYouGo: false });
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
resetStates = (self) => {
    self.setState({ isAlreadyPurchased: false, payAsYouGo: false, payUpFront: false });
};
//handle monthly subscription
handleSubscription = (token, planId, schoolId, packageName, packageId, monthlyPymtDetails, self) => {
    const { popUp } = self.props;

    Meteor.call(
        'stripe.handleCustomerAndSubscribe',
        token.id,
        planId,
        schoolId,
        packageName,
        packageId,
        monthlyPymtDetails,
        (err, res) => {
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
                                        const url = `${Meteor.absoluteUrl()}mySubscription/${Meteor.userId()}`;
                                        window.open(url, '_blank');
                                    }}
                                    applyClose
                                />
                            </ButtonsWrapper>
                        )
                    },
                    true
                );
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
handleCharge = (
    token,
    packageName,
    packageId,
    packageType,
    schoolId,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    self,
    contract
) => {
    const { popUp } = self.props;
    let currentUser = Meteor.user();
    Meteor.call(
        'stripe.chargeCard',
        token.id,
        packageName,
        packageId,
        packageType,
        schoolId,
        expDuration,
        expPeriod,
        noClasses,
        planId,
        contract,
        (error, result) => {
            if (result) {
                if (result == 'Payment Successfully Done') {
                    let x = new Date().getTime();
                    console.log('TCL: self.props', self.props);
                    let memberData = {
                        firstName: currentUser.profile.name || currentUser.profile.firstName,
                        lastName: currentUser.profile.firstName || '',
                        email: currentUser.emails[0].address,
                        phone: '',
                        schoolId: self.props.schoolId,
                        birthYear: '',
                        studentWithoutEmail: false,
                        sendMeSkillShapeNotification: true,
                        activeUserId: currentUser._id,
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
                                            const url = `${Meteor.absoluteUrl()}mySubscription/${Meteor.userId()}`;
                                            window.open(url, '_blank');
                                        }}
                                        applyClose
                                    />
                                </ButtonsWrapper>
                            )
                        },
                        true
                    );
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
handleChargeAndSubscription = (
    packageType,
    packageId,
    schoolId,
    packageName,
    amount,
    monthlyPymtDetails,
    expDuration,
    expPeriod,
    noClasses,
    planId,
    currency,
    pymtType,
    self,
    contract
) => {
    self.setState({ closed: false });
    const { popUp, schoolData } = self.props;
    let { payUpFront, payAsYouGo } = self.state;
    popUp.appear('success', {
        title: 'Wait',
        content: 'Please Wait One Sec...',
        RenderActions: <span />
    }); /* , true, { autoClose: true, autoTimeout: 4000 } */
    Meteor.call('stripe.findAdminStripeAccount', self.props.schoolData.superAdmin, (error, result) => {
        if (result && Meteor.settings.public.paymentEnabled) {
            let handler = StripeCheckout.configure({
                key: Meteor.settings.public.stripe.PUBLIC_KEY,
                image: schoolLogoFinder(schoolData),
                currency: currency,
                locale: 'auto',
                closed: function () {
                    if (!self.state.closed)
                        popUp.appear('alert', {
                            title: 'Canceled ',
                            content: 'The transaction is canceled by the user.',
                            RenderActions: <span />
                        });
                },
                token: function (token) {
                    self.setState({ closed: true });
                    popUp.appear('success', {
                        title: 'Wait',
                        content: 'Please wait transaction in Progress',
                        RenderActions: <span />
                    });
                    //toastr.success("Please wait transaction in Progress", "Success");
                    if (packageType == 'CP' || packageType == 'EP' || payUpFront || payAsYouGo) {
                        handleCharge(
                            token,
                            packageName,
                            packageId,
                            packageType,
                            schoolId,
                            expDuration,
                            expPeriod,
                            noClasses,
                            planId,
                            self,
                            contract
                        );
                    } else if (packageType == 'MP' && pymtType && pymtType.autoWithDraw) {
                        handleSubscription(
                            token,
                            planId,
                            schoolId,
                            packageName,
                            packageId,
                            monthlyPymtDetails,
                            self
                        );
                    }
                }
            });

            // Open Checkout with further options:
            handler.open({
                name: get(self.props.schoolData, 'name', 'School Name'),
                description: packageName,
                zipCode: true,
                amount: amount
            });
            // Close Checkout on page navigation:
            window.addEventListener('popstate', function () {
                handler.close();
            });
            // }
        } else {
            if (Meteor.userId()) {
                self.setState({ isLoading: true });
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