import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ClearIcon from "material-ui-icons/Clear";
import { withStyles } from "material-ui/styles";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    color: "white"
  }
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background: ${props => props.bgColor};
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 4}px;
  transition: 0.5s ease-in-out transform;
  transform-origin: center top;
  ${props => (!props.show ? `transform: scaleY(0)` : "")};
`;

const NotificationInnerWrapper = styled.div`
  /* prettier-ignore */
  ${helpers.flexHorizontalSpaceBetween}
  @media screen and (max-width: ${helpers.mobile}px) {
    justify-content: flex-start;
    flex-direction: column;
  }
`;

const NotificationContent = Text.extend`
  font-size: ${helpers.baseFontSize * 1.5}px;
  color: white;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize}px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  background-color: white;
`;

class Notification extends Component {
  state = {
    show: true
  };
  handleNotificationState = state => () => {
    this.setState(() => {
      return {
        show: state
      };
    });
  };
  render() {
    const {
      bgColor,
      classes,
      buttonLabel,
      onButtonClick,
      actionButton,
      notificationContent
    } = this.props;
    return (
      <Wrapper bgColor={bgColor} show={this.state.show}>
        <ClearIcon
          classes={{ root: classes.icon }}
          onClick={this.handleNotificationState(false)}
        />
        <NotificationInnerWrapper>
          <NotificationContent>{notificationContent}</NotificationContent>
          {actionButton || (
            <ButtonWrapper>
              <FormGhostButton
                alertColor
                label={buttonLabel}
                onClick={onButtonClick}
              />
            </ButtonWrapper>
          )}
        </NotificationInnerWrapper>
      </Wrapper>
    );
  }
}

Notification.propTypes = {
  bgColor: PropTypes.string,
  onPurchaseButtonClick: PropTypes.func,
  actionButton: PropTypes.element,
  notificationContent: PropTypes.string
};

Notification.defaultProps = {
  bgColor: helpers.alertColor,
  notificationContent: "sample notification text"
};

export default withStyles(styles)(Notification);
