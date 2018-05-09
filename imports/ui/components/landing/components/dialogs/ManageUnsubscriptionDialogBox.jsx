import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';


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
      padding: `${helpers.rhythmDiv * 4}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: helpers.rhythmDiv * 2,
      flexShrink: 0,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogActionsRoot: {
      justifyContent: 'center',
      margin: 0,
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

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const Content = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  color: ${helpers.black};
`;


class ManageUnsubscriptionDialogBox extends Component {
  state = {
    isBusy: false,
    classTypeName: '',
    schoolName: '',
  }

  _redirectUser = () => {
    browserHistory.push('/');
  }

  handleButtonClick = (buttonName) => (e)=> {
    const {toastr,requestFor,requestId} = this.props;
    const methodNameToCall = requestFor === 'price details' ? 'pricingRequest.removeRequest' : 'classTimesRequest.removeRequest';
    if(buttonName === 'yes') {
      this.setState({isBusy: true});
      Meteor.call(methodNameToCall,requestId,(err,res) => {
        this.setState({isBusy: false}, () => {
          if(err) {
            toastr.error(err.reason || err.message);
          }else {
            toastr.success("You have been successfully unsubscribed");
          }
        })
      });
    }else {
      this._redirectUser();
    }
  }

  componentDidMount = () => {
    const { toastr, requestFor, requestId } = this.props;
    const methodNameToCall = requestFor === 'price details' ? 'pricingRequest.getSubscriptionData' : 'classTimesRequest.getRequestData';
    Meteor.call(methodNameToCall,requestId,(err,res) => {
      if(err) {
        toastr.error("There was no data found with this request id, you have already unsubscribed.","Error");
      }else {
        this.setState({ classTypeName: res.classTypeName, schoolName: res.schoolName});
      }
    });
  }

  render() {
    const {props} = this;
    // console.log(props,"...");
    return (<Fragment>
        {this.state.isBusy && <ContainerLoader />}
        <Dialog
          fullScreen={props.fullScreen}
          open={props.open}
          onClose={props.onModalClose}
          onRequestClose={props.onModalClose}
          aria-labelledby="manage unsubscriptions"
          classes={{paper: props.classes.dialogRoot}}
        >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
            <DialogTitleWrapper>
              <Title>Unsubcribe Me :( </Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{root : props.classes.dialogContent}}>
            <Content>You have requested for unsubscription from {props.requestFor} of {this.state.classTypeName && `${this.state.classTypeName} class of`} {this.state.schoolName} school. </Content>
            <Content>Click <Bold>Yes</Bold> to continue or <Bold>No</Bold> to cancel your request.</Content>
          </DialogContent>

          <DialogActions classes={{root: props.classes.dialogActionsRoot}}>
            <ButtonsWrapper>
              <ButtonWrapper>
                <PrimaryButton label="Yes" onClick={this.handleButtonClick('yes')} />
              </ButtonWrapper>
              <ButtonWrapper>
                <PrimaryButton label="No" onClick={this.handleButtonClick('no')}/>
              </ButtonWrapper>
            </ButtonsWrapper>
          </DialogActions>
          </MuiThemeProvider>
        </Dialog>
      </Fragment>
    );
  }
}

ManageUnsubscriptionDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  requestFor: PropTypes.string,
  title: PropTypes.string,
  schoolData: PropTypes.object,
  classTypeName: PropTypes.string,
  submitBtnLabel: PropTypes.string,
}

ManageUnsubscriptionDialogBox.defaultProps = {
  title: 'Pricing',
  requestFor: 'price',
  submitBtnLabel: 'Request pricing'
}

export default toastrModal(withMobileDialog()(withStyles(styles)(ManageUnsubscriptionDialogBox)));
