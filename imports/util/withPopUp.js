import React, { Fragment } from "react";
import { Meteor } from "meteor/meteor";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";

export function withPopUp(WrappedComponent) {
  const DEFAULT_AUTO_TIMEOUT = 2000;
  return class extends React.Component {
    state = {
      open: false,
      applyClose: true
    };
    handleClose = () => {
      this.setState({ open: false });

      if (this.props.onPopUpClose && this.state.applyClose)
        this.props.onPopUpClose();
    };
    appear = (
      type,
      dialogBoxProps = {},
      applyClose = true,
      popUpProps = {
        autoClose: false
      }
    ) => {
      this.setState({
        open: true,
        type,
        applyClose,
        dialogBoxProps
      });

      if (popUpProps.autoClose) {
        this._startTimer(popUpProps.autoTimeout || DEFAULT_AUTO_TIMEOUT);
      }
    };

    _startTimer = autoTimeout => {
      Meteor.setTimeout(this.handleClose, autoTimeout);
    };

    handleAffirmationButtonClick = () => {
      if (this.state.applyClose) {
        this.handleClose();
      }
      if (this.state.dialogBoxProps.onAffirmationButtonClick) {
        this.state.dialogBoxProps.onAffirmationButtonClick();
      }
    };

    render() {
      const { open, type, dialogBoxProps } = this.state;
      return (
        <Fragment>
          {open && (
            <SkillShapeDialogBox
              open={open}
              type={type}
              {...dialogBoxProps}
              onModalClose={this.handleClose}
              onCloseButtonClick={this.handleClose}
              onAffirmationButtonClick={this.handleAffirmationButtonClick}
            />
          )}
          <WrappedComponent {...this.props} popUp={{ appear: this.appear }} />
        </Fragment>
      );
    }
  };
}
