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
  }
}

const Wrapper = styled.div`
  ${helpers.flexCenter}
  background-color: white;
  border-radius: 20px;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
`;

const ButtonContainer = styled.div`
  ${helpers.flexCenter}
  font-size: ${helpers.baseFontSize * 0.75}px;
  font-weight: 700;
  color: ${helpers.headingColor};
  cursor: pointer;
`;

const Seperator = styled.div`
  display: inline-block;
  margin: 0 ${helpers.rhythmDiv}px;
`;

const Text = styled.div`
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize * 0.75}px;
  font-weight: 700;
  color: ${helpers.headingColor};
`;

const FloatingMapButton = (props) => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <Wrapper>
        <ButtonContainer onClick={props.onListButtonClick}>
          <Text>LIST</Text>
          <Icon className={props.classes.iconStyles}>grid_on</Icon>
        </ButtonContainer>
      </Wrapper>
    </MuiThemeProvider>
  )
}

FloatingMapButton.propTypes = {
  onListButtonClick: PropTypes.func,
  onShowFilterPanelClick: PropTypes.func
}

export default withStyles(styles)(FloatingMapButton);
