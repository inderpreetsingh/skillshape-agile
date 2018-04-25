import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
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
import Events from '/imports/util/events';


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
  justify-content: space-between;
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

const ErrorWrapper = styled.span`
   color: red;
   float: right;
`;

const ScheduleType = styled.span`
  display: inline-block;
  padding: ${helpers.rhythmDiv}px;
  font-size: 12px;
  font-weight: 500;
  font-family: ${helpers.specialFont};
  background: ${helpers.lightTextColor};
  color: ${helpers.primaryColor};
  border-radius: 2px;`;


const MyClassInfo = (props) => (<ClassContainer>
      <ClassContainerHeader>

          <ClassTimings>
            {props.data.name}
          </ClassTimings>

          {/*<Chip label={props.data.scheduleType} classes={{root: this.props.classes.chip, label: this.props.classes.chipLabel}}/> */}
          <ScheduleType>{props.getDatesBasedOnScheduleType(props.data)}</ScheduleType>
      </ClassContainerHeader>
          <Typography>
            {props.data.desc}
          </Typography>

      <CalenderButtonWrapper>
          {
              props.addToCalender ?  <PrimaryButton
                  icon
                  onClick={() => props.addToMyCalender(props.data)}
                  iconName="perm_contact_calendar"
                  label="Add to my Calender"
              />
              : <SecondaryButton
                  icon
                  onClick={() => props.handleClassInterest({methodName: "classInterest.removeClassInterestByClassTimeId", data: {classTimeId: props.data._id} })}
                  iconName="delete"
                  label="Remove from my Calender"
              />
          }
      </CalenderButtonWrapper>
  </ClassContainer>
)

class ClassTimesDialogBox extends React.Component {

    checkForAddToCalender = (data) => {
        const userId = Meteor.userId()
        if(isEmpty(data) || isEmpty(userId)) {
            return true;
        } else {
            return isEmpty(ClassInterest.find({classTimeId: data._id, userId}).fetch());
        }
    }

    getDatesBasedOnScheduleType = (data) => {
      let startDate = '';
      let endDate = '';
      const dateFormat = 'DD-MM-YYYY';
      const scheduleType = data.scheduleType.toLowerCase();
      const scheduleDetails = data.scheduleDetails;

      if(scheduleType === 'recurring') {
        startDate = moment(new Date(data.startDate)).format(dateFormat);
        endDate = moment(new Date(data.endDate)).format(dateFormat);
        return `Recurring from ${startDate} to ${endDate}`;
      }else if(scheduleType === 'ongoing') {
        return `Ongoing`;
      }else {
        startDate = moment(new Date(scheduleDetails['oneTime'][0].startDate)).format(dateFormat);
        return `Onetime on ${startDate}`;
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
            // Show Login popup
            Events.trigger("loginAsUser");
        }
    }

    handleClassInterest = ({methodName, data}) => {
        Meteor.call(methodName, data, (err, res) => {
            console.log(res,err);
        })
    }

    getSchedules = (classesData) => {
      const ourSchedules = [];

      classesData.forEach(data => {
        const addToCalender = this.checkForAddToCalender(data);

        if(data.scheduleType === 'oneTime') {
          // If schedule is one time..
          data.scheduleDetails.oneTime.forEach(currentData => {
            const myScheduleData = {...data};
            myScheduleData.scheduleDetails.oneTime = [];
            myScheduleData.scheduleDetails.oneTime.push(currentData);

            ourSchedules.push(<MyClassInfo
                data={myScheduleData}
                getDatesBasedOnScheduleType={this.getDatesBasedOnScheduleType}
                addToMyCalender={this.addToMyCalender}
                handleClassInterest={this.handleClassInterest}
                addToCalender={addToCalender}
              />);
          });
        }else {
          // If schedule is ongoing or recurring..
          ourSchedules.push(<MyClassInfo
            data={data}
            addToCalender={addToCalender}
            getDatesBasedOnScheduleType={this.getDatesBasedOnScheduleType}
            addToMyCalender={this.addToMyCalender}
            handleClassInterest={this.handleClassInterest} />);
        }

      });

      return ourSchedules;
    }

    render() {
        // const classTimesData = this.normalizeScheduledetails(this.props.classesData);

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
                        isEmpty(this.props.classesData) ? (
                            <ClassContainer>
                                <Typography caption="p">
                                    No class times have been given by the school. Please click this button to request the school complete their listing
                                </Typography>
                                <br>
                                </br>
                                <PrimaryButton
                                    icon
                                    onClick={this.props.handleClassTimeRequest}
                                    iconName="perm_contact_calendar"
                                    label="Request class times"
                                />
                            </ClassContainer>
                        )
                        : this.getSchedules(this.props.classesData)
                    }
                    {
                      this.props.errorText && <ErrorWrapper>{this.props.errorText}</ErrorWrapper>
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
  }),
  errorText: PropTypes.string,
}

export default withMobileDialog()(withStyles(styles)(ClassTimesDialogBox));
