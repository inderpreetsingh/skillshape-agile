import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {isEmpty,get} from 'lodash';
import styled from "styled-components";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import { withPopUp ,confirmationDialog} from '/imports/util';



const StudentNotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  width: 100%;
  height: 100px;
  border-radius: 5px;
`;
const customStyles = {
  input: (provided, state) => ({
    ...provided,
    fontSize: 16
  })
}

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
        3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      "@media screen and (max-width : 500px)": {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      paddingBottom: helpers.rhythmDiv * 2,
      flexGrow: 0,
      display: "flex",
      justifyContent: "center",
      minHeight: 200,
      [`@media screen and (max-width : ${helpers.mobile}px)`]: {
        padding: `0 ${helpers.rhythmDiv * 2}px`
      }
    },
    dialogRoot: {
      width: "100%",
      maxWidth: 400,
      [`@media screen and (max-width : ${helpers.mobile}px)`]: {
        margin: helpers.rhythmDiv
      }
    },
    iconButton: {
      height: "auto",
      width: "auto"
    }
  };
};

const ActionButtons = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: ${helpers.rhythmDiv * 2}px;
`;

const ActionButton = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ErrorWrapper = styled.span`
  color: red;
  margin: ${helpers.rhythmDiv * 2}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ContentWrapper = styled.div``;

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
  initializeStates = () => {
    this.textInput = React.createRef();
   return {};
  }
  handleRequest = (doc,popUp) =>{
    Meteor.call("Contracts.handleRecords",doc,(err,res)=>{
      if(res){
        let data = {};
          data = {
            popUp,
            title: 'Success',
            type: 'success',
            content: 'Your request is received.',
            buttons: [{ label: 'Ok', onClick: () => {this.props.onModalClose() }}]
          }
          confirmationDialog(data);
      }
    })
  }
  checkIsRequestExist = (doc,popUp) =>{
    Meteor.call("Contracts.handleRecords",doc,(err,res)=>{
      if(!isEmpty(res)){
        let data = {};
          data = {
            popUp,
            title: 'Success',
            type: 'inform',
            content: 'Your already have sent a request.',
            buttons: [{ label: 'Ok', onClick: () => { this.props.onModalClose()}}]
          }
          confirmationDialog(data);
      }
      else{
        doc.action = 'add';
        let data = {};
        data = {
          popUp,
          title: 'Confirmation',
          type: 'inform',
          content: <div>Do you really want to cancel your contract of package <b>{doc.packageName}</b>.</div>,
          buttons: [{ label: 'Cancel', onClick: () => {this.props.onModalClose() }, greyColor: true }, { label: 'Send Request', onClick: () => { this.handleRequest(doc,popUp) } }]
        }
        confirmationDialog(data);
      }
    })
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { _id: purchaseId, userName, schoolId, popUp, packageName,userId } = this.props;
    const {reason} = this.state;
    if(reason.length < 10){
      let data = {};
      data = {
        popUp,
        title: 'Caution',
        type: 'alert',
        content: 'Reason Length is less then 10.',
        buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
      }
      confirmationDialog(data);
      return ;
    }
    let doc = { purchaseId, userName, schoolId, packageName, action: 'find',userId ,reason,status:'pending'};
    this.checkIsRequestExist(doc,popUp);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false ;
  }
  render() {
    const { props } = this;
    return (
      <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby={`Cancel Contract`}
        classes={{ paper: props.classes.dialogRoot }}
      >
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
            onChange = {(e)=>{this.setState({reason:e.target.value})}} 
            />
                <ActionButtons>
                <PrimaryButton
                  formId="addUser"
                  type="submit"
                  label={`Submit`} />
              </ActionButtons>
            </form>
          </DialogContent>

          <DialogActions classes={{ root: props.classes.dialogActionsRoot }}>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog >
    );
  }
}

ContractDialog.propTypes = {
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withStyles(styles)(withPopUp(ContractDialog));
