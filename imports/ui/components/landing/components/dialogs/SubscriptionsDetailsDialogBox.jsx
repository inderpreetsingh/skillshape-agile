import { get } from 'lodash';
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import ReactHtmlParser from 'react-html-parser';
import styled from "styled-components";
import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";
import { DialogBoxTitleBar } from './sharedDialogBoxComponents';
import { SubHeading, Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import { packageStatus } from '/imports/ui/components/landing/constants/packages/packageStatus';
import { calcRenewalDate, capitalizeString, formatDate, formatMoney } from '/imports/util';







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
    font-size: 20px;
    margin-bottom: ${helpers.rhythmDiv / 2}px;
`;

const ClassesRemaining = Text.withComponent('div').extend`
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    background: ${helpers.panelColor};
    padding: ${helpers.rhythmDiv}px;
`;

const ClassesList = styled.ul`
    margin: 0;
    padding: 0;
    overflow-y: auto;
    max-height: 100px;
`;

const ClassListItem = Text.withComponent('li').extend`
    list-style: dot;
    list-style-position: outside;
    margin-left: 17px;
`;


const SubscriptionsDetailsDialogBox = (props) => {

    const getRemainingClasses = (props) => {
        let stringToPrint = '';
        props.combinedData.map((obj,index)=>{
					stringToPrint += ` ${obj.noClasses} ${obj.noClasses <= 1 ? 'Class' : 'Classes'} expire ${formatDate(obj.endDate)} <br/>`;
				})
        return stringToPrint;
    }


    const getDatesBasedOnSubscriptions = (props) => {
        let stringToPrint = '';
        let fee = get(props, 'fee', 0).toFixed(2);
        let currency = get(props, 'currency', '$')
        if (props.payAsYouGo) {
            return (
                <Text>
                    <b>Payment</b> of {formatMoney(fee, currency)} <b>is due on</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', props.combinedData.length - 1)}
                </Text>)
        } else if (props.autoWithdraw) {
            return (
                <Text>
                    <b>Automatic Payment</b> of {formatMoney(fee, currency)} will process {calcRenewalDate(props.endDate, props.packageType === 'MP', 0)}
                </Text>)
        } else if (props.payUpFront) {
            let contractLength = get(props, 'contractLength', 0);
            contractLength = props.combinedData.length > 1 ? contractLength * props.combinedData.length - 1 : 0
            return
            <Text>
                <b>Paid until</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', contractLength)}
            </Text>

        }
    }

    const getContractEnds = () => {
        if (props.autoWithdraw || props.payUpFront || props.payAsYouGo) {
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
    const classesCovered = props.covers || []

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
                        title={capitalizeString(props.packageName || props.name)}
                        onModalClose={onModalClose}
                        classes={classes}
                    />

                </DialogTitle>

                <DialogContent classes={{ root: classes.dialogContent }}>
                    <ContentWrapper>
                        <StatusWrapper>
                            <Text><b>Status:{" "}</b>
                                <Status packageStatus={ourPackageStatus}>
                                    {capitalizeString(ourPackageStatus)}
                                </Status>
                            </Text>
                        </StatusWrapper>

                        {props.packageType == 'CP' && <ClassesRemaining>
                            {ReactHtmlParser(getRemainingClasses(props))}
                        </ClassesRemaining>}

                      

                        {/* Depending upon the type of payment method */}
                        {getDatesBasedOnSubscriptions(props)}

                        {getContractEnds(props)}

                          {classesCovered.length >= 1 && <ClassesCovers>
                            <ContentHead>
                                This Covers:
                            </ContentHead>
                            <ClassesList>
                                {classesCovered.map(classCovered => (
                                    <ClassListItem>
                                        {capitalizeString(classCovered)}
                                    </ClassListItem>
                                ))}
                            </ClassesList>
                        </ClassesCovers>}

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