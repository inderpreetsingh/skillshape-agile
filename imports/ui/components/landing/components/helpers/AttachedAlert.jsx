import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";

import { withStyles } from "material-ui/styles";
import Icon from "material-ui/Icon";

import {
  black,
  primaryColor,
  information,
  flexCenter,
  baseFontSize,
  rhythmDiv
} from "/imports/ui/components/landing/components/jss/helpers.js";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";

const Wrapper = styled.div`
  height: 30px;
  &::after {
    clear: both;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  padding: 0 ${rhythmDiv}px;
  max-width: ${props => (props.open ? "100%" : "30px")};
  width: 100%;
  background: ${props =>
    props.open ? props.color || information : "transparent"};
  transition: 0.3s max-width linear, 0.1s background linear;
  height: 100%;
  float: right;
`;

const AlertContent = Text.extend`
  color: white;
  margin-bottom: 0;
  margin-right: ${rhythmDiv}px;
  transform-origin: top left;
`;

const styles = {
  icon: {
    fontSize: baseFontSize,
    transition: "0.1s color linear"
  },
  isOpen: {
    color: "white"
  },
  isClosed: {
    color: black
  }
};

class AttachedAlert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.open)
      this.setState(state => {
        return {
          ...state,
          open: nextProps.open
        };
      });
  }

  render() {
    const { open } = this.state;
    const { bgColor, classes, iconName, alertMsg } = this.props;
    const alertOpenIconClasses = [classes.icon, classes.isOpen].join(" ");
    const alertCloseIconClases = [classes.icon, classes.isClosed].join(" ");
    return (
      <Wrapper>
        <InnerWrapper open={open} color={bgColor}>
          <CSSTransition
            in={open}
            timeout={200}
            classNames="message"
            unmountOnExit
          >
            <AlertContent>{alertMsg}</AlertContent>
          </CSSTransition>
          <Icon className={open ? alertOpenIconClasses : alertCloseIconClases}>
            {iconName}
          </Icon>
        </InnerWrapper>
      </Wrapper>
    );
  }
}

AttachedAlert.propTypes = {
  iconName: PropTypes.string,
  alertMsg: PropTypes.string
};

AttachedAlert.defaultProps = {
  iconName: "info",
  alertMsg: "Hi this is sample alert"
};

export default withStyles(styles)(AttachedAlert);
