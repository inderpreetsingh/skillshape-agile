import React, { Fragment } from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
import Header from './header/index.jsx';
import { SchoolsList } from './schools/';

import { getUserFullName } from '/imports/util';
import { SubHeading, Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { rhythmDiv, primaryColor } from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const DashBoardContent = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: space-between;
`;

const BodyWrapper = styled.div`
    padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const AddSchool = SubHeading.extend`
    text-align: center;
    margin-bottom: ${rhythmDiv * 4}px;
`;

const MyLink = Text.withComponent('a').extend`
    font-size: inherit;
    color: ${primaryColor};
    cursor: pointer;
    transition: color .1s linear;
    
    &:hover {
        color: ${primaryColor};
    }
`;


export default (props) => {
    const { currentUser,
        isUserSubsReady,
        schools,
        onCreateNewSchool
    } = props;
    return (<Wrapper>
        <BrandBar
            positionStatic
            currentUser={currentUser}
            isUserSubsReady={isUserSubsReady}
        />
        <DashBoardContent>
            <Header
                userImage={currentUser && currentUser.profile.pic}
                userName={getUserFullName(currentUser)} />
            <BodyWrapper>
                <AddSchool>If you want to add a new school, <MyLink onClick={onCreateNewSchool}>click here.</MyLink></AddSchool>
                <SchoolsList schools={schools} />
            </BodyWrapper>
            <Footer />
        </DashBoardContent>
    </Wrapper>)
}