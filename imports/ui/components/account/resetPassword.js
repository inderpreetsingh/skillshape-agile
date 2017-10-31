import React from 'react';
import { browserHistory } from 'react-router';
import { emailRegex } from '/imports/util';

export default class ResetPassword extends React.Component {

	constructor(props){
    super(props);
  }

  submit = (event) => {
    event.preventDefault();
    const { token } = this.props.routeParams;
    const password = this.refs.resetPasswordPassword.value;
    const passwordConfirm = this.refs.resetPasswordPasswordConfirm.value;
    console.log("pwd : " + password);
    if(!password){
      toastr.error("Please enter password","Error");
      return
    }

    if(password != passwordConfirm){
      toastr.error("Please enter valid confirm password","Error");
      return
    }
    
    Accounts.resetPassword(token, password, function(err) {
      if (err) {
        console.log(err.message);
        toastr.error("We are sorry but something went wrong.");
      } else {
        toastr.success("Your password as been updated!");
        browserHistory.push('/');
      }
    });
  }

	render() {

		return(
			<div className="full-page home-page" filter-color="black" style={{backgroundImage: `url('/images/comingsoon.jpg')`}}>
  			<div className="content" style={{paddingTop: '0px'}}>
          <div className="row">
          	<div className="login-card">
            	<div className="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                <form onSubmit={this.submit} id="loginmodal">
                  <div className="card card-login card-hidden" style={{paddingBottom: '0px'}}>
                    <div className="card-header text-center" data-background-color="info">
                      <h4 className="card-title">
                      	Reset Password
                      </h4>
                    </div>
                    <div className="card-content">
                      <div className="input-group">
                          <span className="input-group-addon">
                              <i className="material-icons">lock_outline</i>
                          </span>
                          <input 
                          	type="password" 
                          	placeholder="Password..." 
                          	className="form-control" 
                          	id="resetPasswordPassword"
                          	ref="resetPasswordPassword"
                          />
                      </div>
                      <div className="input-group">
                          <span className="input-group-addon">
                              <i className="material-icons">lock_outline</i>
                          </span>
                          <input 
                          	type="password" 
                          	placeholder="Re-Password..." 
                          	className="form-control" 
                          	id="resetPasswordPasswordConfirm"
                          	ref="resetPasswordPasswordConfirm" 
                          />
                      </div>
                    </div>
                    <div className="footer text-center">
                      <button type="submit" id="resetPassword" className="btn btn-danger">Reset</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
		)
	}
}