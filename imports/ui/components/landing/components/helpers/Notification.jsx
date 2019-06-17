import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ClearIcon from 'material-ui-icons/Clear';
import { withStyles } from 'material-ui/styles';

import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';

const styles = {
  icon: {
    position: 'absolute',
    right: helpers.rhythmDiv,
    top: helpers.rhythmDiv,
    color: 'white',
    cursor: 'pointer',
    height: helpers.baseFontSize,
    width: helpers.baseFontSize,
  },
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background: ${props => props.bgColor};
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 4}px;
  transition: 0.25s ease-in max-height, 0.25s linear opacity,
    0.05s linear padding 0.1s;
  opacity: 1;
  ${props => (!props.show ? 'max-height: 0; opacity: 0; padding: 0' : '')};

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

  @media screen and (max-width: ${helpers.mobile - 100}px) {
    flex-direction: column;
  }
`;

const NotificationContent = Text.extend`
  font-size: ${props => (props.smallText ? helpers.baseFontSize : helpers.baseFontSize * 1.25)}px;
  margin-right: ${helpers.rhythmDiv}px;
  margin-bottom: 0;
  color: white;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${props => (props.smallText ? helpers.baseFontSize : 18)}px;
    margin-bottom: ${helpers.rhythmDiv}px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
`;

class Notification extends Component {
  state = {
    show: true,
  };

  handleNotificationState = state => () => {
    this.setState(() => ({
      show: state,
    }));
  };

  render() {
    const {
      bgColor,
      classes,
      buttonLabel,
      onButtonClick,
      actionButton,
      smallText,
      withCloseIcon,
      notificationContent,
    } = this.props;
    return (
      <Wrapper bgColor={bgColor} show={this.state.show}>
        {withCloseIcon && (
          <ClearIcon
            classes={{ root: classes.icon }}
            onClick={this.handleNotificationState(false)}
          />
        )}
        <NotificationInnerWrapper>
          <NotificationContent smallText={smallText}>{notificationContent}</NotificationContent>
          {actionButton || (
            <ButtonWrapper>
              <FormGhostButton whiteColor label={buttonLabel} onClick={onButtonClick} />
            </ButtonWrapper>
          )}
        </NotificationInnerWrapper>
      </Wrapper>
    );
  }
}

Notification.propTypes = {
  bgColor: PropTypes.string,
  actionButton: PropTypes.element,
  withCloseIcon: PropTypes.bool,
  notificationContent: PropTypes.string,
};

Notification.defaultProps = {
  bgColor: helpers.alertColor,
  withCloseIcon: true,
  notificationContent: 'sample notification text',
};

export default withStyles(styles)(Notification);
