import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';

const styles = theme => {
  	return {
	    button: {
	      margin: 5,
	      width: 150
	    }
    }
}

class EditLocation extends React.Component {

	render() {
		const { fullScreen } = this.props;
		console.log("EditLocation render props -->>>",this.props);
		return (
			<div>
				<Dialog
		          open={this.props.open}
		          onClose={this.props.onClose}
		          aria-labelledby="form-dialog-title"
		          fullScreen={fullScreen}
		        >
		        	<DialogTitle id="form-dialog-title">Edit Location</DialogTitle>
		        	<DialogContent>
		        		EditLocation
		        	</DialogContent>
		        	<DialogActions>
			            <Button color="primary">
			              Submit
			            </Button>
			            <Button onClick={this.props.onClose} color="primary">
			              Cancel
			            </Button>
		            </DialogActions>
		        </Dialog>
			</div>
		)
	}
}  

export default withStyles(styles)(withMobileDialog()(EditLocation));