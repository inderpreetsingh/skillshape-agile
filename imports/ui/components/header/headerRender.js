import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';
import Signin from '/imports/ui/components/account/signin';
import Signup from '/imports/ui/components/account/signup';
import ForgotPassword from '/imports/ui/components/account/forgotPassword';
import { checkDemoUser } from '/imports/util';
import Button from 'material-ui/Button';
import Email from 'material-ui-icons/Email';

export default function() {
    const { currentUser } = this.props;

    return(
        <div>
          <Link to="/" style={{ textDecoration: 'none'}}>
            <Button color="contrast">
                    <i className="material-icons">home</i> Home
            </Button>
          </Link>
          <a style={{ textDecoration: 'none'}} onClick={this.openSignupModalWithRegisterationType.bind(this, true, false)} id="join_student" className="join_school cursor-lint" data-action="student">
            <Button color="contrast">
                    <i className="material-icons">person_add</i> Student Sign Up
            </Button>
          </a>
          <a style={{ textDecoration: 'none'}} onClick={this.openSignupModalWithRegisterationType.bind(this, false, true)} id="join_school" className="join_school cursor-lint" data-action="school">
            <Button color="contrast">
                    <i className="material-icons">school</i> Register a School
            </Button>
          </a>
          <Link style={{ textDecoration: 'none'}} to="/claimSchool">
            <Button color="contrast">
                    <i className="material-icons">check_box</i> Claim a School
            </Button>
          </Link>
          <Link style={{ textDecoration: 'none'}} to="/Contactus">
            <Button color="contrast">
                    <Email /> Contact Us
            </Button>
          </Link>
          <Link style={{ textDecoration: 'none'}} to="/Aboutus">
            <Button color="contrast">
                    <i className="material-icons">info</i> About Us
            </Button>
          </Link>
          <a style={{ textDecoration: 'none'}} onClick={this.openLogInModal} className="login cursor-lint">
            <Button color="contrast">
                    <i className="material-icons ">fingerprint</i> Login
            </Button>
          </a>
        </div>

    )



    return(
      <div>
      <nav className="navbar navbar-default" style={{marginBottom: '0px'}}>
        <div className="container-fluid">
        {
          currentUser ?
          (<div>
            <div className="navbar-minimize">
              <button id="minimizeSidebar" className="btn btn-round btn-white btn-fill btn-just-icon">
                  <i className="material-icons visible-on-sidebar-regular">more_vert</i>
                  <i className="material-icons visible-on-sidebar-mini">view_list</i>
              </button>
            </div>
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                {
                  checkDemoUser(currentUser) &&
                    <a className="cust-brand" href="/school">
                      <img src="/images/YourStudio.png" alt="logo" width="150"/>
                      {/*<!-- <span className="brand-text text-warning" style="font-weight: 900;font-size: 20px;">Fitness<span> Studio</span></span> -->*/}
                    </a>
                }
            </div>
          </div>)
          : (<div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <Link className="brand" to="/">
              <img src="/images/logo-location.png" alt="logo" width="52"/>
            </Link>
            </div>)
        }
        <div className="collapse navbar-collapse">
                {
                  currentUser ?
                    ( <ul className="nav navbar-nav navbar-right">
                        <li className="logout">
                          <a onClick={this.logOut}>
                            <i className="material-icons ">exit_to_app</i>Logout
                          </a>
                        </li>
                     </ul>
                    )
                    : ( <ul className="nav navbar-nav navbar-right">
                      <li>
                        <Link to="/">
                            <i className="material-icons">home</i> Home
                        </Link>
                    </li>
                    <li className="">
                        <a onClick={this.openSignupModalWithRegisterationType.bind(this, true, false)} id="join_student" className="join_school cursor-lint" data-action="student">
                            <i className="material-icons">person_add</i> Student Sign Up
                        </a>
                    </li>
                    <li className="">
                        <a onClick={this.openSignupModalWithRegisterationType.bind(this, false, true)} id="join_school" className="join_school cursor-lint" data-action="school">
                            <i className="material-icons">school</i> Register a School
                        </a>
                    </li>
                    <li>
                        <Link to="/claimSchool">
                            <i className="material-icons">check_box</i> Claim a School
                        </Link>
                    </li>
                    <li>
                        <Link to="/Contactus">
                            <i className="material-icons">email</i> Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link to="/Aboutus">
                            <i className="material-icons">info</i> About Us
                        </Link>
                    </li>
                    <li className="">
                        <a onClick={this.openLogInModal} className="login cursor-lint">
                            <i className="material-icons ">fingerprint</i> Login
                        </a>
                    </li>
                  </ul>
                  )
                }
            {
              currentUser && (
                <form className="navbar-form navbar-right" role="search">
                    <div className="form-group form-search is-empty">
                        <input type="text" className="form-control" placeholder="Search" id="searchParams"/>
                        <span className="material-input"></span>
                    </div>
                    <button type="button" className="btn btn-white btn-round btn-just-icon" id="btnTextSearch">
                        <i className="material-icons">search</i>
                        <div className="ripple-container"></div>
                    </button>
                </form>
              )
            }
        </div>
      </div>
    </nav>
    { this.state.showSignupModal && <Signup
        onClose={this.closeModal}
        schoolRegister={this.state.schoolRegister}
        studentRegister={this.state.studentRegister}
        openSignupModal={this.openSignupModalWithRegisterationType}
        logIn={this.openLogInModal}
      />
    }
    { this.state.showSigninModal && <Signin
        onClose={this.closeModal}
        openSignupModal={this.openSignupModalWithRegisterationType}
        showForgotPasswordModal={this.openForgotPasswordModal}
      />
    }
    {
      this.state.showForgotPasswordModal && <ForgotPassword
        onClose={this.closeModal}
        logIn={this.openLogInModal}
        openSignupModal={this.openSignupModalWithRegisterationType}
      />
    }
    </div>
    )
  }