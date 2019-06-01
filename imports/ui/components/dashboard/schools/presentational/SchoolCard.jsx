import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '/imports/ui/components/landing/components/buttons/';
import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage';
import {
  coverBg,
  flexCenter,
  lightBoxShadow,
  panelColor,
  rhythmDiv,
} from '/imports/ui/components/landing/components/jss/helpers';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import { classTypeImgSrc } from '/imports/ui/components/landing/site-settings';
import { withImageExists } from '/imports/util';

const imageExistsConfig = {
  originalImagePath: 'src',
  defaultImage: classTypeImgSrc,
};

const Wrapper = styled.div`
  ${flexCenter}
  flex-direction: column;
`;

const CardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${props => (props.schoolLogoExists ? 'space-between' : 'flex-end')};
    padding: ${rhythmDiv}px 0 0 ${rhythmDiv}px;
    width: 100%;
    height: 160px;
    border-radius: 5px;
    border: 1px solid ${panelColor};
    box-shadow: ${lightBoxShadow};
    ${coverBg}
    background-image: url(${props => props.bgImg});
    background-position: 50% 50%;
    position: relative;
    margin-bottom: ${rhythmDiv * 2}px;
    
    @media screen and (max-width: 350px) {
    }
`;

const CardWrapperEnhanced = withImageExists(props =>
// console.log("CARD WRAPPER ENHANCED", props);
  <CardWrapper {...props} bgImg={props.bgImg} />,
imageExistsConfig);

const ActionButtons = styled.div`
  ${flexCenter};
  height: 100%;
  align-items: flex-end;

  @media screen and (max-width: 350px) {
    flex-direction: column;
    justify-content: flex-end;
  }
`;

const ProfileWrapper = styled.div`
  margin-right: ${rhythmDiv * 2}px;
  background-color: ${panelColor};
  border-radius: 3px;
  padding: ${rhythmDiv}px;
`;

const SchoolName = Text.extend`
  font-size: 18px;
  margin-bottom: 0;
  text-transform: capitalize;
`;

const SchoolCard = props => (
  <Wrapper>
    <CardWrapperEnhanced schoolLogoExists={!isEmpty(props.schoolLogo)} src={props.schoolCover}>
      {!isEmpty(props.schoolLogo) && (
        <ProfileWrapper>
          <ProfileImage
            imageContainerProps={{
              width: 50,
              height: 50,
              noMarginRight: true,
              noMarginBottom: true,
            }}
            src={props.schoolLogo}
          />
        </ProfileWrapper>
      )}

      <ActionButtons>
        <SecondaryButton icon iconName="school" label="Visit" onClick={props.onVisitSchoolClick} />
        <PrimaryButton icon iconName="edit" label="Edit" onClick={props.onEditSchoolClick} />
      </ActionButtons>
    </CardWrapperEnhanced>
    <SchoolName>{props.schoolName}</SchoolName>
  </Wrapper>
);

SchoolCard.propTypes = {
  schoolLogo: PropTypes.string,
  schoolName: PropTypes.string,
  onVisitSchoolClick: PropTypes.func,
  onEditSchoolClick: PropTypes.func,
};

export default SchoolCard;
