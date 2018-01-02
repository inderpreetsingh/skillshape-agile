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
        <Card className={classes.formContainer} style={{alignItem: 'center'}}>
          <form style={{maxWidth: 600,padding:24}} method="" action="">
            <Grid container style={{marginBottom: '5px',display: 'flex',alignItems: 'baseline'}}>
                <Grid item xs={12} sm={4}>
                  <Typography type="Subheading"> School Info  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        required={true}
                        defaultValue={mediaFormData && mediaFormData.name}
                        inputRef={(ref)=> this.website = ref}
                        label="Website"
                        type="text"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                      required={true}
                      defaultValue={mediaFormData && mediaFormData.name}

                      inputRef={(ref)=> this.email = ref}
                      label="Email"
                      type="email"
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                      required={true}
                      defaultValue={mediaFormData && mediaFormData.name}
                      inputRef={(ref)=> this.phone = ref}
                      label="Phone"
                      type="number"
                      fullWidth
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
                        defaultValue={mediaFormData && mediaFormData.name}
                        inputRef={(ref)=> this.fname = ref}
                        label="First Name"
                        type="text"
                        fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                        required={true}
                        defaultValue={mediaFormData && mediaFormData.name}
                        inputRef={(ref)=> this.lname = ref}
                        label="Last Name"
                        type="text"
                        fullWidth
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
          </form>
        </Card>
      {/*<div className="tab-pane active" id="tab_default_1">
        <div className="col-md-12">
          <div className="card">
            <div className="card-content">
              <form className="form schoolForm" method="" action="">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="form-group">
                      <label>
                        School Name *
                      </label>
                      <input
                        type="text"
                        className="form-control form-mandatory onChange"
                        name="sname"
                        id="sname"
                        key-value="name"
                        value={name}
                        required="true"
                        onChange={(e) => this.setState({name: e.target.value})}
                      />
                      <span className="material-input"></span>
                    </div>
                    <div className="row">
                      <div className="form-group col-sm-7">
                        <label>
                          Website
                        </label>
                        <input
                          type="text"
                          className="form-control form-mandatory onChange"
                          id="Website"
                          key-value="website"
                          value={website}
                          onChange={(e) => this.setState({website: e.target.value})}
                        />
                        <span className="material-input"></span>
                      </div>
                      <div className="form-group col-sm-5">
                        <label>
                            Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control onChange"
                          name="pnum"
                          id="phone"
                          key-value="phone"
                          value={phone}
                          onChange={(e) => this.setState({phone: e.target.value})}
                        />
                        <span className="material-input"></span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-sm-4">
                        <label>
                            First Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-mandatory onChange"
                          id="firstName"
                          key-value="firstName"
                          value={firstName}
                          onChange={(e) => this.setState({firstName: e.target.value})}
                        />
                        <span className="material-input"></span>
                      </div>
                      <div className="form-group col-sm-4">
                        <label>
                            Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control onChange"
                          name="lastName"
                          id="lastName"
                          key-value="lastName"
                          value={lastName}
                          onChange={(e) => this.setState({lastName: e.target.value})}
                        />
                        <span className="material-input"></span>
                      </div>
                      <div className="form-group col-sm-4">
                        <label>
                            Email
                        </label>
                        <input
                          type="email"
                          className="form-control onChange"
                          name="email"
                          id="email"
                          key-value="email"
                          value={email}
                          onChange={(e) => this.setState({email: e.target.value})}
                        />
                        <span className="material-input"></span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                          Background Video URL
                      </label>
                      <input
                        type="text"
                        className="form-control form-mandatory "
                        name="sname"
                        id="backGroundVideoUrl"
                        key-value="name"
                        value={backGroundVideoUrl}
                        onChange={(e) => this.setState({backGroundVideoUrl: e.target.value})}
                      />
                      <span className="material-input"></span>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="fileinput fileinput-new card-button text-center" data-provides="fileinput">
                      <div className="fileinput-new card-button thumbnail">
                        <img className="" src={mainImage || defaultSchoolImage} alt="Profile Image" id="pic"/>
                      </div>
                      <div className="fileinput-preview fileinput-exists thumbnail">
                      </div>
                      <div>
                        <span className="btn btn-warning btn-sm btn-file">
                          <span className="fileinput-new">Upload New Image</span>
                          <span className="fileinput-exists">Change</span>
                          <input type="hidden"/>
                          <input type="file" name="..." accept="image/*" className="validateImageType" ref="schoolImage"/>
                        </span>
                        <a href="#" className="btn btn-danger  fileinput-exists" data-dismiss="fileinput">
                          <i className="fa fa-times"></i>Remove
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group  onChange">
                  <label>
                    About School
                  </label>
                  <div id="summernote1">{aboutHtml}</div>
                  <span className="material-input"></span>
                </div>
                <div className="form-group  onChange">
                  <label>
                    School Description
                  </label>
                  <div id="summernote2">{descHtml}</div>
                  <span className="material-input"></span>
                </div>
                <div className="form-group form-button col-md-6 pull-right">
                </div>
              </form>
              <div className="wizard-footer col-md-12">
                <div className="pull-right">
                  {
                    schoolId ? (
                      <button type="button" onClick={this.updateSchool} style={{float: 'left'}} className="btn btn-success" id="editSchool">Update & Next
                        <div className="ripple-container"></div>
                      </button>
                    ) : (
                      <button type="button" style={{float: 'left'}} className="btn btn-success" id="addSchool">ADD School & Next
                        <div className="ripple-container"></div>
                    </button>
                    )
                  }
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
      </div>*/}
    </div>
  )
}
