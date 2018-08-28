import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router";

import ClassTimeCover from "./classTimeCover/index.jsx";
import ClassTimeInformation from "./classTimeInformation/index.jsx";
import MembersList from "./membersList/index.jsx";
import TimeLine from "./timeline/index.jsx";

import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
import TopSearchBar from "/imports/ui/components/landing/components/TopSearchBar";
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";

import {
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
  @media screen and (min-width: ${tablet}px) {
    display: flex;
    flex-direction: row-reverse;
  }
`;

const ClassDetails = props => {
  const { location } = props;

  const currentView =
    location.pathname === "/classdetails-student"
      ? "studentsView"
      : "instructorsView";
  return (
    <Wrapper>
      {props.noPurchasedClasses &&
        currentView === "studentsView" && (
          <Notification
            notificationContent="You do not have any packages that will cover this class."
            bgColor={danger}
            buttonLabel="Purchase Classes"
            onButtonClick={props.onPurchaseButtonClick}
          />
        )}
      <TopSearchBar />
      <InnerWrapper>
        <ClassTimeWrapper>
          <ClassTimeCover {...props.headerProps} />
          <ClassTimeInformation {...props.ClassTimeInformation} />
        </ClassTimeWrapper>
        <TimeLine {...props.timeLineProps} />
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

export default withRouter(ClassDetails);
