import React,{Fragment} from 'react';
import SkillShapeDialogBox from '/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx';

export function withPopUp(WrappedComponent) {
  return class extends React.Component {
    state = {
        open: false,
        applyClose: true
    }
    onClose = () => {
        this.setState({open: false});

        if(this.props.onPopUpClose && this.state.applyClose)
          this.props.onPopUpClose();
    }
    appear = (type, dialogBoxProps = {}, applyClose = true) => {
      // console.log("appear clicked..")
        this.setState({
          open: true,
          type,
          applyClose,
          dialogBoxProps
        });
    }

    render() {
        const {
            open,
            type,
            dialogBoxProps
        } = this.state;
        return  (<Fragment>
          {open && <SkillShapeDialogBox
                    open={open}
                    type={type}
                    onModalClose={this.onClose}
                    onCloseButtonClick={this.onClose}
                    {...dialogBoxProps}
                  />}
          <WrappedComponent {...this.props} popUp={{appear: this.appear}}/>
      </Fragment>)
    }
  }
}
