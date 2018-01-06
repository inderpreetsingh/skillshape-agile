import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';
import ClearIcon from 'material-ui-icons/Clear';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from 'material-ui/Dialog';


const styles = {
  dialog: {
    padding: `${helpers.rhythmDiv}px`
  },
  dialogPaper: {
    background: helpers.panelColor,
  },
  chip: {
    background: helpers.lightTextColor,
    marginRight: helpers.rhythmDiv
  },
  chipLabel: {
    color: helpers.textColor,
    fontSize: helpers.baseFontSize * 0.75 
  }
};

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;

const ClassContainer = styled.div`
  width: 90%;
  padding: ${helpers.rhythmDiv}px;
  margin: ${helpers.rhythmDiv}px auto;
  border-radius: ${helpers.rhythmDiv}px;
  background: #ffffff;
`;

const ClassContainerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${helpers.rhythmDiv}px;
  
  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ClassTimings = styled.p`
  margin: 0 ${helpers.rhythmDiv}px 0 0;
  font-weight: 600;
  color: ${helpers.headingColor};
`;

const CalenderButtonWrapper = styled.div`
  margin: ${helpers.rhythmDiv} 0 0 0;
  ${helpers.flexCenter}
  justify-content: flex-end;
`;

const DescriptionContainer = styled.div`
  display: flex;
`;


const ClassTimesDialogBox = (props) => (
  <Dialog
    fullScreen={props.fullScreen}
    open={props.open}
    onClose={props.onModalClose}
    aria-labelledby="modal"
    classes={{root: props.classes.dialog, paper: props.classes.dialogPaper}}
  >
    <MuiThemeProvider theme={muiTheme}>
        <DialogTitle>
            <DialogTitleWrapper>
                Class Times
              <IconButton color="primary" onClick={props.onModalClose}>
                <ClearIcon/> 
              </IconButton > 
            </DialogTitleWrapper>
        </DialogTitle>
    
        
        <DialogContent>
            {props.classesData.map(data => (
              <ClassContainer>
                
                <ClassContainerHeader>
                  
                  <ClassTimings>
                    {data.timing} 
                  </ClassTimings>
                  
                  <Chip label={data.classStatus} classes={{root: props.classes.chip, label: props.classes.chipLabel}}/>
                </ClassContainerHeader>  
                <Typography>
                  {data.description}     
                </Typography>
                  
                <CalenderButtonWrapper>
                    {data.addToCalender ? (<SecondaryButton icon iconName="delete" label="Remove from my Calender" />) : (<PrimaryButton icon iconName="perm_contact_calendar" label="Add to my Calender" />)}
                </CalenderButtonWrapper>
              </ClassContainer>
            ))}
        </DialogContent>
    </MuiThemeProvider>
  </Dialog>
);

ClassTimesDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  classesData : PropTypes.arrayOf({
    timing: PropTypes.string,
    description: PropTypes.string,
    addToCalender: PropTypes.bool,
    classStatus: PropTypes.string,
  })
}

export default withMobileDialog()(withStyles(styles)(ClassTimesDialogBox));
