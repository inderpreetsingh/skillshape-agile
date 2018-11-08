import React from "react";
import { ContainerLoader } from "/imports/ui/loading/container";
import { withStyles } from "material-ui/styles";
import { findIndex } from "lodash";
import Button from "material-ui/Button";
import config from "/imports/config";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Select from "material-ui/Select";
import SkillSubject from "react-select";
import Grid from "material-ui/Grid";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog
} from "material-ui/Dialog";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import "/imports/api/sLocation/methods";
import { FormControl } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
const formId = "classTypeForm";
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { isThisSecond } from "date-fns";
import { mobile } from "/imports/ui/components/landing/components/jss/helpers.js";
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
    const { data, locationData } = this.props;
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
      skillSubject: []

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
    this.setState(state => {
      return {
        selectedOption: selectedOption
      };
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { schoolId, data } = this.props;

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
      this.setState({ isBusy: false, error });
    });
  };
  //Set default location id if nothing selected 
  setDefaultLocation = (defaultLocId) => {
    this.setState({ location: defaultLocId })
    return defaultLocId;
  }
  render() {
    const { fullScreen, data, classes, locationData } = this.props;
    const { skillCategoryData, skillSubjectData, selectedOption } = this.state;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          aria-labelledby="form-dialog-title"
          fullScreen={fullScreen}
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
                  doc: data
                })
              }
              onClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}

          {this.state.error ? (
            <div style={{ color: "red" }}>{this.state.error}</div>
          ) : (
              <DialogContent>
                <form id={formId} onSubmit={this.onSubmit}>
                  <TextField
                    required={true}
                    defaultValue={data && data.name}
                    margin="dense"
                    inputRef={ref => (this.classTypeName = ref)}
                    label="Class Type Name"
                    type="text"
                    fullWidth
                  />
                  <TextField
                    defaultValue={data && data.desc}
                    margin="dense"
                    inputRef={ref => (this.desc = ref)}
                    label="Brief Description (200 Characters)"
                    type="text"
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
                          onChange={event =>
                            this.setState({ gender: event.target.value })
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
                          onChange={event =>
                            this.setState({ experienceLevel: event.target.value })
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
                </form>
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
                onClick={() => this.props.onClose()}
                label="Cancel"
                className={classes.cancel}
              />
            </ButtonWrapper>

            <ButtonWrapper>
              <FormGhostButton
                type="submit"
                form={formId}
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

export default withStyles(styles)(withMobileDialog()(ClassTypeForm));
