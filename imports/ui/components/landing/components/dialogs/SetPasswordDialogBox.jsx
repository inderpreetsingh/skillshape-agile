import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import IconInput from '../form/IconInput';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import { ContainerLoader } from '/imports/ui/loading/container';

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
  dialogAction: {
    width: '100%',
  },
};

const ErrorWrapper = styled.span`
  color: red;
  float: right;
`;

class SetPasswordDialogBox extends React.Component {
  state = {
    password: '',
    confirmPassword: '',
    emailOption: false,
    robotOption: false,
    errorEmail: false,
  };

  handleTextChange = (inputName, event) => {
    this.setState({ [inputName]: event.target.value });
  };

  render() {
    const { password, confirmPassword } = this.state;
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          title="Reset Password"
          open={this.props.open}
          onClose={this.props.onModalClose}
          onRequestClose={this.props.onModalClose}
          aria-labelledby="set-password"
        >
          {this.props.isLoading && <ContainerLoader />}
          <DialogTitle>
            <DialogTitleWrapper>
              Set Password
              <IconButton color="primary" onClick={this.props.onModalClose}>
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          <form
            onSubmit={this.props.onCompleteButtonClick.bind(this, { password, confirmPassword })}
          >
            <DialogContent>
              <InputWrapper>
                <IconInput
                  labelText="Password"
                  type="password"
                  iconName="lock_open"
                  value={password}
                  onChange={this.handleTextChange.bind(this, 'password')}
                />
                <IconInput
                  labelText="Repeat Password"
                  type="password"
                  iconName="lock_open"
                  value={confirmPassword}
                  onChange={this.handleTextChange.bind(this, 'confirmPassword')}
                />
              </InputWrapper>
              {this.props.errorText && <ErrorWrapper>{this.props.errorText}</ErrorWrapper>}
            </DialogContent>
            <DialogActions classes={{ action: this.props.classes.dialogAction }}>
              <PrimaryButton type="submit" fullWidth label="Complete" />
            </DialogActions>
          </form>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

SetPasswordDialogBox.propTypes = {
  onCompleteButtonClick: PropTypes.func,
  onModalClose: PropTypes.func,
  open: PropTypes.bool,
  errorText: PropTypes.string,
  isLoading: PropTypes.bool,
};

SetPasswordDialogBox.defaultProps = {
  isLoading: false,
};

export default withStyles(styles)(SetPasswordDialogBox);
