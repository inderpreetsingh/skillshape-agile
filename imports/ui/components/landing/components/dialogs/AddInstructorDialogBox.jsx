import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";

import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton.jsx';
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import Select from "react-select";
import { isEmpty, flatten, get } from "lodash";
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
        3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      "@media screen and (max-width : 500px)": {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      paddingBottom: helpers.rhythmDiv * 2,
      flexGrow: 0,
      display: "flex",
      justifyContent: "center",
      minHeight: 200,
      "@media screen and (max-width : 500px)": {
        // minHeight: "150px"
      }
    },
    dialogRoot: {
      width: "100%",
      maxWidth: 400
    },
    iconButton: {
      height: "auto",
      width: "auto"
    }
  };
};

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: ${rhythmDiv * 2}px;
  `;

const ErrorWrapper = styled.span`
  color: red;
  margin: ${rhythmDiv * 2}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ContentWrapper = styled.div``;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class AddInstructorDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeStates();
  }
  initializeStates = () => {
    let emailList = [];
    const { schoolId } = this.props;
    Meteor.call('school.getAdminsEmail', schoolId, (err, res) => {
      if (res) {
        // console.log(res, "METEOR>>.")
        res.map((obj, index) => {
          emailList.push({ value: obj._id, label: obj.emails[0].address });
        })
      }
      this.setState({ emailList });
    })
    return { selectedOption: [] }
  }
  handleClassesAndClassTime = (popUp, payLoad) => {
    popUp.appear("inform", {
      title: "Add Instructor",
      content: `Add this instructor to this class only, or to this and all future classes?`,
      RenderActions: (
        <div>
          <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose />
          <FormGhostButton label={'Just to this instance'} onClick={() => { this.handleInstructors(popUp, payLoad) }} applyClose />
          <FormGhostButton label={'Whole series'} onClick={() => { this.handleWholeSeries(popUp, payLoad) }} applyClose />
        </div>
      )
    }, true);
  }
  handleWholeSeries = (popUp, payLoad) => {
    let { classData } = this.props;
    payLoad.classTimeId = get(classData[0], 'classTimeId', '');
    payLoad.schoolId = get(classData[0], 'schoolId', '');
    Meteor.call("classTimes.editClassTimes", { doc_id: payLoad.classTimeId, doc: payLoad }, (err, res) => {

      this.setState({ isLoading: false });
      if (res != 'emailNotFound') {
        popUp.appear("success", {
          title: "Added Successfully",
          content: `Successfully added as an instructor.`,
          RenderActions: (
            <FormGhostButton label={'Ok'} onClick={() => { this.props.instructorsIdsSetter ? this.props.instructorsIdsSetter(payLoad.instructors, 'add') : this.props.onModalClose() }} applyClose />
          )
        }, true);
      }
      else if (res == 'emailNotFound') {
        popUp.appear("alert", {
          title: "Email not found",
          content: `No account found with this email. Please create one and try again.`,
          RenderActions: (
            <FormGhostButton label={'Ok'} onClick={() => { }} applyClose />

          )
        }, true);
      }

    })
  }
  handleInstructors = (popUp, payLoad) => {
    Meteor.call("classes.handleInstructors", payLoad, (err, res) => {
      this.setState({ isLoading: false });
      if (res != 'emailNotFound') {
        popUp.appear("success", {
          title: "Added Successfully",
          content: <div>Successfully added as an instructor.<br />{payLoad.classTimeForm ? "Changes will show in the Class Times Editor after saving." : ''}</div>,
          RenderActions: (
            <FormGhostButton label={'Ok'} onClick={() => { this.props.instructorsIdsSetter ? this.props.instructorsIdsSetter(payLoad.instructors, 'add') : this.props.onModalClose() }} applyClose />
          )
        }, true);
      }
      else if (res == 'emailNotFound') {
        popUp.appear("alert", {
          title: "Email not found",
          content: `No account found with this email. Please create one and try again.`,
          RenderActions: (
            <FormGhostButton label={'Ok'} onClick={() => { }} applyClose />

          )
        }, true);
      }

    })
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { popUp } = this.props;
    let { selectedOption } = this.state;
    let payLoad = {
      action: "add",
      _id: !isEmpty(this.props.classData) ? get(this.props.classData[0], '_id', null) : '',
      instructors: !isEmpty(this.props.classData) ? get(this.props.classData[0], 'instructors', this.props.instructorsIds) : [],
      classTimeForm: this.props.classTimeForm
    };
    payLoad.instructors.push(selectedOption.map(ele => ele.value));
    payLoad.instructors = flatten(payLoad.instructors);
    popUp.appear("inform", {
      title: "Confirmation",
      content: `Do you really want to add  these users as an instructor.`,
      RenderActions: (
        <div>
          <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose />
          <FormGhostButton label={'Yes'} onClick={() => { !payLoad.classTimeForm ? this.handleClassesAndClassTime(popUp, payLoad) : this.handleInstructors(popUp, payLoad) }} applyClose />
        </div>
      )
    }, true);
  };
  handlePhoneChange = event => {
    const inputPhoneNumber = event.target.value;
    let phoneRegex = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/g;

    let showErrorMessage;
    if (inputPhoneNumber.match(phoneRegex) || inputPhoneNumber == "") {
      showErrorMessage = false;
    } else {
      showErrorMessage = true;
    }
    this.setState({
      showErrorMessage: showErrorMessage
    });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  handleEmail = (selectedOption) => {
    this.setState(state => {
      return {
        ...state,
        selectedOption: selectedOption
      };
    });
  }
  render() {
    const { props } = this;
    let birthYears = [];
    let adminView = true;
    let { selectedOption, emailList } = this.state;
    return (
      <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="add instructor"
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Add Instructor</Title>

              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent classes={{ root: props.classes.dialogContent }}>
            <form id="addUser" onSubmit={this.onSubmit}>
              <Select
                name="filters"
                placeholder="Select Instructors"
                value={selectedOption}
                options={emailList}
                onChange={this.handleEmail}
                multi
              />




              {/*package details will be show later and the commented code will be used after currency task*/}


              {/* {this.state.selectedClassTypes!=null && !isEmpty(this.state.selectedClassTypes)&& <Grid item xs={12} sm={6} style={{ marginTop: "26px" }}>
          <Multiselect
            textField={"name"}
            valueField={"_id"}
            data={this.props.enrollmentFee}
            placeholder="Enrollment Fee"
            onChange={this.collectSelectedClassTypes}
          />
          
          
        </Grid>}
        {this.state.selectedClassTypes!=null && !isEmpty(this.state.selectedClassTypes)&&  <Grid item xs={12} sm={6} style={{ marginTop: "26px" }}>
        <Multiselect
            textField={"packageName"}
            valueField={"_id"}
            data={this.props.classPricing}
            placeholder="Class Packages"
            onChange={this.collectSelectedClassTypes}
          />
          </Grid>}
        {this.state.selectedClassTypes!=null && !isEmpty(this.state.selectedClassTypes)&&  <Grid item xs={12} sm={6} style={{ marginTop: "26px" }}>
           <Multiselect
            textField={"packageName"}
            valueField={"_id"}
            data={this.props.monthlyPricing}
            placeholder="Monthly Packages"
            onChange={this.collectSelectedClassTypes}
          />
          </Grid>}
         */}




              <ButtonsWrapper>
                {this.state.error && <ErrorWrapper>{this.state.error}</ErrorWrapper>}
                {this.state.selectedOption.length ? <PrimaryButton
                  formId="addUser"
                  type="submit"
                  label={`Add a New ${!adminView ? "Member" : 'Instructor'}`} />
                  : <SecondaryButton
                    disabled
                    label={`Add a New ${!adminView ? "Member" : 'Instructor'}`} />}

                <PrimaryButton formId="cancelUser"
                  label="Cancel"
                  onClick={props.onModalClose}
                />
              </ButtonsWrapper>

            </form>
          </DialogContent>

          <DialogActions classes={{ root: props.classes.dialogActionsRoot }}>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog >
    );
  }
}

AddInstructorDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withStyles(styles)(AddInstructorDialogBox);
