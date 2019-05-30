/* eslint-disable no-return-assign */
import {
  findIndex, size, find, without, isEmpty,
} from 'lodash';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import React from 'react';
import SkillSubject from 'react-select';
import styled from 'styled-components';
import '/imports/api/sLocation/methods';
import config from '/imports/config';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import { confirmationDialog, withPopUp, unSavedChecker } from '/imports/util';
import PropTypes, { instanceOf } from 'prop-types';

const customStyle = {
  marginTop: '10px',
  marginBottom: '10px',
};
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const styles = () => ({
  button: {
    margin: 5,
    width: 150,
  },
  classtypeInputContainer: {
    alignItems: 'center',
    textAlign: 'left',
  },
  delete: {
    backgroundColor: 'red',
    color: 'black',
    fontWeight: 600,
  },
  cancel: {
    backgroundColor: 'yellow',
    color: 'black',
    fontWeight: 600,
  },
  save: {
    backgroundColor: 'green',
    color: 'black',
    fontWeight: 600,
  },
  dialogActionsRoot: {
    [`@media screen and (max-width: ${helpers.mobile}px)`]: {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
});

class ClassTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
    // this.onUpdateSkillCategoryInput = debounce(this.onUpdateSkillCategoryInput, 500);
  }

  initializeFields = () => {
    const { data, locationData, handleIsSavedState } = this.props;
    handleIsSavedState(true);
    const state = {
      gender: 'Any',
      experienceLevel: 'All',
      location: '',
      skillCategoryData: [],
      skillSubjectData: [],
      skillCategoryId: null,
      selectedSkillSubject: null,
      selectedLocation: null,
      searchSkillCategoryText: '',
      selectedOption: [],
      skillSubject: [],
    };
    if (data && size(data) > 0) {
      if (data.selectedSkillCategory && size(data.selectedSkillCategory) > 0) {
        state.searchSkillCategoryText = data.selectedSkillCategory.name;
      }

      return {
        ...state,
        ...data,
        skillCategoryData: [data.selectedSkillCategory],
        location: data.locationId || '',
        selectedLocation:
          locationData && find(locationData, location => data.locationId === location._id),
      };
    }
    return state;
  };

  componentDidMount = () => {
    Meteor.call('getAllSkillSubjects', (err, res) => {
      if (!err) {
        const { skillSubject } = this.state;
        const state = { skillSubjectData: [], selectedOption: [] };
        res.forEach((current) => {
          state.skillSubjectData.push({ value: current._id, label: current.name });
          skillSubject.forEach((skillId) => {
            if (skillId === current._id) {
              state.selectedOption.push({ value: skillId, label: current.name });
            }
          });
        });
        this.setState({
          skillSubjectData: state.skillSubjectData,
          selectedOption: state.selectedOption,
        });
      }
    });
  };

  onSkillSubjectChange = (values) => {
    let newValues = values;
    newValues = values.map((ele) => {
      if (ele.skillCategoryId || ele._id) {
        return ele;
      }
      return undefined;
    });

    newValues = without(newValues, undefined);
    if (!isEmpty(newValues)) {
      this.setState({ selectedSkillSubject: values });
    }
    if (newValues.length === 0) {
      this.setState({ selectedSkillSubject: [] });
    }
  };

  onSkillCategoryChange = (values) => {
    const { selectedSkillSubject } = this.state;
    const newSelectedSKillSubject = selectedSkillSubject
      && selectedSkillSubject.filter(data => findIndex(values, { _id: data.skillCategoryId }) > -1);
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectedSkillCategory: values, selectedSkillSubject: newSelectedSKillSubject });
  };

  handleInputChange = (fieldName, event) => this.setState({ [fieldName]: event.target.value });

  handleSelectChange = (fieldName, event, index, value) => this.setState({ [fieldName]: value });

  handleSkillSubjectInputChange = (selectedOption) => {
    const { handleIsSavedState } = this.props;
    handleIsSavedState(false);
    this.setState({
      selectedOption,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { schoolId, data, popUp } = this.props;
    const {
      selectedOption = [], gender, experienceLevel, location,
    } = this.state;
    if (!this.classTypeName.value) {
      const dialogData = {
        popUp,
        title: 'Error',
        type: 'alert',
        content: 'Class Type Name is Required',
        buttons: [{ label: 'Ok', onClick: () => {}, greyColor: true }],
      };
      confirmationDialog(dialogData);
      return;
    }
    const payload = {
      schoolId,
      name: this.classTypeName.value,
      desc: this.desc.value,
      // skillCategoryId:
      //   this.state.selectedSkillCategory &&
      //   this.state.selectedSkillCategory.map(data => data._id),
      skillSubject: selectedOption.map(obj => obj.value),
      gender,
      experienceLevel,
      ageMin: this.ageMin.value,
      ageMax: this.ageMax.value,
      locationId: location,
    };
    if (!payload.skillSubject) {
      payload.skillSubject = [];
    }
    Meteor.call(
      'getSkillCategoryIdsFromSkillSubjects',
      { skillSubjectIds: payload.skillSubject },
      (err, res) => {
        if (res) {
          payload.skillCategoryId = res;
          if (data && data._id) {
            this.handleSubmit({
              methodName: 'classType.editClassType',
              doc: payload,
              doc_id: data._id,
            });
          } else {
            this.handleSubmit({
              methodName: 'classType.addClassType',
              doc: payload,
            });
          }
        }
      },
    );
  };

  handleSubmit = ({ methodName, doc, doc_id }) => {
    // this.props.enableParentPanelToDefaultOpen();
    const { handleIsSavedState, onClose } = this.props;
    Meteor.call(methodName, { doc, doc_id }, (error, result) => {
      if (result) {
        if (doc_id) {
          onClose(result, 'edit');
        } else {
          onClose(result, 'add');
        }
      }
      handleIsSavedState(true);
      this.setState({ isBusy: false, error });
    });
  };

  // Set default location id if nothing selected
  setDefaultLocation = (defaultLocId) => {
    this.setState({ location: defaultLocId });
    return defaultLocId;
  };

  render() {
    const {
      data, classes, handleIsSavedState, open, onClose,
    } = this.props;
    const {
      skillSubjectData,
      selectedOption,
      isBusy,
      showConfirmationModal,
      error,
      gender,
      experienceLevel,
    } = this.state;
    return (
      <div>
        <Dialog
          open={open}
          onClose={() => {
            unSavedChecker.call(this);
          }}
          aria-labelledby="form-dialog-title"
          fullScreen={false}
        >
          <DialogTitle id="form-dialog-title">Add Class Type</DialogTitle>
          {isBusy && <ContainerLoader />}
          {showConfirmationModal && (
            <ConfirmationModal
              open={showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this Class Type, Are you sure?"
              onSubmit={() => this.handleSubmit({
                methodName: 'classType.removeClassType',
                doc: data,
                doc_id: data._id,
              })
              }
              onClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}

          {error ? (
            <div style={{ color: 'red' }}>{error.error}</div>
          ) : (
            <DialogContent>
              <TextField
                required
                defaultValue={data && data.name}
                margin="dense"
                inputRef={ref => (this.classTypeName = ref)}
                label="Class Type Name"
                type="text"
                onChange={() => {
                  handleIsSavedState(false);
                }}
                fullWidth
              />
              <TextField
                defaultValue={data && data.desc}
                margin="dense"
                inputRef={ref => (this.desc = ref)}
                label="Brief Description (200 Characters)"
                type="text"
                onChange={() => {
                  handleIsSavedState(false);
                }}
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
                      required
                      input={<Input id="gender" />}
                      value={gender}
                      onChange={(event) => {
                        this.setState({ gender: event.target.value });
                        handleIsSavedState(false);
                      }}
                      fullWidth
                    >
                      {config.genderForClassType.map((obj, index) => (
                        <MenuItem key={index.toString} value={obj.label}>
                          {obj.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      defaultValue={data && data.ageMin}
                      margin="dense"
                      inputRef={ref => (this.ageMin = ref)}
                      label="Min Age"
                      type="number"
                      style={{
                        textAlign: 'left',
                        margin: 4,
                        padding: 2,
                        backgroundColor: '#fff',
                      }}
                      inputProps={{ min: '0' }}
                      onChange={() => {
                        handleIsSavedState(false);
                      }}
                    />
                    <TextField
                      defaultValue={data && data.ageMax}
                      margin="dense"
                      inputRef={ref => (this.ageMax = ref)}
                      label="Max Age"
                      type="number"
                      style={{
                        textAlign: 'left',
                        margin: 4,
                        padding: 2,
                        backgroundColor: '#fff',
                      }}
                      inputProps={{ min: '0' }}
                      onChange={() => {
                        handleIsSavedState(false);
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel htmlFor="experienceLevel">Experience Level</InputLabel>
                    <Select
                      required
                      input={<Input id="experienceLevel" />}
                      value={experienceLevel}
                      onChange={(event) => {
                        this.setState({ experienceLevel: event.target.value });
                        handleIsSavedState(false);
                      }}
                      fullWidth
                    >
                      {config.experienceLevel.map((obj, index) => (
                        <MenuItem key={index.toString} value={obj.label}>
                          {obj.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
          )}
          <DialogActions classes={{ root: classes.dialogActionsRoot }}>
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
                onClick={() => {
                  handleIsSavedState(true);
                  onClose();
                }}
                label="Cancel"
                className={classes.cancel}
              />
            </ButtonWrapper>

            <ButtonWrapper>
              <FormGhostButton
                onClick={this.onSubmit}
                label={data ? 'Save' : 'Submit'}
                className={classes.save}
              />
            </ButtonWrapper>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
ClassTypeForm.propTypes = {
  data: PropTypes.instanceOf(Object),
  classes: PropTypes.instanceOf(Object),
  handleIsSavedState: PropTypes.func.isRequired,
  locationData: PropTypes.arrayOf(instanceOf(Object)),
  schoolId: PropTypes.string.isRequired,
  popUp: PropTypes.instanceOf(Object),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
ClassTypeForm.defaultProps = {
  data: {},
  classes: {},
  locationData: [],
  popUp: {},
};
export default withStyles(styles)(withPopUp(withMobileDialog()(ClassTypeForm)));
