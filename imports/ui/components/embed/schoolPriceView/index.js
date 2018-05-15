import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import { isEmpty, get } from 'lodash';

import School from "/imports/api/school/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import ClassType from "/imports/api/classType/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import PackagesList from "/imports/ui/components/landing/components/class/packages/PackagesList.jsx";
import { toastrModal, emailRegex } from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container";
import Events from "/imports/util/events";
import LoginDialogBox from "/imports/ui/components/landing/components/dialogs/LoginDialogBox.jsx";
import SignUpDialogBox from '/imports/ui/components/landing/components/dialogs/SignUpDialogBox.jsx';

class SchoolPriceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState();
  }

  initializeState = ()=> {
        return {
          error: {},
          loginModal : false,
          loginModalTitle: '',
          email: "",
          password: "",
          loading: false,
          isLoading: false,
        }
    }

  componentWillMount() {
    Events.on("loginAsUser", "123456", data => {
      console.log("loginAsUser========>", data);
      this.handleLoginModalState(true, data);
    });
    Events.on("registerAsSchool", "123#567",(data) => {
      let {userType, userEmail, userName} = data;
      console.info(userType,userEmail);
      console.info("userType, userEmail, userName",userType, userEmail, userName);
      //debugger;
      this.handleSignUpDialogBoxState(true, userType, userEmail, userName);
    })
  }

  handleSignUpDialogBoxState = (state, userType, userEmail, userName) => {
    this.setState({signUpDialogBox: state, userData: { userType: userType}, userEmail: userEmail, userName: userName, errorText: null});
  }

  handleLoginModalState = value => {
    this.setState({ loginModal: value });
  };

  getClassName = classTypeId => {
    console.log("SchoolPriceView getClassName classTypeId-->>", classTypeId);
    if (_.isArray(classTypeId)) {
      let str_name = [];
      // let classTypeIds = classTypeId.split(",")
      let classTypeList = ClassType.find({ _id: { $in: classTypeId } }).fetch();
      classTypeList.map(a => {
        str_name.push(a.name);
      });
      return str_name.join(",");
    } else {
      return "";
    }
  };

  handlePurcasePackage = (typeOfTable, tableId, schoolId) => {
    // Start loading
    console.log(typeOfTable, tableId, schoolId);
    const { toastr } = this.props;
    let self = this;
    if (Meteor.userId()) {
      this.setState({ isLoading: true });
      Meteor.call(
        "packageRequest.addRequest",
        {
          typeOfTable: typeOfTable,
          tableId: tableId,
          schoolId: schoolId
        },
        (err, res) => {
          // Stop loading
          self.setState({ isLoading: false });
          if (err) {
            toastr.error(err.reason || err.message, "Error");
          } else {
            // Show confirmation to user that purchase request has been created.
            console.log("result----------------", res);
            toastr.success(res, "Success");
          }
        }
      );
    } else {
      Events.trigger("loginAsUser");
    }
  };

  normalizeMonthlyPricingData = monthlyPricingData => {
    if (monthlyPricingData) {
      let normalizedMonthlyPricingData = [];

      for (let monthlyPricingObj of monthlyPricingData) {
        monthlyPricingObj.pymtDetails.forEach(payment => {
          const myMonthlyPricingObj = Object.assign({}, monthlyPricingObj);
          myMonthlyPricingObj.pymtDetails = [];
          myMonthlyPricingObj.pymtDetails.push(payment);
          normalizedMonthlyPricingData.push(myMonthlyPricingObj);
        });
      }

      return normalizedMonthlyPricingData;
    } else {
      return monthlyPricingData;
    }
  };

  handleLoginModalState = (state, data) => {
    let stateObj = this.initializeState();
    stateObj.loginModal = state;
    if (data) {
      stateObj.loginModalTitle = data.loginModalTitle || "";
      stateObj.email = data.email || "";
      stateObj.redirectUrl = data.redirectUrl;
    }
    this.setState(stateObj);
  };



  handleInputChange = (inputName, event) => {
    if (inputName === "email") {
      const { error } = this.state;
      const email = event.target.value;
      error.email = false;
      if (!emailRegex.email.test(email)) {
        error.email = true;
      }
      this.setState({ error, email });
    } else if (inputName === "password") {
      this.setState({ password: event.target.value });
    }
  };

  onSignInButtonClick = event => {
    event.preventDefault();
    let redirectUrl;
    const { email, password } = this.state;
    let stateObj = { ...this.state };

    if (this.state.redirectUrl) {
      redirectUrl = this.state.redirectUrl;
    }

    if (email && password) {
      this.setState({ loading: true });
      Meteor.loginWithPassword(email, password, (err, res) => {
        stateObj.loading = false;
        if (err) {
          stateObj.error.message = err.reason || err.message;
        } else {
          stateObj.error = {};
          let emailVerificationStatus = get(
            Meteor.user(),
            "emails[0].verified",
            false
          );

          if (!emailVerificationStatus) {
            Meteor.logout();
            stateObj.showVerficationLink = true;
            stateObj.error.message = "Please verify email first. ";
          } else {
            stateObj.loginModal = false;
          }
          /*Admin of school was not login while clicking on `No, I will manage the school`
                    so in this case we need to redirect to school admin page that we are getting in query params*/
          if (redirectUrl) {
            browserHistory.push(redirectUrl);
          } else {
            browserHistory.push("/");
          }
        }
        this.setState(stateObj);
      });
    } else {
      stateObj.error.message = "Enter Password";
      if (!email) {
        stateObj.error.message = "Enter Email Address";
      }
      this.setState(stateObj);
    }
  };

  isLogin = () => {
    // check for user login or not
    if (isEmpty(this.props.currentUser)) {
      this.handleLoginModalState(true);
    } else {
      Meteor.logout();
      setTimeout(function() {
        browserHistory.push("/");
      }, 1000);
    }
  };

  handleLoginGoogle = () => {
    let self = this;
    this.setState({ loading: true });
    Meteor.loginWithGoogle({}, function(err, result) {
      let modalObj = {
        loginModal: false,
        loading: false,
        error: {}
      };
      if (err) {
        modalObj.error.message = err.reason || err.message;
        modalObj.loginModal = true;
      }
      self.setState(modalObj);
    });
  };

  handleLoginFacebook = () => {
    let self = this;
    this.setState({ loading: true });
    Meteor.loginWithFacebook(
      {
        requestPermissions: ["user_friends", "public_profile", "email"]
      },
      function(err, result) {
        let modalObj = {
          loginModal: false,
          loading: false,
          error: {}
        };
        if (err) {
          modalObj.error.message = err.reason || err.message;
          modalObj.loginModal = true;
        }
        self.setState(modalObj);
      }
    );
  };

  handleSignUpModal = () => {
    console.log("handleSignUpModal!!!");
  };

  reSendEmailVerificationLink = () => {
    this.setState({ loading: true });
    Meteor.call(
      "user.sendVerificationEmailLink",
      this.state.email,
      (err, res) => {
        if (err) {
          let errText = err.reason || err.message;
          toastr.error(errText, "Error");
        }
        if (res) {
          this.setState(
            {
              loginModal: false,
              loading: false
            },
            () => {
              this.props.toastr.success(
                "We send a email verification link, Please check your inbox!!",
                "success"
              );
            }
          );
        }
      }
    );
  };

  handleSignUpModal = (userType)=> {
        this.setState({joinModal: false},()=> {
            Events.trigger("registerAsSchool",{userType})
        });
    }

  render() {
    console.log("SchoolPriceView props-->>",this);
    // console.log("ClassPriceTable props-->>",ClassPriceTable);
    // console.log("MonthlyPriceTable props-->>",MonthlyPriceTable);
    const {
      classPricing,
      monthlyPricing,
      enrollmentFee,
      schoolId
    } = this.props;
    return (
      <div className="wrapper">
        {this.state && this.state.isLoading && <ContainerLoader />}
        {this.state.loginModal && (
          <LoginDialogBox
            {...this.state}
            open={this.state.loginModal}
            title={this.state.loginModalTitle}
            onModalClose={() => this.handleLoginModalState(false)}
            handleInputChange={this.handleInputChange}
            onSignInButtonClick={this.onSignInButtonClick}
            onSignUpButtonClick={this.handleSignUpModal}
            onSignUpWithGoogleButtonClick={this.handleLoginGoogle}
            onSignUpWithFacebookButtonClick={this.handleLoginFacebook}
            reSendEmailVerificationLink={this.reSendEmailVerificationLink}
          />
        )}
        {
          this.state.signUpDialogBox &&
          <SignUpDialogBox
              open={this.state.signUpDialogBox}
              onModalClose={() => this.handleSignUpDialogBoxState(false)}
              onSubmit={this.handleSignUpSubmit}
              errorText={this.state.errorText}
              unsetError={this.unsetError}
              userName={this.state.userName}
              userEmail={this.state.userEmail}
              onSignUpWithGoogleButtonClick={this.handleLoginGoogle}
              onSignUpWithFacebookButtonClick={this.handleLoginFacebook}

          />
        }
        {isEmpty(classPricing) && isEmpty(monthlyPricing) ? (
          ""
        ) : (
          <PackagesList
            schoolId={schoolId}
            onAddToCartIconButtonClick={this.handlePurcasePackage}
            enrollMentPackages
            enrollMentPackagesData={enrollmentFee}
            perClassPackagesData={classPricing}
            monthlyPackagesData={this.normalizeMonthlyPricingData(
              monthlyPricing
            )}
          />
        )}
      </div>
    );
  }
}

export default createContainer(props => {
  const { slug } = props.params;

  Meteor.subscribe("UserSchoolbySlug", slug);

  const schoolData = School.findOne({ slug: slug });
  const schoolId = schoolData && schoolData._id;

  Meteor.subscribe("classPricing.getClassPricing", { schoolId });
  Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId });
  Meteor.subscribe("enrollmentFee.getEnrollmentFee", { schoolId });
  const classPricing = ClassPricing.find({ schoolId: schoolId }).fetch();
  const monthlyPricing = MonthlyPricing.find({ schoolId: schoolId }).fetch();
  const enrollmentFee = EnrollmentFees.find({ schoolId }).fetch();

  return {
    ...props,
    schoolData,
    classPricing,
    monthlyPricing,
    enrollmentFee,
    schoolId: schoolId
  };
}, toastrModal(SchoolPriceView));
