import get from 'lodash/get';
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import ClassTimeCover from "./classTimeCover/index.jsx";
import ClassTimeInformation from "./classTimeInformation/index.jsx";
import MembersList from "./membersList/index.jsx";
import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
import { maxContainerWidth, rhythmDiv, tablet } from "/imports/ui/components/landing/components/jss/helpers.js";
import TopSearchBar from "/imports/ui/components/landing/components/TopSearchBar";
import { classTypeImgSrc } from "/imports/ui/components/landing/site-settings.js";
import { withImageExists } from "/imports/util";



const imageExistsBgImage = {
  originalImagePath: "headerProps.bgImg",
  defaultImage: classTypeImgSrc
};

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const PageContent = styled.div`

`;

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

const ClassDetails = props => {
  const { location,
    headerProps,
    classData,
    instructorsData,
    popUp,
    instructorsIds,
    bgImg,
  } = props;
  const { state } = props.location.state;
  const dataProps = props.location.state.props;
  const { school } = state;

  const currentView =
    location.pathname === "/classdetails-student" ? "studentsView" : "instructorsView";
  
  return (
    <Wrapper>
      <PageContent>
        <TopSearchBar {...props.topSearchBarProps} />
        
        <InnerWrapper>
          <ClassTimeWrapper bgImg={bgImg}>
            <ClassTimeCover
              bgImg={bgImg}
              logoImg={headerProps.logoImg}
              classTypeName={get(state.classType, 'name', null)}
              classTypeId={get(state.classType, '_id', null)}
              slug={get(school, 'slug', '')}
            />

            <ClassTimeInformation
              {...dataProps.eventData}
              schoolName={school.name}
              schoolCoverSrc={bgImg}
              locationData={state.location}
              website={school.website}
              classType={state.classType}
              schoolId={school._id}
              popUp={props.popUp}
              params={{ slug: school.slug }}
            />
          </ClassTimeWrapper>
          {/* <TimeLine {...dataProps.eventData} /> */}
          <MembersList
            schoolId={school._id}
            schoolName={school.name}
            classTypeName={get(state.classType, 'name', null)}
            currentView={currentView}
            classData={classData}
            instructorsData={instructorsData}
            popUp={popUp}
            instructorsIds={instructorsIds}
            params={dataProps.params}
          />
        </InnerWrapper>
      </PageContent>
      <Footer />
    </Wrapper>
  );
};
ClassDetails.propTypes = {
  noPurchasedClasses: PropTypes.bool
};

ClassDetails.defaultProps = {
  noPurchasedClasses: true
};

export default withImageExists(
  withRouter(ClassDetails),
  imageExistsBgImage);