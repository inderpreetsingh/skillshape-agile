import React from "react";
import Button from 'material-ui/Button';
import { browserHistory, Link } from 'react-router';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import config from '/imports/config';
import Typography from 'material-ui/Typography';
import Edit from 'material-ui-icons/Edit';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { Loading } from '/imports/ui/loading';
import CreateMedia from '/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia';
import SchoolViewBanner from '/imports/ui/componentHelpers/schoolViewBanner';
import SchoolViewNewBanner from '/imports/ui/componentHelpers/schoolViewBanner/schoolViewNewBanner.jsx';
import MaterialRTE from "/imports/startup/client/material-rte"
// Need to import this in order to show loading component.
import { ContainerLoader } from '/imports/ui/loading/container.js';
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import ReactPhoneInput from 'react-phone-input-2';
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
export default function () {
  let {
    name,
    website,
    phone,
    firstName,
    lastName,
    email,
    backGroundVideoUrl,
    mainImage,
    aboutHtml,
    studentNotesHtml,
  } = this.state;

  const {
    schoolId,
    schoolData,
    classes,
    route,
    mediaFormData,
    currentUser,
    toastr
  } = this.props;
  return (
    <div>
      <SchoolViewNewBanner schoolData={schoolData} schoolId={schoolId} currentUser={currentUser} isEdit={true} />
      {/*this.props.route.name === 'SchoolAdminDev' ? <SchoolViewNewBanner schoolData={schoolData} schoolId={schoolId} currentUser={currentUser} isEdit={true} /> :
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
                    required={true}
                    defaultValue={schoolData && schoolData.name == 'my-school' ? ' ' : schoolData.name}
                    inputRef={(ref) => this.name = ref}
                    label="School Name"
                    type="text"
                    fullWidth
                    onChange={(event) => { this.setState({ name: event.target.value }) }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required={true}
                    defaultValue={schoolData && schoolData.website ? schoolData.website : 'https://www.'}
                    inputRef={(ref) => this.website = ref}
                    label="Website"
                    type="text"
                    fullWidth
                    onChange={(event) => { this.setState({ website: event.target.value }) }}
                  />
                   <TextField
                required={true}
                defaultValue={schoolData && schoolData.email}
                inputRef={(ref) => this.email = ref}
                label="Email"
                type="email"
                fullWidth
                onChange={(event) => { this.setState({ email: event.target.value }) }}
              />
              <ReactPhoneInput
                required={true}
                defaultCountry={'us'}
                value={phone ? phone.toString() : ''}
                onChange={phone => this.setState({ phone })}
                inputStyle={{width:'100%'}}
                placeHolder={'Phone Number'}
                containerStyle={{marginTop:'10px'}}
              />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
             
            </Grid>
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
                required={true}
                defaultValue={schoolData && schoolData.firstName}
                inputRef={(ref) => this.fname = ref}
                label="First Name"
                type="text"
                fullWidth
                onChange={(event) => { this.setState({ firstName: event.target.value }) }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required={true}
                defaultValue={schoolData && schoolData.lastName}
                inputRef={(ref) => this.lname = ref}
                label="Last Name"
                type="text"
                fullWidth
                onChange={(event) => { this.setState({ lastName: event.target.value }) }}
              />
            </Grid>
          </Grid>
          <Grid container style={{ display: 'flex', alignItems: 'baseline' }}>
            <Grid item xs={12} sm={4}>
              <Typography type="title"> School Currency  </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth margin='dense'>
                <InputLabel htmlFor="currency">Preferred Currency</InputLabel>
                <Select
                  input={<Input id="currency" />}
                  value={this.state.currency}
                  onChange={(event) => {
                    if (event.target.value != this.state.previousSelectedCurrency) {
                      toastr.success('You are going to change your Preferred Currency.Please make changes in packages according to your currency. ', "success");
                    }
                    this.setState({ currency: event.target.value })
                  }}
                  fullWidth
                >
                  {
                    config.currency.map((data, index) => {
                      return <MenuItem
                        key={`${index}-${data.value}`}
                        value={data.value}>
                        {data.label}
                      </MenuItem>
                    })
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
                onClick={this.editSchoolCall.bind(this,null)}
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

  )
}
