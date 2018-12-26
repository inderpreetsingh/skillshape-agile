import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


import ProfileImage, { SSImage } from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { flexCenter, rhythmDiv, panelColor } from '/imports/ui/components/landing/components/jss/helpers.js';
import { reviewerImgSrc } from '/imports/ui/components/landing/components/site-settings.js';

const imageExistsConfig = {
    originalImagePath: 'src',
    defaultImage: reviewerImgSrc
};

const Wrapper = styled.div`
    background-color: ${panelColor};
    padding: ${rhythmDiv * 2}px;
`;

const UserProfile = styled.div`
    ${flexCenter}
    flex-direction: column;
`;

const Header = (props) => (
    <Wrapper>
        <UserProfile>
            <ProfileImage
                imageContainerProps={{
                    borderRadius: '50%'
                }}
                src={props.userImageSrc} />
            {props.userName && <Heading>Welcome, {props.userName}</Heading>}
        </UserProfile>
    </Wrapper>
);

Header.propTypes = {
    userImageSrc: PropTypes.string,
    userName: PropTypes.string
}

export default Header;