import React, { Fragment } from "react";
import { Meteor } from "meteor/meteor";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";

export function withPopUp(WrappedComponent) {
  const DEFAULT_AUTO_TIMEOUT = 4000;
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = this._initializeState();
    }

    _startTimer = autoTimeout => {
      Meteor.setTimeout(this.handleClose, autoTimeout);
    };

    _initializeState = () => {
      return {
        open: false,
        type: '',
        applyClose: true,
        dialogBoxProps: {},
        popUpProps: {
          purpose: '',
          autoClose: false
        }
      }
    }

    handleModalClose = () => {
      this.setState({ open: false });
      const { applyClose, dialogBoxProps: { onPopUpClose } } = this.state;

      if (onPopUpClose && applyClose) {
        onPopUpClose();
      }
    };

    handleClose = () => {
      this.setState({ open: false });
    }

    close = () => {
      const initialState = this._initializeState();
      this.setState(currentState => {
        return {
          ...currentState,
          ...initialState
        }
      });
    }

    isPopupActive = () => {
      return this.state.open;
    }

    appear = (
      type,
      dialogBoxProps = {},
      applyClose = true,
      popUpProps = {
        purpose: "", //This prop can help us track the purpose of the popup
        autoClose: false
      }
    ) => {
      this.setState({
        open: true,
        type,
        applyClose,
        dialogBoxProps,
        popUpProps
      });

      if (popUpProps.autoClose) {
        this._startTimer(popUpProps.autoTimeout || DEFAULT_AUTO_TIMEOUT);
      }
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
      const { open, type, dialogBoxProps, popUpProps } = this.state;
      return (
        <Fragment>
          {open && (
            <SkillShapeDialogBox
              open={open}
              type={type}
              {...dialogBoxProps}
              onModalClose={this.handleModalClose}
              onCloseButtonClick={this.handleClose}
              onAffirmationButtonClick={this.handleAffirmationButtonClick}
            />
          )}
          <WrappedComponent
            {...this.props}
            popUp={{
              appear: this.appear,
              close: this.close,
              isPopupActive: this.isPopupActive,
              details: {
                type: type, purpose: popUpProps.purpose
              }
            }} />
        </Fragment>
      );
    }
  };
}
