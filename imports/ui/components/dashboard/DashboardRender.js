import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import Header from './header';
import SchoolsList from './schools';
import CompletePrompt from '/imports/ui/components/completePrompt/index';
import BrandBar from '/imports/ui/components/landing/components/BrandBar';
import Footer from '/imports/ui/components/landing/components/footer/index';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers';
import { Loading } from '/imports/ui/loading';

const MyTransaction = lazy(() => import('/imports/ui/components/users/myTransaction'));

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

export default (props) => {
  const {
    currentUser, isUserSubsReady, headerProps, bodyProps, onCreateNewSchoolClick,
  } = props;
  return (
    <Wrapper>
      <BrandBar positionStatic currentUser={currentUser} isUserSubsReady={isUserSubsReady} />
      <CompletePrompt />
      <DashBoardContent>
        <Header {...headerProps} onCreateNewSchoolClick={onCreateNewSchoolClick} />
        <BodyWrapper>
          <SchoolsList schools={bodyProps.schools} />
          {/* <AddSchool><MyLink onClick={onCreateNewSchoolClick}>click here</MyLink> to add a new school.</AddSchool> */}
        </BodyWrapper>
        <Suspense fallback={<Loading />}>
          <MyTransaction schoolView schoolData={bodyProps.schools} />
        </Suspense>
        <Footer />
      </DashBoardContent>
    </Wrapper>
  );
};
