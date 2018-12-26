import React from 'react';
import { get } from 'lodash';
import styled from 'styled-compoents';

import { PrimaryButton, SecondaryButton } from '/imports/ui/components/landing/components/buttons/';

import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { flexCenter, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
    ${flexCenter}
    justify-content: space-between;
    padding: ${rhythmDiv}px;
    width: 100%;
`;
const ActionButtons = styled.div`
    ${flexCenter};
    flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
    margin-bottom: ${rhythmDiv}px;
    margin-right: ${rhythmDiv}px;

    :last-of-type {
        margin-right: 0;
    }
`;

const ProfileWrapper = styled.div`
    margin-right: ${rhythmDiv * 2}px;
`;

const SchoolCard = (props) => (<Wrapper>
    <ProfileWrapper>
        <ProfileImage
            imageContainerProps={{
                width: 75,
                height: 75,
                borderRadius: '50%'
            }}
            src={props.schoolLogo}
        />
    </ProfileWrapper>
    <ActionButtons>
        <ButtonWrapper>
            <SecondaryButton icon iconName="edit" label="Visit" onClick={props.onVisitSchoolClick} />
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