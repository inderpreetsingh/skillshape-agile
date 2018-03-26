import React, {Component} from 'react';
import PropTypes from 'prop-types';

import SecondaryButton from '../buttons/SecondaryButton';
import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import IconInput from '../form/IconInput.jsx';

import { MuiThemeProvider} from 'material-ui/styles';
import {withStyles} from 'material-ui/styles';

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
    dialogActionsRoot: {
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
    },
    dialogActions: {
      width: '100%',
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    dialogRoot: {
      width: '100%',
      minHeight: '200px'
    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    }
  }
}

const Link = styled.a`
  color:${helpers.textColor};
  &:hover {
    color:${helpers.focalColor};
  }
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;


const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv * 4}px 0;
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


const WrapperContact = styled.li`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ContactNumbersWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const Contact = styled.a`
  color: ${helpers.black};

  :visited {
    color: ${helpers.black};
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    display: none;
  }
`;

const ContactMobile = styled.a`
  display: none;

  color: ${helpers.black};

  :visited: {
    color: ${helpers.black};
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    display: initial;
  }
`;

const ContactNumber = (props) => (<WrapperContact>
    <Contact>{props.tel}</Contact>
    <ContactMobile href={`tel:${props.tel}`}>{props.tel}</ContactMobile>
</WrapperContact>);

const CallUsDialogBox = (props) => {
    console.log(props,"...");
    return (
      <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="contact us"
        classes={{paper: props.classes.dialogRoot}}
      >
      <MuiThemeProvider theme={muiTheme}>
        <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
          <DialogTitleWrapper>
              <Title>Contact Numbers</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
        </DialogTitle>

        <DialogContent classes={{root : props.classes.dialogContent}}>
          <ContactNumbersWrapper>
            {props.contactNumbers.map((contactNumber,i) => <ContactNumber key={i} tel={contactNumber} />)}
          </ContactNumbersWrapper>
        </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
}

CallUsDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  onHandleInputChange: PropTypes.func,
  contactNumbers: PropTypes.arrayOf(PropTypes.strings),
  onModalClose: PropTypes.func,
  loading: PropTypes.bool,
}

export default withMobileDialog()(withStyles(styles)(CallUsDialogBox));
