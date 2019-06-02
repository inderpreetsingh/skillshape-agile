import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton';

class JoinButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openSignUpModal = (userType) => {
    this.setState({ joinModal: false }, () => {
      Events.trigger('registerAsSchool', { userType });
    });
  };

  render() {
    const { fullWidth, currentUser } = this.props;

    return (
      <Fragment>
        {isEmpty(currentUser) && (
          <SecondaryButton
            noMarginBottom
            fullWidth={fullWidth}
            label={this.props.label}
            icon={!currentUser}
            iconName="assignment_ind"
            onClick={() => this.openSignUpModal('Student')}
          />
        )}
      </Fragment>
    );
  }
}

JoinButton.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
};

JoinButton.defaultProps = {
  fullWidth: false,
};

export default JoinButton;
