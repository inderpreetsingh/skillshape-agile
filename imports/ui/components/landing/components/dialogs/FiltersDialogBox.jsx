import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';
import styled from 'styled-components';
import { SocialIcon } from 'react-social-icons';

import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import FilterPanel from '../FilterPanel.jsx';
import IconInput from '../form/IconInput.jsx';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import config from '/imports/config';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
    paddingBottom: `${helpers.rhythmDiv}px`
  },
  dialogTitleRoot: {
    display: 'flex',
    fontFamily: `${helpers.specialFont}`
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
  dialogActionsRootButtons: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv}px`
    }
  },
  iconButton: {
    height: 'auto',
    width: 'auto'
  },
  formControlRoot: {
    marginBottom: `${helpers.rhythmDiv * 2}px`
  }
}

const DialogBoxHeaderText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
`;

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

class FiltersDialogBox extends Component {

    render() {
        console.log("FiltersDialogBox props--->>",this.props);
        const {
            classes,
            open,
            fullScreen,
            onModalClose,
            filterPanelProps
        } = this.props;

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
                  <DialogTitleContainer>
                    <DialogTitleWrapper>
                      Filter  Content
                    </DialogTitleWrapper>
                    <IconButton color="primary" onClick={onModalClose} classes={{root: classes.iconButton}}>
                        <ClearIcon/>
                    </IconButton >
                  </DialogTitleContainer>

                  <DialogActions classes={{root : classes.dialogActionsRoot, action: classes.dialogAction}}>
                    <FilterPanel onModalClose={onModalClose}  {...filterPanelProps} filtersInDialogBox/>
                  </DialogActions>

                </MuiThemeProvider>
            </Dialog>
        )
    }
}

FiltersDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  filterPanelProps: PropTypes.object,
  open: PropTypes.bool,
  errorText: PropTypes.string,
  unsetError: PropTypes.func,
}

export default withMobileDialog()(withStyles(styles)(FiltersDialogBox));
