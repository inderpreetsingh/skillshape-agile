import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import { FormGhostButton } from '/imports/ui/components/landing/components/buttons/';
import { SSImage } from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { flexCenter, rhythmDiv, panelColor, mobile } from '/imports/ui/components/landing/components/jss/helpers.js';
import { withImageExists, capitalizeString } from '/imports/util';
import { reviewerImgSrc } from '/imports/ui/components/landing/site-settings.js';

import {
    SCHOOL_CARD_WIDTH,
    LARGE_SCREEN_GW,
    MED_SCREEN_GW,
    SMALL_SCREEN_GW
} from '../constants';

const imageExistsConfig = {
    originalImagePath: 'src',
    defaultImage: reviewerImgSrc
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

const ButtonWrapper = styled.div`
    position: absolute;
    top: ${rhythmDiv}px;
    right: 42px;

    @media screen and (max-width: ${MED_SCREEN_GW}px) {
        position: static;
    }
`;

const Greeting = Heading.extend`
    margin-bottom: 0;
    @media screen and (max-width: ${MED_SCREEN_GW}px) {
        margin-bottom: ${rhythmDiv}px;
    }
`;

const UserImage = withImageExists(SSImage, imageExistsConfig);

const handleEditProfileClick = (e) => {
    e.preventDefault();
    const currentUserId = Meteor.user()._id;
    browserHistory.push(`/profile/${currentUserId}`);
}

const Header = (props) => (
    <Wrapper>
        <InnerWrapper>
            <UserProfile>
                <UserImage
                    imageContainerProps={{ noMarginRight: true }}
                    src={props.userImageSrc} />
                {props.userName && <Greeting>Welcome back, {capitalizeString(props.userName)}</Greeting>}
            </UserProfile>
            <ButtonWrapper>
                <FormGhostButton
                    icon
                    iconName="account_circle"
                    label="Edit Profile"
                    onClick={handleEditProfileClick} />
            </ButtonWrapper>
        </InnerWrapper>
    </Wrapper>
);

Header.propTypes = {
    userImageSrc: PropTypes.string,
    userName: PropTypes.string
}

export default Header;