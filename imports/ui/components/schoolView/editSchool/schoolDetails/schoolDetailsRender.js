import React from "react";
import Button from 'material-ui/Button';
import { browserHistory, Link } from 'react-router';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import config from '/imports/config';
import Typography from 'material-ui/Typography';
import Edit from 'material-ui-icons/Edit';
import TextField from 'material-ui/TextField';

import { Loading } from '/imports/ui/loading';
import CreateMedia from '/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia';
import SchoolViewBanner from '/imports/ui/componentHelpers/schoolViewBanner';

import MaterialRTE from "/imports/startup/client/material-rte"
// Need to import this in order to show loading component.
import { ContainerLoader } from '/imports/ui/loading/container.js';
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
    mediaFormData,
    currentUser
  } = this.props;

  console.log("SchoolEditDetails render props -->>", this.props)
  return  (
    <div>
      <SchoolViewBanner schoolData={schoolData} schoolId={schoolId} currentUser={currentUser} isEdit={true} />
        {
        this.state.isLoading && <ContainerLoader />
        }
        <Card className={classes.formContainer} style={{alignItem: 'center'}}>
          <form style={{maxWidth: 600,padding:24}} method="" action="">
            <Grid container style={{marginBottom: '5px',display: 'flex',alignItems: 'baseline'}}>
                <Grid item xs={12} sm={4}>
                  <Typography type="Subheading"> School Info  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        required={true}
                        defaultValue={schoolData && schoolData.website}
                        inputRef={(ref)=> this.website = ref}
                        label="Website"
                        type="text"
                        fullWidth
                        onChange={(event)=> {this.setState({website:event.target.value})}}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                      required={true}
                      defaultValue={schoolData && schoolData.email}
                      inputRef={(ref)=> this.email = ref}
                      label="Email"
                      type="email"
                      fullWidth
                      onChange={(event)=> {this.setState({email:event.target.value})}}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                      required={true}
                      defaultValue={schoolData && parseInt((schoolData.phone).replace(/[^0-9]/g, ''), 10)}
                      inputRef={(ref)=> this.phone = ref}
                      label="Phone"
                      type="number"
                      fullWidth
                      onChange={(event)=> {this.setState({phone:event.target.value})}}
                  />
                </Grid>
            </Grid>
            <Grid container style={{display: 'flex',alignItems: 'baseline'}}>
              <Grid item xs={12} sm={4}>
                <Typography type="Subheading"> School Contact  </Typography>
              </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                        required={true}
                        defaultValue={schoolData && schoolData.firstName}
                        inputRef={(ref)=> this.fname = ref}
                        label="First Name"
                        type="text"
                        fullWidth
                        onChange={(event)=> {this.setState({firstName:event.target.value})}}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                        required={true}
                        defaultValue={schoolData && schoolData.lastName}
                        inputRef={(ref)=> this.lname = ref}
                        label="Last Name"
                        type="text"
                        fullWidth
                        onChange={(event)=> {this.setState({lastName:event.target.value})}}
                    />
                  </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <div className={classes.editorTop}>
                  <Typography  type="Subheading" className={classes.typographyRoot}> About the School  </Typography>
                <MaterialRTE value={this.state.aboutHtml} onChange={this.aboutSchoolTREOnChange} />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <div className={classes.editorTop}>
                  <Typography type="Subheading" className={classes.typographyRoot}> Notes for Students  </Typography>
                <MaterialRTE value={this.state.studentNotesHtml} onChange={this.studentNotesTREOnChange} />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={8}>
              </Grid>
              <Grid item xs={4}>
                  <Button
                      type="submit"
                      className="btn"
                      form = "editSchoolDetails"
                      raised
                      onClick ={this.editSchoolCall}
                      color="accent">
                      Save Changes
                  </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
    </div>

  )
}
