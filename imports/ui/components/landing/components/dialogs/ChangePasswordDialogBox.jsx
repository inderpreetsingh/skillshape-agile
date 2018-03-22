import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import IconInput from '../form/IconInput.jsx';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { logoSrc } from '../../site-settings.js';
import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container';



import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';



const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`
  },
  dialogContent :  {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    }
  },
  dialogAction: {
    width: '100%',
    margin: 0
  },
  dialogActionsRoot: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`
    }
  },
  dialogActionsRootSubmitButton: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`
    }
  },
  iconButton: {
    height: 'auto',
    width: 'auto'
  },
}


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
    }

    handleTextChange = (inputName, e) => {
      console.log("inputName",inputName)
      this.setState({[inputName]: e.target.value })
    }

    changePassword = (event) => {
      event.preventDefault();
      console.log("changePassword");
      const { oldPasswd, newPasswd, confirmPasswd} = this.state;
      const { toastr } = this.props;
      console.log("this outside",this);
      let self = this;
      if (newPasswd != confirmPasswd) {
        this.setState({errorText: "Change password and confirm password are not same"});
      } else {
        this.setState({isBusy: true});
        console.log("Password--->>>",oldPasswd,newPasswd)
        Accounts.changePassword(oldPasswd, newPasswd, (error) => {
            let stateObj = {isBusy: true};
            if (error) {
              stateObj.errorText = error.reason || error.message;
              this.setState(stateObj);
            } else {
              // alert("close modal");
                this.props.hideChangePassword("Your password has been changed successfully");
            }
            stateObj.isBusy = false;
            this.setState(stateObj);
        });

      }
    }

    render() {

        const {
            classes,
            open,
            fullScreen,
            onModalClose,
        } = this.props;

         const {
            oldPasswd,
            newPasswd,
            confirmPasswd
        } = this.state;

        console.log('ChangePasswordDialogBox state -->>',this.state);
        //console.log('SignUpDialogBox props -->>',this.props);
        return(
            <Dialog
              fullScreen={fullScreen}
              open={open}
              onClose={onModalClose}
              onRequestClose={onModalClose}
              aria-labelledby="sign-up"
              classes={{paper: classes.dialogPaper}}
            >
                <MuiThemeProvider theme={muiTheme}>
                    <form onSubmit={this.changePassword}>
                    {this.state.isBusy && <ContainerLoader/>}
                      <DialogTitleContainer>
                        <DialogTitleWrapper>
                          <LogoImg src={logoSrc}/>
                          <span>Change Password</span>
                        </DialogTitleWrapper>
                        <IconButton color="primary" onClick={onModalClose} classes={{root: classes.iconButton}}>
                            <ClearIcon/>
                        </IconButton >
                      </DialogTitleContainer>

                        <DialogContent className={classes.dialogContent}>

                            <InputWrapper>
                                <IconInput
                                    type="password"
                                    labelText="Old Password *"
                                    iconName="lock_open"
                                    value={oldPasswd}
                                    onChange={this.handleTextChange.bind(this,'oldPasswd')}
                                />
                                <IconInput
                                    type="password"
                                    labelText="New Password *"
                                    value={newPasswd}
                                    iconName="lock_open"
                                    onChange={this.handleTextChange.bind(this,'newPasswd')}
                                />
                                <IconInput
                                    type="password"
                                    labelText="Confirm New Password *"
                                    iconName="lock_open"
                                    value={confirmPasswd}
                                    onChange={this.handleTextChange.bind(this,'confirmPasswd')}
                                />
                            </InputWrapper>
                            {
                              this.state.errorText &&
                              <ErrorWrapper>{this.state.errorText}</ErrorWrapper>
                            }
                        </DialogContent>
                        <DialogActions classes={{root : classes.dialogActionsRootSubmitButton, action: classes.dialogAction}}>
                            <PrimaryButton type="submit" label="Change Password" noMarginBottom />
                        </DialogActions>
                    </form>
                </MuiThemeProvider>
            </Dialog>
        )
    }
}

ChangePasswordDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
}

export default withMobileDialog()(withStyles(styles)(toastrModal(ChangePasswordDialogBox)));
