import React,{ Component } from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import BasicDescription from './components/school/BasicDescription';
import ReviewsBar from './components/school/ReviewsBar';
import SchoolDetails from './components/school/SchoolDetails';
import ImgSlider from './components/school/ImgSlider';
import PackagesList from './components/school/prices/PackagesList';

import BrandBar from './components/BrandBar';
import ClassMap from './components/map/ClassMap';

import reviewsData from './constants/reviewsData.js';

import * as helpers from './components/jss/helpers.js';

const SchoolImgWrapper = styled.div`
  height: 400px;
`;

const SchoolImg = styled.img`
  width: 100%;
  height: 100%;
`

const MapContainer = styled.div`
  height: 400px;
`

const Wrapper = styled.div`

`;

const MainContent = styled.div`
  overflow: hidden;
  margin-top: ${helpers.oneRow * 3}px;
`;

class ClassType extends Component {
  render() {
    return (
      <Wrapper>
        <BrandBar />
        {/* Top Section After Brandbar */}
        <MainContent>
          <Grid container>
            <Grid item sm={4} xs={12}>
              <SchoolImgWrapper>
                <SchoolImg src="/images/classtype/university.jpg" />
              </SchoolImgWrapper>
            </Grid>
            <Grid item sm={4} xs={12}>
              <BasicDescription title="Class Type Description" >
                <p> Added the basic description </p>
                <p> Some </p>
              </BasicDescription>
            </Grid>
            <Grid item sm={4} xs={12}>
              <MapContainer>
                <ClassMap />
              </MapContainer>
            </Grid>
          </Grid>
        </MainContent>
      </Wrapper>
    );
  }
}

export default ClassType;
