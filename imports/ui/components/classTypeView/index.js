import { isEmpty } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import ClassTypeContent from './ClassTypeContent';
import ClassInterest from '/imports/api/classInterest/fields';
import ClassPricing from '/imports/api/classPricing/fields';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassType from '/imports/api/classType/fields';
import EnrollmentFees from '/imports/api/enrollmentFee/fields';
import Media from '/imports/api/media/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import Reviews from '/imports/api/review/fields';
import School from '/imports/api/school/fields';
import config from '/imports/config';
import Footer from '/imports/ui/components/landing/components/footer/index';
import NotFound from '/imports/ui/components/landing/components/helpers/NotFound';
import TopSearchBar from '/imports/ui/components/landing/components/TopSearchBar';
import { ContainerLoader } from '/imports/ui/loading/container';

const Wrapper = styled.div`
	width: 100%;

	${props => props.isEmpty
		&& `display: flex;
     min-height: 100vh;
     flex-direction: column;
     justify-content: space-between;`};
`;

class ClassTypeView extends Component {
  render() {
    // console.log("ClassTypeView .props-->>",this.props)
    const emptyClassTypeData = isEmpty(this.props.classTypeData);
    if (this.props.isLoading) {
      return <ContainerLoader />;
    }
    return (
      <Wrapper isEmpty={emptyClassTypeData} className="classtype-page">
        {/* <DocumentTitle title={get(this.props,"params.classTypeName","untitled")}> */}
        <div>
          <TopSearchBar {...this.props} />
        </div>
        {emptyClassTypeData ? <NotFound title="No Class Found" /> : <ClassTypeContent {...this.props} />}
        <Footer />
        {/*  </DocumentTitle> */}
      </Wrapper>
    );
  }
}

ClassTypeView.propTypes = {
  className: PropTypes.string,
};

ClassTypeView.defaultProps = {
  className: 'naam yoga',
};

export default createContainer((props) => {
  // console.log("ClassType createContainer props -->>",props);
  const { classTypeId } = props.params;
  let subscription;
  let isLoading = true;
  let classInterestData = [];
  let classTypeData;
  let reviewsSubscriptions;
  if (classTypeId) {
    subscription = Meteor.subscribe('classType.getClassTypeWithClassTimes', {
      classTypeId,
    });
    // added cause sLocation field was giving empty response with 2 publishJoinedCursors
    Meteor.subscribe('classType.getClassTimesWithId', {
      classTypeId,
    });

    reviewsSubscriptions = Meteor.subscribe('review.getReviews', {
      reviewForId: classTypeId,
    });
  }

  const sub1Ready = subscription && subscription.ready();
  const sub2Ready = reviewsSubscriptions && reviewsSubscriptions.ready();
  if (sub1Ready && sub2Ready) {
    isLoading = false;
  }
  Meteor.subscribe('classInterest.getClassInterest');
  Meteor.subscribe('enrollmentFee.getEnrollmentFeeByClassTypeId', { classTypeId });
  classInterestData = ClassInterest.find({}).fetch();
  if (sub1Ready) {
    classTypeData = ClassType.findOne({ _id: classTypeId });
  }
  const schoolData = School.findOne();
  const currency = schoolData && schoolData.currency ? schoolData.currency : config.defaultCurrency;

  const classTimesData = ClassTimes.find({ classTypeId }).fetch();
  const classPricingData = ClassPricing.find().fetch();
  const monthlyPricingData = MonthlyPricing.find().fetch();
  const mediaData = Media.find().fetch();
  const reviewsData = Reviews.find().fetch();
  const enrollmentFeeData = EnrollmentFees.find().fetch();
  // console.log("ClassType classTypeData -->>>",classTypeData)
  // console.log("ClassType classTimesData -->>>",classTimesData)
  // console.log("ClassType schoolData -->>>",schoolData)
  // console.log("ClassType classPricingData -->>>",classPricingData)
  // console.log("ClassType monthlyPricingData -->>>",monthlyPricingData)
  return {
    ...props,
    isLoading,
    reviewsData,
    classTypeData,
    classTimesData,
    schoolData,
    classPricingData,
    monthlyPricingData,
    enrollmentFeeData,
    mediaData,
    classInterestData,
    currency,
  };
}, ClassTypeView);
