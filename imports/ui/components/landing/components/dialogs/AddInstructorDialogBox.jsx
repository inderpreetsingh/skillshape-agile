import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import Multiselect from "react-widgets/lib/Multiselect";
import Checkbox from "material-ui/Checkbox";
import { ContainerLoader } from "/imports/ui/loading/container.js";

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
      width: "100%"
    },
    iconButton: {
      height: "auto",
      width: "auto"
    }
  };
};
const ErrorWrapper = styled.span`
  color: red;
  margin: 15px;
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
    this.state={};
  }

  onSubmit = () => {};
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
  render() {
    const { props } = this;
    let birthYears = [];
    let adminView = true;
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
      <Grid container spacing={24}>
        {/* 1rst Row */}
        <Grid item xs={12} sm={6}>
          <TextField
            id="firstName"
            label="First Name"
            margin="normal"
            fullWidth
            inputRef={ref => {
              this.firstName = ref;
            }}
            required={true}
          />
        </Grid>
        {this.state.isLoading && <ContainerLoader />}
        <Grid item xs={12} sm={6}>
          <TextField
            id="lastName"
            label="Last Name"
            margin="normal"
            fullWidth
            inputRef={ref => {
              this.lastName = ref;
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="email"
            type="email"
            label="Email"
            margin="normal"
            fullWidth
            inputRef={ref => {
              this.email = ref;
            }}
            required={!this.state.studentWithoutEmail}
            disabled={this.state.studentWithoutEmail}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="phone"
            label="Phone"
            margin="normal"
            inputRef={ref => {
              this.phone = ref;
            }}
            fullWidth
            onBlur={this.handlePhoneChange}
          />
          {this.state.showErrorMessage && (
            <Typography color="error" type="caption">
              Not a valid Phone number
            </Typography>
          )}
        </Grid>

        <Grid item sm={6} xs={12}>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="birthYear">Birth Year</InputLabel>
            <Select
              required={true}
              input={<Input id="birthYear" />}
              value={"this.state.birthYear"}
              onChange={event =>
                this.setState({ birthYear: event.target.value })
              }
              fullWidth
            >
              {birthYears.map((index, year) => {
                return (
                  <MenuItem key={birthYears[year]} value={birthYears[year]}>
                    {birthYears[year]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} style={{ marginTop: "26px" }}>
          <Multiselect
            textField={"name"}
            valueField={"_id"}
            data={this.props.classTypeData || []}
            placeholder="Available Classes"
            onChange={this.collectSelectedClassTypes}
            />
        </Grid>

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
       
         
          
           
        <FormControl fullWidth margin="dense">
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.studentWithoutEmail}
                onChange={this.handleChange("studentWithoutEmail")}
                value="studentWithoutEmail"
              />
            }
            label="Student does not have an email"
          />
        </FormControl>
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          {this.state.error && <ErrorWrapper>{this.state.error}</ErrorWrapper>}
          <PrimaryButton
            formId="addUser"
            type="submit"
            label={`Add a New ${!adminView?"Member":'Instructor'}`} />
             <PrimaryButton formId="cancelUser"
            label="Cancel"
            onClick={props.onModalClose}
          />
        </Grid>
      </Grid>
      </form>
          </DialogContent>

          <DialogActions classes={{ root: props.classes.dialogActionsRoot }}>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

AddInstructorDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withStyles(styles)(AddInstructorDialogBox);
