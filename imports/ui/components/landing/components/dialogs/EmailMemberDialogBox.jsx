import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import {sendEmail,withPopUp} from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container.js";

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
      width: '100%'
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


const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class EmailMemberDialogBox extends Component {

  state = {
    subject: '',
    message: ''
  }

  handleInputFieldChange = (fieldName) => (e) => {
    this.setState({
      [fieldName] : e.target.value
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.setState({isLoading:true})
    const {subject,message} = this.state;
    const {email,popUp,onModalClose }= this.props;
    const data = { To:email,subject,text:message,popUp,onModalClose};
    sendEmail(data,popUp)
  }

  render() {
    const {props,state:{isLoading,subject,message}} = this;
    const {schoolData} = props;
    const {name:schoolName} = schoolData || {};
    return (
      <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="contact us"
        classes={{paper: props.classes.dialogRoot}}
      >
      {isLoading && <ContainerLoader/>}
      <MuiThemeProvider theme={muiTheme}>
        <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
          <DialogTitleWrapper>
              <Title>Email {schoolName ? schoolName : 'Member'}</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
        </DialogTitle>

        <DialogContent classes={{root : props.classes.dialogContent}}>
            <form onSubmit={this.handleFormSubmit}>
              <InputWrapper>
                <IconInput inputId="subject" labelText="Subject" value={subject} onChange={this.handleInputFieldChange('subject')}/>
              </InputWrapper>

              <InputWrapper>
                <IconInput inputId="message" labelText="Your message goes here" multiline={true} value={message} onChange={this.handleInputFieldChange('message')} />
              </InputWrapper>
              <ButtonWrapper>
                  <PrimaryButton
                      type="submit"
                      label="Send Message"
                      noMarginBottom
                      disabled={!subject || !message}
                      onClick={this.handleFormSubmit}
                  />
              </ButtonWrapper>
            </form>
        </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

EmailMemberDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  onHandleInputChange: PropTypes.func,
  onModalClose: PropTypes.func,
  loading: PropTypes.bool,
}

export default withStyles(styles)(withMobileDialog()(withPopUp(EmailMemberDialogBox)));
