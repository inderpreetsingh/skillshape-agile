import React,{Fragment} from 'react';
import { withStyles } from "material-ui/styles";
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import '/imports/api/enrollmentFee/methods';
import Typography from 'material-ui/Typography';

const styles = theme => {
    return {
        button: {
          margin: 5,
          width: 150
        }
    }
}

export function toastrModal(WrappedComponent) {

  class toastr extends React.Component {
    state = {
        open: false
    }
    onClose = ()=> {
        this.setState({open: false})
    }
    show = (message, isErrorMessage, elements)=> {
        this.setState({
          message,
          isErrorMessage: isErrorMessage == "Error",
          open: true,
          elementObj: elements
        })
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      // console.log("Container", Container);
        const {
            title,
            message,
            isErrorMessage,
            elementObj
        } = this.state;
        return  <Fragment>
                    <WrappedComponent {...this.props} toastr={{error: this.show, success:this.show }}/>
                    <Dialog
                        open={this.state.open}
                        aria-labelledby="form-dialog-title"
                    >
                        { title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
                        <DialogContent>
                            <Typography color={isErrorMessage ? 'accent' : "primary"}> {message} </Typography>
                            {
                              elementObj && elementObj.element
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.onClose()} color="primary">
                              Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Fragment>
    }
  };
  return withStyles(styles)(toastr);
}
