import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import TermsOfServiceDetailDialogBox from '../dialogs/TermsOfServiceDetailDialogBox';
import * as helpers from '../jss/helpers';

class TermsOfServiceButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termsOfServiceDetailModal: false,
    };
  }

  render() {
    const { termsOfServiceDetailModal } = this.state;
    return (
      <Fragment>
        <Button
          style={{ width: '100%', backgroundColor: helpers.caution }}
          onClick={() => this.setState({ termsOfServiceDetailModal: true })}
        >
          {this.props.label}
        </Button>
        {termsOfServiceDetailModal && (
          <TermsOfServiceDetailDialogBox
            open={termsOfServiceDetailModal}
            onModalClose={() => this.setState({ termsOfServiceDetailModal: false })}
            onAgreeButtonClick={this.props.onAgreeButtonClick}
            onDisAgreeButtonClick={this.props.onDisAgreeButtonClick}
          />
        )}
      </Fragment>
    );
  }
}

TermsOfServiceButton.propTypes = {
  label: PropTypes.string,
};

export default TermsOfServiceButton;
