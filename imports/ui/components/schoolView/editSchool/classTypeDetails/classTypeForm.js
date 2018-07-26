import React from "react";
import { ContainerLoader } from "/imports/ui/loading/container";
import SelectArrayInput from "/imports/startup/client/material-ui-chip-input/selectArrayInput";
import { withStyles } from "material-ui/styles";
import { findIndex } from "lodash";
import Button from "material-ui/Button";
import config from "/imports/config";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Select from "material-ui/Select";
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

const styles = theme => {
  return {
    button: {
      margin: 5,
      width: 150
    },
    classtypeInputContainer: {
      alignItems: "center",
      textAlign: "left"
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
    console.log(data, state, ".... editing data");
    let state = {
      gender: "Any",
      experienceLevel: "All",
      location: "",
      skillCategoryData: [],
      skillSubjectData: [],
      skillCategoryId: null,
      selectedSkillSubject: null,
      selectedLocation: null,
      searchSkillCategoryText: ""
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
          _.find(locationData, function(location) {
            return data.locationId === location._id;
          })
      };
    }
    return state;
  };

  componentDidMount = () => {
    Meteor.call("getDefaultSubjectsList", (err, res) => {
      if (err) {
        console.error(err.reason, "---");
      } else {
        // console.info(res, "==== res ====");
        this.defaultSubjectList = res;
      }
    });
  };

  onSkillSubjectChange = values => {
    values = values.map(ele => {
      if (ele.skillCategoryId || ele._id) {
        return ele;
      }
    });
    // debugger;
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

  handleSkillCategoryInputChange = value => {
    Meteor.call("getSkillCategory", { textSearch: value }, (err, res) => {
      if (res) {
        this.setState({
          skillCategoryData: res || []
        });
      }
    });
  };

  handleSkillSubjectInputChange = value => {
    // if (!_.isEmpty(this.state.selectedSkillCategory)) {
    //   let skillCategoryIds = this.state.selectedSkillCategory.map(
    //     data => data._id
    //   );
    //   Meteor.call(
    //     "getSkillSubjectBySkillCategory",
    //     { skillCategoryIds: skillCategoryIds, textSearch: value },
    //     (err, res) => {
    //       if (res) {
    //         this.setState({
    //           skillSubjectData: res || []
    //         });
    //       }
    //     }
    //   );
    // } else {
    //   // toastr.error("Please select skill category first", "Error");
    // }
    //
    Meteor.call(
      "getSkillSubjectBySkillCategory",
      { skillCategoryIds: {}, textSearch: value },
      (err, res) => {
        if (res.length) {
          this.setState({
            skillSubjectData: res,
            defaultSubjectData: true
          });
        } else {
          this.setState({
            skillSubjectData: this.defaultSubjectList,
            defaultSubjectData: true
          });
        }
      }
    );
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
        this.state.selectedSkillSubject &&
        this.state.selectedSkillSubject.map(data => data._id),
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
        this.props.onClose(result);
      }
      this.setState({ isBusy: false, error });
    });
  };

  render() {
    const { fullScreen, data, classes, locationData } = this.props;
    const { skillCategoryData, skillSubjectData } = this.state;
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
                  label="Brief Description"
                  type="text"
                  fullWidth
                />
                {/*<SelectArrayInput
                  floatingLabelText="Skill Category"
                  optionValue="_id"
                  optionText="name"
                  input={{
                    value: this.state.selectedSkillCategory,
                    onChange: this.onSkillCategoryChange
                  }}
                  onChange={this.onSkillCategoryChange}
                  setFilter={this.handleSkillCategoryInputChange}
                  dataSourceConfig={{ text: "name", value: "_id" }}
                  choices={skillCategoryData}
                /> */}
                <SelectArrayInput
                  floatingLabelText="Skill Subject"
                  optionValue="_id"
                  optionText="name"
                  input={{
                    noFilter: this.state.defaultSubjectData,
                    value: this.state.selectedSkillSubject,
                    onChange: this.onSkillSubjectChange
                  }}
                  onChange={this.onSkillSubjectChange}
                  setFilter={this.handleSkillSubjectInputChange}
                  dataSourceConfig={{ text: "name", value: "_id" }}
                  choices={skillSubjectData}
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
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel htmlFor="location">Location</InputLabel>
                      <Select
                        required={true}
                        input={<Input id="location" />}
                        value={this.state.location}
                        onChange={event =>
                          this.setState({ location: event.target.value })
                        }
                        fullWidth
                      >
                        {_.isEmpty(locationData) && (
                          <MenuItem value="" disabled>
                            No location added in Locations.
                          </MenuItem>
                        )}
                        {locationData.map((data, index) => {
                          return (
                            <MenuItem key={index} value={data._id}>{`${
                              data.address
                            }, ${data.city}, ${data.country}`}</MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
          )}
          <DialogActions>
            {data && (
              <Button
                onClick={() => this.setState({ showConfirmationModal: true })}
                color="accent"
              >
                Delete
              </Button>
            )}
            <Button onClick={() => this.props.onClose()} color="primary">
              Cancel
            </Button>
            <Button type="submit" form={formId} color="primary">
              {data ? "Save" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(ClassTypeForm));
