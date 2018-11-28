import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import LogoImage from '/imports/ui/components/landing/components'
import PrimaryButton from "../buttons/PrimaryButton";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import PhoneIcon from "material-ui-icons/Phone";

import { MuiThemeProvider } from "material-ui/styles";
import { withStyles } from "material-ui/styles";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, {
    DialogContent,
    DialogTitle,
    withMobileDialog
} from "material-ui/Dialog";

import { ContainerLoader } from "/imports/ui/loading/container";

const styles = theme => {
    return {
        dialogTitleRoot: {
            padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
                3}px 0 ${helpers.rhythmDiv * 3}px`,
            marginBottom: `${helpers.rhythmDiv * 2}px`
        },
        dialogContent: {
            padding: `0 ${helpers.rhythmDiv * 3}px`,
            flexShrink: 0
        },
        dialogActionsRoot: {
            padding: "0 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start"
        },
        dialogActions: {
            width: "100%",
            paddingLeft: `${helpers.rhythmDiv * 2}px`
        },
        dialogRoot: {
            minHeight: "400px",
            maxWidth: "300px",
            width: "100%",
            [`@media screen and (max-width : ${helpers.mobile}px)`]: {
                maxWidth: "100%"
            }
        },
        iconButton: {
            height: "auto",
            width: "auto"
        },
        expansionPanelRoot: {
            border: 'none'
        },
        expansionPanelRootExpanded: {
            border: `1px solid black`
        },
        expansionPanelDetails: {
            padding: 0,
            marginTop: helpers.rhythmDiv
        },
        expansionPanelSummary: {
            margin: 0,
            padding: helpers.rhythmDiv
        },
        expansionPanelSummaryContent: {
            margin: 0,
            justifyContent: 'space-between'
        }
    };
};

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DialogTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const Title = styled.h2`
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: ${helpers.rhythmDiv * 4}px 0;
  color: ${helpers.primaryColor};
  line-height: 1;
  font-weight: 300;
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.5}px;
`;

const WrapperContact = styled.li`
  ${helpers.flexCenter} display: inline-flex;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: ${helpers.rhythmDiv}px;
  border: 1px solid ${helpers.primaryColor};
`;

const ContactNumbersWrapper = styled.ul`d {
    color: ${helpers.primaryColor};
  }
`;

const ClassProfile = styled.div`
	/* prettier-ignore */
	${helpers.flexCenter}
`;

const SchoolImage = withImageExists((props) => {
    return (
        <ProgressiveImage src={props.bgImg} placeholder={config.blurImage}>
            {(src) => <ImageContainer src={src} />}
        </ProgressiveImage>
    );
}, imageExistsConfig);


const ManageMemberShipDialogBox = props => {
    // console.log(props,"...");
    return (
        <Dialog
            open={props.open}
            onClose={props.onModalClose}
            onRequestClose={props.onModalClose}
            aria-labelledby="contact us"
            classes={{ paper: props.classes.dialogRoot }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
                    <DialogTitleWrapper>
                        <IconButton
                            color="primary"
                            onClick={props.onModalClose}
                            classes={{ root: props.classes.iconButton }}
                        >
                            <ClearIcon />
                        </IconButton>
                    </DialogTitleWrapper>
                </DialogTitle>

                <DialogContent classes={{ root: props.classes.dialogContent }}>
                    <ContentWrapper>
                        <Title>Edit Membership for {props.studentName} at {props.schoolName}</Title>
                        {props.classTypeData.map(classData =>
                            <ExpansionPanel
                                classes={{
                                    root: classes.expansionPanelRoot
                                }}
                            >
                                <ExpansionPanelSummary
                                    classes={{
                                        root: classes.expansionPanelSummary,
                                        content: classes.expansionPanelSummaryContent
                                    }}
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <ClassProfile>
                                        <LogoImage src={get(classTypeData, 'logoImgMedium', get(school, 'logoImg', schoolLogo))} />
                                        <SubHeading> {classTypeData.name} </SubHeading>
                                    </ClassProfile>
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>

                                </ExpansionPanelDetails>
                            </ExpansionPanel>)}
                    </ContentWrapper>
                </DialogContent>

                <DialogActions
                    classes={{ root: classes.dialogActionsRoot, action: classes.dialogAction }}>

                </DialogActions>
            </MuiThemeProvider>
        </Dialog>
    );
};

ManageMemberShipDialogBox.propTypes = {
    onFormSubmit: PropTypes.func,
    onHandleInputChange: PropTypes.func,
    contactNumbers: PropTypes.arrayOf(PropTypes.strings),
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withMobileDialog()(withStyles(styles)(ManageMemberShipDialogBox));
