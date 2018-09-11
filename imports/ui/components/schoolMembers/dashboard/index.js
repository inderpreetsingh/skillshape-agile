import React, { Fragment } from "react";
import Grid from "material-ui/Grid";
import styled from "styled-components";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { createContainer } from "meteor/react-meteor-data";
import Multiselect from "react-widgets/lib/Multiselect";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Select from "material-ui/Select";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormControlLabel } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
import { PackageDetailsTable } from "./packageDetailsTable";
import { MaterialDatePicker } from "/imports/startup/client/material-ui-date-picker";
import { TableRow, TableCell } from "material-ui/Table";
import List from "material-ui/List";
import Hidden from "material-ui/Hidden";
import find from "lodash/find";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import isEmpty from "lodash/isEmpty";
import IconButton from "material-ui/IconButton";
import Toolbar from "material-ui/Toolbar";
import MenuIcon from "material-ui-icons/Menu";
import ClassType from "/imports/api/classType/fields";
import School from "/imports/api/school/fields";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import get from "lodash/get";
import Checkbox from "material-ui/Checkbox";
import { dateFriendly } from "/imports/util";
import { phoneRegex } from "/imports/util";
import SchoolMemberListItems from "/imports/ui/components/schoolMembers/schoolMemberList/index.js";
import SchoolMemberFilter from "../filter";
import SchoolMemberInfo from "../schoolMemberInfo";
import MemberDialogBox from "/imports/ui/components/landing/components/dialogs/MemberDetails.jsx";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import SchoolMemberMedia from "/imports/ui/components/schoolMembers/mediaDetails";
import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import SubscriptionDetails from "/imports/ui/componentHelpers/subscriptionDetails";
import ClassPricing from "/imports/api/classPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
const drawerWidth = 400;
const style = {
  w211: {
    width: 211
  },
  w100: {
    width: 100
  },
  w150: {
    width: 150
  }
};
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    [theme.breakpoints.up("md")]: {
      position: "relative"
    },
    [theme.breakpoints.down("sm")]: {
      width: `${drawerWidth}px !important`
    },
    boxShadow: "none !important",
    height: "100vh",
    overflow: "auto",
    padding: "0px !important",
    paddingLeft: "16px !important",
    overflowX: "hidden !important"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  drawerIcon: {
    top: "10px",
    left: "388px",
    width: "100px",
    height: "30px",
    position: "absolute",
    float: "right"
  },
  rightPanel: {
    flexGrow: 1,
    backgroundColor: "#fafafa",
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing.unit
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: "90px !important"
    },
    background: "#ffff"
  },
  sideMenu: {
    paddingRight: "0px",
    background: "white",
    border: "solid 3px #dddd",
    paddingTop: "0px !important"
  },
  btnBackGround: {
    background: `${helpers.action}`
  }
});

const ErrorWrapper = styled.span`
  color: red;
  margin: 15px;
`;

class DashBoardView extends React.Component {
  state = {
    renderStudentModal: false,
    startDate: new Date(),
    selectedClassTypes: null,
    memberInfo: {},
    classTypesData: [],
    error: "",
    birthYear: new Date().getFullYear() - 28,
    filters: {
      classTypeIds: [],
      memberName: ""
    },
    studentWithoutEmail: false
  };

  /*Just empty `memberInfo` from state when another `members` submenu is clicked from `School` menu.
    so that right panel gets removed from UI*/
  componentWillReceiveProps(nextProps) {
    if (nextProps.schoolData !== this.props.schoolData) {
      this.setState({ memberInfo: {} });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  renderStudentAddModal = () => {
    var currentYear = new Date().getFullYear();
    let birthYears = [];
    for (let i = 0; i < 60; i++) {
      birthYears[i] = currentYear - i;
    }
    return (
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
              value={this.state.birthYear}
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
            data={this.props.classTypeData}
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
            label="Add a New Member"
          />
          <PrimaryButton
            formId="cancelUser"
            label="Cancel"
            onClick={() =>
              this.setState({ renderStudentModal: false, error: false })
            }
          />
        </Grid>
      </Grid>
    );
  };

  allowAddNewMemberWithThisEmail = event => {
    // event.preventDefault();
    // const { payload } = this.state;
    const { schoolData } = this.props;
    let payload = {};
    payload.firstName = this.firstName.value;
    payload.lastName = this.lastName.value;
    payload.email = this.email.value;
    payload.phone = this.phone.value;
    payload.schoolId = schoolData[0]._id;
    payload.classTypeIds = this.state.selectedClassTypes;
    payload.birthYear = this.state.birthYear;
    payload.studentWithoutEmail = this.state.studentWithoutEmail;

    let state = {
      isLoading: true
    };
    // Confirmation modal open then close it.
    if (this.state.showConfirmationModal) {
      state.showConfirmationModal = false;
    }
    this.setState(state);
    Meteor.call("school.addNewMember", payload, (err, res) => {
      let state = {
        isLoading: false
      };
      if (err) {
        state.error = err.reason || err.message;
      }
      if (res) {
        state.renderStudentModal = false;
      }
      this.setState(state);
    });
  };

  addNewMember = event => {
    event.preventDefault();
    const { schoolData } = this.props;
    // Check for existing user only if users has entered their email.
    if (!isEmpty(schoolData) && !this.state.studentWithoutEmail) {
      // Show Loading
      this.setState({ isLoading: true });
      // Check if user with this email already exists If member exists, school admin sees a dialogue.
      Meteor.call(
        "user.checkForRegisteredUser",
        { email: this.email.value },
        (err, res) => {
         
          let state = {};
          if (res) {
            // Open Modal
            state.showConfirmationModal = true;
            state.message = res;
            state.isLoading = false;
            // this.setState({showConfirmationModal:true, message:res});
          }
          if (err) {
            this.allowAddNewMemberWithThisEmail();
          }
          this.setState(state);
        }
      );
    } else {
      // Create member without email.
      let payload = {};
      payload.firstName = this.firstName.value;
      payload.lastName = this.lastName.value;
      // payload.email = this.email.value;
      payload.phone = this.phone.value;
      payload.schoolId = schoolData[0]._id;
      payload.classTypeIds = this.state.selectedClassTypes;
      payload.birthYear = this.state.birthYear;
      payload.studentWithoutEmail = this.state.studentWithoutEmail;
      Meteor.call("school.addNewMemberWithoutEmail", payload, (err, res) => {
        let state = {
          isLoading: false
        };
        if (err) {
          state.error = err.reason || err.message;
        }
        if (res) {
          state.renderStudentModal = false;
        }
        this.setState(state);
      });
    }
  };

  handleMemberDialogBoxState = () => {
    this.setState({ renderStudentModal: false });
  };

  handleChangeDate = (fieldName, date) => {
    this.setState({ [fieldName]: new Date(date) });
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

  collectSelectedClassTypes = data => {
    let classTypeIds = data.map(item => {
      return item._id;
    });
    this.setState({ selectedClassTypes: classTypeIds });
  };

  handleMemberDetailsToRightPanel = memberId => {
    let memberInfo = SchoolMemberDetails.findOne(memberId);
    // memberInfo = this.state.memberInfo
    this.handleDrawerToggle();
    this.setState({
      memberInfo: {
        _id: memberInfo._id,
        memberId: memberInfo._id,
        name: memberInfo.firstName,
        phone: memberInfo.phone,
        email: memberInfo.email,
        schoolId: memberInfo.schoolId,
        adminNotes: memberInfo.adminNotes,
        classmatesNotes: memberInfo.classmatesNotes,
        birthYear: memberInfo.birthYear,
        lastName: memberInfo.lastName,
        classTypeIds: memberInfo.classTypeIds,
        firstName: memberInfo.firstName,
        pic: memberInfo.profile.profile.pic,
        studentWithoutEmail: memberInfo.studentWithoutEmail,
        packageDetails: memberInfo.packageDetails
      },
      schoolMemberDetailsFilters: { _id: memberId }
    });
  };
  // This is used to save admin notes in `Members` information.
  saveAdminNotesInMembers = event => {
    let memberInfo = this.state.memberInfo;
    memberInfo.adminNotes = event.target.value;
    memberInfo.schoolId = this.props.schoolData && this.props.schoolData._id;
    Meteor.call("school.saveAdminNotesToMember", memberInfo, (err, res) => {
      if (res) {
      }
    });
  };

  handleInput = event => {
    // this.setState({adminNotes:event.target.value});
    let oldMemberInfo = { ...this.state.memberInfo };
    oldMemberInfo.adminNotes = event.target.value;
    this.setState({ memberInfo: oldMemberInfo });
  };

  handleTaggingMembers = () => {
  };

  renderSchoolMedia = (schoolData, memberInfo, slug) => {
    const school = find(schoolData, { _id: memberInfo.schoolId });
    if (isEmpty(school)) {
      return;
    } else {
      return (
        <SchoolMemberMedia
          showUploadImageBtn={slug ? true : false}
          schoolData={school}
          memberInfo={memberInfo}
          schoolMemberDetailsFilters={this.state.schoolMemberDetailsFilters}
          handleTaggingMembers={this.handleTaggingMembers}
          mediaListfilters={{
            $or: [{ taggedMemberIds: { $in: [memberInfo.memberId] } }]
          }}
        />
      );
    }
  };

  handleMemberNameChange = event => {
    this.setState({
      filters: {
        ...this.state.filters,
        memberName: event.target.value
      }
    });
  };

  handleClassTypeDataChange = data => {
    let classTypeIds = data.map(item => {
      return item._id;
    });
    this.setState({
      filters: {
        ...this.state.filters,
        classTypeIds: classTypeIds
      }
    });
  };

  // setInitialClassTypeData = (data) => {
  //     this.refs.SchoolMemberFilter.setClassTypeData(data);
  // }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  // Return Dash view from here
  render() {

    const {
      classes,
      theme,
      schoolData,
      classTypeData,
      slug,
      schoolAdmin
    } = this.props;
    const { renderStudentModal, memberInfo } = this.state;

    let schoolMemberListFilters = { ...this.state.filters };
    if (slug) {
      schoolMemberListFilters.schoolId =
        !isEmpty(schoolData) && schoolData[0]._id;
    }

    let { currentUser, isUserSubsReady } = this.props;
    let filters = { ...this.state.filters };

    if (!slug) {
      filters.activeUserId = currentUser && currentUser._id;
    }

    // Not allow accessing this URL to non admin user.
    if (!schoolAdmin && slug) {
      return (
        <Typography type="display2" gutterBottom align="center">
          To access this page you need to login as an admin.
        </Typography>
      );
    }

    const drawer = (
      <div>
        <List>
          <SchoolMemberFilter
            stickyPosition={this.state.sticky}
            ref="SchoolMemberFilter"
            handleClassTypeDataChange={this.handleClassTypeDataChange}
            handleMemberNameChange={this.handleMemberNameChange}
            classTypeData={classTypeData}
            filters={filters}
          />
          {slug && (
            <Grid
              item
              sm={12}
              xs={12}
              md={12}
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                padding: "16px"
              }}
            >
              <Button
                raised
                className={classes.btnBackGround}
                color="primary"
                onClick={() => this.setState({ renderStudentModal: true })}
              >
                Add New Student
              </Button>
            </Grid>
          )}
          <SchoolMemberListItems
            filters={schoolMemberListFilters}
            handleMemberDetailsToRightPanel={
              this.handleMemberDetailsToRightPanel
            }
          />
        </List>
      </div>
    );

    if (this.props.isLoading) {
      return <Preloader />;
    }

    return (
      <Grid container className={classes.root}>
        {this.state.showConfirmationModal && (
          <ConfirmationModal
            open={this.state.showConfirmationModal}
            submitBtnLabel="Yes"
            cancelBtnLabel="No, I will try with different Email"
            message={this.state && this.state.message.userInfo}
            onSubmit={this.allowAddNewMemberWithThisEmail}
            onClose={() => this.setState({ showConfirmationModal: false })}
          />
        )}
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              
            </Typography>
          </Toolbar>
        </AppBar>
        {!isEmpty(schoolData) && (
          <div>
            <form noValidate autoComplete="off">
              {renderStudentModal && (
                <MemberDialogBox
                  open={renderStudentModal}
                  renderStudentAddModal={this.renderStudentAddModal}
                  addNewMember={this.addNewMember}
                  onModalClose={() =>
                    this.setState({ renderStudentModal: false, error: false })
                  }
                />
              )}
            </form>
          </div>
        )}
        <Grid
          item
          md={4}
          style={{ paddingRight: "0px" }}
          className={classes.sideMenu}
        >
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              style={{ position: "absolute" }}
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown>
            <div variant="permanent" open className={classes.drawerPaper}>
              {drawer}
            </div>
          </Hidden>
        </Grid>
        <Grid
          item
          sm={12}
          xs={12}
          md={8}
          className={classes.rightPanel}
          style={{ height: "100vh", overflow: "auto", overflowX: "hidden" }}
        >
          {!isEmpty(memberInfo) && (
            <Fragment>
              <SchoolMemberInfo
                memberInfo={memberInfo}
                handleInput={this.handleInput}
                saveAdminNotesInMembers={this.saveAdminNotesInMembers}
                disabled={slug ? false : true}
                view={slug ? "admin" : "classmates"}
                classTypeData={get(this.props, "classTypeData", [])}
                handleMemberDetailsToRightPanel={
                  this.handleMemberDetailsToRightPanel
                }
              />
              {memberInfo &&
                Meteor.settings.public.paymentEnabled && (
                  <SubscriptionDetails memberInfo={memberInfo} />
                )}
              {/* <div
                style={{
                  height: "300px",
                  width: "400px",
                  border: "solid 2px",
                  margin: "20px"
                }}
              >
                <div style={{ margin: "10px" }}>Active Subscription</div>
                {memberInfo &&
                  memberInfo.packageDetails &&
                  Object.values(memberInfo.packageDetails).map(value => {
                    return (
                      <center>
                        <div
                          style={{
                            border: "solid 2px",
                            backgroundColor: "green",
                            display: "flex",
                            justifyContent: "space-between",
                            width: "368px",
                            height: "50px",
                            borderRadius: "16px",
                            marginBottom: "2px"
                          }}
                        >
                          <div style={{ margin: "10px" }}>
                            {value && value.createdOn
                              ? dateFriendly(
                                  value.createdOn,
                                  "MMMM Do YYYY, h:mm:ss a"
                                )
                              : "Unavilable"}
                          </div>
                          {"  "}
                          <div style={{ margin: "10px" }}>
                            {value && value.packageName
                              ? value.packageName
                              : "Unavilable"}
                          </div>
                          <div
                            style={{
                              border: "solid 2px",
                              width: "48px",
                              height: "41px",
                              marginTop: "3px",
                              borderRadius: "14px"
                            }}
                          />
                        </div>
                      </center>
                    );
                  })} */}
              {/* old subscription code */}
              {/* <PackageDetailsTable>
                  {memberInfo &&
                    memberInfo.packageDetails &&
                    Object.values(memberInfo.packageDetails).map(value => {
                      return (
                        <TableRow>
                          <TableCell style={style.w150}>
                            {}
                            {value && value.createdOn
                              ? dateFriendly(
                                  value.createdOn,
                                  "MMMM Do YYYY, h:mm:ss a"
                                )
                              : "Unavilable"}
                          </TableCell> */}
              {/* <TableCell style={style.w150}>
                            {value && value.packageName
                              ? value.packageName
                              : "Unavilable"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {/* 
                        
                      );
                    })} */}
              {/* </PackageDetailsTable> */}
              {/* </div> */}
              {this.renderSchoolMedia(schoolData, memberInfo, slug)}
            </Fragment>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default createContainer(props => {
  let { slug } = props.params;
  let schoolData = [];
  let isLoading = true;
  let classTypeData = [];
  let filters = { ...props.filters, slug };
  let schoolAdmin;
  let schoolId;
  let classPricing,monthlyPricing,enrollmentFee;
  let subscription = Meteor.subscribe(
    "schoolMemberDetails.getSchoolMemberWithSchool",
    filters
  );
  if (subscription && subscription.ready()) {
    isLoading = false;
    classTypeData = ClassType.find().fetch();

    if (slug) {
      schoolData = School.find({ slug: slug }).fetch();
 
    } else {
      schoolData = School.find().fetch();
    }
    //find school id
    schoolId=!isEmpty(schoolData) && schoolData[0]._id;
    //find all classpricing from subscription for displaying in add new member popup
    let classPricingSubscription=Meteor.subscribe("classPricing.getClassPricing",{schoolId})
    if(classPricingSubscription.ready()){
      classPricing=ClassPricing.find().fetch();
    }

    //find all enrollmentFee from subscription for displaying in add new member popup
    let enrollmentFeeSubscription=Meteor.subscribe("enrollmentFee.getEnrollmentFee",{schoolId})
    if(enrollmentFeeSubscription.ready()){
      enrollmentFee=EnrollmentFees.find().fetch();
    }
    //find all monthlyPricing from subscription for displaying in add new member popup
    let monthlySubscription=Meteor.subscribe("monthlyPricing.getMonthlyPricing",{schoolId})
    if(monthlySubscription.ready()){
      monthlyPricing=MonthlyPricing.find().fetch();
    }


    if (!isEmpty(schoolData) && schoolData[0].admins) {
      let currentUser = Meteor.user();
      if (
        _.contains(schoolData[0].admins, currentUser._id) ||
        schoolData[0].superAdmin == currentUser._id
      ) {
        schoolAdmin = true;
      }
    }
  }

  return {
    ...props,
    schoolData,
    classTypeData,
    isLoading,
    slug,
    schoolAdmin,
    classPricing,
    enrollmentFee,monthlyPricing
  };
}, withStyles(styles, { withTheme: true })(DashBoardView));
