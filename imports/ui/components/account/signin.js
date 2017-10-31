import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import { emailRegex } from '/imports/util';

let login_fail_count = 0;

export default class Signin extends React.Component{

	constructor(props){
    super(props);
  }

  componentDidMount() {
  	$('#signupmodal').modal('hide')
    $('#loginmodal').modal('show')
    $('#loginmodal').on('hidden.bs.modal', () => {
      this.props.onClose({showSigninModal: false});
		})		
  }

  submit = (event) => {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    
    if(!email) {
    	toastr.error("Please enter a email address");
      return false;
    }

    if(!password) {
    	toastr.error("Please enter a password");
      return false;
    }

    if(!emailRegex.email.test(email)) {
      toastr.error("Please enter valid email address","Error");
      return false;
    }

    Meteor.loginWithPassword(email, password, (error) => {
      if(error) {
        //  toastr.error(error.reason,"Error");
        $('#loginmodal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        console.log(login_fail_count);
        if (login_fail_count > 2) {

          $('#loginmodal').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
          $('body').removeAttr("style");
          $('#forget_pass_modal').modal('show');
          $('#loginmodal').modal('hide');
          $('#signupmodal').modal('hide');
          // Router.go('ForgotPassword');
        } else {

          if(error.reason ==  "Incorrect password") {
            login_fail_count = login_fail_count + 1;
            swal({
              title: error.reason,
              buttonsStyling: false,
              confirmButtonClass: "btn btn-success",
              timer: 2000 ,
              html: error.reason
            }).then(
              function() {},
              function() {}
            );
          } else {

	            swal({
	              title: 'Unauthorised User',
	              buttonsStyling: false,
	              confirmButtonClass: "btn btn-success",
	              timer: 2000,
	              html:'Cannot Login Please contact, ' +
	                '<a href="#">Admin</a> ' +
	                ''
	            }).then(
	              function() {},
	              function() {}
	            );
            }
          }
        } else {

          $('#loginmodal').modal('hide');
          var user_id = Meteor.userId();
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
          //console.log(IsDemoUser());
          if(IsDemoUser()){
            if (Meteor.user().profile.role == 'Admin') {
              browserHistory.push('ScheduleView');
            } else {
              browserHistory.push('ScheduleView');
            }
          } else {
            browserHistory.push('Home');
          }
        }
     });
  }

  render() {

  	return (
  		<div className="modal fade " id="loginmodal" role="dialog">
	    	<div className="modal-dialog" style={{maxWidth: '450px'}}>
	        <div className="modal-content">
	          <div className="modal-body" style={{minHeight: '325px'}}>
	            <form onSubmit={this.submit}>
	                <div className="card-login card-hidden" style={{paddingBottom: '0px'}}>
	                    <div className="card-header text-center" data-background-color="info">
	                        <h4 className="card-title">Login</h4>
	                    </div>
	                    <div className="card-content">
	                        <div className="input-group">
	                            <span className="input-group-addon">
	                                <i className="material-icons">email</i>
	                            </span>
	                            <div className="form-group label-floating">
	                                <label className="control-label">Email address</label>
	                                <input 
	                                	type="email" 
	                                	className="form-control" 
	                                	id="email"
	                                	ref="email"
	                                />
	                            </div>
	                        </div>
	                        <div className="input-group">
	                            <span className="input-group-addon">
	                                <i className="material-icons">lock_outline</i>
	                            </span>
	                            <div className="form-group label-floating">
	                                <label className="control-label">Password</label>
	                                <input 
	                                	type="password" 
	                                	className="form-control" 
	                                	id="password"
	                                	ref="password"
	                                />
	                            </div>
	                        </div>
	                    </div>
	                    <div className="footer text-center">
	                        <button type="submit" id="btn_login" className="btn btn-danger btn-sm">Log in</button>
	                        <br/>
	                        <a onClick={this.props.showForgotPasswordModal.bind(this)} className="forgetPass">Lost your password? Click Here</a>
	                        <br/>
	                    </div>

	                </div>
	            </form>
	            <div className="modal-footer text-center" style={{padding: '0px'}}>
	              <span className="">Not a member yet? <a onClick={this.props.openSignupModal.bind(this, true, false)} className="btn btn-primary btn-sm join_school">Join Now</a></span>
	            </div>
	          </div>
	        </div>
	      </div>
	  </div>
  	)
  }
}