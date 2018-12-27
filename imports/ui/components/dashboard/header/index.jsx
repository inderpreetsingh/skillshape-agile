import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


import { FormGhostButton } from '/imports/ui/components/landing/components/buttons/';
import { SSImage } from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { flexCenter, rhythmDiv, panelColor } from '/imports/ui/components/landing/components/jss/helpers.js';
import { reviewerImgSrc } from '/imports/ui/components/landing/site-settings.js';

import { withImageExists } from '/imports/util';

const imageExistsConfig = {
    originalImagePath: 'src',
    defaultImage: reviewerImgSrc
};

const Wrapper = styled.div`
    position: relative;
    background-color: ${panelColor};
    padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const UserProfile = styled.div`
    ${flexCenter}
    flex-direction: column;
`;

const ButtonWrapper = styled.div`
    position: absolute;
    top: ${rhythmDiv}px;
    right: ${rhythmDiv}px;
`;

const UserImage = withImageExists(SSImage, imageExistsConfig);

const Header = (props) => (
    <Wrapper>
        <UserProfile>
            <UserImage
                imageContainerProps={{
                    borderRadius: '50%'
                }}
                src={props.userImageSrc} />
            {props.userName && <Heading>Welcome back, {props.userName}</Heading>}
        </UserProfile>
        <ButtonWrapper>
            <FormGhostButton icon iconName="edit" label="Edit Profile" />
        </ButtonWrapper>
    </Wrapper>
);

Header.propTypes = {
    userImageSrc: PropTypes.string,
    userName: PropTypes.string
}

export default Header;