import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import SchoolViewBase from './schoolViewBase';
import SchoolViewRender from './schoolViewRender';
import styles from "./style";
import { withStyles } from "/imports/util";

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import SLocation from "/imports/api/sLocation/fields";
import School from "/imports/api/school/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import { toastrModal } from '/imports/util';
import config from '/imports/config';


class SchoolView extends SchoolViewBase {

    constructor(props) {
        super(props);
        this.state = {
            isPublish: true,
            bestPriceDetails: null,
            isLoading:false,
            seeMoreCount:4
        }
    }

    handleSeeMore = () => {
      // Attach count with skill cateory name so that see more functionlity can work properly.
      console.log("handleSeeMore");
      let currentCount = this.state.seeMoreCount;
      this.setState({seeMoreCount:(config.seeMoreCount + currentCount)})
    }
    render() {
        return SchoolViewRender.call(this, this.props, this.state);
    }
}

export default createContainer(props => {
    let { schoolId, slug } = props.params
    let schoolData;
    let classPricing;
    let monthlyPricing;
    let schoolLocation;
    let classType;
    let enrollmentFee;

    if (slug) {
        Meteor.subscribe("UserSchoolbySlug", slug);
        Meteor.subscribe("SkillClassbySchoolBySlug", slug)

        schoolData = School.findOne({ slug: slug })
        schoolId = schoolData && schoolData._id
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
        classPricing = ClassPricing.find({ schoolId: schoolId }).fetch()
        monthlyPricing = MonthlyPricing.find({ schoolId: schoolId }).fetch()
        schoolLocation = SLocation.find({ schoolId: schoolId }).fetch()
        classType = ClassType.find({ schoolId: schoolId }).fetch();
        enrollmentFee = EnrollmentFees.find({schoolId}).fetch();
    }

    // console.log("SchoolView schoolData--->>", schoolData)
    // console.log("SchoolView classType--->>", classType)
    // console.log("SchoolView classPricing--->>", classPricing)
    // console.log("SchoolView monthlyPricing--->>", monthlyPricing)
    // console.log("SchoolView schoolLocation--->>", schoolLocation)
    return { ...props,
        schoolData,
        classPricing,
        monthlyPricing,
        schoolLocation,
        enrollmentFee,
        classType,
        schoolId,
    };
},withStyles(styles)(toastrModal(SchoolView)))
