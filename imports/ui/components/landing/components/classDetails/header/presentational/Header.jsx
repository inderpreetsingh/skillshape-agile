import React from "react";
import styled from "styled-components";

import { withImageExists } from "/imports/util";
import { schoolDetailsImgSrc } from "/imports/ui/components/landing/site-settings.js";
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

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
  height: 400px;
  position: relative;
`;

const NotificationWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
`;

const ClassTypeProfile = styled.div`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  position: absolute;
  bottom: ${helpers.rhythmDiv * 2}px;
  left: ${helpers.rhythmDiv * 2}px;
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
  <Wrapper url={props.bgImg || props.schoolCoverSrc}>
    <NotificationWrapper>
      <Notification
        notificationContent="You do not have any packages that will cover this class."
        bgColor={helpers.danger}
        buttonLabel="Purchase Classes"
        onButtonClick={props.onPurchaseButtonClick}
      />
    </NotificationWrapper>
    <ClassTypeProfileWithDefaultImage
      classTypeCoverSrc={props.classTypeCoverSrc}
    />
  </Wrapper>
);

export default withImageExists(Header, imageExistsConfigSchoolSrc);
