import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';
import styled from 'styled-components';
import { SocialIcon } from 'react-social-icons';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';



import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import GoogleIconButton from '../buttons/GoogleIconButton.jsx';
import FacebookIconButton from '../buttons/FacebookIconButton.jsx';
import LoginButton from '../buttons/LoginButton.jsx';
import IconInput from '../form/IconInput.jsx';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { emailRegex } from '/imports/util';
import config from '/imports/config';
import { logoSrc } from '../../site-settings.js';

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
    padding: `${helpers.rhythmDiv * 2}px`
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
  dialogActionsRootSubmitButton: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`
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

class TaggedMemberDialogBox extends Component {

    state = {
    }

    render() {

        const {
            classes,
            open,
            fullScreen,
            onModalClose,
            onUntagMeButtonClick,
            onEditButtonClick,
            taggedMemberDetails
        } = this.props;

        /*const {
            emailOption,
            robotOption,
            name,
            email,
            errorEmail,
            captchaValue,
            sendMeSkillShapeNotification
        } = this.state;*/

        console.log('TaggedMemberDialogBox state -->>',taggedMemberDetails);
        //console.log('SignUpDialogBox props -->>',this.props);
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
                   <form /*onSubmit={this.props.onSubmit.bind(this, {name, email, captchaValue, sendMeSkillShapeNotification})}*/>
                      <Grid container>
                        <Grid item md={4} sm={4} xs={4}>
                          <Typography>Media Title:</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8}>
                          <Typography>{taggedMemberDetails.name}</Typography>
                        </Grid>
                        <Grid item md={4} sm={4} xs={4}>
                          <Typography>Members:</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8}>
                          <Typography>{(taggedMemberDetails.taggedUserData && taggedMemberDetails.taggedUserData.length > 0) ? taggedMemberDetails.taggedUserData[0].profile.name : ''}</Typography>
                        </Grid>
                        <Grid item md={4} sm={4} xs={4}>
                          <Typography>School:</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8}>
                          <Typography>{taggedMemberDetails.name}</Typography>
                        </Grid>
                        <Grid item md={4} sm={4} xs={4}>
                          <Typography>Permissions:</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8}>
                          <FormControl component="fieldset" required >
                              <RadioGroup
                                  aria-label="mediaSetting"
                                  value={this.state.mediaDefaultValue}
                                  name="mediaSetting"
                                  onChange={this.handleMediaSettingChange}
                                  defaultSelected="both"
                              >
                                  <FormControlLabel value="public" control={<Radio />} label="Make media public so you can share them on social media." />
                                  <FormControlLabel value="member" control={<Radio />} label="Make media from a school only available to members of the school that posted it." />
                              </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={4} xs={4}>
                          <Typography>Notes:</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8}>
                          <Input
                            onBlur={this.props.saveAdminNotesInMembers}
                            onChange={this.props.handleInput}
                            fullWidth
                            style={{border: '1px solid',backgroundColor: '#fff'}}
                            multiline
                            rows={4}
                          />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12} style={{display: 'flex',justifyContent: 'space-between'}}>
                          <Button style={{backgroundColor: '#ffd740'}}>Report as inappropriate</Button>
                          <Button style={{backgroundColor: '#4caf50'}}>Edit</Button>
                        </Grid>
                      </Grid>
                    </form>
                </MuiThemeProvider>
            </Dialog>
        )
    }
}

TaggedMemberDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  onLoginButtonClick: PropTypes.func,
  onSignUpButtonClick: PropTypes.func,
  onSignUpWithGoogleButtonClick: PropTypes.func,
  onSignUpWithFacebookButtonClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  errorText: PropTypes.string,
  unsetError: PropTypes.func,
}

export default withMobileDialog()(withStyles(styles)(TaggedMemberDialogBox));
