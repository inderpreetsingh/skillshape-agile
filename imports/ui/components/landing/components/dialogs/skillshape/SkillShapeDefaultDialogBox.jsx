import React,{Component} from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';


import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import { MuiThemeProvider} from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  border-top: 5px solid ${props => props.color};
  width: 100%;
`;

const Title = styled.h2`
  margin: 0;
  color: ${props => props.color};
  font-weight: 400;
  font-family: ${helpers.specialFont};
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
    dialogAction: {
        width: '100%'
    },
    dialogContent: {

    }
}

const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;

const popUpBasicConfig = {
  warning: {
    color: helpers.warningColor,
    title: 'Uh Oh!',
    tagline: 'Something went wrong. Please try again',
    affimateBtnText: 'Try Again'
  },
  alert: {
    color: helpers.alertColor,
    title: 'Are you sure?',
    tagline: 'It can cause serious issues. do you wanna continue ?',
    affimateBtnText: "Yes"
  },
  inform: {
    color: helpers.black,
    title: 'One more step...',
    tagline 'You need to have an account on skillshape, before you can perform this action',
  },
  success: {
    color: helpers.primaryColor,
    title: 'Thank you!!',
    tagline: 'Your action is successfully completed',
    affimateBtnText: 'Okay'
  }
}

class SkillShapeDefaultDialogBox extends Component {
    render() {
        const {
          title,
          tagline,
          type,
          classes,
          onModalClose,
          open } = this.props;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                  title="skillshape popup"
                  open={open}
                  onClose={onModalClose}
                  onRequestClose={onModalClose}
                  aria-labelledby="skillshape-popup"
                >
                    <DialogTitleWrapper color={pop}>
                        <Title>{title || popUpBasicConfig[type].title}</Title>

                        <IconButton color={popUpBasicConfig[type].color} onClick={onModalClose}>
                          <ClearIcon/>
                        </IconButton >
                    </DialogTitleWrapper>

                    <DialogContent classes={{action: classes.dialogContent}}>
                      {tagline || popUpBasicConfig[type].tagline}
                    </DialogContent>

                    <DialogActions classes={{action: classes.dialogAction}}>
                      <Button onClick={props.onAffirmationButtonClick} color={popUpBasicConfig[type].color}>
                        {popUpBasicConfig[type].affimateBtnText}
                      </Button>
                      {(type === 'alert' || type === 'warning') && <Button onClick={onModalClose || onCloseButtonClick} color="primary">
                        Cancel
                      </Button>}
                    </DialogActions>

                </Dialog>
            </MuiThemeProvider>
        )
    }
}

SkillShapeDefaultDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  onAffirmationButtonClick: PropTypes.func,
  onCloseButtonClick: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  tagline: PropTypes.string,
}

export default withStyles(styles)(SkillShapeDefaultDialogBox);
