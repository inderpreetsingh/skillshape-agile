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

const BodyWrapper = styled.div`
    padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const Content = SubHeading.extend`
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
    return (<Fragment>
        <BrandBar
            positionStatic
            currentUser={currentUser}
            isUserSubsReady={isUserSubsReady}
        />
        <Header
            userImage={currentUser && currentUser.profile.pic}
            userName={getUserFullName(currentUser)} />
        <BodyWrapper>
            <Content>If you want to add a new school, <MyLink onClick={onCreateNewSchool}>click here.</MyLink></Content>
            <SchoolsList schools={schools} />
        </BodyWrapper>
        <Footer />
    </Fragment>)
}