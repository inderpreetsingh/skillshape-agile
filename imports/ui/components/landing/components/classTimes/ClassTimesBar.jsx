import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import ClassTime from './ClassTime.jsx';
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexDirectionColumn}
  padding: ${helpers.rhythmDiv}px;
`;

const ClassTimesWrapper = styled.div`
  overflow: hidden;
`;

const Title = styled.h3`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.25}px;
  font-weight: 400;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ClassTimesBar = (props) => (
  <Wrapper>
     <Title>Class Time for {props.classTypeName}</Title>
     <ClassTimesWrapper>
     <Grid container>
        {props.classTimesData.map(classTimeObj => (
            <Grid item xs={12} sm={12} md={6} >
              <ClassTime
                addToCalender={classTimeObj.addToCalender}
                timing={classTimeObj.timing}
                description={classTimeObj.description}
                scheduleType={classTimeObj.scheduleType} />
            </Grid>
        ))}
      </Grid>
     </ClassTimesWrapper>
  </Wrapper>
);

export default ClassTimesBar;
