import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router";

import ClassTimeCover from "./classTimeCover/index.jsx";
import ClassTimeInformation from "./classTimeInformation/index.jsx";
import MembersList from "./membersList/index.jsx";
import TimeLine from "./timeline/index.jsx";
import get from 'lodash/get';
import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
import TopSearchBar from "/imports/ui/components/landing/components/TopSearchBar";
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";

import { withImageExists } from "/imports/util";

import {
  schoolDetailsImgSrc,
  coverSrc
} from "/imports/ui/components/landing/site-settings.js";

const imageExistsConfigSchoolSrc = {
  originalImagePath: "headerProps.schoolCoverSrc",
  defaultImage: coverSrc
};

import {
  rhythmDiv,
  panelColor,
  tablet,
  danger,
  maxContainerWidth
} from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  overflow: hidden;
`;

const InnerWrapper = styled.div`
  max-width: ${maxContainerWidth}px;
  margin: 0 auto;
`;

const ClassTimeWrapper = styled.div`
  position: relative;
  z-index: 0;
  background-image: url('${props => props.bgImg}');
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.9;
    background: white;
    z-index: -1;
  }

  @media screen and (min-width: ${tablet}px) {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: ${rhythmDiv * 4}px;
  }
`;

const ClassDetails = props => {
  const { location,headerProps } = props;
  const {state} = props.location.state;
  const dataProps =  props.location.state.props;
  const {school} = state;
  let schoolImage,classTypeImage;
  schoolImage = get(school,'logoImgMedium',get(school,'logoImg',config.defaultSchoolImage))
	classTypeImage = get(state,'classImg',config.defaultSchoolImage)

  const currentView =
    location.pathname === "/classdetails-student" ? "studentsView" : "instructorsView";
  return (
    <Wrapper>
      <TopSearchBar {...props.topSearchBarProps} />
      {props.noPurchasedClasses &&
        currentView === "studentsView" && (
          <Notification
            notificationContent="You do not have any packages that will cover this class."
            bgColor={danger}
            buttonLabel="Purchase Classes"
            onButtonClick={props.onPurchaseButtonClick}
          />
        )}
      <InnerWrapper>
        <ClassTimeWrapper bgImg={classTypeImage}>
          <ClassTimeCover 
          classTypeCoverSrc={schoolImage}
           schoolCoverSrc={classTypeImage} 
           classTypeName = {get(state.classType,'name',null)}
           classTypeId = {get(state.classType,'_id',null)}
           slug = {get(school,'slug','')}
           />
          <ClassTimeInformation
            {...dataProps.eventData}
            schoolName={school.name}
            schoolCoverSrc={classTypeImage}
            locationData = {state.location}
            website = {school.website}
          />
        </ClassTimeWrapper>
        <TimeLine {...dataProps.eventData} />
        <MembersList currentView={currentView} />
      </InnerWrapper>
      <Footer />
    </Wrapper>
  );
};
ClassDetails.propTypes = {
  noPurchasedClasses: PropTypes.bool
};

ClassDetails.defaultProps = {
  noPurchasedClasses: true
};

export default withImageExists(
  withRouter(ClassDetails),
  imageExistsConfigSchoolSrc
);
