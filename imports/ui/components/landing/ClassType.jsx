import React,{ Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import { MuiThemeProvider } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import ReviewsBar from './components/school/ReviewsBar.jsx';
import ClassTypeCover from './components/school/ClassTypeCover.jsx';
import PackagesList from './components/school/packages/PackagesList.jsx';
import ImgSlider from './components/school/ImgSlider.jsx';
import SchoolDetails from './components/school/details/SchoolDetails.jsx';
import ReviewsSlider from './components/school/ReviewsSlider.jsx';
import ClassTypeDescription from './components/school/ClassTypeDescription.jsx';
import ClassTypeInfo from './components/school/ClassTypeInfo.jsx';
import MyCalendar from '../users/myCalender';

import StarsBar from './components/StarsBar.jsx';
import ClassTimesSlider from './components/classTimes/ClassTimesSlider.jsx';
import BrandBar from './components/BrandBar';
import TopSearchBar from './components/TopSearchBar';
import Footer from './components/footer/index.jsx';
import ClassMap from './components/map/ClassMap';
import ClassTimesBoxes from './components/classTimes/ClassTimesBoxes';
import ClassTimeButton from './components/buttons/ClassTimeButton.jsx';
import SkillShapeButton from './components/buttons/SkillShapeButton.jsx';

import reviewsData from './constants/reviewsData.js';
import classTimesBarData from './constants/classTimesBarData.js';
import perClassPackagesData from './constants/perClassPackagesData.js';
import monthlyPackagesData from './constants/monthlyPackagesData.js';
import schoolImages from './constants/schoolImgSliderData.js';
import schoolDetails from './constants/schoolDetailsData.js';
import classTypeData from './constants/classTypeData.js';

import * as helpers from './components/jss/helpers.js';
import * as settings from './site-settings.js';
import muiTheme from './components/jss/muitheme.jsx';

const SchoolImgWrapper = styled.div`
  height: 400px;
`;

const SchoolImg = styled.img`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  width: 100%;
  margin-top: 66px;
`;

const ClassTypeDetailsWrapper = styled.div`
  ${helpers.flexDirectionColumn}
`;

const DescriptionText = styled.p`
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
`;

const CoverContent = styled.div`
  display: flex;
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
  z-index: 16;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const CoverContentWrapper = styled.div`
  max-width: ${helpers.maxContainerWidth}px;
  width: 100%;
  margin: 0 auto;
`;

const MapContainer = styled.div`
  height: 320px;
  max-width: 496px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  border-radius: 5px;
`;

const ClassTypeForegroundImage = styled.div`
  ${helpers.coverBg}
  background-position: center center;
  background-image: url('${props => props.coverSrc}');
  height: 480px;
  border-radius: 5px;
  flex-grow: 1;
  position: relative;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: none;
  }
`;

const ContentSection = styled.div`
  margin-right:${props => props.leftSection ? `${helpers.rhythmDiv * 2}px` : 0 };
  flex-grow: ${props => props.leftSection ? 0 : 1 };
  display: flex;
  flex-direction: column;
  align-items: ${props => props.leftSection ? 'initial' : 'stretch' };

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-right: 0;
  }
`;

const ClassTypeInfoWrapper = styled.div`

`;

const ClassWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: ${props => props.reviews ? helpers.rhythmDiv * 8 : 0}px;
`;

const ClassTimesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  line-height: 1;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
  padding: 0;
`;

const Main = styled.main`
  width: 100%;
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

const PackagesWrapper = styled.div`
  ${helpers.flexDirectionColumn}
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
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

const ActionButtonsWrapper = styled.div`
  position: absolute;
  left: ${helpers.rhythmDiv}px;
  bottom: ${helpers.rhythmDiv * 2}px;
  right: auto;
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const ActionButton = styled.div`
  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

class ClassType extends Component {
  render() {

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Wrapper>
          {/*<TopSearchBar positionFixed={true}/> */}
          <BrandBar barButton={<Fragment></Fragment>} />

          {/* Class Type Cover includes description, map, foreground image, then class type information*/}
          <ClassTypeCover>
            <CoverContentWrapper>
              <CoverContent>
                <ContentSection leftSection>
                  <MapContainer>
                    <ClassMap mapLocation={this.props.mapLocation}/>
                  </MapContainer>

                  <ClassTypeDescription
                    schoolName={schoolDetails.schoolName}
                    description={schoolDetails.fullDescription}
                    classTypeName={schoolDetails.classTypeName}
                    noOfStars={schoolDetails.noOfStars}
                    noOfReviews={schoolDetails.noOfReviews}
                  />
                </ContentSection>

                <ContentSection>
                  <ClassTypeForegroundImage coverSrc={settings.classTypeImgSrc} >

                    <ActionButtonsWrapper>

                      <ActionButton>
                        <ClassTimeButton icon iconName='phone' label="Call Us" onClick={this.props.onCallUsButtonClick}/>
                      </ActionButton>

                      <ActionButton>
                        <ClassTimeButton secondary noMarginBottom label="Email Us" icon iconName="email" onClick={this.props.onEmailButtonClick} />
                      </ActionButton>

                        <ClassTimeButton secondary noMarginBottom label="Pricing" onClick={this.props.onPricingButtonClick} />

                    </ActionButtonsWrapper>

                  </ClassTypeForegroundImage>

                  <ClassTypeInfoWrapper>
                    <ClassTypeInfo
                      ageRange={classTypeData.ageRange}
                      gender={classTypeData.gender}
                      experience={classTypeData.experience}
                      subjects={classTypeData.subjects}
                    />
                  </ClassTypeInfoWrapper>

                </ContentSection>

              </CoverContent>
            </CoverContentWrapper>
          </ClassTypeCover>

          {/* Main section includes reviews slider, class timing boxes(+ slider), pricing section, about school section, calendar */}
          <Main>
            <MainInnerFixedContainer marginBottom="0">
              <MainInner reviews largePadding="32" smallPadding="32">
                <ClassWrapper reviews>
                  <ReviewsSlider data={reviewsData} padding={helpers.rhythmDiv}/>
                </ClassWrapper>

                <ClassWrapper>
                  <ClassTimesTitle>Class timings for {this.props.className}</ClassTimesTitle>
                  <ClassTimesBoxes classTimesData={classTimesBarData} />
                </ClassWrapper>
              </MainInner>
            </MainInnerFixedContainer>

            <PackagesWrapper>
              <PackagesTitle>Pay only for what you need</PackagesTitle>
              <PackagesList
                perClassPackagesData={perClassPackagesData}
                monthlyPackagesData={monthlyPackagesData}
              />
            </PackagesWrapper>

            <MainInnerFixedContainer fixedWidth="1100" marginBottom="32">
              <SchoolDetails
                website={schoolDetails.website}
                address={schoolDetails.address}
                images={schoolImages}
                schoolName={schoolDetails.schoolName}
                notes={schoolDetails.notes}
                description={schoolDetails.fullDescription}
              />
              <CalendarWrapper>
                <MyCalendar />
              </CalendarWrapper>
            </MainInnerFixedContainer>

            <Footer />

          </Main>
        </Wrapper>
      </MuiThemeProvider>
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
