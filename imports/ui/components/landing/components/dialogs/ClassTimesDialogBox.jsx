import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';

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

import ClassInterest from "/imports/api/classInterest/fields";

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

class ClassTimesDialogBox extends React.Component {

    checkForAddToCalender = (data) => {
        const userId = Meteor.userId()
        if(isEmpty(data) || isEmpty(userId)) {
            return true;
        } else {
            return isEmpty(ClassInterest.find({classTimeId: data._id, userId}).fetch());
        }
    }

    addToMyCalender = (data) => {
        // check for user login or not
        const userId = Meteor.userId()
        if(!isEmpty(userId)) {
            const doc = {
                classTimeId: data._id,
                classTypeId: data.classTypeId,
                schoolId: data.schoolId,
                userId,
            }
            this.handleClassInterest({
                methodName:"classInterest.addClassInterest",
                data: {doc}
            })
        } else {
            alert("Please login !!!!")
        }
    }

    handleClassInterest = ({methodName, data}) => {
        Meteor.call(methodName, data, (err, res) => {
            console.log(res,err);
        })
    }

    render() {

        console.log("ClassTimesDialogBox props--->>",this.props)
        return (
            <Dialog
                fullScreen={this.props.fullScreen}
                open={this.props.open}
                onClose={this.props.onModalClose}
                aria-labelledby="modal"
                classes={{root: this.props.classes.dialog, paper: this.props.classes.dialogPaper}}
            >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle>
                    <DialogTitleWrapper>
                        Class Times
                      <IconButton color="primary" onClick={this.props.onModalClose}>
                        <ClearIcon/>
                      </IconButton>
                    </DialogTitleWrapper>
                </DialogTitle>
                <DialogContent>
                    {
                        isEmpty(this.props.classesData) ? <ClassContainer>No Class Time Found</ClassContainer>
                        : this.props.classesData.map(data => {
                            const addToCalender  = this.checkForAddToCalender(data);
                            return <ClassContainer>

                                <ClassContainerHeader>

                                    <ClassTimings>
                                        {data.timing}
                                    </ClassTimings>

                                    <Chip label={data.scheduleType} classes={{root: this.props.classes.chip, label: this.props.classes.chipLabel}}/>
                                </ClassContainerHeader>
                                    <Typography>
                                      {data.desc}
                                    </Typography>

                                <CalenderButtonWrapper>
                                    {
                                        addToCalender ?  <PrimaryButton
                                            icon
                                            onClick={() => this.addToMyCalender(data)}
                                            iconName="perm_contact_calendar"
                                            label="Add to my Calender"
                                        />
                                        : <SecondaryButton
                                            icon
                                            onClick={() => this.handleClassInterest({methodName: "classInterest.removeClassInterestByClassTimeId", data: {classTimeId: data._id} })}
                                            iconName="delete"
                                            label="Remove from my Calender"
                                        />
                                    }
                                </CalenderButtonWrapper>
                            </ClassContainer>
                        })
                    }
                </DialogContent>
            </MuiThemeProvider>
          </Dialog>
        )
    }
}

ClassTimesDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  classesData : PropTypes.arrayOf({
    timing: PropTypes.string,
    desc: PropTypes.string,
    addToCalender: PropTypes.bool,
    scheduleType: PropTypes.string,
  })
}

export default withMobileDialog()(withStyles(styles)(ClassTimesDialogBox));