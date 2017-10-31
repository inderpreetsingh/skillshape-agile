import React from 'react';
import { browserHistory } from 'react-router';
import { emailRegex } from '/imports/util';

export default class ForgotPassword extends React.Component {

	constructor(props){
    super(props);
  }

  componentDidMount() {
    $('#loginmodal').modal('hide')
   	$('#forget_pass_modal').modal('show')
   	$('#forget_pass_modal').on('hidden.bs.modal', () => {
      this.props.onClose({showForgotPasswordModal: false});
		})	
  }

  submit = (event) => {
    event.preventDefault();
    const email =  this.refs.email.value;
   
    if(!email) {
      toastr.error("Please enter email address","Error");
      return
    }

    if(!emailRegex.email.test(email)) {
      toastr.error("Please enter valid email address","Error");
      return
    }

    Accounts.forgotPassword({email:email}, (err) => {
      if (err) {
        if (err.message === 'User not found [403]') {
          toastr.error("This email does not exist.","Error");
        } else {
          toastr.error("We are sorry but something went wrong.","Error");
          console.log('We are sorry but something went wrong.');
        }
      } else {
        toastr.success("Email Sent. Check your mailbox.","Success");
        $('#forget_pass_modal').modal('hide');
      }
    });
  }

  render() {
  	
  	return (
  		<div className="modal fade " id="forget_pass_modal" role="dialog">
      	<div className="modal-dialog" style={{maxWidth: '420px'}}>
          <div className="modal-content">
            <div className="modal-body" style={{minHeight: '290px'}}>
              <form onSubmit={this.submit}>
                <div className="card-hidden" style={{paddingBottom: '0px'}}>
                  <div className="card-header text-center" data-background-color="info">
                    <h4 className="card-title">Forgot password</h4>
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
                  </div>
                  <div className="footer text-center">
                    <button type="submit" id="btn_reset_password" className="btn btn-danger" style={{width: '80%'}}>Submit</button>
                  </div>
                </div>
              </form>
              <div className="modal-footer text-center">
                <span className="pull-right">Back to <a onClick={this.props.logIn}  className="btn btn-primary btn-sm back_to_login login"> Login</a></span>
                <span className="pull-left">Not Member yet? <a onClick={this.props.openSignupModal.bind(this, true, false)} className="btn btn-primary btn-sm btn_signup join_school">Join Now</a></span>
              </div>
            </div>
          </div>
        </div>
    </div>
  	)
  }
}