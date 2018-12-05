import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get, isEmpty } from 'lodash';
import { withStyles, MuiThemeProvider } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Dialog, {
    DialogContent,
    DialogTitle,
    DialogActions,
    withMobileDialog
} from "material-ui/Dialog";


import ClearIcon from 'material-ui-icons/Clear';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { FormGhostButton, PrimaryButton } from '/imports/ui/components/landing/components/buttons/';

import { DialogBoxTitleBar } from './sharedDialogBoxComponents';
import { Text, SubHeading, ToggleVisibility } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';

import {
    formatMoney,
    maximumClasses,
    capitalizeString,
    calcRenewalDate,
    calcContractEnd,
    formatDate
} from '/imports/util';

import { packageStatus } from '/imports/ui/components/landing/constants/packages/packageStatus';

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

const styles = theme => {
    return {
        dialogTitleRoot: {
            marginTop: `${helpers.rhythmDiv * 2}px`,
            padding: `0 ${helpers.rhythmDiv * 3}px`
        },
        dialogContent: {
            paddingBottom: helpers.rhythmDiv,
        },
        dialogPaper: {
            maxWidth: 600,
            padding: helpers.rhythmDiv * 3,
            width: '100%',
            margin: helpers.rhythmDiv
        },
        dialogActionsRoot: {
            padding: `0 ${helpers.rhythmDiv}px`,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
        },
        dialogActions: {
            width: '100%',
            paddingLeft: `${helpers.rhythmDiv * 2}px`
        },
        iconButton: {
            height: "auto",
            width: "auto",
        },
    };
};

const ContentWrapper = styled.div`
  width: 100%;
`;

const Title = SubHeading.extend`
    font-style: italic;
    text-align: center;
    font-weight: 300;
`;

const StatusWrapper = styled.div`
    margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Status = Text.withComponent('span').extend`
	font-weight: 500;
	color: ${(props) => packageStatus[props.packageStatus]};
`;

const ClassesCovers = styled.div`
    margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ContentHead = SubHeading.extend`
    margin-bottom: ${helpers.rhythmDiv / 2}px;
`;

const ClassesRemaining = styled.div`
    margin-top: ${helpers.rhythmDiv * 2}px;
    background: ${helpers.panelColor};
    padding: ${helpers.rhythmDiv / 2}px ${helpers.rhythmDiv}px;
`;


const SubscriptionsDetailsDialogBox = (props) => {

    const getCovers = (data) => {
        let str = '';
        if (!isEmpty(data)) {
            str = data.map((classType) => classType);
            str = str.join(', ');
        }
        return str.toLowerCase();

    }

    const getRemainingClasses = (props) => {
        let noClasses = 0;
        props.combinedData.map((obj, index) => {
            noClasses += get(obj, "noClasses", 0) || 0;
        });
        return `${noClasses} ${noClasses <= 1 ? 'Class' : 'Classes'} Remaining`;
    }


    const getDatesBasedOnSubscriptions = (props) => {
        let stringToPrint = '';
        let fee = get(props, 'fee', 0).toFixed(2);
        let currency = get(props, 'currency', '$')
        if (props.payAsYouGo) {
            return (<React.Fragment>
                <Text>
                    <b>Payment until</b> and payment of {formatMoney(fee, currency)} <b>due:</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', props.combinedData.length - 1)}
                </Text>
            </React.Fragment>)
        } else if (props.autoWithdraw) {
            return (<React.Fragment>
                <Text>
                    <b>Automatic Payment</b> of {formatMoney(fee, currency)} will process {calcRenewalDate(props.endDate, props.packageType === 'MP', 0)}
                </Text>
            </React.Fragment>)
        } else if (props.payUpFront) {
            let contractLength = get(props, 'contractLength', 0);
            contractLength = props.combinedData.length > 1 ? contractLength * props.combinedData.length - 1 : 0
            return <React.Fragment>
                <Text>
                    <b>Paid until</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', contractLength)}
                </Text>
            </React.Fragment>
        }
    }

    const getContractEnds = () => {
        if (props.autoWithdraw || props.payUpFront) {
            return (<Text>
                <b>Contract ends:</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', props.contractLength)}
            </Text>)
        }
    }

    const {
        classes,
        onModalClose,
        subscriptionsData,
        open,
        fullScreen,
    } = props;

    const ourPackageStatus = props.packageStatus || props.status;


    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby="Subscriptions Details"
            classes={{ paper: classes.dialogPaper }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                    <DialogBoxTitleBar
                        variant="text-left-aligned"
                        title={props.packageName || props.name}
                        onModalClose={onModalClose}
                        classes={classes}
                    />

                </DialogTitle>

                <DialogContent classes={{ root: classes.dialogContent }}>
                    <ContentWrapper>
                        <StatusWrapper>
                            <Text>Status:{" "}
                                <Status packageStatus={ourPackageStatus}>
                                    {capitalizeString(ourPackageStatus)}
                                </Status>
                            </Text>
                        </StatusWrapper>

                        <ClassesCovers>
                            <ContentHead>
                                This Covers:
                            </ContentHead>
                            <Text>
                                {getCovers(props.covers)}
                            </Text>
                        </ClassesCovers>

                        {/* Depending upon the type of payment method */}
                        {getDatesBasedOnSubscriptions(props)}

                        {getContractEnds(props)}

                        {props.packageType == 'CP' && <ClassesRemaining>
                            <ContentHead>
                                Classes Remaining :
                            </ContentHead>
                            <Text>
                                {getRemainingClasses(props)}
                            </Text>
                        </ClassesRemaining>}

                    </ContentWrapper>
                </DialogContent>

                <DialogActions
                    classes={{
                        root: classes.dialogActionsRoot,
                        action: classes.dialogAction
                    }}>

                </DialogActions>
            </MuiThemeProvider>
        </Dialog>
    );
};

SubscriptionsDetailsDialogBox.propTypes = {
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withStyles(styles)(SubscriptionsDetailsDialogBox);