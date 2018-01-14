import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';

import ClassTime from './ClassTime.jsx';
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
`;

const ClassTimesWrapper = styled.div`
  display: flex;
`;

const ClassTimesBar = (props) => (
  <Wrapper>
     <Typography>Class Time for {props.classTypeName}</Typography>
     <ClassTimesWrapper>
      {props.classTimesData.map(classTimeObj => (
          <ClassTime
            addToCalender={classTimeObj.addToCalender}
            timing={classTimeObj.timing}
            description={classTimeObj.description}
            scheduleType={classTimeObj.scheduleType} />
      ))}
     </ClassTimesWrapper>
  </Wrapper>
);

export default ClassTimesBar;
