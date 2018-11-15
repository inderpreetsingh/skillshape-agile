import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import ClassTypeCover from './components/class/cover/ClassTypeCover.jsx';
import ClassTypeCoverContent from './components/class/cover/ClassTypeCoverContent.jsx';
import SchoolDetails from './components/class/details/SchoolDetails.jsx';
import PackagesList from './components/class/packages/PackagesList.jsx';
import ClassTimesBoxes from './components/classTimes/ClassTimesBoxes';
import Footer from './components/footer/index.jsx';
import * as helpers from './components/jss/helpers.js';
import TopSearchBar from './components/TopSearchBar';
import classTimesBarData from './constants/classTimesBarData.js';
import classTypeData from './constants/classTypeData.js';
import monthlyPackagesData from './constants/monthlyPackagesData.js';
import perClassPackagesData from './constants/perClassPackagesData.js';
import schoolDetails from './constants/schoolDetailsData.js';
import schoolImages from './constants/schoolImgSliderData.js';
import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar/index.js';






const SchoolImgWrapper = styled.div`
  height: 400px;
`;

const SchoolImg = styled.img`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  width: 100%;
`;

const Main = styled.main`
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    overflow: hidden;
  }
`;

const MainInnerFixedContainer = styled.div`
  max-width: ${props => props.fixedWidth ? props.fixedWidth : helpers.maxContainerWidth}px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : helpers.rhythmDiv * 2}px;
`;

const MainInner = styled.div`
  padding: ${props => props.largePadding ? props.largePadding : helpers.rhythmDiv * 2}px;
  overflow: ${props => (props.reviews || props.classTimes) ? 'hidden' : 'initial' };

  @media screen and (max-width : ${helpers.mobile}px) {
    padding: ${props => props.smallPadding ? props.smallPadding : helpers.rhythmDiv * 2}px;
  }
`;

const ClassTypeDetailsWrapper = styled.div`
  ${helpers.flexDirectionColumn}
`;

const ClassWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding-bottom: ${props => props.paddingBottom ? props.paddingBottom: 0}px;
  }
`;

const ClassTimesWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 4}px;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding-bottom: ${props => props.paddingBottom ? props.paddingBottom: 0}px;
    margin-bottom: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-bottom: ${helpers.rhythmDiv * 4}px;
  }
`;

const ClassTimesInnerWrapper = styled.div`
  padding: 0px;
  overflow: hidden;

  @media screen and (max-width : ${helpers.mobile}px) {
    padding: ${props => props.smallPadding ? props.smallPadding : helpers.rhythmDiv * 2}px;
    padding-top: 0;
  }
`;

const ClassTimesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  line-height: 1;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: 0;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }
`;

const ClassTimesName = styled.span`
  text-transform: capitalize;
`;

const PackagesWrapper = styled.div`
  ${helpers.flexDirectionColumn}
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv * 8}px;
`;

const PackagesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const CalendarWrapper = styled.div`
   _box-shadow: 0px 0px 5px 1px rgba(221,221,221,1);
   border: 1px solid rgba(221,221,221,1);
`;

class ClassType extends Component {
  render() {
    return (<Wrapper className="classtype-page">
        <div>
          <TopSearchBar />
        </div>
        {/* Class Type Cover includes description, map, foreground image, then class type information*/}
        <ClassTypeCover coverSrc={this.props.coverSrc}>
          <ClassTypeCoverContent
            schoolDetails={{...schoolDetailsData}}
            classTypeData={{...classTypeData}}
            onCallUsButtonClick={this.props.onCallUsButtonClick}
            onEmailButtonClick={this.props.onEmailButtonClick}
            onPricingButtonClick={this.props.onPricingButtonClick}
            mapLocation={this.props.mapLocation}
          />
        </ClassTypeCover>

        {/* Main section includes reviews slider, class timing boxes(+ slider), pricing section, about school section, calendar */}
        <Main>
          <MainInnerFixedContainer marginBottom="32">
            <MainInner reviews largePadding="32" smallPadding="32">
              <ClassWrapper>
                {/*<ReviewsManager reviewsData={reviewsData} /> */}
              </ClassWrapper>
            </MainInner>
          </MainInnerFixedContainer>

          <MainInnerFixedContainer marginBottom="16">
            <ClassTimesInnerWrapper>
              <ClassTimesWrapper paddingBottom="48">
                <ClassTimesTitle>Class timings for <ClassTimesName>{this.props.className.toLowerCase()}</ClassTimesName></ClassTimesTitle>
                <ClassTimesBoxes classTimesData={classTimesBarData} />
              </ClassTimesWrapper>
            </ClassTimesInnerWrapper>
          </MainInnerFixedContainer>

          <PackagesWrapper>
            <PackagesTitle>Pay only for what you need</PackagesTitle>
            <PackagesList
              perClassPackagesData={perClassPackagesData}
              monthlyPackagesData={monthlyPackagesData}
            />
          </PackagesWrapper>

          <MainInnerFixedContainer fixedWidth="1100" marginBottom="64">
            <SchoolDetails
              website={schoolDetails.website}
              address={schoolDetails.address}
              images={schoolImages}
              schoolName={schoolDetails.name}
              notes={schoolDetails.notes}
              description={schoolDetails.fullDescription}
            />
            <CalendarWrapper>
              <ManageMyCalendar classCalendar={true} {...this.props}/>
            </CalendarWrapper>
          </MainInnerFixedContainer>

          <Footer />
        </Main>
      </Wrapper>
    );
  }
}

ClassType.propsTypes = {
  className: PropTypes.string
}

ClassType.defaultProps = {
  className: 'naam yoga'
}

export default ClassType;
