import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export default class Signin extends React.Component{

	constructor(props){
    super(props);
  }

  componentDidMount() {
  	$('#signupmodal').modal('hide')
    $('#loginmodal').modal('show')
    $('#loginmodal').on('hidden.bs.modal', () => {
      this.props.onClose();
	})		
  }

  render() {

  	return (
  		<div className="modal fade " id="loginmodal" role="dialog">
	    	<div className="modal-dialog" style={{maxWidth: '450px'}}>
	        <div className="modal-content">
	          <div className="modal-body" style={{minHeight: '325px'}}>
	            <form method="#" action="#" id="">
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
	                                <input type="email" className="form-control" id="email"/>
	                            </div>
	                        </div>
	                        <div className="input-group">
	                            <span className="input-group-addon">
	                                <i className="material-icons">lock_outline</i>
	                            </span>
	                            <div className="form-group label-floating">
	                                <label className="control-label">Password</label>
	                                <input type="password" className="form-control" id="password"/>
	                            </div>
	                        </div>
	                    </div>
	                    <div className="footer text-center">
	                        <button type="button" id="btn_login" className="btn btn-danger btn-sm">Log in</button>
	                        <br/>
	                        <a href="#" className="forgetPass">Lost your password? Click Here</a>
	                        <br/>
	                    </div>

	                </div>
	            </form>
	            <div className="modal-footer text-center" style={{padding: '0px'}}>
	              <span className="">Not a member yet? <a href="#" className="btn btn-primary btn-sm join_school">Join Now</a></span>
	            </div>
	          </div>
	        </div>
	      </div>
	  </div>
  	)
  }
}