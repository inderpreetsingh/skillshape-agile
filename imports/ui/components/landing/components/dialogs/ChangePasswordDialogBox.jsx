import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { logoSrc } from '../../site-settings';
import PrimaryButton from '../buttons/PrimaryButton';
import IconInput from '../form/IconInput';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import { ContainerLoader } from '/imports/ui/loading/container';
import { toastrModal } from '/imports/util';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
  },
  dialogContent: {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    },
  },
  dialogAction: {
    width: '100%',
    margin: 0,
  },
  dialogActionsRoot: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  dialogActionsRootSubmitButton: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  iconButton: {
    height: 'auto',
    width: 'auto',
  },
};

const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;

const DialogTitleWrapper = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ErrorWrapper = styled.span`
  color: red;
  float: left;
`;

const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  margin-right: ${helpers.rhythmDiv}px;
  cursor: pointer;

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 30px;
    height: 30px;
  }
`;

class ChangePasswordDialogBox extends Component {
  state = {
    errorText: null,
  };

  handleTextChange = (inputName, e) => {
    this.setState({ [inputName]: e.target.value });
  };

  changePassword = (event) => {
    event.preventDefault();
    const { oldPasswd, newPasswd, confirmPasswd } = this.state;
    const { toastr } = this.props;
    const self = this;
    if (newPasswd != confirmPasswd) {
      this.setState({
        errorText: 'Change password and confirm password are not same',
      });
    } else {
      this.setState({ isBusy: true });
      Accounts.changePassword(oldPasswd, newPasswd, (error) => {
        const stateObj = { isBusy: true };
        if (error) {
          stateObj.errorText = error.reason || error.message;
          this.setState(stateObj);
        } else {
          // alert("close modal");
          this.props.hideChangePassword('Your password has been changed successfully');
          this.props.onModalClose();
        }
        stateObj.isBusy = false;
        this.setState(stateObj);
      });
    }
  };

  render() {
    const {
      classes, open, fullScreen, onModalClose,
    } = this.props;

    const { oldPasswd, newPasswd, confirmPasswd } = this.state;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="sign-up"
        classes={{ paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <form onSubmit={this.changePassword}>
            {this.state.isBusy && <ContainerLoader />}
            <DialogTitleContainer>
              <DialogTitleWrapper>
                <LogoImg src={logoSrc} />
                <span>Change Password</span>
              </DialogTitleWrapper>
              <IconButton
                color="primary"
                onClick={onModalClose}
                classes={{ root: classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleContainer>

            <DialogContent className={classes.dialogContent}>
              <InputWrapper>
                <IconInput
                  type="password"
                  labelText="Old Password *"
                  iconName="lock_open"
                  value={oldPasswd}
                  onChange={this.handleTextChange.bind(this, 'oldPasswd')}
                />
                <IconInput
                  type="password"
                  labelText="New Password *"
                  value={newPasswd}
                  iconName="lock_open"
                  onChange={this.handleTextChange.bind(this, 'newPasswd')}
                />
                <IconInput
                  type="password"
                  labelText="Confirm New Password *"
                  iconName="lock_open"
                  value={confirmPasswd}
                  onChange={this.handleTextChange.bind(this, 'confirmPasswd')}
                />
              </InputWrapper>
              {this.state.errorText && <ErrorWrapper>{this.state.errorText}</ErrorWrapper>}
            </DialogContent>
            <DialogActions
              classes={{
                root: classes.dialogActionsRootSubmitButton,
                action: classes.dialogAction,
              }}
            >
              <PrimaryButton type="submit" label="Change Password" noMarginBottom />
            </DialogActions>
          </form>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

ChangePasswordDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
};

export default withMobileDialog()(withStyles(styles)(toastrModal(ChangePasswordDialogBox)));
