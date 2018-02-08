import React, {Component} from 'react';
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
  max-width: 1144px;
  margin: 0 auto;

  @media screen and (max-width : 1191px) {
    max-width: 858px;
  }

  @media screen and (max-width : 910px) {
    max-width: 572px;
  }

  @media screen and (max-width: 627px) {
    max-width: 286px;
  }
`;

const styles = {
  typeItem: {
    display: 'flex',
    justifyContent: 'center'
  }
}

const GridContainer = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const GridItem = styled.div`
  padding: ${props => props.spacing ? props.spacing/2 : '16'}px;
`;

const ClassTimesBar = (props) => (
  <Wrapper>
     <ClassTimesWrapper>
      <GridContainer>
        {props.classTimesData.map(classTimeObj => (
          <GridItem key={classTimeObj._id} spacing={32}>
            <ClassTime {...classTimeObj} />
          </GridItem>
        ))}
      </GridContainer>
     </ClassTimesWrapper>
  </Wrapper>
);

ClassTimesBar.propTypes = {
  classTimesData: PropTypes.arrayOf(classTime),
}

export default withStyles(styles)(ClassTimesBar);
