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
import { FormControl, FormControlLabel } from "material-ui/Form";
import PackageAddNew from './PackageAddNew';
import SchoolViewBase from '/imports/ui/components/schoolView/schoolViewBase';
import Checkbox from "material-ui/Checkbox";
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
const TextWrapper = styled.div`
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    text-decoration: underline;`;
const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;
const labelValue =['Add this class to my calendar.','Sign me up for notification of class time or location changes',
'Sign me up for emails from the school about this class.']
class ThinkingAboutAttending extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checkBoxes:[this.props.addToCalendar?true:false,false,false] }
    }
    
    render() {
        const {checkBoxes}=this.state;
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
}                   {checkBoxes.map((i,index)=>{
                       return ( <FormControl fullWidth margin="dense">
                       <FormControlLabel
                         control={
                             <Checkbox
                             checked={checkBoxes[index]}
                             onChange={(e) => {
                                 let old = checkBoxes;
                                 old[index] = e.target.checked;
                                 this.setState({ checkBoxes: old })
                                }}
                                value={index}
                                />
                         }
                         label={labelValue[index]}
                       />
                     </FormControl>)
                   })}
                  <TextWrapper> To attend you must purchase a class package.</TextWrapper>
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
                                onClick={() => {
                                    
                                    if(addToCalendar== 'closed'){
                                        handleClassClosed();
                                    }
                                    else if (addToCalendar && checkBoxes[0]){
                                        handleAddToMyCalendarButtonClick();
                                    }
                                    else if(!checkBoxes[0]  && !addToCalendar){
                                        handleRemoveFromCalendarButtonClick();
                                    }
                                    else{
                                        
                                        onModalClose(); 
                                    }
                                }}
                                label={"Purchase at Class"}
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
