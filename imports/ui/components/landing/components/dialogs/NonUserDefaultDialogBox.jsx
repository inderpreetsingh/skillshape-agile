import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { MuiThemeProvider} from 'material-ui/styles';
import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import IconInput from '../form/IconInput.jsx';

import PrimaryButton from '../buttons/PrimaryButton';
import LoginButton from '../buttons/LoginButton.jsx';
import JoinButton from '../buttons/JoinButton.jsx';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

import { ContainerLoader } from '/imports/ui/loading/container';

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexShrink: 0,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogRoot: {

    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    }
  }
}

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ContentWrapper = styled.p`
  margin: 0;
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
  text-align: center;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Bold = styled.span`
  font-weight: 500;
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
`;

const DialogActionText = styled.p`
  margin: 0;
  margin-right: ${helpers.rhythmDiv}px;
  flex-shrink: 0;
`;

const ActionWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  justify-content: flex-end;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const Or  = styled.span`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-family: ${helpers.specialFont};
  font-weight: 500;
  margin-right: ${helpers.rhythmDiv}px;
`;


const NonUserDefaultDialogBox = (props) => {
    return (
      <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="join skillshape"
        classes={{paper: props.classes.dialogRoot}}
      >
      <MuiThemeProvider theme={muiTheme}>
        <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
          <DialogTitleWrapper>
              <Title>{props.title}</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
        </DialogTitle>

        <DialogContent classes={{root : props.classes.dialogContent}}>
          <ContentWrapper>Press <Bold>Login</Bold> if already a member, or <Bold>Sign up</Bold> to become a member.</ContentWrapper>
          <ButtonsWrapper>
            <ButtonWrapper>
              <LoginButton />
            </ButtonWrapper>
            <ButtonWrapper>
              <JoinButton label="Sign Up"/>
            </ButtonWrapper>
          </ButtonsWrapper>
        </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
}


NonUserDefaultDialogBox.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
}

NonUserDefaultDialogBox.defaultProps = {
  title: 'Join us'
}

export default withMobileDialog()(withStyles(styles)(NonUserDefaultDialogBox));
