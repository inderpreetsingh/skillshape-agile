import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

export default class Signup extends React.Component{

  constructor(props){
    super(props);
  }

  componentDidMount() {
  	$('#signupmodal').modal('show')
  	$('#Join').modal('show')
    $('#loginmodal').modal('hide')
    $('#Join').on('hidden.bs.modal', () => {
      this.props.onClose();
		})		
  }

  render() {
  	const {
  		schoolRegister,
  		studentRegister,
  	} = this.props;

  	return (
      <div className="modal fade " id="Join" role="dialog">
        <div className="modal-dialog" style={{maxWidth: '450px'}}>
            <div className="modal-content">
              <div className="modal-body" style={{minHeight: '500px'}}>
                <div className="card-signup" style={{paddingBottom: '20px', paddingTop: '20px', paddingLeft: '0px', paddingRight: '0px'}}>
                  <ul className="nav nav-pills nav-pills-primary nav-pills-icons" style={{marginTop: '0px', paddingLeft: '45px', marginBottom: '10px'}}>
                      <li className={studentRegister ? "active sheade" : "sheade"} id="student-tab">
                        <a href="#" className="card-title text-center">Sign Up as a Student</a>
                      </li>
                      <li className={schoolRegister ? "active sheade" : "sheade"} id="school-tab">
                        <a href="#" className="card-title text-center">Register a School</a>
                      </li>
                  </ul>
                    <div className="">
                        <div className="col-md-12">
                          <div className="col-md-12 text-center">
                              {/*<!-- <span className="">Sign up with  <a href="#" style="text-decoration: underline;">facebook</a> or <a href="#" style="text-decoration: underline;">Google</a></span> -->*/}
                          </div>
                            <form className="form" method="" action="" id="signupmodal">
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">email</i>
                                  </span>
                                  <div className="form-group">
                                  	<input type="text" className="form-control" placeholder="Email..." id="email"/>
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">account_box</i>
                                  </span>
                                  <div className="form-group">
                                  	<input type="text" className="form-control" placeholder="First Name" id="fname"/>
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">account_box</i>
                                  </span>
                                  <div className="form-group">
                                  	<input type="text" className="form-control" placeholder="Last Name" id="lname"/>
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">lock_outline</i>
                                  </span>
                                  <div className="form-group">
                                  	<input type="password" placeholder="Password..." className="form-control" id="password"/>
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">lock_outline</i>
                                  </span>
                                  <div className="form-group">
                                  	<input type="password" placeholder="Re-enter Password..." className="form-control" id="re_password" />
                                  </div>
                              </div>
                                    {/*<!-- If you want to add a checkbox to this form, uncomment this code -->*/}
                            </form>
                        </div>
                        {/*<!-- <div className="col-sm-12">
                          <div className="checkbox">
                              <label >
                                  <input type="checkbox" name="optionsCheckboxes" checked><b> I'd like to receive news, surveys, and update via email about skillshape and its partner schools.</b>

                                  <small style="display: block;padding-top: 5px;">By clicking sign up or Continue with I agree to SkillShape's Teram of Service, Privacy Policy, and nondiscrimination Policy.</small>
                              </label>
                          </div>
                        </div> -->*/}
                        <div className="modal-footer text-center">
                            <button type="button" className="btn btn-danger btn_sign_up" id="btn_sign_up" style={{width:'100%', marginTop: '20px'}}>Sign up</button>
                            <hr style={{marginTop: '10px', marginBottom: '5px'}}/>
                            <div className="col-md-12 text-center">
                                <span className="">Already a Skillshape Member?  <a href="#" className="btn btn-success btn-sm login" >Log in</a></span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  	)
  }
}