import { isEmpty } from 'lodash';
import ClearIcon from 'material-ui-icons/Clear';
import ErrorIcon from 'material-ui-icons/ErrorOutline';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import { ContainerLoader } from '/imports/ui/loading/container';
import { confirmationDialog, withPopUp } from '/imports/util';

const StudentNotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  width: 100%;
  height: 100px;
  border-radius: 5px;
`;
const ErrorArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  visibility: ${props => (props.validation ? 'hidden' : 'visible')};
`;

const styles = theme => ({
  dialogTitleRoot: {
    padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
    marginBottom: `${helpers.rhythmDiv * 2}px`,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  dialogContent: {
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    paddingBottom: helpers.rhythmDiv * 2,
    flexGrow: 0,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 200,
    [`@media screen and (max-width : ${helpers.mobile}px)`]: {
      padding: `0 ${helpers.rhythmDiv * 2}px`,
    },
  },
  dialogRoot: {
    width: '100%',
    maxWidth: 400,
    [`@media screen and (max-width : ${helpers.mobile}px)`]: {
      margin: helpers.rhythmDiv,
    },
  },
  iconButton: {
    height: 'auto',
    width: 'auto',
  },
});

const ActionButtons = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: ${helpers.rhythmDiv * 2}px;
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class ContractDialog extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeStates();
  }

  initializeStates = () => ({ validation: false });

  handleRequest = (doc, popUp) => {
    Meteor.call('Contracts.handleRecords', doc, (err, res) => {
      if (res) {
        let data = {};
        data = {
          popUp,
          title: 'Success',
          type: 'success',
          content: 'Your request is received.',
          buttons: [
            {
              label: 'Ok',
              onClick: () => {
                this.props.onModalClose();
              },
            },
          ],
        };
        this.setState({ isLoading: false }, confirmationDialog(data));
      }
    });
  };

  checkIsRequestExist = (doc, popUp) => {
    Meteor.call('Contracts.handleRecords', doc, (err, res) => {
      if (!isEmpty(res)) {
        let data = {};
        data = {
          popUp,
          title: 'Success',
          type: 'inform',
          content: 'Your already have sent a request.',
          buttons: [
            {
              label: 'Ok',
              onClick: () => {
                this.props.onModalClose();
              },
            },
          ],
        };
        this.setState({ isLoading: false }, confirmationDialog(data));
      } else {
        doc.action = 'add';
        let data = {};
        data = {
          popUp,
          title: 'Confirmation',
          type: 'inform',
          content: (
            <div>
              Do you really want to cancel your contract of package
              {' '}
              <b>{doc.packageName}</b>
.
            </div>
          ),
          buttons: [
            {
              label: 'Cancel',
              onClick: () => {
                this.props.onModalClose();
              },
              greyColor: true,
            },
            {
              label: 'Send Request',
              onClick: () => {
                this.handleRequest(doc, popUp);
              },
            },
          ],
        };
        confirmationDialog(data);
      }
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const {
      _id: purchaseId,
      userName,
      schoolId,
      popUp,
      packageName,
      userId,
      payAsYouGo,
      autoWithdraw,
    } = this.props;
    const { reason } = this.state;
    const doc = {
      purchaseId,
      userName,
      schoolId,
      packageName,
      action: 'find',
      userId,
      reason,
      status: 'pending',
      payAsYouGo,
      autoWithdraw,
    };
    this.setState({ isLoading: true }, () => {
      this.checkIsRequestExist(doc, popUp);
    });
  };

  render() {
    const { props } = this;
    const { isLoading, validation } = this.state;
    return (
      <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="Cancel Contract"
        classes={{ paper: props.classes.dialogRoot }}
      >
        {isLoading && <ContainerLoader />}
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Reason For Contract Cancel</Title>

              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent classes={{ root: props.classes.dialogContent }}>
            <form id="addUser" onSubmit={this.onSubmit}>
              <StudentNotesContent
                onChange={(e) => {
                  if (e.target.value.length >= 10 && !validation) {
                    this.setState({ validation: true, reason: e.target.value });
                  } else if (e.target.value.length < 10) {
                    this.setState({ validation: false });
                  }
                }}
              />
              <ErrorArea validation={validation}>
                <ErrorIcon />
                Minimum 10 Characters
              </ErrorArea>
              <ActionButtons>
                <PrimaryButton
                  formId="addUser"
                  disabled={!validation}
                  type="submit"
                  label="Submit"
                />
              </ActionButtons>
            </form>
          </DialogContent>

          <DialogActions classes={{ root: props.classes.dialogActionsRoot }} />
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

ContractDialog.propTypes = {
  onModalClose: PropTypes.func,
  loading: PropTypes.bool,
};

export default withStyles(styles)(withPopUp(ContractDialog));
