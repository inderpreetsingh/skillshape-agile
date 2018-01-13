import React,{ Component } from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import ReviewsBar from './components/school/ReviewsBar';
import SchoolDetails from './components/school/SchoolDetails';
import ImgSlider from './components/school/ImgSlider';
import PackagesList from './components/school/prices/PackagesList';

import reviewsData from './constants/reviewsData.js';

const SchoolImgWrapper = styled.div`
  height: 400px;
`;

class ClassType extends Component {
  render() {
    return (
      <Grid container>
        <Grid item sm={4} xs={12}>
          <SchoolImgWrapper>
            <img src="/images/classtype/university.jpg" />
          </SchoolImgWrapper>
        </Grid>
        <Grid item sm={4} xs={12}>
          
        </Grid>
        <Grid item sm={4} xs={12}>
        </Grid>
      </Grid>
    );
  }
}

export default ClassType;
