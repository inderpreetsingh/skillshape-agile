import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import SchoolViewBase from "./schoolViewBase";
import SchoolViewRender from "./schoolViewRender";
import SchoolViewNewRender from "./schoolViewNewRender";
import styles from "./style";
import { withStyles } from "/imports/util";

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import SLocation from "/imports/api/sLocation/fields";
import School from "/imports/api/school/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import Reviews from "/imports/api/review/fields";
import { withPopUp } from "/imports/util";
import config from "/imports/config";
import ClassTimes from "/imports/api/classTimes/fields";

class SchoolView extends SchoolViewBase {
  constructor(props) {
    super(props);
    this.state = {
      isPublish: true,
      bestPriceDetails: null,
      isLoading: false,
      seeMoreCount: 4,
      type: "both",
      classTimesData: [],
      myClassTimes: [],
      manageAll: true,
      attendAll: true,
      currency:null,
      filter: {
        classTimesIds: [],
        classTimesIdsForCI: []
      }
    };
  }
  componentWillMount() {
    // let { slug } = this.props.params;
    // Meteor.call('school.findSchoolById',slug,(err,res)=>{
    //   res && this.setState({currency:res})
    // })
  }
  handleSeeMore = () => {
    // Attach count with skill cateory name so that see more functionlity can work properly.
    let currentCount = this.state.seeMoreCount;
    this.setState({ seeMoreCount: config.seeMoreCount + currentCount });
  };
  componentDidUpdate = () => {
    document.title =
      this.props.schoolData && this.props.schoolData.name.toLowerCase();
  };

  render() {
    
    // if(this.props.route.name === 'SchoolViewDeveloping') {
    return SchoolViewNewRender.call(this, this.props, this.state);
    // }
    // return SchoolViewRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  let { schoolId, slug } = props.params;
  let schoolData;
  let reviewsData;
  let classPricing;
  let monthlyPricing;
  let schoolLocation;
  let classType;
  let enrollmentFee;
  let showLoading = true;
  let subscription;
  let reviewsSubscriptions;
  let classTimesData;
  let currency;

  if (slug) {
    subscription = Meteor.subscribe("UserSchoolbySlug", slug);
    // Meteor.subsc/ribe("SkillClassbySchoolBySlug", slug)
  }

  if (subscription && subscription.ready()) {
    // showLoading = false;
    schoolData = School.findOne({ slug: slug });
    schoolId = schoolData && schoolData._id;
    reviewsSubscriptions = Meteor.subscribe("review.getReviews", {
      reviewForId: schoolId
    });
    currency = schoolData && schoolData.currency ? schoolData.currency : config.defaultCurrency;
  }

  const sub1 = reviewsSubscriptions && reviewsSubscriptions.ready();
  const sub2 = subscription && subscription.ready();

  if (sub1 && sub2) {
    showLoading = false;
  }

  if (schoolId) {
    Meteor.subscribe("UserSchool", schoolId);
    Meteor.subscribe("SkillClassbySchool", schoolId);
    Meteor.subscribe("ClaimOrder", "");
    Meteor.subscribe("location.getSchoolLocation", { schoolId });
    Meteor.subscribe("classTypeBySchool", schoolId);
    Meteor.subscribe("classPricing.getClassPricing", { schoolId });
    Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId });
    Meteor.subscribe("enrollmentFee.getEnrollmentFee", { schoolId });

    schoolData = School.findOne({ _id: schoolId });
    reviewsData = Reviews.find({ reviewForId: schoolId }).fetch();
    classPricing = ClassPricing.find({ schoolId: schoolId }).fetch();
    monthlyPricing = MonthlyPricing.find({ schoolId: schoolId }).fetch();
    schoolLocation = SLocation.find({ schoolId: schoolId }).fetch();
    classType = ClassType.find({ schoolId: schoolId }).fetch();
    enrollmentFee = EnrollmentFees.find({ schoolId }).fetch();
    // Class times subscription.
    let classTypeIds = classType && classType.map(data => data._id);
    Meteor.subscribe("classTimes.getclassTimesByClassTypeIds", {
      schoolId,
      classTypeIds
    });
    classTimesData = ClassTimes.find(
      { schoolId },
      { sort: { _id: -1 } }
    ).fetch();
  }

  return {
    ...props,
    schoolData,
    reviewsData,
    classPricing,
    monthlyPricing,
    schoolLocation,
    enrollmentFee,
    classType,
    schoolId,
    showLoading,
    classTimesData,
    currency
  };
}, withStyles(styles)(withPopUp(SchoolView)));
