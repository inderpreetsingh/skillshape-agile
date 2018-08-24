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
    right: helpers.rhythmDiv,
    top: helpers.rhythmDiv,
    color: "white",
    cursor: "pointer",
    height: helpers.baseFontSize,
    width: helpers.baseFontSize
  }
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background: ${props => props.bgColor};
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 4}px;
  transition: 0.25s ease-in max-height, 0.25s linear opacity,
    0.05s linear padding 0.1s;
  opacity: 1;
  max-height: 160px;
  ${props => (!props.show ? `max-height: 0; opacity: 0; padding: 0` : "")};

  @media screen and (max-width: ${helpers.mobile}px) {
    // padding: ${helpers.rhythmDiv * 2}px;
  }
`;

const NotificationInnerWrapper = styled.div`
  /* prettier-ignore */
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet}px) {
    /* prettier-ignore */
    ${helpers.flexHorizontalSpaceBetween}
  }
`;

const NotificationContent = Text.extend`
  font-size: ${helpers.baseFontSize * 1.25}px;
  margin-right: ${helpers.rhythmDiv}px;
  color: white;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: 18px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
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
                whiteColor
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
