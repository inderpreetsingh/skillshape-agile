import React,{ Component } from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import { MuiThemeProvider } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import BasicDescription from './components/school/BasicDescription';
import ReviewsBar from './components/school/ReviewsBar';
import SchoolDetails from './components/school/details/SchoolDetails';
import ClassTypeCover from './components/school/ClassTypeCover';
import ImgSlider from './components/school/ImgSlider';
import PackagesList from './components/school/prices/PackagesList';
import SchoolOfferings from './components/school/SchoolOfferings';
import ClassTypeDescription from './components/school/ClassTypeDescription.jsx';
import ClassTypeInfo from './components/school/ClassTypeInfo.jsx';
import StarsBar from './components/StarsBar.jsx';
import ReviewsSlider from './components/school/ReviewsSlider.jsx';
import MyCalendar from './components/MyCalendar';

import BrandBar from './components/BrandBar';
import TopSearchBar from './components/TopSearchBar';
import Footer from './components/footer/index.jsx';
import ClassMap from './components/map/ClassMap';
import ClassTimesBar from './components/classTimes/ClassTimesBar';

import reviewsData from './constants/reviewsData.js';
import classTimesData from './constants/classTimesData.js';
import perClassPackagesData from './constants/perClassPackagesData.js';
import monthlyPackagesData from './constants/monthlyPackagesData.js';

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
`;

const ClassTypeDetailsWrapper = styled.div`
  ${helpers.flexDirectionColumn}
`;

const PageContentWrapper = styled.div`
  overflow: hidden;
  margin-top: ${(helpers.oneRow * 3) - helpers.rhythmDiv}px;
  width: 100%;
`;

const SectionsWrapper = styled.div`
  width: 100%;
  display: flex;

  @media screen and ( max-width: ${helpers.mobile + 100}px) {
    flex-direction: column-reverse;
  }
`;

const MainSection = styled.div`
  width: 66.66%;
  padding: ${helpers.rhythmDiv}px;

  @media screen and ( max-width: ${helpers.mobile + 100}px) {
    width: 100%;
  }
`;

const SideSection = styled.div`
  width: 33.34%;
  padding: ${helpers.rhythmDiv}px;

  @media screen and ( max-width: ${helpers.mobile + 100}px) {
    width: 100%;
  }
`;

const MediaSection = styled.div`
  width: 100%;
`;

const PricesSection = styled.div`
  width: 100%;
`;

const SectionHeader = styled.h1`
  font-family: ${helpers.specialFont};
  font-weight: 500;
  text-align: center;
  font-size: ${helpers.baseFontSize * 1.5}px;
`;

const DescriptionText = styled.p`
  font-family: ${helpers.commonFont};
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
  margin-bottom: ${helpers.rhythmDiv}px;
  border-radius: 5px;
`;

const ClassTypeForegroundImage = styled.div`
  ${helpers.coverBg}
  background-position: center center;
  background-image: url('${props => props.coverSrc}');
  height: 480px;
  border-radius: 5px;
  flex-grow: 1;

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

const ReviewsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Main = styled.div`
  max-width: ${helpers.maxContainerWidth}px;
  width: 100%;
  margin: 0 auto;
`;

const MainInner = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
`;

class ClassType extends Component {
  render() {

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Wrapper>
          {/*<TopSearchBar positionFixed={true}/> */}

          <ClassTypeCover>
            <CoverContentWrapper>
              <CoverContent>
                <ContentSection leftSection>
                  <MapContainer>
                    <ClassMap mapLocation={this.props.mapLocation}/>
                  </MapContainer>

                  <ClassTypeDescription/>
                </ContentSection>

                <ContentSection>
                  <ClassTypeForegroundImage coverSrc={settings.classTypeImgSrc} />

                  <ClassTypeInfoWrapper>
                    <ClassTypeInfo />
                  </ClassTypeInfoWrapper>

                </ContentSection>

              </CoverContent>
            </CoverContentWrapper>
          </ClassTypeCover>

          <Main>
            <MainInner>
              <ReviewsWrapper>
                <ReviewsSlider reviewsData={reviewsData}/>
                <ReviewsBar />
              </ReviewsWrapper>
            </MainInner>
          </Main>

        </Wrapper>
      </MuiThemeProvider>
    );
  }
}

export default ClassType;
