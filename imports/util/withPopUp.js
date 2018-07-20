import React,{Fragment} from 'react';
import SkillShapeDefaultDialogBox from '/imports/ui/components/landing/components/dialogs/SkillShapeDefaultDialogBox.jsx';

export function withPopUp(WrappedComponent) {
  return class PopUpContainer extends React.Component {
    state = {
        open: false,
        applyClose: true
    }
    onClose = () => {
        this.setState({open: false});

        if(this.props.onToastrClose && this.state.applyClose)
          this.props.onPopUpClose();
    }
    appear = (type, dialogBoxProps, applyClose = true) => {
      console.log("appear clicked..")
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
          {open && <SkillShapeDefaultDialogBox
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
