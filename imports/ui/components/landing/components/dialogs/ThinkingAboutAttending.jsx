import ClearIcon from 'material-ui-icons/Clear';
import Checkbox from "material-ui/Checkbox";
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from "material-ui/Form";
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import React from 'react';
import styled from "styled-components";
import muiTheme from '../jss/muitheme.jsx';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { mobile } from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from '/imports/ui/loading/container';
import Button from 'material-ui/Button';
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
  font-size: 30px;
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
    },dialogTitle:{
        borderTop: `5px solid #4caf50`
    },
    StyleForButton  :{
        fontFamily: helpers.specialFont,
        fontSize: helpers.baseFontSize,
        backgroundColor: '#4caf50',
        border: '1px solid',
        borderColor: helpers.primaryColor,
        color: 'black',
        textTransform: 'none',
        fontWeight: 500,
        height: '100%',
        marginRight: helpers.rhythmDiv,
        '&:hover': {
            backgroundColor: 'white',
    }
    
}}
const TextWrapper = styled.div`
    text-align: center;
    font-size: 15px;
    font-weight: 500;
   `;
const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;
const labelValue =['Add this class to my calendar.','Sign me up for notification of class time or location changes.',
'Sign me up for emails from the school about this class.']
class ThinkingAboutAttending extends React.Component {
    constructor(props) {
        super(props);
        const {addToCalendar,notification}= this.props;
        this.state = { checkBoxes:[true,true,true] }
    }
    
    render() {
        const {checkBoxes}=this.state;
        const { open,onModalClose,addToCalendar,
            handleClassClosed,handleCheckBoxes,purchaseThisPackage ,name} = this.props;
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
                    <DialogTitle  classes={{ root: this.props.classes.dialogTitle }}>
                        <DialogTitleWrapper>
                        About Attending {name && name}

                            <IconButton color="primary" onClick={() => { onModalClose()}}>
                                <ClearIcon /> 
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent style={{ fontSize: '18px' }}>
                 {checkBoxes.map((i,index)=>{
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
                                darkGreyColor
                                onClick={onModalClose}
                                label="Not Yet, Thanks!"
                            />
                            </ButtonWrapper>
                            <ButtonWrapper>
                                <Button
                                    onClick={purchaseThisPackage}
                                    classes={{ root: this.props.classes.StyleForButton }}
                                >
                                    Purchase Package Now
		                        </Button>
                            {/* <FormGhostButton
                                onClick={purchaseThisPackage}
                                label="Purchase Package Now"
                            /> */}
                        </ButtonWrapper>
                        <ButtonWrapper>
                            <FormGhostButton
                                onClick={() => {
                                    
                                    if(addToCalendar== 'closed'){
                                        handleClassClosed();
                                    }
                                    else{
                                        handleCheckBoxes(checkBoxes);
                                    }
                                }}
                                label={"Purchase at School"}
                            />
                        </ButtonWrapper>
                    
                    </DialogActions>

                </Dialog>
            </MuiThemeProvider>
        )
    }
}


export default withStyles(styles)(ThinkingAboutAttending);
