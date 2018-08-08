import React, { Fragment } from "react";
import styled from "styled-components";

import { withImageExists } from "/imports/util";
import { schoolDetailsImgSrc } from "/imports/ui/components/landing/site-settings.js";
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import {
  rhythmDiv,
  danger
} from "/imports/ui/components/landing/components/jss/helpers.js";

const imageExistsConfigSchoolSrc = {
  originalImagePath: "schoolCoverSrc",
  defaultImage: schoolDetailsImgSrc
};

const imageExistsConfigClassSrc = {
  originalImagePath: "classTypeCoverSrc",
  defaultImage: schoolDetailsImgSrc
};

const Wrapper = styled.header`
  background-image: url('${props => props.url}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  height: 300px;
  position: relative;
`;

const ClassTypeProfile = styled.div`
  border-radius: 50%;
  width: 175px;
  height: 175px;
  position: absolute;
  bottom: ${rhythmDiv * 2}px;
  left: ${rhythmDiv * 2}px;
  background-image: url('${props => props.url}');
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`;

// const ProfilePicDefaultImage = (props) =>
const ClassTypeProfileWithDefaultImage = withImageExists(props => {
  const { bgImg, classTypeCoverSrc } = props;
  return <ClassTypeProfile url={bgImg || classTypeCoverSrc} />;
}, imageExistsConfigClassSrc);

const Header = props => (
  <Fragment>
    {props.noPurchasedClasses && (
      <Notification
        notificationContent="You do not have any packages that will cover this class."
        bgColor={danger}
        buttonLabel="Purchase Classes"
        onButtonClick={props.onPurchaseButtonClick}
      />
    )}
    <Wrapper url={props.bgImg || props.schoolCoverSrc}>
      <ClassTypeProfileWithDefaultImage
        classTypeCoverSrc={props.classTypeCoverSrc}
      />
    </Wrapper>
  </Fragment>
);

export default withImageExists(Header, imageExistsConfigSchoolSrc);
