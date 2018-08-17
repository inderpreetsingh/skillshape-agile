import React, { Fragment } from "react";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";

export function withPopUp(WrappedComponent) {
  return class extends React.Component {
    state = {
      open: false,
      applyClose: true
    };
    onClose = () => {
      this.setState({ open: false });

      if (this.props.onPopUpClose && this.state.applyClose)
        this.props.onPopUpClose();
    };
    appear = (type, dialogBoxProps = {}, applyClose = true) => {
      // console.log("appear clicked..")
      this.setState({
        open: true,
        type,
        applyClose,
        dialogBoxProps
      });
    };

    onAffirmationButtonClick = () => {
      if (this.state.applyClose) {
        this.onClose();
      }
      if(this.state.dialogBoxProps.onAffirmationButtonClick){
        this.state.dialogBoxProps.onAffirmationButtonClick();
      }
    };

    render() {
      const { open, type, dialogBoxProps } = this.state;
     // console.log(this.state, "this.state... withPopUp");
      return (
        <Fragment>
          {open && (
            <SkillShapeDialogBox
              open={open}
              type={type}
              onModalClose={this.onClose}
              onCloseButtonClick={this.onClose}
              onAffirmationButtonClick={this.onAffirmationButtonClick}
              {...dialogBoxProps}
            />
          )}
          <WrappedComponent {...this.props} popUp={{ appear: this.appear }} />
        </Fragment>
      );
    }
  };
}
