import { isEmpty } from 'lodash';
import ClearIcon from 'material-ui-icons/Clear';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import React from 'react';
import styled from 'styled-components';
import muiTheme from '../jss/muitheme';
import ClassTypePackages from './classTypePackages';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import { PrivacySettings } from '/imports/ui/components/landing/components/dialogs/';
import SignUpDialogBox from '/imports/ui/components/landing/components/dialogs/SignUpDialogBox';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';
import {
  handleJoin,
  handleLoginFacebook,
  handleLoginGoogle,
  handleSignUpSubmit,
} from '/imports/util';
import Events from '/imports/util/events';

const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
  font-size: 30px;
`;

const styles = {
  dialogAction: {
    width: '100%',
  },
  dialogActionsRoot: {
    [`@media screen and (max-width: ${helpers.mobile}px)`]: {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
  dialogTitle: {
    borderTop: '5px solid #4caf50',
  },
  StyleForButton: {
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
    },
  },
};
const TextWrapper = styled.div`
  text-align: center;
  font-size: 15px;
  font-weight: 500;
`;
const ErrorWrapper = styled.span`
  color: red;
  float: right;
`;

class ThinkingAboutAttending extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkBoxes: [true, true],
      classTypePackages: false,
      packagesRequired: 'perClassAndMonthly',
      isLoading: this.props.isLoading,
    };
  }

  componentWillMount() {
    Events.on('loginAsUser', '123456', (data) => {
      this.handleLoginModalState(true, data);
    });
    Events.on('registerAsSchool', '123#567', (data) => {
      const { userType, userEmail, userName } = data;
      this.handleSignUpDialogBoxState(true, userType, userEmail, userName);
    });
    this.checkUserPurchases(this.props);
    this.getCheckBoxValues();
  }

  componentWillReceiveProps(nextProps) {
    !isEmpty(nextProps) && this.checkUserPurchases(nextProps);
  }

  getCheckBoxValues = () => {
    const { classTypeId, classTimeId, schoolId } = this.props;
    const filterForNotificationStatus = { classTypeId, userId: Meteor.userId() };
    Meteor.call(
      'classInterest.getClassInterest',
      filterForNotificationStatus,
      schoolId,
      (err, result) => {
        if (!isEmpty(result)) {
          const {
            classInterestData,
            notification: { classTimesRequest, classTypeLocationRequest },
            schoolMemberData,
            isFirstTime,
          } = result;
          // let calendar = !isEmpty(classInterestData),default always be true;
          const calendar = true;
          const notification = !isEmpty(classTimesRequest)
            && classTimesRequest.notification
            && !isEmpty(classTypeLocationRequest)
            && classTypeLocationRequest.notification;
          const checkBoxes = [calendar, notification];
          if (isEmpty(schoolMemberData)) {
            checkBoxes.push(true);
          }
          const { phoneAccess = 'public', emailAccess = 'public', _id: memberId } = schoolMemberData || {};
          const memberData = { phoneAccess, emailAccess, memberId };
          this.setState({
            checkBoxes,
            checkBoxesData: result,
            memberData,
            isFirstTime,
          });
        }
      },
    );
  };

  checkUserPurchases = (props) => {
    if (props.classTypeId && Meteor.userId()) {
      const { classTypeId } = props;
      const filter = { classTypeId, userId: Meteor.userId() };
      Meteor.call('classPricing.signInHandler', filter, (err, res) => {
        if (!isEmpty(res)) {
          const { epStatus, purchased, noPackageRequired } = res;
          if ((epStatus && !isEmpty(purchased)) || noPackageRequired) {
            this.setState({ alreadyPurchased: true, loginUserPurchases: res });
          } else if (!epStatus) {
            this.setState({ packagesRequired: 'enrollment' });
          } else {
            this.setState({ packagesRequired: 'perClassAndMonthly' });
          }
        }
      });
    }
  };

  handleSignUpDialogBoxState = (state, userType, userEmail, userName) => {
    this.setState({
      signUpDialogBox: state,
      userData: { userType },
      userEmail,
      userName,
      errorText: null,
    });
  };

  unsetError = () => this.setState({ errorText: null });

  closeClassTypePackages = () => {
    this.setState({ classTypePackages: false });
  };

  handlePrivacySettingDialog = (value = true) => {
    this.getCheckBoxValues();
    this.setState({ privacySettings: value });
  };

  render() {
    const {
      checkBoxes,
      classTypePackages,
      packagesRequired,
      loginUserPurchases,
      alreadyPurchased,
      isLoading,
      privacySettings,
      memberData,
      isBusy,
    } = this.state;
    const {
      open,
      onModalClose,
      name,
      schoolId,
      params,
      classTypeId,
      handleSignIn,
      schoolName,
    } = this.props;
    let packagesLength = 0;
    if (!isEmpty(loginUserPurchases)) {
      const { purchased = [] } = loginUserPurchases;
      packagesLength = purchased.length;
    }
    const labelValue = [
      'Add this class to my calendar.',
      'Sign me up for notifications regarding class time or Location changes.',
      `Would you like to allow ${schoolName} to have access to your email address for general contact, newsletters regarding classes you are signed up for, and other marketing purposes related to the school? You can revoke this any time in your Edit Memberships area.`,
    ];
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          title="Thinking About Attending"
          open={open}
          onClose={onModalClose}
          onRequestClose={onModalClose}
          aria-labelledby="Thinking About Attending"
        >
          {privacySettings && (
            <PrivacySettings
              open={privacySettings}
              onModalClose={() => {
                this.handlePrivacySettingDialog(false);
                onModalClose();
              }}
              schoolName={schoolName}
              {...memberData}
            />
          )}
          {this.state.signUpDialogBox && (
            <SignUpDialogBox
              open={this.state.signUpDialogBox}
              onModalClose={() => this.handleSignUpDialogBoxState(false)}
              onSubmit={(payload, event) => {
                handleSignUpSubmit.call(this, payload, event);
              }}
              errorText={this.state.errorText}
              unsetError={this.unsetError}
              userName={this.state.userName}
              userEmail={this.state.userEmail}
              onSignUpWithGoogleButtonClick={() => {
                handleLoginGoogle.call(this);
              }}
              onSignUpWithFacebookButtonClick={() => {
                handleLoginFacebook.call(this);
              }}
              isBusy={isBusy}
            />
          )}
          {isLoading && <ContainerLoader />}
          {classTypePackages && (
            <ClassTypePackages
              schoolId={schoolId}
              open={classTypePackages}
              onClose={() => this.setState({ classTypePackages: false })}
              params={params}
              classTypeId={classTypeId}
              packagesRequired={packagesRequired}
              closeClassTypePackages={this.closeClassTypePackages}
              handleSignIn={handleSignIn}
            />
          )}
          <DialogTitle classes={{ root: this.props.classes.dialogTitle }}>
            <DialogTitleWrapper>
              About Attending
              {' '}
              {name && name}
              <IconButton
                color="primary"
                onClick={() => {
                  onModalClose();
                }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent style={{ fontSize: '18px' }}>
            <TextWrapper>
              {' '}
              {!alreadyPurchased
                ? 'To attend you must purchase a class package.'
                : `Congratulations! You have ${packagesLength} subscription that will allow you to attend ${name} classes. `}
            </TextWrapper>
            {checkBoxes.map((i, index) => (
              <FormControl fullWidth margin="dense" key={index.toString()}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={checkBoxes[index]}
                      onChange={(e) => {
                        const old = checkBoxes;
                        old[index] = e.target.checked;
                        this.setState({ checkBoxes: old });
                      }}
                      value={index}
                    />
)}
                  label={labelValue[index]}
                />
              </FormControl>
            ))}
          </DialogContent>
          <DialogActions classes={{ root: this.props.classes.dialogActionsRoot }}>
            <ButtonWrapper>
              <FormGhostButton darkGreyColor onClick={onModalClose} label="Close!" />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                onClick={() => {
                  handleJoin.call(this);
                }}
                label={alreadyPurchased ? 'Join' : 'Join and Pay Later'}
              />
            </ButtonWrapper>
            {!alreadyPurchased && (
              <ButtonWrapper>
                <Button
                  onClick={() => {
                    this.setState({ classTypePackages: true });
                  }}
                  classes={{ root: this.props.classes.StyleForButton }}
                >
                  Purchase Package Now
                </Button>
              </ButtonWrapper>
            )}
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(ThinkingAboutAttending);
