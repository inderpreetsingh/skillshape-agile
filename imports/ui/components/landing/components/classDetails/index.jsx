import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import ClassTimeCover from './classTimeCover/index';
import ClassTimeInformation from './classTimeInformation/index';
import MembersList from './membersList/index';
import Footer from '/imports/ui/components/landing/components/footer/index';
import {
  maxContainerWidth,
  rhythmDiv,
  tablet,
} from '/imports/ui/components/landing/components/jss/helpers';
import TopSearchBar from '/imports/ui/components/landing/components/TopSearchBar';
import { classTypeImgSrc } from '/imports/ui/components/landing/site-settings';
import { withImageExists } from '/imports/util';

const imageExistsBgImage = {
  originalImagePath: 'headerProps.bgImg',
  defaultImage: classTypeImgSrc,
};

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const PageContent = styled.div``;

const InnerWrapper = styled.div`
  max-width: ${maxContainerWidth}px;
  margin: 0 auto;
`;

const ClassTimeWrapper = styled.div`
  position: relative;
  z-index: 0;
  background-image: url('${props => props.bgImg}');
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: ${rhythmDiv * 8}px;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.9;
    background: white;
    z-index: -1;
  }

  @media screen and (min-width: ${tablet}px) {
    display: flex;
    flex-direction: row-reverse;
  }
`;

const ClassDetails = (props) => {
  const {
    headerProps,
    classData,
    instructorsData,
    popUp,
    instructorsIds,
    bgImg,
    classTypeData,
    schoolData,
    currentView,
    topSearchBarProps,
    params,
    classTimeInformationProps,
    notification,
    loginUserPurchases,
    packagesRequired,
    classInterestData,
  } = props;
  return (
    <Wrapper>
      <PageContent>
        <TopSearchBar {...topSearchBarProps} />
        <InnerWrapper>
          <ClassTimeWrapper bgImg={bgImg}>
            <ClassTimeCover
              bgImg={bgImg}
              logoImg={headerProps.logoImg}
              classTypeName={get(classTypeData, 'name', null)}
              classTypeId={get(classTypeData, '_id', null)}
              slug={get(schoolData, 'slug', '')}
            />

            <ClassTimeInformation
              schoolName={schoolData.name}
              schoolCoverSrc={bgImg}
              website={schoolData.website}
              classType={classTypeData}
              schoolId={schoolData._id}
              popUp={popUp}
              params={params}
              classData={classData}
              notification={notification}
              loginUserPurchases={loginUserPurchases}
              packagesRequired={packagesRequired}
              classInterestData={classInterestData}
              {...classTimeInformationProps}
            />
          </ClassTimeWrapper>
          {/* <TimeLine {...dataProps.eventData} /> */}
          <MembersList
            schoolId={schoolData._id}
            schoolName={schoolData.name}
            classTypeName={get(classTypeData, 'name', null)}
            currentView={currentView}
            classData={classData}
            instructorsData={instructorsData}
            popUp={popUp}
            instructorsIds={instructorsIds}
            params={params}
            schoolData={schoolData}
            slug={schoolData.slug}
            notification={notification}
            loginUserPurchases={loginUserPurchases}
            packagesRequired={packagesRequired}
          />
        </InnerWrapper>
      </PageContent>
      <Footer />
    </Wrapper>
  );
};
ClassDetails.propTypes = {
  noPurchasedClasses: PropTypes.bool,
};

ClassDetails.defaultProps = {
  noPurchasedClasses: true,
};

export default withImageExists(withRouter(ClassDetails), imageExistsBgImage);
