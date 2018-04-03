import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import styled from 'styled-components';

import IconButton from 'material-ui/IconButton';
import {withStyles} from 'material-ui/styles';

import ClearIcon from 'material-ui-icons/Clear';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from './jss/helpers.js';

const styles = {
  iconButtonStyles : {
    cursor: 'pointer',
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  iconColorLight: {
    color: 'white'
  },
  iconColorDark: {
    color: helpers.black
  }
};

const Wrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  z-index: 1299;
  position: ${props => props.positionStatic ? 'relative' : 'absolute'};
  background: ${props => props.color};
  transition: 0.25s linear height, 0.25s linear opacity;
  height: ${props => props.isShown ? props.height + 'px' : 0};
  opacity: ${props => props.isShown ? 1 : 0};
`;

const Title = styled.p`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 500;
  line-height: 1;
  color: white;
`;

const MyLink = styled(Link)`
  font-style: italic;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  color: white;
`;

class ContactUsBar extends Component {
    state = {
      isShown: true
    }

    handleIconClick = () => {
      this.setState({
        isShown: false
      })
    }

    render() {
      const iconStyles = this.props.iconColorDark ? this.props.classes.iconColorDark : this.props.classes.iconColorLight;
      return(<Wrapper isShown={this.state.isShown} positionStatic={this.props.positionStatic} height={this.props.height} color={this.props.color}>
        <Title>Confused? Questions? <MyLink to='/contact-us'>click here</MyLink> </Title>

        <IconButton color="secondary" onClick={this.handleIconClick} classes={{root: this.props.classes.iconButtonStyles , icon : iconStyles}} >
          <ClearIcon />
        </IconButton >
      </Wrapper>)
    }
}

ContactUsBar.propTypes = {
  positionStatic: PropTypes.bool,
  height: PropTypes.string,
  color: PropTypes.string
}

ContactUsBar.defaultProps = {
  height: '32',
  positionStatic: true,
  color: helpers.primaryColor,
  iconColorDark: false,
}

export default withStyles(styles)(ContactUsBar);
