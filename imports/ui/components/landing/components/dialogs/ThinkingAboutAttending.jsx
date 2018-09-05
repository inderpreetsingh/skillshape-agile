import React from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider } from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import PackageListingAttachment from './PackageListingAttachment';
import PackageAddNew from './PackageAddNew';
import SchoolViewBase from '/imports/ui/components/schoolView/schoolViewBase';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import styled from "styled-components";
import {mobile } from "/imports/ui/components/landing/components/jss/helpers.js";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;


const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
    dialogAction: {
        width: '100%'
    },
    dialogActionsRoot: {
      [`@media screen and (max-width: ${mobile}px)`]: {
        flexWrap: "wrap",
        justifyContent: "flex-start"
      }
    }
}

const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;

class ThinkingAboutAttending extends React.Component {
    constructor(props) {
        super(props);
        this.state = { PackageListingAttachment: false, pacLisAttOpen: true, PackageAddNew: false }
    }
   
    render() {
        const { open,onModalClose,addToCalendar,handleRemoveFromCalendarButtonClick,
            handleClassClosed,handleAddToMyCalendarButtonClick,purchaseThisPackage } = this.props;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Select Package"
                    open={open}
                    onClose={onModalClose}
                    onRequestClose={onModalClose}
                    aria-labelledby="Thinking About Attending"
                >
                    {this.props.isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                        Thinking About Attending

                            <IconButton color="primary" onClick={() => { onModalClose()}}>
                                <ClearIcon /> 
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent style={{ fontSize: '18px' }}>
                    This will add this class to your calendar and sign you up for notifications about class time or location changes,
                     as well as emails about this class. To attend, you must purchase a class package. 

                    </DialogContent>
                    <DialogActions classes={{ root: this.props.classes.dialogActionsRoot }}>
                      
                        <ButtonWrapper>
                            <FormGhostButton
                                onClick={purchaseThisPackage}
                                label="Purchase this Package"
                            />
                        </ButtonWrapper>
                        <ButtonWrapper>
                            <FormGhostButton
                                onClick={() => {addToCalendar== 'closed'? handleClassClosed() : addToCalendar ? handleAddToMyCalendarButtonClick() : handleRemoveFromCalendarButtonClick()}}
                                label={addToCalendar== 'closed'? "Class Closed" : addToCalendar ? "Add To Calendar" : "Remove from Calendar"}
                            />
                        </ButtonWrapper>
                        <ButtonWrapper>
                            <FormGhostButton
                                darkGreyColor
                                onClick={onModalClose}
                                label="No thanks"
                            />
                        </ButtonWrapper>
                    </DialogActions>

                </Dialog>
            </MuiThemeProvider>
        )
    }
}


export default withStyles(styles)(ThinkingAboutAttending);
