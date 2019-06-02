import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { LARGE_SCREEN_GW, MED_SCREEN_GW } from '../../constants';
import { FormGhostButton } from '/imports/ui/components/landing/components/buttons/';
import { SSAvatar } from '/imports/ui/components/landing/components/helpers/ProfileImage';
import {
  flexCenter,
  panelColor,
  rhythmDiv,
} from '/imports/ui/components/landing/components/jss/helpers';
import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import { capitalizeString, withImageExists } from '/imports/util';

const imageExistsConfig = {
  originalImagePath: 'src',
  // eslint-disable-next-line no-undef
  defaultImage: config.defaultProfilePicOptimized,
};

const Wrapper = styled.div`
  background-color: ${panelColor};
  padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const InnerWrapper = styled.div`
  ${flexCenter}
  flex-direction: column;
  position: relative;
  max-width: ${LARGE_SCREEN_GW}px;
  margin: 0 auto;

  @media screen and (max-width: ${LARGE_SCREEN_GW}px) {
    max-width: ${MED_SCREEN_GW}px;
  }
`;

const UserProfile = styled.div`
  ${flexCenter}
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  ${flexCenter}
  position: absolute;
  top: ${rhythmDiv}px;
  right: 60px;

  @media screen and (max-width: ${LARGE_SCREEN_GW}px) {
    position: static;
    margin-left: ${rhythmDiv}px;
  }

  @media screen and (max-width: 350px) {
    flex-direction: column;
    margin-left: 0;
  }
`;

const ButtonWrapper = styled.div`
  margin-right: ${rhythmDiv}px;

  :last-of-type {
    margin-right: 0;
  }

  @media screen and (max-width: 350px) {
    margin-right: 0;
    margin-bottom: ${rhythmDiv}px;
  }
`;

const Greeting = Heading.extend`
  margin-bottom: 0;
  @media screen and (max-width: ${LARGE_SCREEN_GW}px) {
    margin-bottom: ${rhythmDiv}px;
  }
`;

const UserImage = withImageExists(SSAvatar, imageExistsConfig);

const Header = (props) => {
  const {
    userName, userImage, onCreateNewSchoolClick, onEditProfileClick,
  } = props;
  return (
    <Wrapper>
      <InnerWrapper>
        <UserProfile>
          <UserImage
            imageContainerProps={{
              borderRadius: '50%',
              bgPosition: '50% 100%',
              bgSize: 'cover',
              noMarginRight: true,
            }}
            src={userImage}
          />
          {userName && (
            <Greeting>
              Welcome back,
              {capitalizeString(userName)}
            </Greeting>
          )}
        </UserProfile>
        <ButtonsWrapper>
          <ButtonWrapper>
            <FormGhostButton
              icon
              iconName="school"
              label="Add School"
              onClick={onCreateNewSchoolClick}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <FormGhostButton
              icon
              iconName="account_circle"
              label="Edit Profile"
              onClick={onEditProfileClick}
            />
          </ButtonWrapper>
        </ButtonsWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

Header.propTypes = {
  userImage: PropTypes.string,
  userName: PropTypes.string,
  onEditProfileClick: PropTypes.func,
  onCreateNewSchoolClick: PropTypes.func,
};

export default Header;
