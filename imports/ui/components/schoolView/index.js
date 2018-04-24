import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import SchoolViewBase from './schoolViewBase';
import SchoolViewRender from './schoolViewRender';
import SchoolViewNewRender from './schoolViewNewRender';
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
import { toastrModal } from '/imports/util';
import config from '/imports/config';
import ClassTimes from "/imports/api/classTimes/fields";

class SchoolView extends SchoolViewBase {

    constructor(props) {
        super(props);
        this.state = {
            isPublish: true,
            bestPriceDetails: null,
            isLoading:false,
            seeMoreCount:4,
            type: "both",
            classTimesData: [],
            myClassTimes: [],
            manageAll: true,
            attendAll: true,
            filter: {
                classTimesIds: [],
                classTimesIdsForCI: [],
            },
        }
    }

    handleSeeMore = () => {
      // Attach count with skill cateory name so that see more functionlity can work properly.
      console.log("handleSeeMore");
      let currentCount = this.state.seeMoreCount;
      this.setState({seeMoreCount:(config.seeMoreCount + currentCount)})
    }
    render() {
        console.log(this.props,'This . route . location name school view render..');
        // if(this.props.route.name === 'SchoolViewDeveloping') {
          return SchoolViewNewRender.call(this, this.props, this.state);
        // }
        // return SchoolViewRender.call(this, this.props, this.state);
    }
}

export default createContainer(props => {
    let { schoolId, slug } = props.params
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

    if (slug) {
        subscription = Meteor.subscribe("UserSchoolbySlug", slug);
        // Meteor.subsc/ribe("SkillClassbySchoolBySlug", slug)
    }

    if(subscription && subscription.ready()) {
      // showLoading = false;
      schoolData = School.findOne({ slug: slug })
      schoolId = schoolData && schoolData._id;
      reviewsSubscriptions = Meteor.subscribe('review.getReviews',{reviewForId: schoolId});
    }

    const sub1 = reviewsSubscriptions && reviewsSubscriptions.ready();
    const sub2 = subscription && subscription.ready();

    if(sub1 && sub2) {
      showLoading = false;
    }

    if (schoolId) {
      Meteor.subscribe("UserSchool", schoolId);
      Meteor.subscribe("SkillClassbySchool", schoolId);
      Meteor.subscribe("ClaimOrder", "");
      Meteor.subscribe("location.getSchoolLocation", { schoolId });
      Meteor.subscribe("classTypeBySchool", schoolId);
      Meteor.subscribe("classPricing.getClassPricing", { schoolId })
      Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId })
      Meteor.subscribe("enrollmentFee.getEnrollmentFee", {schoolId});

      schoolData = School.findOne({ _id: schoolId })
      reviewsData = Reviews.find({reviewForId: schoolId}).fetch();
      classPricing = ClassPricing.find({ schoolId: schoolId }).fetch()
      monthlyPricing = MonthlyPricing.find({ schoolId: schoolId }).fetch()
      schoolLocation = SLocation.find({ schoolId: schoolId }).fetch()
      classType = ClassType.find({ schoolId: schoolId }).fetch();
      enrollmentFee = EnrollmentFees.find({schoolId}).fetch();
      // Class times subscription.
      let classTypeIds = classType && classType.map((data) => data._id);
      Meteor.subscribe("classTimes.getclassTimesByClassTypeIds", { schoolId, classTypeIds });
      classTimesData = ClassTimes.find({ schoolId }, { sort: { _id: -1 } }).fetch();
    }

    // console.log("SchoolView schoolData--->>", schoolData)
    // console.log("SchoolView classType--->>", classType)
    // console.log("SchoolView classPricing--->>", classPricing)
    // console.log("SchoolView monthlyPricing--->>", monthlyPricing)
    // console.log("SchoolView schoolLocation--->>", schoolLocation)
    return { ...props,
        schoolData,
        reviewsData,
        classPricing,
        monthlyPricing,
        schoolLocation,
        enrollmentFee,
        classType,
        schoolId,
        showLoading,
        classTimesData
    };
},withStyles(styles)(toastrModal(SchoolView)))
