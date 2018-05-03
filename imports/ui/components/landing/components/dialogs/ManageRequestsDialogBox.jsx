import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import { getUserFullName } from '/imports/util/getUserData';
import { openMailToInNewTab } from '/imports/util/openInNewTabHelpers';
import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { isEmpty} from 'lodash';

import PrimaryButton from '../buttons/PrimaryButton';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';

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
  display: flex;
  justify-content: ${props => props.stars ? 'center' : 'flex-start'}
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class ManageRequestsDialogBox extends Component {
  state = {
    isBusy: false,
    userExists: false,
    name: '',
    email: '',
    subscribe: true,
    readyToSubmit: false,
    inputsName: ['name','email'],
  }

  handleInputChange = name => e => {
    this.setState({
      [name] : e.target.value
    });
  }

  handleChange = name => e => {
    this.setState({
      [name]: e.target.checked
    })
  }

  handleRequest = (text) => {
    const {schoolData} = this.props;
    const userName = Meteor.userId ? getUserFullName(Meteor.user()) : this.state.name;
    if(!isEmpty(schoolData)) {
      const ourEmail = schoolData.email;
      let emailBody = "";
      let subject ="", message =  "";
      let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`
      let currentUserName = userName;
      // emailBody = `Hi, %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text ? text : pricing}%3F %0D%0A%0D%0A Thanks`
      emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text ? text : pricing} %0D%0A%0D%0A Thanks`
      const mailTo = `mailto:${ourEmail}?subject=${subject}&body=${emailBody}`;

      console.info(encodeURI(mailTo),mailTo,"my mail To data.............");

      openMailToInNewTab(mailTo);

    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const {toastr,requestFor} = this.props;
    const data = {
      name: this.state.name,
      email: this.state.email,
      classTypeId: this.props.classTypeId,
      schoolId: this.props.schoolData._id
    }
    let methodNameToCall = 'classTimesRequest.addRequest';
    let text = 'class times';
    if(requestFor === 'price') {
      methodNameToCall = 'pricingRequest.addRequest';
      text = 'pricing';
    }

    if(this.state.readyToSubmit && this.state.subscribe) {
      if (!data.email) {
          toastr.error('Please enter your email.', 'Error');
          return false;
      } else if (!emailReg.test(data.email)) {
          toastr.error("Please enter valid email address", "Error");
          return false;
      } else if (!data.name) {
          toastr.error("Please enter a name", "Error");
          return false;
      }else {
        this.setState({isBusy: true});
        Meteor.call(methodNameToCall, data, (err,res) => {
          this.setState({isBusy: false}, () => {
            // console.log(this,this.props,"this .props")
            debugger;
              if(err) {
                toastr.error(err.reason || err.message,"Error");
              }else if(res.message) {
                toastr.error(res.message,'Error');
                // this.props.onModalClose();
              }
              else if(res) {
                // toastr.success('Your request have been added, will be notified shortly','success');
                this.props.onModalClose();
                setTimeout(() => {
                  this.handleRequest(text);
                })
              }

              if(this.props.onFormSubmit) {
                this.props.onFormSubmit();
              }
          });
        });

      }
    }else if(this.state.readyToSubmit && !this.state.subscribe) {
      this.handleRequest(text);
    }
  }

  _validateAllInputs = (data, inputNames) => {

    for(let i = 0; i < inputNames.length; ++i) {
      if(data[inputNames[i]] == '') {
        return false;
      }
    }

    return true;
  }

  componentDidUpdate = () => {
    const readyToSubmit = this._validateAllInputs(this.state,this.state.inputsName);
    if(this.state.readyToSubmit !== readyToSubmit) {
      this.setState({ readyToSubmit : readyToSubmit});
    }
  }

  _addExistingUserDetails = () => {
    this.setState({
      userExists: true,
      email: Meteor.user().emails[0].address,
      name: getUserFullName(Meteor.user())
    })
  }

  componentDidMount = () => {
    if(Meteor.userId()) {
      this._addExistingUserDetails();
    }
  }

  render() {
    const {props} = this;
    // console.log(props,"...");
    return (
      <Fragment>
        {this.state.isBusy && <ContainerLoader />}
        <Dialog
          fullScreen={props.fullScreen}
          open={props.open}
          onClose={props.onModalClose}
          onRequestClose={props.onModalClose}
          aria-labelledby="manage requests"
          classes={{paper: props.classes.dialogRoot}}
        >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
            <DialogTitleWrapper>
              <Title>Request {props.title}</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{root : props.classes.dialogContent}}>
            <form onSubmit={this.handleFormSubmit}>
              <InputWrapper stars>
                <IconInput inputId="name" labelText="Your name" value={this.state.name} disabled={this.state.userExists} onChange={this.handleInputChange('name')} />
              </InputWrapper>

              <InputWrapper>
                <IconInput inputId="message" type='email' labelText="Your email address" disabled={this.state.userExists} value={this.state.email} onChange={this.handleInputChange('email')} />
              </InputWrapper>

              <InputWrapper>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.subscribe}
                      onChange={this.handleChange('subscribe')}
                      value={true}
                      color="primary"
                    />
                  }
                  label="Subscribe me to updates"
                />
              </InputWrapper>

              <ButtonWrapper>
                {this.state.readyToSubmit ?
                  <PrimaryButton
                    type="submit"
                    label={props.submitBtnLabel}
                    noMarginBottom
                    onClick={this.handleFormSubmit}
                  />
                :
                <button className="cancel-button increase-height" disabled >{props.submitBtnLabel}</button>}
              </ButtonWrapper>
            </form>
          </DialogContent>
          </MuiThemeProvider>
        </Dialog>
      </Fragment>
    );
  }
}

ManageRequestsDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  requestFor: PropTypes.string,
  userProfile: PropTypes.object,
  title: PropTypes.string,
  submitBtnLabel: PropTypes.string,
}

ManageRequestsDialogBox.defaultProps = {
  title: 'Pricing',
  requestFor: 'price',
  submitBtnLabel: 'Request pricing'
}

export default toastrModal(withMobileDialog()(withStyles(styles)(ManageRequestsDialogBox)));
