import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel} from 'material-ui/Form';
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
      maxWidth: '500px',
      overflow: 'hidden',
      width: '100%'
    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    },
    labelText: {
      display: 'flex',
      alignItems: 'flex-end',
      marginLeft: -14,
      marginRight: helpers.rhythmDiv * 2
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
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const FormText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.black};
  line-height: 1;
  font-size: ${helpers.baseFontSize}px;
  margin: 0;
  cursor: pointer;
`;

const LabelText = FormText.extend`
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.3;
`;

const SubscriptionNotes = FormText.extend`
  font-size: 12px;
  font-weight: 400;
`;

class ManageUnsubscriptionDialogBox extends Component {
  state = {
    isBusy: false,
    title: ''
  }

  handleClickOnYesButton = () => {

  }

  handleClickOnNoButton = () => {

  }

  componentDidMount = () => {
    const { taostr, requestId } = this.props;
    // Meteor.call('pricingRequest.getSubscriptionData',requestId,(err,res) => {
    //   if(err) {
    //
    //   }else {
    //     this.setState({ title: res.title});
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

          </DialogContent>

          <DialogActions>

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
