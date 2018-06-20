import React from "react";
import ReactDOM from "react-dom";
import { checkSuperAdmin, createMarkersOnMap } from "/imports/util";
import Events from "/imports/util/events";
import { capitalizeString } from "/imports/util";
import { browserHistory, Link } from "react-router";
// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import SLocation from "/imports/api/sLocation/fields";
import { Loading } from "/imports/ui/loading";
import { openMailToInNewTab } from "/imports/util/openInNewTabHelpers";
import { isEmpty } from "lodash";
import { getUserFullName } from "/imports/util/getUserData";

export default class SchoolViewBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let { slug } = this.props.params;
    Meteor.call("school.getBestPrice", { slug }, (error, result) => {
      this.setState({ bestPriceDetails: result });
    });
  }

  componentDidUpdate() {
    if (
      !_.isEmpty(this.props.schoolLocation) &&
      this.props.route.name !== "SchoolViewDeveloping"
    ) {
      createMarkersOnMap("schoolLocationMap", this.props.schoolLocation);
    }
  }

  validateString = value => {
    if (value) return value;
    return "";
  };

  // checkUserAccess = (currentUser,schoolId) => {
  //   return checkMyAccess({user: currentUser,schoolId});
  // }

  handleGiveReview = () => {
    const { toastr } = this.props;
    if (Meteor.userId()) {
      this.handleDialogState("giveReviewDialog", true);
    } else {
      this.handleDefaultDialogBox("Login to give review", true);
    }
  };

  getReviewTitle = name => {
    return `Give review for ${capitalizeString(name)}`;
  };

  handleDialogState = (dialogName, state) => {
    const currentState = { ...this.state };
    currentState[dialogName] = state;
    this.setState(currentState);
  };

  handleDefaultDialogBox = (title, state) => {
    const newState = {
      ...state,
      defaultDialogBoxTitle: title,
      nonUserDefaultDialog: state
    };
    this.setState(newState);
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

  claimASchool = (currentUser, schoolData) => {
    if (currentUser) {
      setTimeout(() => {
        if (checkSuperAdmin(currentUser)) {
        } else {
          if (
            currentUser.profile &&
            currentUser.profile.schoolId &&
            currentUser.profile.schoolId.length > 1
          ) {
            toastr.error(
              "You already manage a school. You cannot claim another School. Please contact admin for more details",
              "Error"
            );
          } else {
            let claimRequest = ClaimRequest.find().fetch();
            if (claimRequest && claimRequest.length > 0) {
              toastr.info(
                "We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.",
                ""
              );
              return;
            }
            if (schoolData.claimed == "Y") {
              this.setState({ claimRequestModal: true });
              // show modal over here
              return;
            } else {
              this.setState({ claimSchoolModal: true });
              return;
              // show modal over here
            }
          }
        }
      }, 1000);
    } else {
      toastr.error(
        "Please register yourself as an individual member before claiming your school",
        "Error"
      );
      Meteor.setTimeout(() => {
        Events.trigger("join_school", {
          studentRegister: false,
          schoolRegister: true
        });
      }, 1000);
    }
  };

  claimBtnCSS = (currentUser, claimed) => {
    if (
      currentUser &&
      currentUser.profile &&
      currentUser.profile.schoolId &&
      currentUser.profile.schoolId.length > 1
    ) {
      return "btn-default";
    } else if (claimed == "Y") {
      return "btn-danger";
    } else {
      return "btn-success";
    }
  };

  getClassImageUrl = (classType, classImagePath) => {
    let image = ClassType.findOne({ _id: classType }).classTypeImg;
    if (image && image.length) {
      return image;
    } else if (classImagePath && classImagePath.length > 1) {
      return classImagePath;
    } else {
      return "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
    }
  };

  viewSchedule = skillclass => {
    let str = "";
    if (skillclass.isRecurring == "true" && skillclass.repeats) {
      let repeats = JSON.parse(skillclass.repeats);
      let repeat_details = repeats.repeat_details || [];
      str = "Start from " + repeats.start_date + "</br>";
      for (let i = 0; i < repeat_details.length; i++) {
        const classLocation = SLocation.findOne({
          _id: repeat_details[i].location
        });
        str +=
          "<b>" +
          repeat_details[i].day +
          "</b> " +
          repeat_details[i].start_time +
          " to " +
          repeat_details[i].end_time +
          " at " +
          this.validateString(classLocation.neighbourhood) +
          ", " +
          classLocation.city +
          "</br>";
      }
    } else {
      const classLocation = SLocation.findOne({ _id: skillclass.locationId });
      str =
        "Start from " +
        this.validateString(skillclass.plannedStart) +
        "  to " +
        this.validateString(skillclass.plannedEnd) +
        "</br>" +
        this.validateString(skillclass.planEndTime) +
        " to " +
        this.validateString(skillclass.planStartTime) +
        " at " +
        this.validateString(classLocation.neighbourhood) +
        ", " +
        classLocation.city;
    }
    return str;
  };

  getClassPrice = classTypeId => {
    const classPrice = ClassPricing.findOne({
      classTypeId: { $regex: "" + classTypeId + "", $options: "i" }
    });
    if (classPrice && classPrice.cost) {
      return `$${classPrice.cost}/Month`;
    }
    return "";
  };

  getClassName = classTypeId => {
    console.log("getClassName classTypeId-->>", classTypeId);
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

  getImageMediaList = (mediaList, type) => {
    if (!mediaList) {
      return [];
    } else {
      let size = 1;
      let imageList = [];
      let return_list = [];

      if (type == "Image") {
        mediaList.map(a => {
          if (a && a.mediaType) {
            if (a.mediaType.toLowerCase() == "Image".toLowerCase()) {
              imageList.push(a);
            }
          }
        });
      } else {
        mediaList.map(a => {
          if (a && a.mediaType) {
            if (a.mediaType.toLowerCase() != "Image".toLowerCase()) {
              imageList.push(a);
            }
          }
        });
      }

      for (var i = 0; i < imageList.length; i += size) {
        var smallarray = imageList.slice(i, i + size);
        return_list.push({ item: smallarray });
      }
      return return_list;
    }
  };

  checkClaim = (currentUser, schoolId) => {
    if (
      currentUser &&
      currentUser.profile &&
      currentUser.profile.schoolId === schoolId
    )
      return false;
    return true;
  };

  getPublishStatus = isPublish => {
    if (isPublish) return true;
    return false;
  };

  handlePublishStatus = (schoolId, event) => {
    const { toastr } = this.props;
    if (schoolId) {
      let isPublish = event.target.checked;
      this.setState({ isLoading: true });

      Meteor.call(
        "school.publishSchool",
        { schoolId, isPublish },
        (error, result) => {
          this.setState({ isLoading: false }, _ => {
            if (error) {
              toastr.error(error.reason || error.message, "Error");
            }
            if (result) {
              let msg;
              if (isPublish) {
                msg =
                  "This School and all his Class Types of this has been published.";
              } else {
                msg =
                  "This School and all his Class Types of this has been unpublished.";
              }
              toastr.success(msg, "success");
            }
          });
        }
      );
    } else {
      toastr.error(
        "Something went wrong. Please try after sometime!!",
        "Error"
      );
    }
  };

  getClaimSchoolModalTitle = () => {
    const { claimSchoolModal, claimRequestModal, successModal } = this.state;
    if (claimSchoolModal) {
      return "Are you sure You Claim this school?";
    } else if (claimRequestModal) {
      return "This school is already claimed. Do you want to continue?";
    } else if (successModal) {
      return "Claim Status";
    }
  };

  modalClose = () => {
    this.setState({
      claimRequestModal: false,
      claimSchoolModal: false,
      successModal: false
    });
  };

  modalSubmit = () => {
    const { claimSchoolModal, claimRequestModal, successModal } = this.state;
    const { currentUser, schoolId, schoolData } = this.props;

    if (claimSchoolModal && currentUser && currentUser._id && schoolId) {
      Meteor.call(
        "school.claimSchool",
        currentUser._id,
        schoolId,
        (error, result) => {
          if (error) {
            console.error("error", error);
          }
          if (result) {
            // console.log("result", result);
            this.setState({ successModal: true, claimSchoolModal: false });
          }
        }
      );
    } else if (
      claimRequestModal &&
      currentUser &&
      currentUser._id &&
      schoolId &&
      schoolData
    ) {
      const payload = {
        userId: currentUser._id,
        schoolId: schoolId,
        currentUserId: schoolData.userId,
        schoolName: schoolData.name,
        Status: "new"
      };

      Meteor.call("addClaimRequest", payload, (error, result) => {
        console.log(e);
        if (error) {
          console.error("error", error);
        }
        if (result) {
          console.log("result", result);
          toastr.success(
            "You have requested to manage a school that has already been claimed. We will investigate this double claim and inform you as soon as a decision has been made. If you are found to be the rightful manager of the listing, you will be able to edit the school listing.",
            "Success"
          );
        }
      });
    } else if (successModal && schoolId) {
      this.setState({ successModal: false });
      browserHistory.push(`/schoolAdmin/${schoolId}/edit`);
    }
  };

  checkOwnerAccess = (currentUser, userId) => {
    if (currentUser) return currentUser._id == userId;
    return false;
  };

  checkForJoin = (currentUser, classId) => {
    if (currentUser && currentUser.profile && currentUser.profile.classIds)
      return currentUser.profile.classIds.includes(classId);
    return false;
  };

  scrollToTop = ref => {
    const node = ReactDOM.findDOMNode(ref);
    node.scrollIntoView({ behavior: "smooth" });
  };
  // ADDING A NEW FLOW FOR REQUEST PRICING
  // // This function is used to Open pricing info request Modal
  // handlePricingInfoRequestModal = () => {
  //   console.log("handlePricingInfoRequestModal")
  //     // Set state for opening Price info Request Modal.
  //     this.setState({
  //         showConfirmationModal: true,
  //     });
  // }

  getOurEmail = () => {
    return this.props.schoolData.email;
  };

  cancelConfirmationModal = () =>
    this.setState({ showConfirmationModal: false });

  handleRequest = (text = "pricing") => {
    const { toastr, schoolData } = this.props;

    if (!isEmpty(schoolData)) {
      let emailBody = "";
      let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
      let subject = "",
        message = "";
      let currentUserName = getUserFullName(Meteor.user());
      emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${
        text ? text : pricing
      }%3F %0D%0A%0D%0A Thanks`;
      const mailTo = `mailto:${this.getOurEmail()}?subject=${subject}&body=${emailBody}`;

      console.info(mailTo, "my mail To data.............");
      // const mailToNormalized = encodeURI(mailTo);
      // window.location.href = mailToNormalized;
      openMailToInNewTab(mailTo);
    }
  };

  handlePricingRequest = () => {
    const { toastr, schoolData } = this.props;
    if (!Meteor.userId()) {
      this.handleDialogState("manageRequestsDialog", true);
    } else {
      const data = {
        schoolId: schoolData._id
      };

      Meteor.call("pricingRequest.addRequest", data, schoolData, (err, res) => {
        this.setState({ isBusy: false }, () => {
          if (err) {
            toastr.error(err.reason || err.message, "Error", {}, false);
          } else if (res.message) {
            toastr.error(res.message, "Error");
          } else if (res) {
            toastr.success("Your request has been processed", "success");
            this.handleRequest("pricing");
          }
        });
      });
    }
  };

  // Request Pricing info using this function
  requestPricingInfo = schoolData => {
    this.setState({ showConfirmationModal: false });
    if (!isEmpty(schoolData)) {
      let emailBody = "";
      let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
      let subject = "",
        message = "";
      let currentUserName = getUserFullName(Meteor.user());
      emailBody = `Hi, %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend.%0D%0A%0D%0ACan you update your pricing%3F %0D%0A%0D%0A Thanks`;
      const mailTo = `mailto:${this.getOurEmail()}?subject=${subject}&body=${emailBody}`;
      const mailToNormalized = mailTo;
      // window.location.href = mailToNormalized;
      openMailToInNewTab(mailToNormalized);
    }
    // Close Modal and Do request for pricing info.
    // const { toastr } = this.props;
    // Meteor.call('school.requestPricingInfo',schoolData, (err,res)=> {
    //   // Check sucess method in response and send confirmation to user using a toastr.
    //     if(err) {
    //       toastr.error(err.reason || err.message, "Error")
    //     }
    //     if(res && res.emailSent) {
    //       toastr.success('Your request for pricing info has been sent. We will notify you when we will update Pricing for our school','success')
    //     }
    // });
  };

  // This is used to send purchase request email when user wants to purchase a package.
  handlePurcasePackage = (typeOfTable, tableId, schoolId) => {
    // Start loading

    console.log("handlePurchase Package called in schoolview");
    const { toastr } = this.props;
    let self = this;
    let schoolAccountConnected; // Needs to pay through card if school's stripe account is connected.
    if (schoolAccountConnected) {
      var handler = StripeCheckout.configure({
        key: Meteor.settings.public.stripe.PUBLIC_KEY,
        image: "https://stripe.com/img/documentation/checkout/marketplace.png",
        locale: "auto",
        token: function(token) {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          console.log("token id is", token);
          Meteor.call("chargeCard", token.id);
        }
      });

      // Open Checkout with further options:
      handler.open({
        name: "Stripe.com",
        description: "Skill",
        zipCode: true,
        amount: 2000
      });

      // Close Checkout on page navigation:
      window.addEventListener("popstate", function() {
        handler.close();
      });
    }

    // Meteor.setTimeout(() => {
    //   console.log("called the method handle purchase package",typeOfTable, tableId, schoolId);
    //   self.setState({
    //     isLoading: false
    //   })
    // },2000);

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

  checkForHtmlCode = data => {
    if (data && data != "<p><br></p>") {
      return true;
    }
    return false;
  };
}
