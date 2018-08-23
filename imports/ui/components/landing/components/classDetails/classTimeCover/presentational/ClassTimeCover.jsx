import React, { Fragment } from "react";
import styled from "styled-components";

import { withImageExists } from "/imports/util";
import { schoolDetailsImgSrc } from "/imports/ui/components/landing/site-settings.js";

import ActionButtons from "/imports/ui/components/landing/components/classDetails/classTimeInformation/presentational/ActionButtons";
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import {
  tablet,
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

const Wrapper = styled.div`
  background-image: url('${props => props.url}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  width: 100%;
  height: 160px;
  position: relative;

  @media screen and (min-width: ${tablet}px) {
    flex: 1;
    height: auto;
    margin-bottom: ${rhythmDiv * 4}px;
  }
`;

const ClassTypeProfile = styled.div`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  position: absolute;
  bottom: ${rhythmDiv * 2}px;
  left: ${rhythmDiv * 2}px;
  background-image: url('${props => props.url}');
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`;

const ClassTypeProfileWithDefaultImage = withImageExists(props => {
  const { bgImg, classTypeCoverSrc } = props;
  return <ClassTypeProfile url={bgImg || classTypeCoverSrc} />;
}, imageExistsConfigClassSrc);

const ShowOnLargeScreen = styled.div`
  display: none;
  @media screen and (min-width: ${tablet});
`;

const ClassTimeCover = props => (
  <Wrapper url={props.bgImg || props.schoolCoverSrc}>
    <ClassTypeProfileWithDefaultImage
      classTypeCoverSrc={props.classTypeCoverSrc}
    />
    <ShowOnLargeScreen>
      <ActionButtons />
    </ShowOnLargeScreen>
  </Wrapper>
);

export default withImageExists(ClassTimeCover, imageExistsConfigSchoolSrc);
