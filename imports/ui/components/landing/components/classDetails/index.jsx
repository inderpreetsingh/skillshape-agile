import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ClassTimeCover from "./classTimeCover/index.jsx";
import ClassTimeInformation from "./classTimeInformation/index.jsx";
import MembersList from "./membersList/index.jsx";
import TimeLine from "./timeline/index.jsx";

import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";

import {
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

const Header = styled.header`
  @media screen and (min-width: ${tablet}px) {
    display: flex;
    flex-direction: row-reverse;
  }
`;

const ClassDetails = props => (
  <Wrapper>
    {props.noPurchasedClasses && (
      <Notification
        notificationContent="You do not have any packages that will cover this class."
        bgColor={danger}
        buttonLabel="Purchase Classes"
        onButtonClick={props.onPurchaseButtonClick}
      />
    )}
    <InnerWrapper>
      <Header>
        <ClassTimeCover {...props.headerProps} />
        <ClassTimeInformation {...props.ClassTimeInformation} />
      </Header>
      <TimeLine {...props.timeLineProps} />
      <MembersList />
    </InnerWrapper>
  </Wrapper>
);

ClassDetails.propTypes = {
  noPurchasedClasses: PropTypes.bool
};

ClassDetails.defaultProps = {
  noPurchasedClasses: true
};

export default ClassDetails;
