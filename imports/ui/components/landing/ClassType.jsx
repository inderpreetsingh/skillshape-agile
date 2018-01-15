import React,{ Component } from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import { MuiThemeProvider } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import BasicDescription from './components/school/BasicDescription';
import ReviewsBar from './components/school/ReviewsBar';
import SchoolDetails from './components/school/details/SchoolDetails';
import ImgSlider from './components/school/ImgSlider';
import PackagesList from './components/school/prices/PackagesList';
import SchoolOfferings from './components/school/SchoolOfferings';
import MyCalendar from './components/MyCalendar';

import BrandBar from './components/BrandBar';
import Footer from './components/footer/index.jsx';
import ClassMap from './components/map/ClassMap';
import ClassTimesBar from './components/classTimes/ClassTimesBar';

import reviewsData from './constants/reviewsData.js';
import classTimesData from './constants/classTimesData.js';
import perClassPackagesData from './constants/perClassPackagesData.js';
import monthlyPackagesData from './constants/monthlyPackagesData.js';

import * as helpers from './components/jss/helpers.js';
import muiTheme from './components/jss/muitheme.jsx';

const SchoolImgWrapper = styled.div`
  height: 400px;
`;

const SchoolImg = styled.img`
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  height: 400px;
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

class ClassType extends Component {
  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Wrapper>
          <BrandBar positionFixed={true}/>

          <PageContentWrapper>
            {/* Top Section After Brandbar */}
            <Grid container>
              <Grid item sm={4} xs={12}>
                <SchoolImgWrapper>
                  <SchoolImg src="/images/classtype/university.jpg" />
                </SchoolImgWrapper>
              </Grid>

              <Grid item sm={4} xs={12}>
                <ClassTypeDetailsWrapper>

                  <SchoolOfferings />

                  <BasicDescription title="Class Type Description" >
                    <Typography> Added the basic description </Typography>
                    <Typography> Some more description </Typography>
                  </BasicDescription>

                </ClassTypeDetailsWrapper>
              </Grid>

              <Grid item sm={4} xs={12}>
                <MapContainer>
                  <ClassMap />
                </MapContainer>
              </Grid>
            </Grid>

            <SectionsWrapper>
              <MainSection>
                <ReviewsBar totalReviews={3} averageRatings={4.5} reviewsData={reviewsData} />
                <ClassTimesBar classTimesData={classTimesData} classTypeName={'class type name'} />

              </MainSection>

              <SideSection>
                <SchoolDetails />
              </SideSection>
            </SectionsWrapper>

            <MediaSection>
              <SectionHeader>Media</SectionHeader>
              <ImgSlider />
            </MediaSection>

            <PricesSection>
              <SectionHeader>Prices</SectionHeader>
              <PackagesList monthlyPackagesData={monthlyPackagesData} perClassPackagesData={perClassPackagesData}/>
            </PricesSection>
          </PageContentWrapper>

          <Footer />
        </Wrapper>
      </MuiThemeProvider>
    );
  }
}

export default ClassType;
