import Card from 'material-ui/Card';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import React from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import styled from 'styled-components';
import config from '/imports/config';
import { get } from 'lodash';
import MaterialRTE from '/imports/startup/client/material-rte';
import SchoolViewNewBanner from '/imports/ui/componentHelpers/schoolViewBanner/schoolViewNewBanner';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
// Need to import this in order to show loading component.
import { ContainerLoader } from '/imports/ui/loading/container';

const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
export default function () {
  const {

    phone,

  } = this.state;

  const {
    schoolId,
    schoolData,
    classes,

    currentUser,
    popUp,
    handleIsSavedState,
  } = this.props;
  return (
    <div>
      <SchoolViewNewBanner schoolData={schoolData} schoolId={schoolId} currentUser={currentUser} isEdit />
      {/* this.props.route.name === 'SchoolAdminDev' ? <SchoolViewNewBanner schoolData={schoolData} schoolId={schoolId} currentUser={currentUser} isEdit={true} /> :
        <SchoolViewBanner schoolData={schoolData} schoolId={schoolId} currentUser={currentUser} isEdit={true} /> */}
      {
        this.state.isLoading && <ContainerLoader />
      }
      <Card className={classes.formContainer} style={{ alignItem: 'center' }}>
        <form style={{ maxWidth: 600, padding: 24 }} method="" action="">
          <Grid container style={{ marginBottom: '5px', display: 'flex', alignItems: 'baseline' }}>
            <Grid item xs={12} sm={4}>
              <Typography type="title"> School Info  </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    required
                    defaultValue={get(schoolData, 'name', '') == 'my-school' ? ' ' : schoolData.name}
                    inputRef={ref => this.name = ref}
                    label="School Name"
                    type="text"
                    fullWidth
                    onChange={(event) => {
                      this.setState({ name: event.target.value });
                      handleIsSavedState(false);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    defaultValue={get(schoolData, 'website', 'https://www.')}
                    inputRef={ref => this.website = ref}
                    label="Website"
                    type="text"
                    fullWidth
                    onChange={(event) => {
                      this.setState({ website: event.target.value });
                      handleIsSavedState(false);
                    }}
                  />
                  <TextField
                    required
                    defaultValue={get(schoolData, 'email', '')}
                    inputRef={ref => this.email = ref}
                    label="Email"
                    type="email"
                    fullWidth
                    onChange={(event) => {
                      this.setState({ email: event.target.value });
                      handleIsSavedState(false);
                    }}
                  />
                  <ReactPhoneInput
                    required
                    defaultCountry="us"
                    value={phone ? phone.toString() : ''}
                    onChange={(phone) => {
                      this.setState({ phone });
                      handleIsSavedState(false);
                    }}
                    inputStyle={{ width: '100%' }}
                    placeHolder="Phone Number"
                    containerStyle={{ marginTop: '10px' }}
                    disableAreaCodes
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} />
            {/* <Grid item xs={12} sm={4}> */}
            {/* <TextField
                required={true}
                defaultValue={schoolData && schoolData.phone && parseInt((schoolData.phone).replace(/[^0-9]/g, ''), 10)}
                inputRef={(ref) => this.phone = ref}
                label="Phone"
                type="number"
                fullWidth
                onChange={(event) => { this.setState({ phone: parseInt(event.target.value) }) }}
              /> */}

            {/* </Grid> */}
          </Grid>
          <Grid container style={{ display: 'flex', alignItems: 'baseline' }}>
            <Grid item xs={12} sm={4}>
              <Typography type="title"> School Contact  </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                defaultValue={get(schoolData, 'firstName', '')}
                inputRef={ref => this.fname = ref}
                label="First Name"
                type="text"
                fullWidth
                onChange={(event) => {
                  this.setState({ firstName: event.target.value });
                  handleIsSavedState(false);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                defaultValue={get(schoolData, 'lastName', '')}
                inputRef={ref => this.lname = ref}
                label="Last Name"
                type="text"
                fullWidth
                onChange={(event) => {
                  this.setState({ lastName: event.target.value });
                  handleIsSavedState(false);
                }}
              />
            </Grid>
          </Grid>
          <Grid container style={{ display: 'flex', alignItems: 'baseline' }}>
            <Grid item xs={12} sm={4}>
              <Typography type="title"> School Currency  </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="currency">Preferred Currency</InputLabel>
                <Select
                  input={<Input id="currency" />}
                  value={this.state.currency}
                  onChange={(event) => {
                    if (event.target.value != this.state.previousSelectedCurrency) {
                      popUp.appear('success', { title: 'Inform', content: 'You are going to change your Preferred Currency.Please make changes in packages according to your currency.' });
                    }
                    handleIsSavedState(false);
                    this.setState({ currency: event.target.value });
                  }}
                  fullWidth
                >
                  {
                    config.currency.map((data, index) => (
                      <MenuItem
                        key={`${index}-${data.value}`}
                        value={data.value}
                      >
                        {data.label}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className={classes.editorTop}>
                <Typography type="title" className={classes.typographyRoot}> About the School  </Typography>
                <MaterialRTE value={this.state.aboutHtml} onChange={this.aboutSchoolTREOnChange} />
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className={classes.editorTop}>
                <Typography type="title" className={classes.typographyRoot}> Notes for Students  </Typography>
                <MaterialRTE value={this.state.studentNotesHtml} onChange={this.studentNotesTREOnChange} />
              </div>
            </Grid>
          </Grid>
          <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <Button
                    type="submit"
                    style={{margin: 8}}
                    className="btn"
                    form = "editSchoolDetails"
                    raised
                    onClick ={this.editSchoolCall}
                    color="accent">
                    Save
                </Button>
                <Button
                      type="submit"
                      style={{margin: 8}}
                      className="btn"
                      form = "editSchoolDetails"
                      raised
                      onClick ={this.editSchoolCall.bind(this, 'nextTab')}
                      color="accent">
                      Save and Next
                  </Button> */}
            <ButtonWrapper>
              <FormGhostButton
                onClick={this.editSchoolCall.bind(this, null)}
                label="Save"
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                type="submit"
                form="editSchoolDetails"
                onClick={this.editSchoolCall.bind(this, 'nextTab')}
                label="Save and Next"
              />
            </ButtonWrapper>
          </Grid>
        </form>
      </Card>
    </div>

  );
}
