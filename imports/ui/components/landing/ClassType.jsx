import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import { MuiThemeProvider } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import ReviewsBar from './components/school/ReviewsBar';
import ClassTypeCover from './components/school/ClassTypeCover';
import PackagesList from './components/school/packages/PackagesList'
import ImgSlider from './components/school/ImgSlider';
import ReviewsSlider from './components/school/ReviewsSlider.jsx';
import SchoolOfferings from './components/school/SchoolOfferings';
import ClassTypeDescription from './components/school/ClassTypeDescription.jsx';
import ClassTypeInfo from './components/school/ClassTypeInfo.jsx';

import StarsBar from './components/StarsBar.jsx';
import ClassTimesSlider from './components/classTimes/ClassTimesSlider.jsx';
import MyCalendar from './components/MyCalendar';
import BrandBar from './components/BrandBar';
import TopSearchBar from './components/TopSearchBar';
import Footer from './components/footer/index.jsx';
import ClassMap from './components/map/ClassMap';
import ClassTimesBar from './components/classTimes/ClassTimesBar';

import reviewsData from './constants/reviewsData.js';
import classTimesBarData from './constants/classTimesBarData.js';
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
  width: 100%;
  margin: 0 auto;
  margin-bottom: ${helpers.rhythmDiv * 8}px;
`;

const ClassTimesWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const ClassTimesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  margin-bottom: ${helpers.rhythmDiv * 3}px;
`;

const Main = styled.div`
  max-width: ${helpers.maxContainerWidth}px;
  width: 100%;
  margin: 0 auto;
`;

const MainInner = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  overflow: hidden;

  @media screen and (max-width : ${helpers.mobile}) {
    padding: ${helpers.rhythmDiv}px;
  }
`;

const PackagesWrapper = styled.div`
  ${helpers.flexDirectionColumn}
  width: 100%;
`;

const PackagesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
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

                  <ClassTypeDescription />
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
                <ReviewsSlider data={reviewsData} padding={helpers.rhythmDiv}/>
              </ReviewsWrapper>

              <ClassTimesWrapper>
                <ClassTimesTitle>Class timings for {this.props.className}</ClassTimesTitle>
                <ClassTimesBar classTimesData={classTimesBarData} />
              </ClassTimesWrapper>
            </MainInner>

            <PackagesWrapper>
              <PackagesTitle>Pay only for what you need</PackagesTitle>
              <PackagesList
                perClassPackagesData={perClassPackagesData}
                monthlyPackagesData={monthlyPackagesData}
              />
            </PackagesWrapper>
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
