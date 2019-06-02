// import { blue500 } from 'material-ui/styles/colors';
import { withMobileDialog } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import React from 'react';
import '/imports/api/classInterest/methods';
import '/imports/api/classTimes/methods';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import Preloader from '/imports/ui/components/landing/components/Preloader';
import { toastrModal } from '/imports/util';


const styles = theme => ({
  dialogPaper: {
    overflowX: 'hidden',
    padding: helpers.rhythmDiv * 2,
    maxWidth: 400,
  },
});


class StripeConnectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false,
    };
  }

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.code) {
      const { toastr } = this.props;
      const ROOT_URL = Meteor.absoluteUrl();
      Meteor.call(
        'stripe.getStripeToken',
        this.props.location.query.code,
        (error, result) => {
          if (result) {
            toastr.success(result, 'Success');
          } else if (error) {
            toastr.success(error.reason, 'Success');
          }
          setTimeout(() => {
            window.location.replace(ROOT_URL);
          }, 3000);
        },
      );
    }
  }

  render() {
    return (
      <div>
        <center style={{ top: '50%' }}>
          <Preloader />
        </center>
      </div>
    );
  }
}

export default withMobileDialog()(
  withStyles(styles)(toastrModal(StripeConnectModal)),
);
