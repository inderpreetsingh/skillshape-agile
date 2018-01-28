import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import ClassTime from './ClassTime.jsx';
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  width: 100%;
`;

const ClassTimesWrapper = styled.div`
  overflow: hidden;
`;

const Title = styled.h3`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.25}px;
  font-weight: 400;
  font-style: italic;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ClassTimesBar = (props) => (
  <Wrapper>
     <Title>Class Timings for {props.classTypeName}</Title>
     <ClassTimesWrapper>
      <Grid container>
        {props.classTimesData.map(classTimeObj => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ClassTime {...classTimeObj} />
          </Grid>
        ))}
      </Grid>
     </ClassTimesWrapper>
  </Wrapper>
);

export default ClassTimesBar;
