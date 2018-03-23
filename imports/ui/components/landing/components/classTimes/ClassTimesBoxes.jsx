import React, { Component , Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ClassTimesSlider from './ClassTimesSlider.jsx';
import ClassTimesBar from './ClassTimesBar.jsx';

import classTime from '../../constants/structure/classTime.js';
import * as helpers from '../jss/helpers.js';

const SliderWrapper = styled.div`
  display: none;
  @media screen and (max-width: ${helpers.mobile + 100}px ) {
    display: block;
  }
`;

const BarWrapper = styled.div`
  display: block;
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    display: none;
  }
`;

class ClassTimesBoxes extends Component {
  render() {
    const { classTimesData} = this.props;
    // console.log("ClassTimesBoxes props-->>",this.props, slider);
    return (<Fragment>
        <SliderWrapper>
          <ClassTimesSlider data={classTimesData} padding={helpers.rhythmDiv} />
        </SliderWrapper>
        <BarWrapper>
          <ClassTimesBar classTimesData={classTimesData} />
        </BarWrapper>
    </Fragment>)
  }
}

ClassTimesBoxes.propTypes = {
  classTimesData: PropTypes.arrayOf(classTime),
}

export default ClassTimesBoxes;
