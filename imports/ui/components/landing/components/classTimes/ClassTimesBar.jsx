import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import ClassTime from './ClassTime.jsx';
import classTime from '../../constants/structure/classTime.js';

import  {getContainerMaxWidth} from '../../../../../util/cards.js';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  width: 100%;
`;

const styles = {
  typeItem: {
    display: 'flex',
    justifyContent: 'center'
  }
}


const CARD_WIDTH = 250;


const ClassTimesWrapper = styled.div`
  max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,4)}px;
  margin: 0 auto;

  @media screen and (max-width : 1200px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,3)}px;
  }

  @media screen and (max-width : 960px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,2)}px;
  }

  @media screen and (max-width : 600px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,1)}px;
  }
`;

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
