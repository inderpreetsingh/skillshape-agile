import React from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider} from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import PrimaryButton from '../buttons/PrimaryButton';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import List, {
  ListItem,
  ListItemText,
} from 'material-ui/List';

const styles = {
    dialogAction: {
        width: '100%',
    },
    dialogPaper: {
        overflow: 'hidden'
    },
    dialogAction : {
      justifyContent: 'center',
    },
    dialogActionSpacingItems: {
        justifyContent: 'space-between'
    },
    buttonLabel: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    buttonFullWidth: {
      width : '100%',
      textTransform: 'none'
    }
}


const DialogContentListWrapper = styled.div`
  ${helpers.flexCenter};
  align-items: baseline;
  @media screen and (max-width: ${helpers.mobile}px) {
      flex-direction: column;
  }    
`;


const DialogActionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
    @media screen and (max-width: ${helpers.mobile}px) {
      flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
    width: calc(50% - ${helpers.rhythmDiv * 2}px);
    padding: ${helpers.rhythmDiv};
    text-align: center;
    
    @media screen and (max-width: ${helpers.mobile}px) {
      width: 100%;
    }
`;

const ButtonLabelTextWrapper = styled.p`
    margin: 0;
`;

const DialogBoxHeaderText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;



const ManageSchoolListingDialogBox = (props) => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="manage-school-listing"
    classes={{paper: props.classes.dialogPaper}}
  >
  <MuiThemeProvider theme={muiTheme}>
    <DialogTitle>
      <DialogTitleWrapper>
        Manage Listing
        
        <IconButton color="primary" onClick={props.onModalClose}>
          <ClearIcon/> 
        </IconButton > 
      </DialogTitleWrapper>
    </DialogTitle>
    
    <DialogActions classes={{root: props.classes.dialogAction}}>
      <DialogBoxHeaderText>Would You like to manage a school Listing ?</DialogBoxHeaderText>
    </DialogActions>
    
    <DialogContent>
      <DialogContentListWrapper>
        <div>
          <List>
            <ListItem>
              <ListItemText primary="Bring in Student"/>
            </ListItem>  
            <ListItem>
              <ListItemText primary="Manage School Media "/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Add Beutiful Calenders and Labels in your Website"/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Much More!"/>
            </ListItem>
            <ListItem>
              <ListItemText primary="FREE!"/>
            </ListItem>
          </List>
        </div>
        
        <div>
          <List>
            <ListItem>
              <ListItemText primary="Find Ideal Learning Experiences"/>
            </ListItem>  
            <ListItem>
              <ListItemText primary="Sort through Locations and time easily"/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Add Classes to your Calender"/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Much More"/>
            </ListItem>
            <ListItem>
              <ListItemText primary="FREE!"/>
            </ListItem>
          </List>
        </div>
      </DialogContentListWrapper>
    </DialogContent>
    
    <DialogActions classes={{root: props.classes.dialogAction, action: props.classes.dialogAction}}>
       <DialogActionWrapper>
        <ButtonWrapper>
            <Button color="primary" classes={{root: props.classes.buttonFullWidth, label: props.classes.buttonLabel}} onClick={props.onManageSchoolButtonClick}>
                <ButtonLabelTextWrapper>I manage a school</ButtonLabelTextWrapper>
                <ButtonLabelTextWrapper>(student account included)</ButtonLabelTextWrapper>
            </Button>
        </ButtonWrapper>
        <ButtonWrapper>
            <Button color="primary" classes={{root: props.classes.buttonFullWidth, label: props.classes.buttonLabel}} onClick={props.onStudentButtonClick}>
                <ButtonLabelTextWrapper>I am a student</ButtonLabelTextWrapper>
                <ButtonLabelTextWrapper>(You can add student)</ButtonLabelTextWrapper>
            </Button>
        </ButtonWrapper>
      </DialogActionWrapper>
    </DialogActions>
    </MuiThemeProvider>
  </Dialog>
);

ManageSchoolListingDialogBox.propTypes = {
  onModalClose: PropTypes.func,  
  onStudentButtonClick: PropTypes.func,
  onManageSchoolButtonClick: PropTypes.func
}

export default withStyles(styles)(ManageSchoolListingDialogBox);
