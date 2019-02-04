import React, {Component} from 'react';
import {
  IdealBankElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
/* 

input,
.StripeElement {
  height: 40px;

  color: #32325d;
  background-color: white;
  border: 1px solid transparent;
  border-radius: 4px;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

input {
  padding: 10px 12px;
}

input:focus,
.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
*/
const styles = theme => {
    return {
      dialogTitleRoot: {
        padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
          3}px 0 ${helpers.rhythmDiv * 3}px`,
        marginBottom: `${helpers.rhythmDiv * 2}px`,
        "@media screen and (max-width : 500px)": {
          padding: `0 ${helpers.rhythmDiv * 3}px`
        }
      },
      dialogContent: {
        padding: `0 ${helpers.rhythmDiv * 3}px`,
        paddingBottom: helpers.rhythmDiv * 2,
        flexGrow: 0,
        display: "flex",
        justifyContent: "center",
        minHeight: 200,
        [`@media screen and (max-width : ${helpers.mobile}px)`]: {
          padding: `0 ${helpers.rhythmDiv * 2}px`
        }
      },
      dialogRoot: {
        width: "100%",
        maxWidth: 400,
        [`@media screen and (max-width : ${helpers.mobile}px)`]: {
          margin: helpers.rhythmDiv
        }
      },
      iconButton: {
        height: "auto",
        width: "auto"
      }
    };
  };
// You can customize your Elements to give it the look and feel of your site.
const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        letterSpacing: '0.025em',
        padding: '10px 14px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    },
  };
};

class _IdealBankForm extends Component {
  handleSubmit = async (ev) => {
    ev.preventDefault();
    console.log('TCL: handleSubmit -> this.props.stripe', this.props.stripe)
    if (this.props.stripe) {
    const {source, error} = await  this.props.stripe
        .createSource({
          type: 'ideal',
          amount: 1099,
          currency: 'eur',
          // You can specify a custom statement descriptor.
          statement_descriptor: 'ORDER AT11990',
          owner: {
            name: ev.target.name.value,
          },
          redirect: {
            return_url: `${document.URL}`,
          },
        })
        if(source){
            this.props.handleResult(source);
        }
        else if(error){
            this.props.handleError(error);
        }
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  render() {
      console.log('_IdealBankForm')
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name
          <input name="name" type="text" placeholder="Jane Doe" required />
        </label>
        <label>
          iDEAL Bank
          <IdealBankElement className="IdealBankElement" {...createOptions()} />
        </label>
        <button>Pay</button>
      </form>
    );
  }
}

const IdealForm = injectStripe(_IdealBankForm);

class IdealDialog extends Component {
  render() {
      const {props} = this;
    return (
        <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby={`StripIDealDialog`}
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
          </DialogTitle>
          <DialogContent classes={{ root: props.classes.dialogContent }}>
          <StripeProvider apiKey={Meteor.settings.public.stripe.PUBLIC_KEY}>
        <Elements>
          <IdealForm handleResult={this.props.handleResult} />
        </Elements>
      </StripeProvider>
          </DialogContent>
          <DialogActions classes={{ root: props.classes.dialogActionsRoot }}>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog >
   
    );
  }
}
export default withStyles(styles)(IdealDialog);