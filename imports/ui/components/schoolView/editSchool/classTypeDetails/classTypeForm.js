import { findIndex } from "lodash";
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from "material-ui/Dialog";
import { FormControl } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import React from "react";
import SkillSubject from "react-select";
import styled from "styled-components";
import "/imports/api/sLocation/methods";
import config from "/imports/config";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { mobile } from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import { confirmationDialog, withPopUp ,unSavedChecker} from '/imports/util';
const formId = "classTypeForm";
const customStyle = {
  marginTop: "10px",
  marginBottom: '10px',
}
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const styles = theme => {
  return {
    button: {
      margin: 5,
      width: 150
    },
    classtypeInputContainer: {
      alignItems: "center",
      textAlign: "left"
    },
    delete: {
      backgroundColor: 'red',
      color: "black",
      fontWeight: 600
    },
    cancel: {
      backgroundColor: 'yellow',
      color: "black",
      fontWeight: 600
    },
    save: {
      backgroundColor: 'green',
      color: "black",
      fontWeight: 600
    },
    dialogActionsRoot: {
      [`@media screen and (max-width: ${mobile}px)`]: {
        flexWrap: "wrap",
        justifyContent: "center"
      }
    }
  };
};

class ClassTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
    // this.onUpdateSkillCategoryInput = _.debounce(this.onUpdateSkillCategoryInput, 500);
  }

  initializeFields = () => {
    const { data, locationData,handleIsSavedState } = this.props;
    handleIsSavedState(true);
    let state = {
      gender: "Any",
      experienceLevel: "All",
      location: "",
      skillCategoryData: [],
      skillSubjectData: [],
      skillCategoryId: null,
      selectedSkillSubject: null,
      selectedLocation: null,
      searchSkillCategoryText: "",
      selectedOption: [],
      skillSubject: [],

    };
    if (data && _.size(data) > 0) {
      if (
        data.selectedSkillCategory &&
        _.size(data.selectedSkillCategory) > 0
      ) {
        state.searchSkillCategoryText = data.selectedSkillCategory.name;
      }

      return {
        ...state,
        ...data,
        skillCategoryData: [data.selectedSkillCategory],
        location: data.locationId || "",
        selectedLocation:
          locationData &&
          _.find(locationData, function (location) {
            return data.locationId === location._id;
          })
      };
    }
    return state;
  };

  componentDidMount = () => {
    Meteor.call("getAllSkillSubjects", (err, res) => {
      if (err) {

      } else {
        // console.info(res, "==== res ====");
        let state = { skillSubjectData: [], selectedOption: [] }
        res.map((current, index) => {
          state.skillSubjectData.push({ value: current._id, label: current.name })
          this.state.skillSubject.map((skillId) => {
            if (skillId == current._id) {
              state.selectedOption.push({ value: skillId, label: current.name })
            }
          })
        })
        this.setState({ skillSubjectData: state.skillSubjectData, selectedOption: state.selectedOption })
      }
    });
  };

  onSkillSubjectChange = values => {
    values = values.map(ele => {
      if (ele.skillCategoryId || ele._id) {
        return ele;
      }
    });

    values = _.without(values, undefined);
    if (!_.isEmpty(values)) {
      this.setState({ selectedSkillSubject: values });
    }
    if (values.length == 0) {
      this.setState({ selectedSkillSubject: [] });
    }
  };

  onSkillCategoryChange = values => {
    const selectedSkillSubject =
      this.state.selectedSkillSubject &&
      this.state.selectedSkillSubject.filter(data => {
        return findIndex(values, { _id: data.skillCategoryId }) > -1;
      });
    this.setState({ selectedSkillCategory: values, selectedSkillSubject });
  };

  handleInputChange = (fieldName, event) =>
    this.setState({ [fieldName]: event.target.value });

  handleSelectChange = (fieldName, event, index, value) =>
    this.setState({ [fieldName]: value });



  handleSkillSubjectInputChange = selectedOption => {
    const {handleIsSavedState} = this.props;
    handleIsSavedState(false);
    this.setState(state => {
      return {
        selectedOption: selectedOption,
      };
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { schoolId, data,popUp } = this.props;
    if(!this.classTypeName.value){
      let data = {
        popUp,
        title: 'Error',
        type: 'alert',
        content: `Class Type Name is Required`,
        buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
      };
      confirmationDialog(data);
      return;
    }
    const payload = {
      schoolId: schoolId,
      name: this.classTypeName.value,
      desc: this.desc.value,
      // skillCategoryId:
      //   this.state.selectedSkillCategory &&
      //   this.state.selectedSkillCategory.map(data => data._id),
      skillSubject:
        this.state.selectedOption &&
        this.state.selectedOption.map(data => data.value),
      gender: this.state.gender,
      experienceLevel: this.state.experienceLevel,
      ageMin: this.ageMin.value && parseInt(this.ageMin.value),
      ageMax: this.ageMax.value && parseInt(this.ageMax.value),
      locationId: this.state.location
    };
    if (!payload.skillSubject) {
      payload.skillSubject = [];
    }
    Meteor.call(
      "getSkillCategoryIdsFromSkillSubjects",
      { skillSubjectIds: payload.skillSubject },
      (err, res) => {
        if (res) {
          payload.skillCategoryId = res;
          if (data && data._id) {
            this.handleSubmit({
              methodName: "classType.editClassType",
              doc: payload,
              doc_id: data._id
            });
          } else {
            this.handleSubmit({
              methodName: "classType.addClassType",
              doc: payload
            });
          }
        } else {
        }
      }
    );
  };

  handleSubmit = ({ methodName, doc, doc_id }) => {
    //this.props.enableParentPanelToDefaultOpen();
    const {handleIsSavedState} = this.props;
    Meteor.call(methodName, { doc, doc_id }, (error, result) => {

      if (error) {
      }
      if (result) {
        if (doc_id) {
          this.props.onClose(result, 'edit');
        } else {
          this.props.onClose(result, "add");
        }
      }
      handleIsSavedState(true);
      this.setState({ isBusy: false, error });
    });
  };
  //Set default location id if nothing selected 
  setDefaultLocation = (defaultLocId) => {
    this.setState({ location: defaultLocId })
    return defaultLocId;
  }
  
  render() {
    const { fullScreen, data, classes, handleIsSavedState } = this.props;
    const {  skillSubjectData, selectedOption } = this.state;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={()=>{unSavedChecker.call(this)}}
          aria-labelledby="form-dialog-title"
          fullScreen={false}
        >
          <DialogTitle id="form-dialog-title">Add Class Type</DialogTitle>
          {this.state.isBusy && <ContainerLoader />}
          {this.state.showConfirmationModal && (
            <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this Class Type, Are you sure?"
              onSubmit={() =>
                this.handleSubmit({
                  methodName: "classType.removeClassType",
                  doc: data,
                  doc_id: data._id
                })
              }
              onClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}

          {this.state.error ? (
            <div style={{ color: "red" }}>{this.state.error}</div>
          ) : (
              <DialogContent>
                  <TextField
                    required={true}
                    defaultValue={data && data.name}
                    margin="dense"
                    inputRef={ref => (this.classTypeName = ref)}
                    label="Class Type Name"
                    type="text"
                    onChange={()=>{handleIsSavedState(false)}}
                    fullWidth
                  />
                  <TextField
                    defaultValue={data && data.desc}
                    margin="dense"
                    inputRef={ref => (this.desc = ref)}
                    label="Brief Description (200 Characters)"
                    type="text"
                    onChange={()=>{handleIsSavedState(false)}}
                    fullWidth
                    multiline
                    inputProps={{ maxLength: 200 }}
                  />
                  <SkillSubject
                    name="filters"
                    style={customStyle}
                    placeholder="SKill Subject"
                    value={selectedOption}
                    options={skillSubjectData}
                    onChange={this.handleSkillSubjectInputChange}
                    closeMenuOnSelect={false}
                    multi
                  />

                  <Grid container className={classes.classtypeInputContainer}>
                    <Grid item xs={8} sm={6}>
                      <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="gender">Gender</InputLabel>
                        <Select
                          required={true}
                          input={<Input id="gender" />}
                          value={this.state.gender}
                          onChange={event =>{
                            this.setState({ gender: event.target.value})
                            handleIsSavedState(false)
                          }
                          }
                          fullWidth
                        >
                          {config.genderForClassType.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.label}>
                                {data.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          defaultValue={data && data.ageMin}
                          margin="dense"
                          inputRef={ref => (this.ageMin = ref)}
                          label="Min Age"
                          type="number"
                          style={{
                            textAlign: "left",
                            margin: 4,
                            padding: 2,
                            backgroundColor: "#fff"
                          }}
                          inputProps={{ min: "0" }}
                          onChange={()=>{handleIsSavedState(false)}}
                        />
                        <TextField
                          defaultValue={data && data.ageMax}
                          margin="dense"
                          inputRef={ref => (this.ageMax = ref)}
                          label="Max Age"
                          type="number"
                          style={{
                            textAlign: "left",
                            margin: 4,
                            padding: 2,
                            backgroundColor: "#fff"
                          }}
                          inputProps={{ min: "0" }}
                          onChange={()=>{handleIsSavedState(false)}}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="experienceLevel">
                          Experience Level
                      </InputLabel>
                        <Select
                          required={true}
                          input={<Input id="experienceLevel" />}
                          value={this.state.experienceLevel}
                          onChange={event =>{
                            this.setState({ experienceLevel: event.target.value})
                            handleIsSavedState(false)
                          }
                          }
                          fullWidth
                        >
                          {config.experienceLevel.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.label}>
                                {data.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                  </Grid>
              </DialogContent>
            )}
          <DialogActions classes={{ root: this.props.classes.dialogActionsRoot }}>
            {data && (

              <ButtonWrapper>
                <FormGhostButton
                  alertColor
                  onClick={() => this.setState({ showConfirmationModal: true })}
                  label="Delete"
                  className={classes.delete}
                />
              </ButtonWrapper>
            )}
            <ButtonWrapper>
              <FormGhostButton
                darkGreyColor
                onClick={this.props.onClose}
                label="Cancel"
                className={classes.cancel}
              />
            </ButtonWrapper>

            <ButtonWrapper>
              <FormGhostButton
                onClick={this.onSubmit}
                label={data ? "Save" : "Submit"}
                className={classes.save}
              />
            </ButtonWrapper>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

export default withStyles(styles)(withPopUp(withMobileDialog()(ClassTypeForm)));
