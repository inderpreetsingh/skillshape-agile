import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';
import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withPopUp, gotoClaimSchool, confirmationDialog } from '/imports/util';


const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;
const CenterAll = styled.div`
  display: flex;
  justify-content: center;
`;
const styles = {
  dialogAction: {
    width: '100%',
  },
  textField: {
    marginBottom: helpers.rhythmDiv,
  },
};

class OnBoardingDialogBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleSearch = () => {
    const { popUp } = this.props;
    const schoolName = this.schoolName.value;
    if (!schoolName) {
      popUp.appear('alert', { content: 'Please enter school name!' });
    } else if (schoolName.length < 3) {
      popUp.appear('alert', { content: 'School name length is less then 3!' });
    } else {
      this.checkSchoolNameExists(schoolName);
    }
  };

  checkSchoolNameExists = (schoolName) => {
    this.setState({ isLoading: true });
    const { popUp } = this.props;
    Meteor.call('school.findSchoolNameExistsOrNot', schoolName, (err, res) => {
      this.setState({ isLoading: false });
      if (!res) {
        const data = {
          popUp,
          title: 'Confirmation',
          type: 'inform',
          content: 'There are no schools with a similar name.',
          buttons: [
            {
              label: 'Search Again',
              onClick: () => {
                gotoClaimSchool(schoolName);
                this.props.onModalClose();
              },
            },
            {
              label: 'Create New School',
              onClick: () => {
                this.handleListingOfNewSchool(schoolName);
              },
            },
          ],
        };
        confirmationDialog(data);
      } else {
        this.props.onModalClose();
        gotoClaimSchool(schoolName);
      }
      if (err) {
        popUp.appear('alert', { content: 'Something Went Wrong!' });
      }
    });
  };

  handleListingOfNewSchool = (schoolName) => {
    const currentUser = Meteor.user();
    if (currentUser) {
      this.setState({ isLoading: true });
      Meteor.call('school.addNewSchool', currentUser, schoolName, (err, res) => {
        const state = {
          isLoading: false,
        };
        this.props.onModalClose();
        if (res) {
          browserHistory.push(res);
        }
        this.setState(state);
      });
    } else {
      // Show Login popup
      this.props.onModalClose();
      Events.trigger('loginAsUser');
    }
  };

  keyPress = (e) => {
    if (e.keyCode == 13) {
      this.handleSearch();
    }
  };

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          title="Onboarding School"
          open={this.props.open}
          onClose={this.props.onModalClose}
          onRequestClose={this.props.onModalClose}
          aria-labelledby="Onboarding School"
        >
          {isLoading && <ContainerLoader />}
          <DialogTitle>
            <DialogTitleWrapper>
              Enter Your School Name
              <IconButton color="primary" onClick={this.props.onModalClose}>
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              autoFocus
              inputRef={ref => (this.schoolName = ref)}
              label="School Name!"
              type="text"
              fullWidth
              multiline
              className={classes.textField}
              onKeyDown={this.keyPress}
              inputProps={{ maxLength: 200 }}
            />
            Please Enter Your School Name to find in existing records.
          </DialogContent>
          <DialogActions classes={{ action: this.props.classes.dialogAction }}>
            <CenterAll>
              <PrimaryButton onClick={this.handleSearch} label="Search" />
            </CenterAll>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

OnBoardingDialogBox.propTypes = {
  open: PropTypes.bool,
  onModalClose: PropTypes.func,
};
export default withStyles(styles)(withPopUp(OnBoardingDialogBox));
