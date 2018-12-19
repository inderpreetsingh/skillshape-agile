import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEmpty, flatten, get, uniq } from "lodash";
import styled from "styled-components";

import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, withStyles } from "material-ui/styles";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";

import PackagesList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';
import { PrimaryButton } from "/imports/ui/components/landing/components/buttons/";
import { ContainerLoader } from "/imports/ui/loading/container.js";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { dialogStyles } from './sharedDialogBoxStyles';
import { ActionButtons, ActionButton } from './sharedDialogBoxComponents';

const styles = theme => {
    return {
        ...dialogStyles,
        radioGroupWrapper: {
            margin: 0,
            marginTop: helpers.rhythmDiv * 3,
            paddingLeft: helpers.rhythmDiv,
            [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
                width: "auto"
            }
        },
        radioLabelRoot: {
            marginRight: helpers.rhythmDiv * 3
        },
        radioLabel: {
            fontSize: helpers.baseFontSize,
            [`@media screen and (max-width: ${helpers.mobile + 50}px)`]: {
                fontSize: 14
            }
        },
        radioButton: {
            height: helpers.rhythmDiv * 3,
            width: helpers.rhythmDiv * 3,
            marginRight: helpers.rhythmDiv
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
            radioButtonGroupValue: "others"
        }
    }

    handleRadioChange = (e, value) => {
        // debugger;
        this.setState(state => {
            return {
                ...state,
                radioButtonGroupValue: e.target.value
            }
        });
    };


    render() {
        const { props } = this;
        const {
            classes,
            open,
            onModalClose,
            schoolId,
            packagesList,
            currency,
        } = props;

        return (<Dialog
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby={"packages"}
            classes={{ paper: classes.dialogRoot }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                    <DialogTitleWrapper>
                        <Title>Packages </Title>
                        <IconButton
                            color="primary"
                            onClick={onModalClose}
                            classes={{ root: classes.iconButton }}
                        >
                            <ClearIcon />
                        </IconButton>
                    </DialogTitleWrapper>
                </DialogTitle>
                <DialogContent classes={{ root: classes.dialogContent }}>
                    {(!isEmpty(enrollmentFeeData)
                        || !isEmpty(monthlyPricingData)
                        || !isEmpty(classPricingData))
                        && <PackagesList
                            usedFor="dialogBox"
                            variant={'light'}
                            schoolId={classTypeData.schoolId}
                            enrollMentPackages
                            enrollMentPackagesData={enrollmentFeeData}
                            perClassPackagesData={classPricingData}
                            monthlyPackagesData={normalizeMonthlyPricingData(monthlyPricingData)}
                            currency={currency}
                        />}

                    <FormControl
                        component="fieldset"
                        className={classes.radioGroupWrapper}>
                        <RadioGroup
                            aria-label="payment-options"
                            name="payment-options"
                            className={classes.radioGroup}
                            value={this.state.value}
                            onChange={this.handleRadioChange}
                        >
                            <FormControlLabel
                                classes={{
                                    root: classes.radioLabelRoot,
                                    label: classes.radioLabel
                                }}
                                value="cash" control={<Radio />} label="Cash" />
                            <FormControlLabel
                                classes={{
                                    root: classes.radioLabelRoot,
                                    label: classes.radioLabel
                                }}
                                value="check" control={<Radio />} label="Check" />
                            <FormControlLabel
                                classes={{
                                    root: classes.radioLabelRoot,
                                    label: classes.radioLabel
                                }}
                                value="creditCard" control={<Radio />} label="Credit Card" />
                            <FormControlLabel
                                classes={{
                                    root: classes.radioLabelRoot,
                                    label: classes.radioLabel
                                }}
                                value="bankTransfer" control={<Radio />} label="Bank Transfer" />
                            <FormControlLabel
                                classes={{
                                    root: classes.radioLabelRoot,
                                    label: classes.radioLabel
                                }}
                                value="other" control={<Radio />} label="Others" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions classes={{ root: classes.dialogActionsRoot }}>
                    <ActionButtons>
                        <ActionButton>
                            <PrimaryButton
                                label={'Just to this instance'} onClick={() => { this.handleInstructors(popUp, payLoad) }} applyClose />
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
    loading: PropTypes.bool
};

export default withStyles(styles)(BuyPackagesDialogBox);
