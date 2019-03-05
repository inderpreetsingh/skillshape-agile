import React, { lazy, Suspense } from 'react';
import { Loading } from '/imports/ui/loading';
import styled from 'styled-components';
import Header from './header';
import SchoolsList from './schools/';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
import { primaryColor, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import { SubHeading, Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
const MyTransaction = lazy(()=>import("/imports/ui/components/users/myTransaction"))

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
    margin-bottom: 0;
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
        headerProps,
        bodyProps,
        onCreateNewSchoolClick
    } = props;
    return (<Wrapper>
        <BrandBar
            positionStatic
            currentUser={currentUser}
            isUserSubsReady={isUserSubsReady}
        />
        <DashBoardContent>
            <Header {...headerProps} onCreateNewSchoolClick={onCreateNewSchoolClick} />
            <BodyWrapper>
                <SchoolsList schools={bodyProps.schools} />
                {/*<AddSchool><MyLink onClick={onCreateNewSchoolClick}>click here</MyLink> to add a new school.</AddSchool>*/}
            </BodyWrapper>
            <Suspense fallback={<Loading/>}>
            <MyTransaction
                  schoolView = {true}
                  schoolData = {bodyProps.schools}
                  />
            </Suspense>
            <Footer />
        </DashBoardContent>
    </Wrapper>)
}