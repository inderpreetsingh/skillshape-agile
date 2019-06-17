import get from 'lodash/get';
import React from 'react';
import MyProfileRender from './myProfileRender';
import {
  compressImage,
  confirmationDialog,
  withPopUp,
  withStyles,
  handleOnBeforeUnload,
} from '/imports/util';

const style = theme => ({
  card: {
    margin: 5,
  },
  cardHeaderTitle: {
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  inputCaption: {
    marginBottom: 10,
  },
});

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      gender: '',
      dob: null,
      email: '',
      phone: '',
      address: '',
      currency: '',
      about: '',
      profileExpanded: true,
      mediaExpanded: true,
      isBusy: false,
      isSaved: true,
    };
  }

  routerWillLeave = (nextLocation) => {
    // return false to prevent a transition w/o prompting the user,
    // or return a string to allow the user to decide:
    // return `null` or nothing to let other hooks to be executed
    //
    // NOTE: if you return true, other hooks will not be executed!
    if (!this.state.isSaved) {
      window.history.pushState(null, null, this.props.currentLocationPathName);
      return 'Your work is not saved! Are you sure you want to leave?';
    }
  };

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    this.getCurrentUserDataFromServer(this.props);
  }

  getCurrentUserDataFromServer = (props) => {
    const {
      currentUser,
      params: { id },
    } = props;
    this.setState({ isLoading: true });
    if (currentUser && id) {
      Meteor.call('user.getUserDataFromId', id, (err, res) => {
        if (res) {
          this.initializeUserProfileForm(res);
        } else {
          this.setState({ isLoading: false });
        }
      });
    }
  };

  componentDidUpdate() {
    window.onbeforeunload = null;
    if (!this.state.isSaved) {
      window.onbeforeunload = handleOnBeforeUnload;
    }
  }

  componentWillUnmount() {
    // unregister onbeforeunload event handler
    window.onbeforeunload = null;
  }

  componentWillReceiveProps(nextProps) {
    this.getCurrentUserDataFromServer(nextProps);
  }

  initializeUserProfileForm = (currentUser) => {
    if (currentUser) {
      this.setState({
        firstName: currentUser.profile.firstName || currentUser.profile.name || '',
        lastName: currentUser.profile.lastName || '',
        gender: currentUser.profile.gender || '',
        dob: currentUser.profile.dob || null,
        email: currentUser.emails[0].address,
        phone: currentUser.profile.phone || '',
        address: currentUser.profile.address || '',
        currency: currentUser.profile.currency || '',
        about: currentUser.profile.about || '',
        refresh_token: get(currentUser, 'refresh_token', null),
        isSaved: true,
        isLoading: false,
        currentUser,
      });
    }
  };

  validateUser = () => {
    const {
      currentUser: { _id, roles = [] },
    } = this.props;
    let isAccessAllowed = false;
    roles.map((role) => {
      if (role == 'School' || role == 'Superadmin') {
        isAccessAllowed = true;
      }
    });
    const paramId = get(this.props, 'params.id', null);
    if (_id === paramId || isAccessAllowed) return true;
    return false;
  };

  handleExpandClick = (field) => {
    this.setState({ [field]: !this.state[field] });
  };

  handleUserImageChange = (file) => {
    this.setState({ file });
  };

  passwordChangeMsg = () => {
    const { popUp } = this.props;
    const data = {
      popUp,
      title: 'Success',
      type: 'success',
      content: 'Your Password Change Successful.',
      buttons: [
        {
          label: 'Ok',
          onClick: () => {
            this.setState({ changePasswordDialogBox: false });
          },
          greyColor: true,
        },
      ],
    };
    confirmationDialog(data);
  };

  handleTextChange = (fieldName, event) => {
    this.setState({ [fieldName]: event.target.value, isSaved: false });
  };

  clearAllEvents = () => {
    this.setState({ isBusy: true }, () => {
      const docId = get(this.state.currentUser, '_id', Meteor.userId());
      const doc = { refresh_token: null, googleCalendarId: null };
      Meteor.call('calendar.clearAllEvents', { doc, docId }, (err, res) => {
        if (err) {
          this.somethingWentWrong();
        } else {
          this.setState({ isBusy: false });
          const { popUp } = this.props;
          const data = {
            popUp,
            title: 'Success',
            type: 'success',
            content: 'Your SkillShape events in Google Calendar will be clear shortly.',
            buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
          };
          confirmationDialog(data);
        }
      });
    });
  };

  confirmationRemoveGoogleSync = () => {
    const { popUp } = this.props;
    const data = {
      popUp,
      title: 'Confirmation',
      type: 'inform',
      content:
        'You can Disconnect Google Sync as well as Disconnect Google Sync  and clear previous SkillShape events from google calendar.',
      buttons: [
        { label: 'No, Thanks!', onClick: () => {}, greyColor: true },
        {
          label: 'Disconnect Google ',
          onClick: () => {
            this.removeGoogleSync();
          },
        },
        {
          label: 'Disconnect & Clear Events',
          onClick: () => {
            this.clearAllEvents();
          },
        },
      ],
    };
    confirmationDialog(data);
  };

  removeGoogleSync = () => {
    const docId = get(this.state.currentUser, '_id', Meteor.userId());
    const doc = { refresh_token: null, googleCalendarId: null };
    this.setState({ isBusy: true }, () => {
      Meteor.call('user.editUser', { doc, docId }, (err, res) => {
        this.setState({ isBusy: false });
        const { popUp } = this.props;
        const data = {
          popUp,
          title: 'Success',
          type: 'success',
          content: 'Your Google Calendar disconnected with SkillShape Successfully.',
          buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
        };
        confirmationDialog(data);
      });
    });
  };

  handleDobChange = (date) => {
    this.setState({ dob: date, isSaved: false });
  };

  onLocationChange = (location) => {
    this.setState({
      loc: location.coords,
      address: location.fullAddress,
      isSaved: false,
    });
  };

  locationInputChanged = (event) => {
    // Need to update address otherwise we can not edit location.
    this.setState({
      address: event.target.value,
      isSaved: false,
    });
    if (!event.target.value) {
      this.setState({
        loc: null,
        address: null,
      });
    }
  };

  submitUserDetails = (event) => {
    event.preventDefault();
    this.setState({ isBusy: true });
    const allUploadPromise = [];
    if (this.validateUser()) {
      const userData = {
        'profile.firstName': this.state.firstName,
        'profile.lastName': this.state.lastName,
        'profile.phone': this.state.phone,
        'profile.gender': this.state.gender,
        'profile.dob': this.state.dob && new Date(this.state.dob),
        'profile.address': this.state.address,
        'profile.currency': this.state.currency,
        'profile.about': this.state.about,
        'profile.coords': this.state.loc,
        refresh_token: this.state.refresh_token,
        savedByUser: true,
      };
      const { file } = this.state;
      try {
        compressImage(file.org, file.file, file.isUrl).then((result) => {
          console.group('MyProfile');
          if (_.isArray(result)) {
            console.log('Non-cors');
            for (let i = 0; i <= 1; i++) {
              allUploadPromise.push(
                new Promise((resolve, reject) => {
                  S3.upload({ files: { 0: result[i] }, path: 'compressed' }, (err, res) => {
                    if (res) {
                      if (i == 0) {
                        userData['profile.medium'] = res.secure_url;
                        resolve();
                      } else {
                        userData['profile.low'] = res.secure_url;
                        resolve();
                      }
                    }
                  });
                }),
              );
            }
            Promise.all(allUploadPromise).then(() => {
              if (file && file.fileData && !file.isUrl) {
                S3.upload({ files: { 0: file.fileData }, path: 'profile' }, (err, res) => {
                  if (err) {
                    this.setState({
                      isBusy: false,
                      errorText: err.reason || err.message,
                    });
                  }
                  if (res) {
                    userData['profile.pic'] = res.secure_url;
                    this.editUserCall(userData);
                  }
                });
              } else if (file && file.isUrl) {
                userData['profile.pic'] = file.file;
                this.editUserCall(userData);
              } else {
                this.editUserCall(userData);
              }
            });
          } else {
            console.log('cors');
            if (file && file.fileData && !file.isUrl) {
              S3.upload({ files: { 0: file.fileData }, path: 'profile' }, (err, res) => {
                if (err) {
                  this.setState({
                    isBusy: false,
                    errorText: err.reason || err.message,
                  });
                }
                if (res) {
                  userData['profile.pic'] = res.secure_url;
                  this.editUserCall(userData);
                }
              });
            } else if (file && file.isUrl) {
              userData['profile.pic'] = file.file;
              this.editUserCall(userData);
            } else {
              this.editUserCall(userData);
            }
          }
          console.groupEnd('MyProfile');
        });
      } catch (error) {
        this.editUserCall(userData);
        throw new Meteor.Error(error);
      }
    } else {
      this.setState({ isBusy: false, errorText: 'Access Denied' });
    }
  };

  editUserCall = (userData) => {
    const { popUp } = this.props;
    const { currentUser } = this.state;
    Meteor.call('user.editUser', { doc: userData, docId: currentUser._id }, (error, result) => {
      console.log('TCL: result', result);
      const state = { isBusy: false, isSaved: true };
      console.log('TCL: error', error);
      if (error) {
        state.errorText = error.reason || error.message;
        const data = {
          popUp,
          title: 'Error',
          type: 'alert',
          content: state.errorText,
          buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
        };
        confirmationDialog(data);
      }
      if (result) {
        const data = {
          popUp,
          title: 'Success',
          type: 'success',
          content: 'You have successfully edited your profile!',
          buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
        };
        confirmationDialog(data);
      }
      this.setState(state);
    });
  };

  changePassword = () => {
    const { popUp } = this.props;
    const currentPassword = this.refs.currentPassword.value;
    const newPassword = this.refs.newPassword.value;
    const confirmPassword = this.refs.confirmPassword.value;
    if (!currentPassword || !newPassword || !confirmPassword) {
      const data = {
        popUp,
        title: 'Error',
        type: 'error',
        content: 'All fields are mandatory',
        buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
      };
      confirmationDialog(data);
      return;
    }

    if (newPassword !== confirmPassword) {
      const data = {
        popUp,
        title: 'Error',
        type: 'error',
        content: 'Password Not Match',
        buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
      };
      confirmationDialog(data);
      return;
    }

    Accounts.changePassword(currentPassword, newPassword, (err, result) => {
      if (err) {
        const data = {
          popUp,
          title: 'Error',
          type: 'error',
          content: 'We are sorry but something went wrong.',
          buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
        };
        confirmationDialog(data);
      } else {
        this.refs.currentPassword.value = null;
        this.refs.newPassword.value = null;
        this.refs.confirmPassword.value = null;
        const data = {
          popUp,
          title: 'Success',
          type: 'success',
          content: 'Your password has been changed.',
          buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
        };
        confirmationDialog(data);
      }
    });
  };

  handleCalendarSync = () => {
    const self = this;
    this.setState({ isBusy: true }, () => {
      const clientId = Meteor.settings.public.googleAppId;
      try {
        gapi.load('auth2', () => {
          auth2 = gapi.auth2.init({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/calendar',
          });
          auth2
            .grantOfflineAccess()
            .then((res) => {
              console.log('TCL: handleCalendarSync -> res', res);
              if (res.code) {
                Meteor.call('calendar.getRefreshToken', res.code);
                const { popUp } = self.props;
                const data = {
                  popUp,
                  title: 'Success',
                  type: 'success',
                  content:
                    'Your Google Calendar connected with SkillShape Successfully. All SkillShape events will be sync shortly.',
                  buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
                };
                self.setState({ isBusy: false });
                confirmationDialog(data);
              } else {
                self.somethingWentWrong();
              }
            })
            .catch((err) => {
              self.somethingWentWrong(err.error);
            });
        });
      } catch (error) {
        console.log('error in handleCalendarSync', error);
        this.somethingWentWrong();
      }
    });
  };

  somethingWentWrong = (errorCode) => {
    this.setState({ isBusy: false });
    let content = 'Oops Something Went Wrong. Please try again.';
    if (errorCode == 'popup_closed_by_user') {
      content = 'Google Popup is closed by the user. Pease try again.';
    } else if (errorCode == 'popup_blocked_by_browser') {
      content = 'Google Popup is blocked by the browser. Please allow google popup and try again.';
    }
    const { popUp } = this.props;
    const data = {
      popUp,
      title: 'Error',
      type: 'alert',
      content,
      buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
    };
    confirmationDialog(data);
  };

  calendarConformation = () => {
    const { popUp } = this.props;
    const data = {
      popUp,
      title: 'Confirmation',
      type: 'inform',
      content:
        'Please Connect your Google Account to sync SkillShape Calendar with your Google Calendar.',
      buttons: [
        { label: 'Cancel', onClick: () => {}, greyColor: true },
        {
          label: 'Yes',
          onClick: () => {
            this.handleCalendarSync();
          },
        },
      ],
    };
    confirmationDialog(data);
  };

  render() {
    return MyProfileRender.call(this, this.props, this.state);
  }
}

export default withStyles(style)(withPopUp(MyProfile));
