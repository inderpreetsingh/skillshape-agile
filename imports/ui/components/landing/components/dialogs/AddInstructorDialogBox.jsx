import { get } from 'lodash';
import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import {isEmpty} from "lodash";
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
  handleInstructors = (popUp,payLoad) =>{
    Meteor.call("classes.handleInstructors",payLoad,(err,res)=>{
      this.setState({isLoading:false});
      if(res != 'emailNotFound'){
        popUp.appear("success", {
          title: "Added Successfully",
          content: `${payLoad.email} successfully added as an instructor.`,
          RenderActions: ( 
            <FormGhostButton label={'Ok'} onClick={()=>{this.props.instructorsIdsSetter ? this.props.instructorsIdsSetter(res,'add') : this.props.onModalClose()}}  applyClose />
          )
        }, true);
      }
      else if(res == 'emailNotFound'){
        popUp.appear("alert", {
          title: "Email not found",
          content: `No account found with ${payLoad.email}. Please create one and try again.`,
          RenderActions: ( 
            <FormGhostButton label={'Ok'} onClick={()=>{}}  applyClose />

          )
        }, true);
      }

    })
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({isLoading:true});
    const {popUp} = this.props;
    let payLoad = {
      action:"add",
      _id:!isEmpty(this.props.classData) ? get(this.props.classData[0],'_id',null):'',
      email:this.email.value,
      instructors:!isEmpty(this.props.classData) ? get(this.props.classData[0],'instructors',[]):'',
      classTimeForm:this.props.classTimeForm
    };
    popUp.appear("inform", {
      title: "Confirmation",
      content: `Do you really want to add  ${payLoad.email} as an instructor.`,
      RenderActions: ( 
        <div>
        <FormGhostButton label={'Cancel'} onClick={()=>{}}  applyClose />
        <FormGhostButton label={'Yes'} onClick={()=>{this.handleInstructors(popUp,payLoad)}}  applyClose />
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
      <Grid container spacing={24} >
        {/* 1rst Row */}
        
        <Grid item xs={12} sm={6} >
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
            style={{left:"50%"}}
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
