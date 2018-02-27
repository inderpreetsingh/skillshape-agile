import React, {Component} from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';


import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
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
  }
}

class TaggedMemberDialogBox extends Component {

    state = {
      mediaDefaultValue: get(this.props, `currentMediaData.users_permission[${Meteor.userId()}].accessType`, "public")
    }

    handleChange = name => event => {
      this.setState({ [name]: event.target.checked });
    };

    // This is used to handle "Untag me" and change User specific media settings.
    handleUsersMediaSetting = () => {
      const mediaDefaultValue = this.state.mediaDefaultValue;
      const tagOrUntag = this.state.tagOrUntag;
      console.log("this is handleUsersMediaSetting",this);
      const currentMediaData = {...this.props.currentMediaData, users_permission:{[Meteor.userId()]:this.state.mediaDefaultValue}};
      Meteor.call("media.editMedia",currentMediaData._id, currentMediaData,tagOrUntag);
    }

    handleMediaSettingChange = (event) => {
      console.log("event====>",event.target.value)
      this.setState({
        mediaDefaultValue: event.target.value
      })
    }


    render() {

      console.log("media_access_permission",Meteor.user());

        const {
            classes,
            open,
            fullScreen,
            onModalClose,
            onUntagMeButtonClick,
            onEditButtonClick,
            currentMediaData,
            schoolData
        } = this.props;

        console.log('TaggedMemberDialogBox state -->>',currentMediaData);
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
                          <Typography>{currentMediaData.name}</Typography>
                        </Grid>
                        <Grid item md={4} sm={4} xs={4}>
                          <Typography>Members:</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8}>
                          { currentMediaData.taggedUserData && currentMediaData.taggedUserData.map((userData) => {
                              return userData.profile.name
                          })}
                          <Typography></Typography>
                        </Grid>
                        <Grid item md={4} sm={4} xs={4}>
                          <Typography>School:</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8}>
                          <Typography>{schoolData.name}</Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12} style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
                          <Typography>Permissions:</Typography>
                          <FormControl component="fieldset" required >
                              <RadioGroup
                                  aria-label="mediaSetting"
                                  value={this.state.mediaDefaultValue}
                                  name="mediaSetting"
                                  onChange={this.handleMediaSettingChange}
                                  defaultSelected="both"
                                  style={{display: 'inline'}}
                              >
                                  <FormControlLabel value="public" control={<Radio />} label="Public" />
                                  <FormControlLabel value="member" control={<Radio />} label="School only" />
                              </RadioGroup>
                          </FormControl>
                        </Grid>
                        {(Meteor.userId() !== currentMediaData.createdBy) &&
                          <Grid item md={12} sm={12} xs={12} style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.tagOrUntag}
                                  onChange={this.handleChange('tagOrUntag')}
                                  value="tagOrUntag"
                                  color="primary"
                                />
                              }
                              label="Untag Me"
                            />
                          </Grid>
                        }
                        {currentMediaData.desc &&
                          <Grid container style={{padding: 8}}>
                            <Grid item md={4} sm={4} xs={4}>
                              <Typography>Notes:</Typography>
                            </Grid>
                            <Grid item md={8} sm={8} xs={8}>
                              <Typography>{currentMediaData.desc}</Typography>
                            </Grid>
                          </Grid>
                        }
                        <Grid item md={12} sm={12} xs={12} style={{display: 'flex',justifyContent: 'space-between'}}>
                          <Button style={{backgroundColor: '#ffd740'}}>Report as inappropriate</Button>
                          {
                            (Meteor.userId() == currentMediaData.createdBy) ?
                            <Button style={{backgroundColor: '#4caf50'}} onClick={this.props.openEditTaggedModal}>Edit</Button>
                            : <Button style={{backgroundColor: '#ffd740'}} onClick={this.handleUsersMediaSetting}>Save</Button>
                          }
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
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
}

export default withMobileDialog()(withStyles(styles)(TaggedMemberDialogBox));
