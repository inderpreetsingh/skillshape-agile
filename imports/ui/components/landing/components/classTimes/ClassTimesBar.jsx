import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

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
  max-width: 1096px;
  margin: 0 auto;

  @media screen and (max-width: 1280px) {
    max-width: 822px;
  }

  @media screen and (max-width: 960px) {
    max-width: 548px;
  }

  @media screen and (max-width: 600px) {
    max-width: 274px;
  }
`;

const TransitionHandler = styled.div`
  transition: all .8s linear;
`;

const styles = {
  typeItem: {
    display: 'flex',
    justifyContent: 'center'
  }
}

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
      <Grid container spacing={24} justify-content='center' alignItems="center" alignContent='center'>
        {props.classTimesData.map(classTimeObj => (
          <Grid key={classTimeObj._id} item xs={12} sm={6} md={4} lg={3} className={props.classes.typeItem}>
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

export default withStyles(styles)(ClassTimesBar);
