import PropTypes from 'prop-types';
import { Component } from 'react';
import ClassPriceRender from './classPriceRender';
import { toastrModal, withStyles } from '/imports/util';

const styles = theme => ({
  card: {},
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  input: {
    display: 'none',
  },
  classtypeHeader: {
    backgroundColor: theme.palette.primary[500],
    padding: 5,
  },
  classtypeForm: {
    backgroundColor: theme.palette.grey[100],
    borderRadius: 5,
    padding: 12,
  },
  inputDisableBox: {
    textAlign: 'left',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
    marginRight: 6,
    padding: 10,
    borderRadius: 2,
    backgroundColor: '#fff',
    minHeight: 15,
  },
  classtypeInputContainer: {
    alignItems: 'center',
    textAlign: 'left',
  },
  paddingTopAndBottom: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  paddingLeft: {
    paddingLeft: theme.spacing.unit * 2,
  },
  notifyExplanation: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '24px',
    padding: '10px',
    border: '1px solid rgb(221, 221, 221)',
    alignItems: 'center',
  },
});

class ClassPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      showForm: false,
      formData: null,
    };
  }

  setFormData = (formData) => {
    this.setState({ formData });
  };

  handleFormModal = () => this.setState({ showForm: false, formData: null });

  // Update Class time from prices page.
  handleUpdateClassTime = () => {
    const { schoolId, toastr } = this.props;
    // Send Email to Students for update.
    Meteor.call('classPricing.notifyStudentForPricingUpdate', { schoolId }, (err, res) => {
      if (res && res.emailSent) {
        toastr.success(
          'Your Email regarding pricing info update has been sent successfully',
          'success',
        );
      } else if (res && !res.emailSent) {
        toastr.success('No Student joined your school classes yet.', 'success');
      } else {
      }
    });
  };

  render() {
    return ClassPriceRender.call(this, this.props, this.state);
  }
}

ClassPrice.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(toastrModal(ClassPrice));
