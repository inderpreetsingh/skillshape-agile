import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import isEmpty from "lodash/isEmpty";
import School from '/imports/api/school/fields';
import ClassPricing from '/imports/api/classPricing/fields';
import ClassType from '/imports/api/classType/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import EnrollmentFees from '/imports/api/enrollmentFee/fields';
import PackagesList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';
import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container';
import Events from '/imports/util/events';
import LoginDialogBox from '/imports/ui/components/landing/components/dialogs/LoginDialogBox.jsx';

class SchoolPriceView extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {
      isLoading: false,
      loginModal: false,
      loginModalTitle: '',
    }
  }

  componentWillMount() {
    Events.on("loginAsUser", "123456", (data) => {
        console.log("loginAsUser========>",data)
        this.handleLoginModalState(true, data);
    })
  }

  handleLoginModalState = (value) => {
    this.setState({loginModal: value});
  }

  getClassName = (classTypeId) => {
    console.log("SchoolPriceView getClassName classTypeId-->>",classTypeId)
    if(_.isArray(classTypeId)) {
      let str_name = []
      // let classTypeIds = classTypeId.split(",")
      let classTypeList = ClassType.find({_id:{$in:classTypeId}}).fetch();
      classTypeList.map((a) => { str_name.push(a.name)})
      return str_name.join(",")
    } else {
      return ""
    }
  }

   handlePurcasePackage = (typeOfTable, tableId, schoolId) => {
        // Start loading
        console.log(typeOfTable, tableId, schoolId);
        const { toastr } = this.props;
        let self = this;
        if (Meteor.userId()) {
            this.setState({ isLoading: true });
            Meteor.call(
                "packageRequest.addRequest", {
                    typeOfTable: typeOfTable,
                    tableId: tableId,
                    schoolId: schoolId
                },
                (err, res) => {
                    // Stop loading
                    self.setState({ isLoading: false });
                    if (err) {
                        toastr.error(
                            err.reason || err.message,
                            "Error"
                        );
                    } else {
                        // Show confirmation to user that purchase request has been created.
                        console.log("result----------------", res);
                        toastr.success(
                            res,
                            "Success"
                        );
                    }
                }
            );
        } else {
            Events.trigger("loginAsUser");
        }
    }

  normalizeMonthlyPricingData = (monthlyPricingData) => {
      if(monthlyPricingData) {
        let normalizedMonthlyPricingData = [];

        for(let monthlyPricingObj of monthlyPricingData) {
            monthlyPricingObj.pymtDetails.forEach(payment => {
              const myMonthlyPricingObj = Object.assign({},monthlyPricingObj);
              myMonthlyPricingObj.pymtDetails = [];
              myMonthlyPricingObj.pymtDetails.push(payment);
              normalizedMonthlyPricingData.push(myMonthlyPricingObj);
            });
        }

        return normalizedMonthlyPricingData;
      }else{
        return monthlyPricingData;
      }
    }

  render() {
    // console.log("SchoolPriceView props-->>",this.props);
    // console.log("ClassPriceTable props-->>",ClassPriceTable);
    // console.log("MonthlyPriceTable props-->>",MonthlyPriceTable);
    const { classPricing, monthlyPricing , enrollmentFee, schoolId} = this.props;
    return (
        <div className="wrapper">
            {
            this.state && this.state.isLoading && <ContainerLoader />
          }
          {
            this.state.loginModal  &&
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
            }
           {(isEmpty(classPricing) && isEmpty(monthlyPricing)) ?
                  '' :
                  <PackagesList
                    schoolId={schoolId}
                    onAddToCartIconButtonClick={this.handlePurcasePackage}
                    enrollMentPackages
                    enrollMentPackagesData={enrollmentFee}
                    perClassPackagesData={classPricing}
                    monthlyPackagesData={this.normalizeMonthlyPricingData(monthlyPricing)}
                  />
                }
        </div>
    )
  }
}

export default createContainer(props => {
    const { slug } = props.params;

    Meteor.subscribe("UserSchoolbySlug", slug);

    const schoolData = School.findOne({slug: slug})
    const schoolId = schoolData && schoolData._id

    Meteor.subscribe("classPricing.getClassPricing", {schoolId})
    Meteor.subscribe("monthlyPricing.getMonthlyPricing", {schoolId})
    Meteor.subscribe("enrollmentFee.getEnrollmentFee", {schoolId});
    const classPricing = ClassPricing.find({schoolId: schoolId}).fetch()
    const monthlyPricing = MonthlyPricing.find({schoolId: schoolId}).fetch()
    const enrollmentFee = EnrollmentFees.find({schoolId}).fetch();

    return { ...props,
        schoolData,
        classPricing,
        monthlyPricing,
        enrollmentFee,
        schoolId: schoolId
    }
}, toastrModal(SchoolPriceView))