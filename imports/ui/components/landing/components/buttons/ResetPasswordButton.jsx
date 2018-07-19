import React, { Component, Fragment } from "react";
import { isEmpty, get } from "lodash";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";

import { emailRegex, toastrModal } from "/imports/util";

import SecondaryButton from "/imports/ui/components/landing/components/buttons/SecondaryButton.jsx";
import ResetPasswordDialogBox from "/imports/ui/components/landing/components/dialogs/ResetPasswordDialogBox.jsx";

class ResetPasswordButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetModal: false,
      error: {},
      email: "",
      loading: false
    };
  }

  handleResetPasswordModalState = state => {
    this.setState({ resetModal: state });
  };

  handleInputChange = event => {
    const { error } = this.state;
    const email = event.target.value;
    error.email = false;
    if (!emailRegex.email.test(email)) {
      error.email = true;
    }
    this.setState({ error, email });
  };

  onSubmit = event => {
    const { email, error } = this.state;
    event.preventDefault();
    let stateObj = { ...this.state };
    if (email) {
      this.setState({ loading: true });
      Accounts.forgotPassword({ email }, (err, res) => {
        stateObj.loading = false;
        if (err) {
          stateObj.error.message = err.reason || err.message;
          stateObj.resetModal = true;
        } else {
          stateObj.resetModal = false;
          this.props.toastr.success(
            "We send a reset password link, Please check your inbox!!",
            "success"
          );
        }

        this.setState(stateObj);
      });
    } else {
      stateObj.error.message = "Enter Email Address";
      this.setState(stateObj);
    }
  };

  render() {
    const { resetModal } = this.state;
    return (
      <Fragment>
        <SecondaryButton
          label="Recover Password"
          onClick={() => this.handleResetPasswordModalState(true)}
        />
        {resetModal && (
          <ResetPasswordDialogBox
            {...this.state}
            open={resetModal}
            onModalClose={() => this.handleResetPasswordModalState(false)}
            handleInputChange={this.handleInputChange}
            resetPasswordFormSubmit={this.onSubmit}
          />
        )}
      </Fragment>
    );
  }
}

export default toastrModal(ResetPasswordButton);
