import React from "react";
import get from "lodash/get";
import { browserHistory } from "react-router";
import moment from "moment";
import { createContainer } from "meteor/react-meteor-data";
import MyProfileRender from "./myProfileRender";
import { withStyles, confirmationDialog, emailRegex, withPopUp, compressImage } from "/imports/util";
import { resolve } from "url";

const style = theme => {
  return {
    card: {
      margin: 5
    },
    actions: {
      display: "flex"
    },
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      }),
      marginLeft: "auto"
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    inputCaption: {
      marginBottom: 10
    }
  };
};

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      gender: "",
      dob: null,
      email: "",
      phone: "",
      address: "",
      currency: "",
      about: "",
      profileExpanded: true,
      mediaExpanded: true,
      isBusy: false
    };
  }

  componentDidMount() {
    this.initialzeUserProfileForm(this.props.currentUser);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.initialzeUserProfileForm(nextProps.currentUser);
    }
  }

  initialzeUserProfileForm = currentUser => {
    if (currentUser) {
      this.setState({
        firstName: currentUser.profile.firstName || currentUser.profile.name || "",
        lastName: currentUser.profile.lastName || "",
        gender: currentUser.profile.gender || "",
        dob: currentUser.profile.dob || null,
        email: currentUser.emails[0].address,
        phone: currentUser.profile.phone || "",
        address: currentUser.profile.address || "",
        currency: currentUser.profile.currency || "",
        about: currentUser.profile.about || "",
        refresh_token: get(currentUser,'refresh_token',null)
      });
    }
  };

  validateUser = () => {
    const { currentUser } = this.props;
    const paramId = get(this.props, "params.id", null);
    if (currentUser && currentUser._id === paramId) return true;
    return false;
  };

  handleExpandClick = field => {
    this.setState({ [field]: !this.state[field] });
  };

  handleUserImageChange = file => {
    this.setState({ file });
  };

  handleTextChange = (fieldName, event) => {
    this.setState({ [fieldName]: event.target.value });
  };
  removeGoogleSync = () =>{
    let docId = get(this.props.currentUser,'_id',Meteor.userId());
    let doc = {refresh_token:null};
    Meteor.call("user.editUser",{ doc, docId },(err,res)=>{
      const {popUp} = this.props;
      const data = {
        popUp,
        title: 'Success',
        type: 'success',
        content: 'Your Google Calendar disconnected with SkillShape Successfully.',
        buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
      };
      confirmationDialog(data);
    })
  }
  handleDobChange = date => {
    this.setState({ dob: date })
  }

  onLocationChange = location => {
    this.setState({
      loc: location.coords,
      address: location.fullAddress
    });
  };

  locationInputChanged = event => {
    // Need to update address otherwise we can not edit location.
    this.setState({
      address: event.target.value
    });
    if (!event.target.value) {
      this.setState({
        loc: null,
        address: null
      });
    }
  };

  submitUserDetails = event => {
    event.preventDefault();
    this.setState({ isBusy: true });
    let allUploadPromise = [];
    if (this.validateUser()) {
      const userData = {
        "profile.firstName": this.state.firstName,
        "profile.lastName": this.state.lastName,
        "profile.phone": this.state.phone,
        "profile.gender": this.state.gender,
        "profile.dob": this.state.dob && new Date(this.state.dob),
        "profile.address": this.state.address,
        "profile.currency": this.state.currency,
        "profile.about": this.state.about,
        "profile.coords": this.state.loc,
        refresh_token:this.state.refresh_token
      };
      const { file } = this.state;
      try {
        compressImage(file['org'], file.file, file.isUrl).then((result) => {
          console.group("MyProfile");
          if (_.isArray(result)) {
            console.log('Non-cors');
            for (let i = 0; i <= 1; i++) {
              allUploadPromise.push(new Promise((resolve, reject) => {
                S3.upload({ files: { "0": result[i] }, path: "compressed" }, (err, res) => {
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
              }))
            }
            Promise.all(allUploadPromise).then(() => {
              if (file && file.fileData && !file.isUrl) {
                S3.upload(
                  { files: { "0": file.fileData }, path: "profile" },
                  (err, res) => {
                    if (err) {
                      this.setState({
                        isBusy: false,
                        errorText: err.reason || err.message
                      });
                    }
                    if (res) {
                      userData["profile.pic"] = res.secure_url;
                      this.editUserCall(userData);
                    }
                  }
                );
              } else if (file && file.isUrl) {
                userData["profile.pic"] = file.file;
                this.editUserCall(userData);
              } else {
                this.editUserCall(userData);
              }
            })
          }
          else {
            console.log('cors');
            if (file && file.fileData && !file.isUrl) {
              S3.upload(
                { files: { "0": file.fileData }, path: "profile" },
                (err, res) => {
                  if (err) {
                    this.setState({
                      isBusy: false,
                      errorText: err.reason || err.message
                    });
                  }
                  if (res) {
                    userData["profile.pic"] = res.secure_url;
                    this.editUserCall(userData);
                  }
                }
              );
            } else if (file && file.isUrl) {
              userData["profile.pic"] = file.file;
              this.editUserCall(userData);
            } else {
              this.editUserCall(userData);
            }
          }
          console.groupEnd("MyProfile");
        })
      } catch (error) {
        this.editUserCall(userData);
        throw new Meteor.Error(error);
      }
    } else {
      this.setState({ isBusy: false, errorText: "Access Denied" });
      return;
    }
  };

  editUserCall = userData => {
    const { currentUser, popUp } = this.props;
    Meteor.call(
      "user.editUser",
      { doc: userData, docId: currentUser._id },
      (error, result) => {
        let state = { isBusy: false };
        if (error) {
          state.errorText = error.reason || error.message;
          const data = {
            popUp,
            title: 'Error',
            type: 'alert',
            content: state.errorText,
            buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
          };
          confirmationDialog(data);
        }
        if (result) {
          const data = {
            popUp,
            title: 'Success',
            type: 'success',
            content: "You have successfully edited your profile!",
            buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
          };
          confirmationDialog(data);
        }
        this.setState(state);
      }
    );
  };

  changePassword = () => {
    const { popUp } = this.props;
    let currentPassword = this.refs.currentPassword.value;
    let newPassword = this.refs.newPassword.value;
    let confirmPassword = this.refs.confirmPassword.value;
    if (!currentPassword || !newPassword || !confirmPassword) {
      const data = {
        popUp,
        title: 'Error',
        type: 'error',
        content: "All fields are mandatory",
        buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
      };
      confirmationDialog(data);
      return;
    }

    if (newPassword && confirmPassword && newPassword != confirmPassword) {
      const data = {
        popUp,
        title: 'Error',
        type: 'error',
        content: "Password Not Match",
        buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
      };
      confirmationDialog(data);
      return;
    }

    if (newPassword && confirmPassword && currentPassword) {
      Accounts.changePassword(currentPassword, newPassword, (err, result) => {
        if (err) {
          const data = {
            popUp,
            title: 'Error',
            type: 'error',
            content: "We are sorry but something went wrong.",
            buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
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
            content: "Your password has been changed.",
            buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
          };
          confirmationDialog(data);
        }
      });
    }
  };
  handleCalendarSync = () => {
    let self = this;
    this.setState({ isBusy: true }, () => {
      const clientId = Meteor.settings.public.googleAppId;
      gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
          client_id: clientId,
          scope:'https://www.googleapis.com/auth/calendar'
        });
        auth2.grantOfflineAccess().then((res) => {
          if (res.code) {
            Meteor.call('calendar.getRefreshToken', res.code, (err, res) => {
              self.setState({ isBusy: false });
              const { popUp } = self.props;
              if(res){
                const data = {
                  popUp,
                  title: 'Success',
                  type: 'success',
                  content: 'Your Google Calendar connected with SkillShape Successfully.',
                  buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
                };
                confirmationDialog(data);
              }
              else{
                this.somethingWentWrong();
              }
            })
          }
          else {
            this.somethingWentWrong();
          }
        });
      });
    })
  }
  somethingWentWrong = () => {
    this.setState({ isBusy: false });
    const { popUp } = this.props;
    const data = {
      popUp,
      title: 'Error',
      type: 'alert',
      content: 'Oops Something Went Wrong!',
      buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
    };
    confirmationDialog(data);
  }
  calendarConformation = () => {
    const { popUp } = this.props;
    const data = {
      popUp,
      title: 'Confirmation',
      type: 'inform',
      content: 'Please Connect your Google Account to sync SkillShape Calendar with your Google Calendar.',
      buttons: [{ label: 'Cancel', onClick: () => { }, greyColor: true }, { label: 'Yes', onClick: () => { this.handleCalendarSync() } }]
    };
    confirmationDialog(data);
  }
  render() {
    return MyProfileRender.call(this, this.props, this.state);
  }
}

export default withStyles(style)(withPopUp(MyProfile));
