import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';

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

class ManageRequests extends Component {
  state = {
    isBusy: false,
    name: '',
    email: '',
    subscribe: true
  }

  handleInputChange = name => e => {
    this.setState({
      [name] : e.target.value
    })
  }

  handleChange = name => e => {
    this.setState({
      [name]: e.target.checked
    })
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    const {toastr,requestFor} = this.props;
    const data = {
      name: this.state.reviewForId,
      email: this.state.reviewFor,
      subscribe: this.state.subscribe,
    }
    let methodNameToCall = 'classTimesRequest.addRequest';

    if(requestFor === 'price') {
      methodNameToCall = 'pricingRequest.addRequest';
    }

    this.setState({isBusy: true});
    Meteor.call(methodNameToCall, data, (err,res) => {
      this.setState({isBusy: false}, () => {
        // console.log(this,this.props,"this .props")
          if(err) {
            toastr.error(err.reason || err.message,"Error");
          }else if(res.message) {
            toastr.error(res.message,'Error');
            this.props.onModalClose();
          }
          else if(res) {
            toastr.success('Your request have been added, will be notified shortly','success');
            this.props.onModalClose();
          }

          if(this.props.onFormSubmit) {
            this.props.onFormSubmit();
          }
      });
    });

  }

  componentDidMount = () => {
    // Meteor.call('reviews.getMyReview',this.props.reviewForId,(err,data) => {
    //   // console.log(data,"we get back this data..")
    //   if(data) {
    //     this.setState({
    //       ratings: data.ratings,
    //       comment: data.comment
    //     });
    //   }
    // });
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
              <Title>Request {title}</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{root : props.classes.dialogContent}}>
            <form onSubmit={this.handleFormSubmit}>
              <InputWrapper stars>
                <IconInput inputId="name" labelText="Your name" value={this.state.name} onChange={this.handleInputChange('name')} />
              </InputWrapper>

              <InputWrapper>
                <IconInput inputId="message" type='email' labelText="Your email address" value={this.state.email} onChange={this.handleInputChange('email')} />
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
                <PrimaryButton
                  type="submit"
                  label={this.props.submitBtnLabel}
                  noMarginBottom
                  onClick={this.handleFormSubmit}
                />
              </ButtonWrapper>
            </form>
          </DialogContent>
          </MuiThemeProvider>
        </Dialog>
      </Fragment>
    );
  }
}

ManageRequests.propTypes = {
  onFormSubmit: PropTypes.func,
  requestFor: PropTypes.string,
  userProfile: PropTypes.object,
  title: PropTypes.string,
  submitBtnLabel: PropTypes.string,
}

ManageRequests.defaultProps = {
  title: 'Pricing',
  requestFor: 'price',
  submitBtnLabel: 'RequestPricing'
}

export default toastrModal(withMobileDialog()(withStyles(styles)(ManageRequests)));
