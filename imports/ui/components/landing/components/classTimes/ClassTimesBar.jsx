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

const CARD_WIDTH = 250;

const getContainerMaxWidth = (spacing, noOfCards) => {
  return (spacing * noOfCards) + (CARD_WIDTH * noOfCards);
}

const ClassTimesWrapper = styled.div`
  max-width: ${props => getContainerMaxWidth(props.spacing,4)}px;
  margin: 0 auto;

  @media screen and (max-width : 1280px) {
    max-width: ${props => getContainerMaxWidth(props.spacing,3)}px;
  }

  @media screen and (max-width : 960px) {
    max-width: ${props => getContainerMaxWidth(props.spacing,2)}px;
  }

  @media screen and (max-width : 600px) {
    max-width: ${props => getContainerMaxWidth(props.spacing,1)}px;
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
     <ClassTimesWrapper spacing={32}>
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
