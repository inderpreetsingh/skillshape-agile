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
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
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
            minHeight: 300,
            maxHeight: 400,
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

const HighlightedBg = Text.withComponent('div').extend`
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    background: ${helpers.panelColor};
    padding: ${helpers.rhythmDiv}px;
`;

const ClassesList = styled.ul`
    margin: 0;
    padding: 0;
`;

const ClassListItem = Text.withComponent('li').extend`
    list-style: dot;
    list-style-position: outside;
    margin-left: 17px;
`;


const SubscriptionsDetailsDialogBox = (props) => {

    const getRemainingClasses = (props) => {
        let stringToPrint = '';
            if(props.combinedData){
                props.combinedData.map((obj, index) => {
                   stringToPrint += ` ${obj.noClasses} ${obj.noClasses <= 1 ? 'Class' : 'Classes'} expires on ${formatDate(obj.endDate)} <br/>`;
               }) 
            }
            else{
                stringToPrint += ` ${props.noClasses} ${props.noClasses <= 1 ? 'Class' : 'Classes'} expires on ${formatDate(props.endDate)} <br/>`;
            }
        return stringToPrint;
    }


    const getContractEnds = () => {
        if (props.autoWithdraw || props.payUpFront || props.payAsYouGo) {
            return (<Text>
                <b>Contract ends:</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', props.contractLength)}
            </Text>)
        }
    }



    const getDatesBasedOnSubscriptions = (props) => {
        let stringToPrint = '';
        let fee = get(props, 'amount', 0).toFixed(2);
        let currency = get(props, 'currency', '$');

        if (props.packageType == 'EP') {
            return (<HighlightedBg>
                <Text>
                    <b>Expiration Date :</b> {formatDate(props.endDate)}
                </Text>
            </HighlightedBg>)
        }
        else if (props.payAsYouGo) {
            return (<HighlightedBg>
                <Text>
                    <b>Payment</b> of {formatMoney(fee, currency)} <b>is due on</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', props.combinedData && props.combinedData.length - 1)}
                </Text>
                {getContractEnds()}
            </HighlightedBg>
            )
        }else if (props.payUpFront) {
            let contractLength = get(props, 'contractLength', 0);
            contractLength = props.combinedData && props.combinedData.length > 1 ? contractLength * props.combinedData.length - 1 : 0
            return (
                <HighlightedBg>
                    <Text>
                        <b>Paid until</b> {calcRenewalDate(props.endDate, props.packageType === 'MP', contractLength)}
                    </Text>
                    {getContractEnds()}
                </HighlightedBg>
            )
        } else  {
            return (
                <HighlightedBg>
                    <Text>
                        <b>Automatic Payment</b> of {formatMoney(fee, currency)} will process {calcRenewalDate(props.endDate, props.packageType === 'MP', 0)}
                    </Text>
                    {getContractEnds()}
                </HighlightedBg>
            )
        } 
    }

    const {
        open,
        classes,
        fullScreen,
        onModalClose,
        subscriptionsData,
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
                        titleProps={{
                            variant: 'text-left-aligned',
                        }}
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

                        {props.packageType == 'CP' && <HighlightedBg>
                            {ReactHtmlParser(getRemainingClasses(props))}
                        </HighlightedBg>}

                        {/* Depending upon the type of payment method */}
                        {getDatesBasedOnSubscriptions(props)}

                        {classesCovered.length && <ClassesCovers>
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
                   {
                       props.packageType == 'MP' && !props.payUpFront && (
                        <FormGhostButton
                        alertColor
                        label={'Cancel Contract'}
                        onClick= {()=>{}}
                        />
                       )
                   } 
                </DialogActions>
            </MuiThemeProvider>
        </Dialog>
    );
};

SubscriptionsDetailsDialogBox.propTypes = {
    onModalClose: PropTypes.func,
};

export default withStyles(styles)(SubscriptionsDetailsDialogBox);