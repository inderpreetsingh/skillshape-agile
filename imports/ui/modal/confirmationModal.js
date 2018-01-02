import React from 'react';
import { withStyles } from '/imports/util';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import '/imports/api/enrollmentFee/methods';



const styles = theme => {
    return {
        button: {
          margin: 5,
          width: 150
        }
    }
}

class ConfirmationModal extends React.Component {

	constructor(props) {
        super(props);
    }

	render() {
		console.log("ConfirmationModal props-->>",this.props);
		const {
			fullScreen,
			title,
			message,
			submitBtnLabel,
			cancelBtnLabel,
		} = this.props;

		return (
			<Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title"
                fullScreen={fullScreen}
            >
            	{ title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
                <DialogContent>
                    {message}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.onSubmit()} color="primary">
                      {submitBtnLabel}
                    </Button>
                    <Button onClick={() => this.props.onClose()} color="primary">
                      {cancelBtnLabel}
                    </Button>
                </DialogActions>
            </Dialog>
		)
	}
}

export default withStyles(styles)(withMobileDialog()(ConfirmationModal));