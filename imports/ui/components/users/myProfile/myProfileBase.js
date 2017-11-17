import React from 'react';
import { imageRegex } from '/imports/util';
import { browserHistory } from 'react-router';
import moment from 'moment';

export default class MyProfileBase extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    	firstName: "",
    	nickame: "",
    	lastName: "",
    	gender: "",
    	dob: null,
    	phone: "",
    	address: "",
    }
  }

  componentDidMount() {
  	this.initialzeUserProfileForm(this.props.currentUser)
  }
  componentWillReceiveProps() {
  	this.initialzeUserProfileForm(this.props.currentUser)
  }

  initialzeUserProfileForm = (currentUser) => {
    if(currentUser) {
  		this.setState({
  			firstName: currentUser.profile.firstName || "", 
  			nickame: currentUser.profile.nickame || "", 
  			lastName: currentUser.profile.lastName || "", 
  			gender: currentUser.profile.gender || "", 
  			dob: (currentUser.profile.dob && moment(currentUser.profile.dob)) || null, 
  			phone: currentUser.profile.phone || "", 
  			address: currentUser.profile.address || "", 
  		})
  	}
  }

  updateUser = () => {
  	let imageFile = this.refs.ProfileImage.files[0]; 
  	if(imageFile) {
  		if(!imageRegex.image.test(imageFile.name)) {
  			toastr.error("Please enter valid Image file","Error");
  			return 
  		}
  		S3.upload({files: { "0": imageFile}, path:"profile"}, (err, res) => {
  			if(err) {
  				console.error("err ",err)
  			}
  			if(res) {
  				this.editUserCall(res)
  			}
  		})
  	} else
  		this.editUserCall()
  }

  editUserCall = (imageUpload) => {
  	const { currentUser } = this.props;
    // console.log("editUserCall -->>",this.state.dob)
  	const userData = {
  		"profile.firstName": this.state.firstName,
  		"profile.nickame": this.state.nickame,
  		"profile.lastName": this.state.lastName,
  		"profile.phone": this.state.phone,
  		"profile.gender": this.state.gender,
  		"profile.dob": (this.state.dob && this.state.dob._d) || null,
  		"profile.address": this.state.address,
  	}
  	if(imageUpload) {
  		userData["profile.pic"] = imageUpload.secure_url
  	}
  	Meteor.call("editUser", userData, currentUser._id, null, (error, result) => {
      if(error) {
        console.error("error", error);
      }
      if(result) {
        browserHistory.push('/'); 
      }
    });
  }

  changePassword = () => {
    let currentPassword = this.refs.currentPassword.value;
    let newPassword = this.refs.newPassword.value;
    let confirmPassword = this.refs.confirmPassword.value;
    if(!currentPassword || !newPassword || !confirmPassword) {
      toastr.error("All fields are mandatory","Error");
      return
    }

    if(newPassword && confirmPassword && (newPassword != confirmPassword)) {
      toastr.error("Password Not Match","Error");
      return
    }

    if(newPassword && confirmPassword && currentPassword) {
      Accounts.changePassword(currentPassword, newPassword, (err, result) => {
        if (err) {
          toastr.error('We are sorry but something went wrong.');
        } else {
          this.refs.currentPassword.value = null
          this.refs.newPassword.value = null
          this.refs.confirmPassword.value = null
          toastr.success("Your password has been changed.","Success");
        }
      });
    }
  }
}
