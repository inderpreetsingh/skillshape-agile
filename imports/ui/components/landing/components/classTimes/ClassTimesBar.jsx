import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import ClassTime from './ClassTime.jsx';

import classTime from '../../constants/structure/classTime.js';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  width: 100%;
`;

const ClassTimesWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 3}px;
`;

const TransitionHandler = styled.div`
  transition: all .8s linear;
`;

const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={1000}
    classNames="fade"
  >
    {children}
  </CSSTransition>
);

const ClassTimesBar = (props) => (
  <Wrapper>
     <ClassTimesWrapper>
      <Grid container spacing={24}>
        {props.classTimesData.map(classTimeObj => (
          <Grid key={classTimeObj._id} item xs={12} sm={4} md={4} lg={3}>
            <ClassTime {...classTimeObj} />
          </Grid>
        ))}
      </Grid>
     </ClassTimesWrapper>
  </Wrapper>
);

ClassTimesBar.propTypes = {
  classTimesData: PropTypes.arrayOf(classTime),

}

export default ClassTimesBar;
