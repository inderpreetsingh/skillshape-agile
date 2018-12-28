import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { createContainer } from "meteor/react-meteor-data";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import { isEmpty, flatten, get, uniq } from "lodash";


import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import Radio, { RadioGroup } from "material-ui/Radio";
import { FormLabel, FormControl, FormControlLabel } from "material-ui/Form";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import ClearIcon from "material-ui-icons/Clear";

import Package from '/imports/ui/components/landing/components/class/packages/Package.jsx';
import { PrimaryButton } from "/imports/ui/components/landing/components/buttons/";
import { ContainerLoader } from "/imports/ui/loading/container.js";

import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import School from "/imports/api/school/fields";

import { withPopUp, stripePaymentHelper, normalizeMonthlyPricingData } from "/imports/util";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { dialogStyles } from './sharedDialogBoxStyles';
import { ActionButtons, DialogBoxTitleBar } from './sharedDialogBoxComponents';

const PackagesListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const PackageWrapper = styled.div`
    margin-bottom: ${helpers.rhythmDiv}px;
    :last-of-type {
        margin-bottom: 0;
    }
`;
const Title = styled.h2`
	font-family: ${helpers.specialFont};
	font-weight: 300;
	text-align: center;
	font-style: italic;
	line-height: 1;
	font-size: ${helpers.baseFontSize * 1.5}px;
	margin: 0;
	margin-bottom: ${helpers.rhythmDiv * 4}px;
	color: ${helpers.textColor};
	width: 100%;
`;
const ActionButton = styled.div`
    display: flex;
    width: calc(50% - ${helpers.rhythmDiv}px);
    margin-bottom: ${helpers.rhythmDiv}px;

    @media screen and (max-width: ${helpers.mobile - 100}px) {
        width: 100%;
        :last-of-type {
            margin-bottom: 0;
        }  
    }
`;

const NotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  width: 100%;
  height: 100px;
  border-radius: 5px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 300px;
`;

const styles = theme => {
    return {
        ...dialogStyles,
        dialogActions: {
            width: '100%'
        },
        dialogContent: {
            ...dialogStyles.dialogContent,
            flexShrink: 0,
            flexDirection: 'column',
            paddingBottom: 0,
            [`@media screen and (max-width: ${helpers.mobile}px)`]: {
                padding: `0 ${helpers.rhythmDiv * 2}px`,
            }
        },
        iconButton: {
            ...dialogStyles.iconButton,
            position: 'absolute',
            top: helpers.rhythmDiv,
            right: helpers.rhythmDiv
        },
        radioButtonIcon: {
            width: 24,
            height: 24
        },
        radioGroupWrapper: {
            margin: 0,
            [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
                width: "auto"
            }
        },
        radioButtonRoot: {
            width: 24,
            height: 24,
            marginRight: helpers.rhythmDiv
        },
        radioLabelRoot: {
            margin: helpers.rhythmDiv,
            marginLeft: 0
        },
        radioLabel: {
            fontSize: helpers.baseFontSize,
            [`@media screen and (max-width: ${helpers.mobile + 50}px)`]: {
                fontSize: 14
            }
        },
        radioGroup: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
                justifyContent: "flex-start"
            },
            [`@media screen and (max-width: ${helpers.mobile}px)`]: {
                flexDirection: "column"
            }
        },
    }
}


class BuyPackagesDialogBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPackageIndex: -1,
            radioButtonGroupValue: "other"
        }

    }

    handleRadioButtonChange = event => {
        this.setState({ radioButtonGroupValue: event.target.value });
    };

    handlePackageClick = (selectedPackageIndex, selectedPackageType) => (e) => {
        e.preventDefault();

        this.setState(state => {
            return {
                ...state,
                selectedPackageIndex,
                selectedPackageType
            }
        })
    }
    packageSelectAlert = () => {
        const { popUp } = this.props;
        popUp.appear("alert", { title: "Alert", content: "Package  not selected. Please select one package first then try again." });
    }
    acceptPayment = () => {
        let { packageList, currentProps } = this.props;
        let { selectedPackageIndex, selectedPackageType, radioButtonGroupValue } = this.state;
        let packageData;
        if (selectedPackageType) {
            packageList.map((obj) => {
                if (obj.title == selectedPackageType) {
                    packageData = obj.packageData;
                }
            })
            packageData = packageData[selectedPackageIndex];
            this.props.acceptPayment(packageData, currentProps, radioButtonGroupValue);
        }
        else {
            this.packageSelectAlert();
        }
    }
    handleSendLink = () => {
        let { packageList, currentProps } = this.props;
        let { selectedPackageIndex, selectedPackageType } = this.state;
        let packageData;
        if (selectedPackageType) {
            packageList.map((obj) => {
                if (obj.title == selectedPackageType) {
                    packageData = obj.packageData;
                }
            })
            packageData = packageData[selectedPackageIndex];
            let { _id, packageType } = packageData;
            this.props.onSendLinkClick(currentProps, _id, packageType);
        }
        else {
            this.packageSelectAlert();
        }
    }

    render() {
        const { props } = this;
        const {
            classes,
            open,
            onModalClose,
            schoolId,
            packageList,
            currency,
            isLoading,
            joinNow,
            onSendLinkClick
        } = props;

        const {
            selectedPackageIndex,
            radioButtonGroupValue,
            selectedPackageType
        } = this.state;


        return (<Dialog
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby={"packages"}
            classes={{ paper: classes.dialogRoot }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                    <DialogBoxTitleBar
                        title="Packages"
                        classes={classes}
                        onModalClose={onModalClose}
                    />
                </DialogTitle>
                {isLoading ?
                    <ContainerLoader />
                    :
                    <DialogContent classes={{ root: classes.dialogContent }}>
                        {!isEmpty(packageList) && packageList.map((obj) => {
                            return (
                                <PackagesListWrapper>
                                    <Title>{obj.title}</Title>
                                    {!isEmpty(obj.packageData) && obj.packageData.map((packageData, i) => (
                                        <PackageWrapper>
                                            <Package
                                                key={i}
                                                {...packageData}
                                                packageSelected={i === selectedPackageIndex && obj.title == selectedPackageType}
                                                onPackageClick={this.handlePackageClick(i, obj.title)}
                                                usedFor="buyPackagesDialogBox"
                                                variant={'light'}
                                                schoolId={schoolId}
                                                currency={currency}
                                            />
                                        </PackageWrapper>
                                    ))}
                                </PackagesListWrapper>

                            )

                        })}

                       
                            <Fragment>
                                <NotesContent
                                    placeholder="Notes..."
                                />

                                <FormControl
                                    component="fieldset"
                                    className={classes.radioGroupWrapper}>
                                    <RadioGroup
                                        aria-label="payment-options"
                                        name="payment-options"
                                        className={classes.radioGroup}
                                        value={this.state.radioButtonGroupValue}
                                        onChange={this.handleRadioButtonChange}
                                    >
                                        <FormControlLabel
                                            classes={{
                                                root: classes.radioLabelRoot,
                                                label: classes.radioLabel,
                                            }}
                                            value="cash" control={<Radio
                                                classes={{
                                                    root: classes.radioButtonRoot
                                                }}
                                            />} label="Cash" />

                                        <FormControlLabel
                                            classes={{
                                                root: classes.radioLabelRoot,
                                                label: classes.radioLabel
                                            }}
                                            value="check" control={<Radio
                                                classes={{
                                                    root: classes.radioButtonRoot
                                                }}
                                            />} label="Check" />
                                        <FormControlLabel
                                            classes={{
                                                root: classes.radioLabelRoot,
                                                label: classes.radioLabel
                                            }}
                                            value="creditCard" control={<Radio
                                                classes={{
                                                    root: classes.radioButtonRoot
                                                }}
                                            />} label="Credit Card" />
                                        <FormControlLabel
                                            classes={{
                                                root: classes.radioLabelRoot,
                                                label: classes.radioLabel
                                            }}
                                            value="bankTransfer" control={<Radio
                                                classes={{
                                                    root: classes.radioButtonRoot
                                                }}
                                            />} label="Bank Transfer" />
                                        <FormControlLabel
                                            classes={{
                                                root: classes.radioLabelRoot,
                                                label: classes.radioLabel
                                            }}
                                            value="other" control={<Radio
                                                classes={{
                                                    root: classes.radioButtonRoot
                                                }}
                                            />} label="Others" />
                                    </RadioGroup>
                                </FormControl>
                            </Fragment>
                    </DialogContent>}

                <DialogActions classes={{ root: classes.dialogActionsRoot, action: classes.dialogActions }}>
                    <ActionButtons>
                        <ActionButton
                        >
                            <PrimaryButton
                                fullWidth
                                label={'Send Link'}
                                onClick={this.handleSendLink} />
                        </ActionButton>
                        <ActionButton
                        >
                            <PrimaryButton
                                fullWidth
                                label={'Accept Payment'}
                                onClick={this.acceptPayment} />
                        </ActionButton>
                    </ActionButtons>
                </DialogActions>
            </MuiThemeProvider>
        </Dialog >
        );
    }
}

BuyPackagesDialogBox.propTypes = {
    onModalClose: PropTypes.func,
    loading: PropTypes.bool,
    showPaymentMethods: PropTypes.bool
};

BuyPackagesDialogBox.defaultProps = {
    showPaymentMethods: true
}

export default withStyles(styles)(createContainer(props => {
    const { classTypeId } = props;
    //TODO: Need to filter out packages which are already purchased..
    //let purchasesData = 
    let monthlyPricingSubscription;
    let classPricingSubscription;
    let enrollmentSubscription;
    let isLoading = true;
    let currency = config.defaultCurrency;
    //console.log(classData,props,'classTYpeid')
    if (classTypeId) {
        monthlyPricingSubscription = Meteor.subscribe('monthlyPricing.getMonthlyPricingWithClassId', { classTypeId: [classTypeId] });
        classPricingSubscription = Meteor.subscribe('classPricing.getClassPricingWithClassId', { classTypeId });
        enrollmentSubscription = Meteor.subscribe('enrollmentFee.getClassTypeEnrollMentFree', { classTypeId })
    }

    const sub1Ready = monthlyPricingSubscription && monthlyPricingSubscription.ready();
    const sub2Ready = classPricingSubscription && classPricingSubscription.ready();
    const sub3Ready = enrollmentSubscription && enrollmentSubscription.ready();
    // console.info(sub1Ready, sub2Ready, sub3Ready, ">>>>>>>>>>>>>");
    if (sub1Ready && sub2Ready && sub3Ready) {
        isLoading = false;
    }

    let classPricingData = ClassPricing.find().fetch();
    let CP = classPricingData.map((obj) => {
        obj.packageType = 'CP';
        obj.classPackages = true;
        return obj;
    })
    let monthlyPricingData = MonthlyPricing.find().fetch();
    monthlyPricingData = normalizeMonthlyPricingData(monthlyPricingData);
    let MP = monthlyPricingData.map((obj) => {
        obj.packageType = 'MP';
        return obj;
    })
    let enrollmentFeeData = EnrollmentFees.find().fetch();
    let EP = enrollmentFeeData.map((obj) => {
        obj.packageType = 'EP';
        return obj;
    })
    let packageList = [];
    if (!isEmpty(EP)) {
        packageList.push({ title: 'Enrollment Packages', packageData: EP })
    }
    if (!isEmpty(MP)) {
        packageList.push({ title: 'Monthly Packages', packageData: MP })
    }
    if (!isEmpty(CP)) {
        packageList.push({ title: 'Per Class Packages', packageData: CP })
    }


    return {
        ...props,
        isLoading,
        packageList,
        currency
    };
}, withPopUp(BuyPackagesDialogBox)));
