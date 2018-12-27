import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import styled from 'styled-components';


import { PrimaryButton, SecondaryButton } from '/imports/ui/components/landing/components/buttons/';
import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import {
    flexCenter,
    rhythmDiv,
    panelColor,
    lightBoxShadow,
    maxContainerWidth
} from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: ${rhythmDiv}px;
    width: 100%;
    border: 1px solid ${panelColor};
    box-shadow: ${lightBoxShadow};
    max-width: ${maxContainerWidth}px;
    background-image: url(${props => props.bgImg});
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;


    ::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }
`;
const ActionButtons = styled.div`
    ${flexCenter};
    align-items: flex-end;
`;

const ButtonWrapper = styled.div`
    margin-right: ${rhythmDiv}px;

    :last-of-type {
        margin-right: 0;
    }
`;

const ProfileWrapper = styled.div`
    margin-right: ${rhythmDiv * 2}px;
`;

const SchoolCard = (props) => (<Wrapper bgImg={props.schoolCover}>
    <ProfileWrapper>
        <ProfileImage
            imageContainerProps={{
                width: 75,
                height: 75,
            }}
            src={props.schoolLogo}
        />
    </ProfileWrapper>
    <ActionButtons>
        <ButtonWrapper>
            <SecondaryButton label="Visit" onClick={props.onVisitSchoolClick} />
        </ButtonWrapper>
        <ButtonWrapper>
            <PrimaryButton icon iconName="edit" label="Edit" onClick={props.onEditSchoolClick} />
        </ButtonWrapper>
    </ActionButtons>
</Wrapper>);

SchoolCard.propTypes = {
    schoolLogo: PropTypes.string,
    onVisitSchoolClick: PropTypes.func,
    onEditSchoolClick: PropTypes.func,
}


export default SchoolCard;