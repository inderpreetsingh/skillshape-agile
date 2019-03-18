import React from "react";
import { isEmpty, get } from "lodash";
import { createContainer } from "meteor/react-meteor-data";
import config from "/imports/config";
import School from "/imports/api/school/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import ClassType from "/imports/api/classType/fields";
import { EnrollmentPackagesDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import PackagesList from "/imports/ui/components/landing/components/class/packages/PackagesList.jsx";
import { withPopUp, emailRegex, stripePaymentHelper, normalizeMonthlyPricingData,handleSignUpSubmit,handleLoginFacebook,handleLoginGoogle } from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container";
import Events from "/imports/util/events";
import LoginDialogBox from "/imports/ui/components/landing/components/dialogs/LoginDialogBox.jsx";
import SignUpDialogBox from "/imports/ui/components/landing/components/dialogs/SignUpDialogBox.jsx";
import { openMailToInNewTab } from "/imports/util/openInNewTabHelpers";
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';

class SchoolPriceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState();
  }

  initializeState = () => {
    return {
      error: {},
      loginModal: false,
      loginModalTitle: "",
      email: "",
      password: "",
      loading: false,
      isLoading: false,
      errorText: null
    };
  };

  componentWillMount() {
    Events.on("loginAsUser", "123456", data => {
      this.handleLoginModalState(true, data);
    });
    Events.on("registerAsSchool", "123#567", data => {
      let { userType, userEmail, userName } = data;

      //debugger;
      this.handleSignUpDialogBoxState(true, userType, userEmail, userName);
    });

    // let { slug } = this.props.params;

    // Meteor.call('school.findSchoolById',slug,(err,res)=>{
    //   res&&this.setState({currency:res})
    // })
  }

  componentDidUpdate() {
    // Get height of document
    function getDocHeight(doc) {
      doc = doc || document;
      // from http://stackoverflow.com/questions/1145850/get-height-of-entire-document-with-javascript
      var body = doc.body,
        html = doc.documentElement;
      var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      return doc.getElementById("UserMainPanel").offsetHeight;
    }
    // send docHeight onload
    function sendDocHeightMsg(e) {
      setTimeout(() => {
        var ht = getDocHeight();
        parent.postMessage(
          JSON.stringify({ docHeight: ht, iframeId: "ss-school-price-view" }),
          "*"
        );
      }, 3000);
    }
    // assign onload handler
    sendDocHeightMsg();
    // if (window.addEventListener) {
    //     window.addEventListener('load', sendDocHeightMsg, false);
    // } else if (window.attachEvent) { // ie8
    //     window.attachEvent('onload', sendDocHeightMsg);
    // }
  }

  handleSignUpDialogBoxState = (state, userType, userEmail, userName) => {
    this.setState({
      signUpDialogBox: state,
      userData: { userType: userType },
      userEmail: userEmail,
      userName: userName,
      errorText: null
    });
  };

  handleLoginModalState = value => {
    this.setState({ loginModal: value });
  };

  getClassName = classTypeId => {
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
  handlePurchasePackage = async (packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType
  ) => {
    try {
      stripePaymentHelper.call(this, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType);
    } catch (error) {
      console.log('Error in handlePurchasePackage', error);
    }
  };

  purchasedSuccessfully = () => {
    this.setState({ enrollmentPackagesDialog: false });
  }
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
      this.setState({ isLoading: true });
      Meteor.loginWithPassword(email, password, (err, res) => {
        stateObj.isLoading = false;
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
          openMailToInNewTab("/");
          // browserHistory.push();
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
      setTimeout(function () {
        browserHistory.push("/");
      }, 1000);
    }
  };

  


  reSendEmailVerificationLink = () => {
    this.setState({ loading: true });
    const { popUp } = this.props;
    Meteor.call(
      "user.sendVerificationEmailLink",
      this.state.email,
      (err, res) => {
        if (err) {
          let errText = err.reason || err.message;
          popUp.appear("alert", { content: errText });
        }
        if (res) {
          this.setState(
            {
              loginModal: false,
              loading: false
            },
            () => {
              popUp.appear("success", {
                content:
                  "We send a email verification link, Please check your inbox!"
              });
            }
          );
        }
      }
    );
  };

  handleSignUpModal = userType => {
    this.setState({ joinModal: false }, () => {
      Events.trigger("registerAsSchool", { userType });
    });
  };
  unsetError = () => this.setState({ errorText: null });




  render() {
    const {
      classPricing,
      monthlyPricing,
      enrollmentFee,
      schoolId,
      currency
    } = this.props;
    const { isBusy} = this.state;
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
            fullScreen={false}
            title={
              "In order to make a purchase, you must Create an account or log into SkillShape."
            }
          />
        )}
        {
          this.state.enrollmentPackagesDialog &&
          <EnrollmentPackagesDialogBox
            open={this.state.enrollmentPackagesDialog}
            schoolId={schoolId}
            onAddToCartIconButtonClick={this.handlePurchasePackage}
            onModalClose={() => {
              this.setState(state => {
                return {
                  ...state,
                  enrollmentPackagesDialog: false,
                  selectedClassTypeIds: null
                }
              })
            }}
            classTypeIds={this.state.selectedClassTypeIds}
            epData={this.state.epData}
            currentPackageData={this.state.currentPackageData}
          />
        }
        {this.state.signUpDialogBox && (
          <SignUpDialogBox
            open={this.state.signUpDialogBox}
            onSubmit={(payload, event) => { handleSignUpSubmit.call(this, payload, event) }}
            errorText={this.state.errorText}
            unsetError={this.unsetError}
            userName={this.state.userName}
            userEmail={this.state.userEmail}
            onSignUpWithGoogleButtonClick={() => { handleLoginGoogle.call(this) }}
            onSignUpWithFacebookButtonClick={() => { handleLoginFacebook.call(this) }}
            isBusy={isBusy}
          />
        )}

        {(!isEmpty(enrollmentFee) || !isEmpty(classPricing) || !isEmpty(monthlyPricing)) ?
          <PackagesList
            schoolId={schoolId}
            onAddToCartIconButtonClick={this.handlePurchasePackage}
            variant="light"
            enrollMentPackages
            enrollMentPackagesData={enrollmentFee}
            perClassPackagesData={classPricing}
            monthlyPackagesData={normalizeMonthlyPricingData(monthlyPricing)}
            currency={currency}
          />
          :
          <Text align="center">This School haven't published any pricing information yet.</Text>
        }
      </div>
    );
  }
}

export default createContainer(props => {
  const { slug } = props.params;
  let schoolData, schoolId, currency;
  userBySchoolSubscription = Meteor.subscribe("UserSchoolbySlug", slug);
  if (userBySchoolSubscription.ready()) {
    schoolData = School.findOne({ slug: slug });
    schoolId = schoolData && schoolData._id;
    currency =
      schoolData && schoolData.currency
        ? schoolData.currency
        : config.defaultCurrency;
  }
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
    schoolId: schoolId,
    currency: currency
  };
}, withPopUp(SchoolPriceView));
