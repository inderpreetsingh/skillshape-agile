import classnames from "classnames";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import Card, { CardContent, CardHeader } from "material-ui/Card";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import Collapse from "material-ui/transitions/Collapse";
import Typography from "material-ui/Typography";
import React from "react";
import DocumentTitle from "react-document-title";
import ReactPhoneInput from 'react-phone-input-2';
import styled from "styled-components";
import config from "/imports/config";
import { MaterialDatePicker } from "/imports/startup/client/material-ui-date-picker";
import MediaUpload from "/imports/ui/componentHelpers/mediaUpload";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import IconInput from "/imports/ui/components/landing/components/form/IconInput";
import { Loading } from "/imports/ui/loading";
import { ContainerLoader } from "/imports/ui/loading/container";
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import  ChangePasswordDialogBox from "/imports/ui/components/landing/components/dialogs/ChangePasswordDialogBox.jsx";

const SaveBtnWrapper = styled.div`
  margin: 10px;
  float: right;
`;

const ErrorWrapper = styled.span`
  color: red;
  float: right;
`;

const ProfileForm = styled.form`
  padding-left: ${rhythmDiv}px;
`;

const GridWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

export default function () {
  let { currentUser, classes, isUserSubsReady } = this.props;
  let {
    firstName,
    nickame,
    lastName,
    dob,
    phone,
    address,
    email,
    about,
    refresh_token,
    changePasswordDialogBox
  } = this.state;
  let userType = Meteor.user();
  if (!isUserSubsReady) return <Loading />;

  if (!currentUser) {
    return (
      <Typography type="display2" gutterBottom align="center">
        User not found!!!
      </Typography>
    );
  }
  const pic = currentUser.profile && currentUser.profile.medium ? currentUser.profile.medium :
    currentUser.profile && currentUser.profile.pic ? currentUser.profile.pic : config.defaultProfilePic;
  if (this.validateUser()) {
    return (
      <DocumentTitle title={this.props.route.name}>
        <GridWrapper>
        {currentUser && changePasswordDialogBox &&
          <ChangePasswordDialogBox
            open={changePasswordDialogBox}
            onModalClose={() => this.setState({ changePasswordDialogBox: false })}
            hideChangePassword={this.passwordChangeMsg}
          />
        }
          <Grid container>
            {this.state.isBusy && <ContainerLoader />}
            <Grid item xs={12} sm={12}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{title: classes.cardHeaderTitle}}
                  title="My Profile"
                  action={
                    <IconButton
                      className={classnames(classes.expand, {
                        [classes.expandOpen]: this.state.profileExpanded
                      })}
                      onClick={this.handleExpandClick.bind(
                        this,
                        "profileExpanded"
                      )}
                      aria-expanded={this.state.profileExpanded}
                      aria-label="Show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  }
                />
                <Collapse
                  in={this.state.profileExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent>
                    <Grid container>
                      <Grid item xs={12} sm={12} md={4}>
                        <MediaUpload
                          fullScreen={false}
                          onChange={this.handleUserImageChange}
                          minWidth={201}
                          data={{ file: pic, isUrl: true }}
                          showVideoOption={false}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={8}>
                        <ProfileForm onSubmit={this.submitUserDetails}>
                          <IconInput
                            labelText="First Name"
                            value={firstName}
                            onChange={this.handleTextChange.bind(
                              this,
                              "firstName"
                            )}
                          />
                          <IconInput
                            labelText="Last Name"
                            value={lastName}
                            onChange={this.handleTextChange.bind(
                              this,
                              "lastName"
                            )}
                          />
                          <Typography
                            className={classes.inputCaption}
                            type="caption"
                          >
                            Your public profile only shows first name. When you
                            join a school, your instructors will see your first
                            and last name.
                        </Typography>
                          <FormControl fullWidth margin="dense">
                            <InputLabel htmlFor="gender">I Am</InputLabel>
                            <Select
                              input={<Input id="gender" />}
                              value={this.state.gender}
                              onChange={event =>
                                this.setState({ gender: event.target.value ,isSaved:false})
                              }
                              fullWidth
                              style={{ fontWeight: 600 }}
                            >
                              {config.gender.map((data, index) => {
                                return (
                                  <MenuItem
                                    key={`${index}-${data.value}`}
                                    value={data.value}
                                  >
                                    {data.label}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <Typography
                            className={classes.inputCaption}
                            type="caption"
                          >
                            We use this data for analysis and never share it with
                            other users.
                        </Typography>
                          <InputLabel fullWidth margin="dense">
                            <MaterialDatePicker
                              classes={classes.datePickerProps}
                              required={false}
                              emptyLabel="Select a Date"
                              floatingLabelText={"Birth Date"}
                              hintText={"Birth Date"}
                              value={dob}
                              onChange={this.handleDobChange}
                              fullWidth={true}
                              format={"DD-MM-YYYY"}
                              style={{ fontWeight: 600 }}
                            />
                          </InputLabel>
                          <Typography
                            className={classes.inputCaption}
                            type="caption"
                          >
                            The wonderful day you took your first breath. We use
                            this data to help you find classes and never share it
                            with other users.
                        </Typography>
                          <IconInput
                            type="email"
                            disabled={true}
                            value={email}
                            labelText="Email Address"
                            iconName="email"
                          />
                          <Typography
                            className={classes.inputCaption}
                            type="caption"
                          >
                            We won't be share your private email address with
                            other Members.
                        </Typography>
                          {/* <IconInput
                          type="tel"
                          labelText="Phone Number"
                          iconName="contact_phone"
                          value={phone}
                          onChange={this.handleTextChange.bind(this, "phone")}
                        /> */}
                          <ReactPhoneInput
                            defaultCountry={'us'}
                            value={phone ? phone.toString() : ''}
                            onChange={phone => this.setState({ phone,isSaved:false })}
                            inputStyle={{ width: '100%' }}
                            placeHolder={'Phone Number'}
                            containerStyle={{ marginTop: '10px' }}
                            disableAreaCodes={true}
                          />
                          <Typography
                            className={classes.inputCaption}
                            type="caption"
                          >
                            This is only shared with Administrators of a school
                            you have enrolled in.
                        </Typography>
                          <FormControl fullWidth margin="dense">
                            <InputLabel htmlFor="currency">
                              Preferred Currency
                          </InputLabel>
                            <Select
                              input={<Input id="currency" />}
                              value={this.state.currency}
                              onChange={event =>
                                this.setState({ currency: event.target.value,isSaved:false })
                              }
                              fullWidth
                              style={{ fontWeight: 600 }}
                            >
                              {config.currency.map((data, index) => {
                                return (
                                  <MenuItem
                                    key={`${index}-${data.value}`}
                                    value={data.value}
                                  >
                                    {data.label}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <IconInput
                            onChange={this.locationInputChanged}
                            iconName="location_on"
                            googlelocation={true}
                            labelText="Where you live"
                            value={address}
                            defaultValue={address}
                            onLocationChange={this.onLocationChange}
                          />
                          <IconInput
                            type="text"
                            multiline={true}
                            labelText="About You"
                            defaultValue={about}
                            value={about}
                            onChange={this.handleTextChange.bind(this, "about")}
                          />
                          {!refresh_token ? <PrimaryButton
                            label={`Sync Google Calendar`}
                            onClick={this.calendarConformation}
                          />
                            : <PrimaryButton
                              label={`Cancel Google Calendar Sync`}
                              onClick={this.confirmationRemoveGoogleSync}
                            />}
                            <PrimaryButton
                              label={`Change Password`}
                              onClick={()=>{this.setState({changePasswordDialogBox:true})}}
                            />
                          <SaveBtnWrapper>
                            {/* <Button type="submit" color="accent" raised dense>
                            Save
                          </Button> */}
                            <FormGhostButton
                              type="submit"
                              label='Save'
                            />
                          </SaveBtnWrapper>
                          {this.state.errorText && (
                            <ErrorWrapper>{this.state.errorText}</ErrorWrapper>
                          )}
                        </ProfileForm>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>

            {/*<Grid item xs={12} sm={4} /> */}
          </Grid>
        </GridWrapper>
      </DocumentTitle>
    );
  } else {
    return (
      <Typography type="display2" gutterBottom align="center">
        Access Denied!!!
      </Typography>
    );
  }
}
