import React from "react";
import styled from "styled-components";
import ActionButtons from "/imports/ui/components/landing/components/classDetails/shared/ActionButtons";
import { rhythmDiv, tablet } from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc, schoolDetailsImgSrc } from "/imports/ui/components/landing/site-settings.js";
import { withImageExists } from "/imports/util";

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
    border-radius: 5px;
  }
`;

const ClassTypeProfile = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
  bottom: ${rhythmDiv * 2}px;
  left: ${rhythmDiv * 2}px;
  background-image: url('${props => props.url}');
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`;

const ButtonsWrapper = styled.div`
  display: none;
  @media screen and (min-width: ${tablet}px) {
    display: flex;
    width: calc(100% - 160px); // subtracting the space for profile.
    margin-left: auto;
    height: 100%;
    align-items: flex-end;
    justify-content: flex-end;
  }
`;

const ClassTypeProfileWithDefaultImage = withImageExists(props => {
  const { bgImg, classTypeCoverSrc } = props;
  return <ClassTypeProfile url={bgImg || classTypeCoverSrc} />;
}, imageExistsConfigClassSrc);

const ClassTimeCover = props => (
  <Wrapper url={props.schoolCoverSrc}>
    <ClassTypeProfileWithDefaultImage
      classTypeCoverSrc={props.classTypeCoverSrc}
    />
    <ButtonsWrapper>
      <ActionButtons
        slug={props.slug}
        classTypeId={props.classTypeId}
        classTypeName={props.classTypeName}
      />
    </ButtonsWrapper>
  </Wrapper>
);

export default ClassTimeCover;
