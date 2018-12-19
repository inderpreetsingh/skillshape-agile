import React from "react";
import get from "lodash/get";
import { browserHistory } from "react-router";
import moment from "moment";
import { createContainer } from "meteor/react-meteor-data";
import MyProfileRender from "./myProfileRender";
import { withStyles, imageRegex, emailRegex, toastrModal, compressImage } from "/imports/util";
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
        about: currentUser.profile.about || ""
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
        "profile.coords": this.state.loc
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
    const { currentUser, toastr } = this.props;
    Meteor.call(
      "user.editUser",
      { doc: userData, docId: currentUser._id },
      (error, result) => {
        let state = { isBusy: false };
        if (error) {
          state.errorText = error.reason || error.message;
          toastr.error(state.errorText, "Error");
        }
        if (result) {
          toastr.success("You have successfully edited your profile!", "Success");
        }
        this.setState(state);
      }
    );
  };

  changePassword = () => {
    let currentPassword = this.refs.currentPassword.value;
    let newPassword = this.refs.newPassword.value;
    let confirmPassword = this.refs.confirmPassword.value;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toastr.error("All fields are mandatory", "Error");
      return;
    }

    if (newPassword && confirmPassword && newPassword != confirmPassword) {
      toastr.error("Password Not Match", "Error");
      return;
    }

    if (newPassword && confirmPassword && currentPassword) {
      Accounts.changePassword(currentPassword, newPassword, (err, result) => {
        if (err) {
          toastr.error("We are sorry but something went wrong.");
        } else {
          this.refs.currentPassword.value = null;
          this.refs.newPassword.value = null;
          this.refs.confirmPassword.value = null;
          toastr.success("Your password has been changed.", "Success");
        }
      });
    }
  };

  render() {
    return MyProfileRender.call(this, this.props, this.state);
  }
}

export default withStyles(style)(toastrModal(MyProfile));
