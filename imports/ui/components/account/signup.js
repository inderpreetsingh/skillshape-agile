import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory} from 'react-router';

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

  submit = (event) => {
    event.preventDefault();
    console.log("email -->>",this.refs.email.value);
    const email = this.refs.email.value;
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const password = this.refs.password.value;
    const re_password = this.refs.re_password.value;
    const fname = this.refs.fname.value;
    const lname = this.refs.fname.value;
    
    if (!fname) {
      toastr.error("Please enter a first name","Error");
      return false;
    }

    const profile = {
      "firstName": fname,
      "lastName": lname,
    }

    if(!emailReg.test(email)) {
      toastr.error("Please enter valid email address","Error");
      return false;
    }

    if(password != re_password) {
      toastr.error("Please enter valid confirm password","Error");
      return false;
    }

    Accounts.createUser({ email: email, password: password, profile: profile }, (error) => {
      if(error) {
        toastr.error(error.reason,"Eroor");
      } else {
        const { schoolRegister, studentRegister } = this.props;
        let user_id = Meteor.userId();
        $('#signupmodal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        
        Meteor.call( 'sendVerificationLink', (error, response ) =>  {
          if ( error ) {
            toastr.error(error.reason,"Error");
          } else {
            let email = Meteor.user().emails[0].address;
            toastr.success("Verification sent to "+email+"","Success");
          }
        });

        let role_name = "Admin"
        let data = null;
       // var active_selection = $('.sheade.active').attr("id");
        if(studentRegister) {
          data = {"profile.acess_type":"student"}
          role_name = "Student"
        }
        else if(schoolRegister) {
          data = {"profile.acess_type":"school"}
          role_name = "Admin"
        }
        console.log(data);

        Meteor.call("editUser", data,user_id,role_name, (error, result) => {
          if(error) {
            console.log("error :"+error);
            console.log("error", error);
          }
          if(result) {
            if(studentRegister) {
              browserHistory.push(`/profile/${Meteor.userId()}`)
            } else if(schoolRegister) {
              browserHistory.push('/ClaimSchool')                
            }
          }
        });
      }
    });
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
                        <a onClick={this.props.openSignupModal.bind(this, true, false)} className="card-title text-center">Sign Up as a Student</a>
                      </li>
                      <li className={schoolRegister ? "active sheade" : "sheade"} id="school-tab">
                        <a onClick={this.props.openSignupModal.bind(this, false, true)} className="card-title text-center">Register a School</a>
                      </li>
                  </ul>
                    <div className="">
                        <div className="col-md-12">
                          <div className="col-md-12 text-center">
                              {/*<!-- <span className="">Sign up with  <a href="#" style="text-decoration: underline;">facebook</a> or <a href="#" style="text-decoration: underline;">Google</a></span> -->*/}
                          </div>
                            <form className="form" id="signupmodal" onSubmit={this.submit}>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">email</i>
                                  </span>
                                  <div className="form-group">
                                  	<input 
                                      type="text" 
                                      className="form-control" 
                                      placeholder="Email..." 
                                      id="email"
                                      ref="email" 
                                    />
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">account_box</i>
                                  </span>
                                  <div className="form-group">
                                  	<input 
                                      type="text" 
                                      className="form-control" 
                                      placeholder="First Name" 
                                      id="fname"
                                      ref="fname"
                                      />
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">account_box</i>
                                  </span>
                                  <div className="form-group">
                                  	<input 
                                      type="text" 
                                      className="form-control" 
                                      placeholder="Last Name" 
                                      id="lname"
                                      ref="lname"
                                    />
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">lock_outline</i>
                                  </span>
                                  <div className="form-group">
                                  	<input 
                                      type="password" 
                                      placeholder="Password..." 
                                      className="form-control" 
                                      id="password"
                                      ref="password"
                                    />
                                  </div>
                              </div>
                              <div className="input-group">
                                  <span className="input-group-addon">
                                      <i className="material-icons">lock_outline</i>
                                  </span>
                                  <div className="form-group">
                                  	<input 
                                      type="password" 
                                      placeholder="Re-enter Password..." 
                                      className="form-control" 
                                      id="re_password"
                                      ref="re_password" 
                                    />
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
                            <button type="submit" form="signupmodal" className="btn btn-danger btn_sign_up" id="btn_sign_up" style={{width:'100%', marginTop: '20px'}}>Sign up</button>
                            <hr style={{marginTop: '10px', marginBottom: '5px'}}/>
                            <div className="col-md-12 text-center">
                                <span className="">Already a Skillshape Member?  <a onClick={this.props.logIn} className="btn btn-success btn-sm login" >Log in</a></span>
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