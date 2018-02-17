import React,{Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import muiTheme from '../jss/muitheme.jsx';
import * as helpers from '../jss/helpers.js';

const styles = {
  iconStyles: {
    display: 'inline-block',
    margin: 0,
    marginLeft : `${helpers.rhythmDiv}px`,
    fontSize: `${helpers.baseFontSize * 0.75}px`,
    fontWeight: 700,
    color: `${helpers.headingColor}`,
    paddingTop: '1px',
  },
  withCardsIcon: {
    marginLeft: 0,
    fontSize: `${helpers.baseFontSize * 1.5}px`,
    color: 'white'
  }
}

const Wrapper = styled.div`
  ${helpers.flexCenter}
  background-color: ${props => props.cardsView ?  helpers.danger : 'white'};
  border-radius: ${props => props.cardsView ?  '50%' : '20px'};
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
`;

const ButtonContainer = styled.div`
  ${helpers.flexCenter}
  flex-direction: ${props => props.cardsView ? 'column-reverse' : 'row'};
  cursor: pointer;
`;

const Seperator = styled.div`
  display: inline-block;
  margin: 0 ${helpers.rhythmDiv}px;
`;

const Text = styled.div`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 0.75}px;
  font-style: normal;
  font-weight:${props => props.cardsView ? 500 : 700};
  color: ${props => props.cardsView ? 'white' : helpers.headingColor};
`;

const FloatingChangeViewButton = (props) => {
  let iconStyles = `${props.classes.iconStyles}`;
  if(props.cardsView) {
    iconStyles = iconStyles + ' ' + props.classes.withCardsIcon;
  }
  return (<Wrapper cardsView={props.cardsView}>
      <ButtonContainer cardsView={props.cardsView} onClick={props.onListButtonClick}>
        <Text cardsView={props.cardsView}>{props.label}</Text>
        <Icon className={iconStyles}>{props.iconName}</Icon>
      </ButtonContainer>
    </Wrapper>)
}

FloatingChangeViewButton.propTypes = {
  onListButtonClick: PropTypes.func,
  onShowFilterPanelClick: PropTypes.func,
  label: PropTypes.string,
  iconName: PropTypes.string,
  cardsView: true
}

FloatingChangeViewButton.defaultProps = {
  label: 'LIST',
  iconName: 'grid_on',
  cardsView: false
}

export default withStyles(styles)(FloatingChangeViewButton);
