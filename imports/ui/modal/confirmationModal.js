import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import React from 'react';
import '/imports/api/enrollmentFee/methods';
import { withStyles } from '/imports/util';

const styles = theme => ({
  button: {
    margin: 5,
    width: 150,
  },
});

class ConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      fullScreen, title, message, submitBtnLabel, cancelBtnLabel,
    } = this.props;

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreen}
      >
        {title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onSubmit()} color="primary">
            {submitBtnLabel}
          </Button>
          <Button onClick={() => this.props.onClose()} color="primary">
            {cancelBtnLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(ConfirmationModal));
