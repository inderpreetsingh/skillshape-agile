import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui-icons/Clear';
import MoreVert from 'material-ui-icons/MoreVert';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer'
  },
  cardIconButton : {
    borderRadius: '50%',
    minWidth: '0',
    minHeight: '0',
    padding: `0 ${helpers.rhythmDiv}px`,
    height: helpers.rhythmDiv * 4,
    width: helpers.rhythmDiv * 4,
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.1), 1px 0px 1px 1px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'white'
    }
  }
}

const IconButtonWrapper = styled.div`
  position: absolute;
  bottom: ${props => props.closeButton ? 'initial' : 0};
  top: ${props => props.closeButton ? 0 : 'initial'};
  right: 16px;
  transform: translateY(${props => props.closeButton ? '-50%' : '50%'});
  transition: ${props => props.revealCard ? 'none' : 'opacity .1s linear .15s'};
  transition: ${props => props.closeButton && 'none'};
  opacity: ${props => props.revealCard ? '0' : '1'};
  opacity: ${props => props.closeButton && 1};
`;

const CardTopArea = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const CardsContent = styled.div`
`;


const ClassTimesCard = (props) =>  {
  const {classes} = props;

  return (<Paper className={classes.cardWrapper} itemScope itemType="http://schema.org/Service">
    <CardTopArea>
      <IconButtonWrapper revealCard={props.revealCard} closeButton>
      <IconButton className={props.classes.cardIconButton} variant="fab" color="secondary" aria-label="close" onClick={props.hideCardContent}>
        <Icon>clear</Icon>
      </IconButton>
      </IconButtonWrapper>
    </CardTopArea>

    <CardContent>

    </CardContent>
  </Paper>)

}

export default withStyles(styles)(ClassTimesCard);
