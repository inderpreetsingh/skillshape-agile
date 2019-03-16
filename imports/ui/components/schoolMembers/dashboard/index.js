import concat from 'lodash/concat';
import find from "lodash/find";
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from "lodash/isEmpty";
import remove from 'lodash/remove';
import Checkbox from "material-ui/Checkbox";
import Drawer from "material-ui/Drawer";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import { createContainer } from "meteor/react-meteor-data";
import React, { Fragment, lazy, Suspense } from "react";
import ReactResizeDetector from 'react-resize-detector';
import { CSSTransition } from 'react-transition-group';
import Multiselect from "react-widgets/lib/Multiselect";
import styled from "styled-components";
import SchoolMemberFilter from "../filter";
//const SchoolMemberInfo = lazy(() => import("../schoolMemberInfo"));
import ClassPricing from "/imports/api/classPricing/fields";
import ClassSubscription from "/imports/api/classSubscription/fields";
import ClassType from "/imports/api/classType/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import Purchases from "/imports/api/purchases/fields";
import School from "/imports/api/school/fields";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import MemberDialogBox from "/imports/ui/components/landing/components/dialogs/MemberDetails.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { ToggleVisibilityTablet } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import SchoolMemberMedia from "/imports/ui/components/schoolMembers/mediaDetails";
import { Loading } from '/imports/ui/loading';
import { ContainerLoader } from "/imports/ui/loading/container.js";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import { packageCoverProvider } from '/imports/util';

const SchoolMemberInfo = lazy(() => import("../schoolMemberInfo"));
const SchoolAdminsList = lazy(() => import('/imports/ui/components/schoolMembers/schoolMemberList/SchoolMemberCards.jsx'));
const SchoolMembersList = lazy(() => import('/imports/ui/components/schoolMembers/schoolMemberList/'));

const drawerWidth = 400;

const Drawers = styled.div`
  max-width: ${drawerWidth}px;
  height: ${props => props.height}px;
  width: 100%;
  overflow: auto;

  @media screen and (max-width: ${helpers.tablet}px) {
    height: auto;
    width: auto;
  }
`;

const FixedDrawer = styled.div`
  max-width: ${drawerWidth}px;
  height: ${props => props.height}px;
  width: 100%;
  display: 'block';
  background: ${helpers.panelColor};
  boxShadow: none;
  overflow: auto;
  padding: ${helpers.rhythmDiv}px;
  

  @media screen and (max-width: ${helpers.tablet}px) {
    width: auto;
  }
`;

const SchoolMemberWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 0%;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: ${helpers.panelColor};
`;

const SplitScreenWrapper = styled.div`
  display: flex;
  transition: all .5s linear;
`;

const MembersScreenWrapper = SplitScreenWrapper.extend`
  flex-direction: column;
`;

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
  // appBar: {
  //   position: "absolute",
  //   marginLeft: drawerWidth,
  //   [theme.breakpoints.up("md")]: {
  //     display: "none"
  //   }
  // },
  toolbar: theme.mixins.toolbar,
  drawerRoot: {
    position: 'absolute',
  },
  drawerPaper: {
    maxWidth: `${drawerWidth}px`,
    display: 'block',
    [`@media screen and ($max-width: ${helpers.tablet}px)`]: {
      position: "relative",
    },
    background: helpers.panelColor,
    boxShadow: "none !important",
    // height: "100vh",
    overflow: "auto",
    padding: helpers.rhythmDiv,
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
    membersViewHeight: null,
    classTypesData: [],
    error: "",
    birthYear: new Date().getFullYear() - 28,
    filters: {
      classTypeIds: [],
      memberName: ""
    },
    slidingDrawerState: false,
    studentWithoutEmail: false,
    mobileOpen: true,
    joinSkillShape: false,
    to: null,
    userName: null
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleSlidingDrawerState);
  }

  componentDidMount = (nextProps, nextState) => {
    this.handleSlidingDrawerState();
    window.addEventListener('resize', this.handleSlidingDrawerState);
  }

  // componentDidUpdate = () => {
  //   const elem = this.schoolMemberWrapper;
  //   debugger;
  //   if (elem && elem.getBoundingClientRect) {
  //     const height = this._getElementHeight(elem);
  //     // console.log(height, elem.getBoundingClientRect().height, elem.offsetHeight, ".............");
  //     this.setoffsetHeight
  //   }
  // }

  /*Just empty `memberInfo` from state when another `members` submenu is clicked from `School` menu.
    so that right panel gets removed from UI*/
  componentWillReceiveProps(nextProps) {
    let { userId: activeUserId, schoolData, purchaseByUserId, superAdminId, isLoading } = nextProps;
    let { memberInfo } = this.state;
    let schoolId = get(schoolData[0], '_id', null);
    let schoolName = get(schoolData[0], 'name', 'School Name')
    if (!isLoading && schoolId && activeUserId && isEmpty(memberInfo)) {
      let data = { schoolId, activeUserId }
      Meteor.call("schoolMemberDetails.getMemberData", data, (err, memberInfo) => {
        if (!isEmpty(memberInfo)) {
          let { studentWithoutEmail, classTypeIds, classmatesNotes, adminNotes, _id: memberId, profile: { profile: { name, pic, firstName, lastName, phone }, emails } } = memberInfo;
          let subscriptionList = packageCoverProvider(get(purchaseByUserId, activeUserId, []));
          let email = get(emails[0], 'address', null);
          let schoolImg = get(schoolData[0], 'mainImageMedium', get(schoolData[0], 'mainImage', config.defaultSchoolImage));
          let superAdmin = superAdminId == activeUserId ? true : false;
          this.setState({
            memberInfo: {
              _id: activeUserId,
              memberId: memberId,
              name: name,
              phone: phone,
              email: email,
              activeUserId: activeUserId,
              schoolId: schoolId,
              adminNotes: adminNotes,
              classmatesNotes: classmatesNotes,
              lastName: lastName,
              classTypeIds: classTypeIds,
              firstName: firstName,
              pic: pic,
              studentWithoutEmail: studentWithoutEmail,
              schoolName: schoolName,
              subscriptionList,
              superAdmin,
              schoolImg
            }
          });
        }
      })
    }
  }

  _getElementHeight = (elem) => {
    return elem && elem.getBoundingClientRect && elem.offsetHeight;
  }

  handleSlidingDrawerState = () => {
    if (window.innerWidth <= helpers.tablet) {
      if (!this.state.slidingDrawerState)
        this.setState(state => ({ ...state, slidingDrawerState: true }));
    } else {
      if (this.state.slidingDrawerState)
        this.setState(state => ({ ...state, slidingDrawerState: false }));
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  setMembersViewDimensions = (height) => {
    // debugger;
    if (height && this.state.membersViewHeight !== height) {
      this.setState(state => {
        return {
          ...state,
          membersViewHeight: height
        }
      });
    }

    return;
  }

  renderStudentAddModal = () => {
    const { isAdmin, view } = this.props;
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
        <Grid item xs={12} sm={6} style={{ marginTop: "24px" }}>
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
            label={`Add a New ${view == 'classmates' ? "Member" : 'Admin'}`} /> <PrimaryButton formId="cancelUser"
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
    const { isAdmin, schoolData, adminsIds } = this.props;
    let schoolId = schoolData[0]._id;
    let _id = this.state.message && this.state.message.userId || null;
    let schoolName = schoolData[0].name;
    let to = this.email.value;
    let userName = this.firstName.value;
    let payload = {};
    let adminName = get(Meteor.user(), "profile.firstName", get(Meteor.user(), "profile.name"), "Admin")
    payload.firstName = this.firstName.value;
    payload.lastName = this.lastName.value;
    payload.email = this.email.value;
    payload.phone = this.phone.value;
    payload.schoolId = schoolData[0]._id;
    payload.classTypeIds = this.state.selectedClassTypes;
    payload.birthYear = this.state.birthYear;
    payload.studentWithoutEmail = this.state.studentWithoutEmail;
    payload.signUpType = "member-signup"
    payload.sendMeSkillShapeNotification = true;
    payload.schoolName = schoolName;
    // console.log("​isAdmin", isAdmin)
    if (!isAdmin) {

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
    } else if (_id && schoolId) {
      this.setState({ isLoading: true })
      Meteor.call('school.manageAdmin', _id, schoolId, 'add', to, userName, schoolName, null, adminName, (err, res) => {
        if (res) {
          this.setState({ renderStudentModal: false, showConfirmationModal: false, isLoading: false, message: null });
        }
      })


    }
    else {
      payload.userType = 'School';
      payload.name = this.firstName.value;
      this.setState({ joinSkillShape: true, to: this.email.value, userName: this.firstName.value, payload: payload, message: null });
    }
  };

  addNewMember = event => {
    event.preventDefault();
    const { schoolData, isAdmin, adminsIds } = this.props;
    // Check for existing user only if users has entered their email.
    if (!isEmpty(schoolData) && !this.state.studentWithoutEmail) {
      // Show Loading
      this.setState({ isLoading: true });
      // Check if user with this email already exists If member exists, school admin sees a dialogue.
      Meteor.call(
        "user.checkForRegisteredUser",
        {
          email: this.email.value,
        },
        (err, res) => {

          let state = {};
          if (res) {
            // Open Modal
            let _id = res.userId;
            // state.showConfirmationModal = fals;
            state.message = res;
            state.isLoading = false;
            if (findIndex(adminsIds, (o) => { return o == _id }) != -1 && isAdmin) {
              this.setState({ error: 'This person is already an admin.', isLoading: false });
              return;
            }
            this.setState(state);
            this.allowAddNewMemberWithThisEmail();

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

  handleMemberDetailsToRightPanel = (memberId, superAdminId) => {
    const { isAdmin, schoolData, adminsData, purchaseByUserId, view } = this.props;
    let memberInfo, profile, pic, schoolId = get(schoolData[0], "_id", ''), email, _id, superAdmin;
    let schoolName = get(schoolData[0], "name", '');
    let emailAccess = "public";
    let phoneAccess = 'public';
    let schoolImg = get(schoolData[0], 'mainImageMedium', get(schoolData[0], 'mainImage', config.defaultSchoolImage));
    if (view == 'classmates') {
      memberInfo = SchoolMemberDetails.findOne(memberId);
      profile = memberInfo.profile.profile;
      email = memberInfo.profile.emails[0].address;
      _id = memberInfo.activeUserId;
      emailAccess = memberInfo.emailAccess;
      phoneAccess = memberInfo.phoneAccess;

    }
    else {
      memberInfo = adminsData.find(ele => ele._id == memberId);
      if (memberInfo) {
        profile = memberInfo.profile;
        email = memberInfo.emails[0].address;
        _id = memberInfo._id;

      }
    }
    superAdmin = superAdminId == _id ? true : false;
    pic = profile && profile.medium ? profile.medium : profile && profile.pic ? profile.pic : config.defaultProfilePicOptimized;
    // memberInfo = this.state.memberInfo
    let subscriptionList = packageCoverProvider(get(purchaseByUserId, _id, []));
    this.handleDrawerToggle();
    this.setState({
      memberInfo: {
        _id: _id,
        memberId: memberInfo._id,
        name: profile.name,
        phone: profile.phone,
        email: email,
        phoneAccess,
        emailAccess,
        activeUserId: get(memberInfo, 'activeUserId', _id),
        schoolId: schoolId,
        adminNotes: memberInfo.adminNotes,
        classmatesNotes: memberInfo.classmatesNotes,
        birthYear: profile.birthYear,
        lastName: profile.lastName,
        classTypeIds: memberInfo.classTypeIds,
        firstName: profile.firstName,
        pic: pic,
        studentWithoutEmail: memberInfo.studentWithoutEmail,
        packageDetails: memberInfo.packageDetails,
        schoolName: schoolName,
        subscriptionList,
        superAdmin,
        schoolImg
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

  handleDrawerToggle = (e) => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
    // if (window.innerWidth <= helpers.tablet) {
    // } else {
    //   e.preventDefault();
    //   return;
    // }
  };
  // Return Dash view from here
  joinSkillShape = () => {
    const { schoolData } = this.props;
    const { to, userName, payload } = this.state;
    let schoolName;
    let schoolId = schoolData[0]._id;
    schoolName = schoolData[0].name;
    this.setState({ isLoading: true })
    Meteor.call('school.manageAdmin', null, schoolId, "join", to, userName, schoolName, payload, (err, res) => {
      if (res) {
        this.setState({ renderStudentModal: false, joinSkillShape: false, isLoading: false });
      }
    })
  }

  handleElementResize = (width, height) => {
    // debugger;
    console.info(width, height, 'resize .......');
    this.setMembersViewDimensions(height);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.isLoading;
  }
  render() {
    const { classes, theme, schoolData, classTypeData, slug, schoolAdmin, isAdmin, adminsData, superAdminId, isLoading, view } = this.props;
    const { renderStudentModal, memberInfo, joinSkillShape, slidingDrawerState } = this.state;
    let schoolMemberListFilters = { ...this.state.filters };
    if (slug) {
      schoolMemberListFilters.schoolId =
        !isEmpty(schoolData) && schoolData[0]._id;
    }
    let { currentUser, isUserSubsReady } = this.props;
    let filters = { ...this.state.filters };
    if (this.props.isLoading) {
      return <ContainerLoader />;
    }
    else if (!slug) {
      filters.activeUserId = currentUser && currentUser._id;
    } else if (!schoolAdmin && slug) { // Not allow accessing this URL to non admin user.

      return (
        <Typography type="display2" gutterBottom align="center">
          To access this page you need to login as an admin.
        </Typography>
      );
    }
    const isMemberSelected = !isEmpty(this.state.memberInfo);

    const drawer = (
      <div>
        <SchoolMemberFilter
          stickyPosition={this.state.sticky}
          ref="SchoolMemberFilter"
          handleClassTypeDataChange={this.handleClassTypeDataChange}
          handleMemberNameChange={this.handleMemberNameChange}
          classTypeData={classTypeData}
          filters={filters}
          isAdmin={isAdmin}
          cardsView={isMemberSelected ? 'list' : 'grid'}
          view={view}
        />
        {slug && (
          <PrimaryButton
            className={classes.btnBackGround}
            onClick={() => this.setState({ renderStudentModal: true })}
            label={view == 'admin' ? "Add New Admin" : "Add New Student"}
          />
        )}
        <Suspense fallback={<Loading />}>
          {view == 'admin' && !_.isEmpty(adminsData) ?
            <SchoolAdminsList
              cardsView={isMemberSelected ? 'list' : 'grid'}
              listView
              collectionData={adminsData}
              handleMemberDetailsToRightPanel={
                this.handleMemberDetailsToRightPanel
              }
              isAdmin={isAdmin}
              superAdminId={superAdminId}
              view={view}
            /> :
            <SchoolMembersList
              cardsView={isMemberSelected ? 'list' : 'grid'}
              listView
              filters={schoolMemberListFilters}
              handleMemberDetailsToRightPanel={
                this.handleMemberDetailsToRightPanel
              }
              view={view}
              isAdmin={isAdmin}
            />}
        </Suspense>
      </div>
    );

    return (
      <Wrapper>
        {joinSkillShape && (
          <ConfirmationModal
            open={joinSkillShape}
            submitBtnLabel="Yes, Send Invitation"
            cancelBtnLabel="Cancel"
            message="No user exists with this email.Do you want to send SkillShape join invitation to this person."
            onSubmit={this.joinSkillShape}
            onClose={() => this.setState({ joinSkillShape: false, isLoading: false, renderStudentModal: false })}
          />
        )}
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
        {/*<AppBar className={classes.appBar}>
          <Toolbar>
            
            <Typography variant="title" color="inherit" noWrap>

            </Typography>
          </Toolbar>
        </AppBar>*/}
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
                  isAdmin={isAdmin}
                  view={view}
                />
              )}
            </form>
          </div>
        )}
        {/*<Grid
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
          style={{ overflow: "auto", overflowX: "hidden" }}
        >
          <Suspense fallback={<Loading/>}>
            {!isEmpty(memberInfo) && (
              <Fragment>
                <SchoolMemberInfo
                  selectedSchoolData={find(schoolData, { _id: memberInfo.schoolId })}
                  memberInfo={memberInfo}
                  handleInput={this.handleInput}
                  saveAdminNotesInMembers={this.saveAdminNotesInMembers}
                  disabled={slug ? false : true}
                  view={view}
                  classTypeData={get(this.props, "classTypeData", [])}
                  handleMemberDetailsToRightPanel={
                    this.handleMemberDetailsToRightPanel
                  }
                  isAdmin={isAdmin}
                  notClassmatePage={get(this.props.location, 'pathname', null) != "/classmates" ? true : false}
                />
                {this.renderSchoolMedia(schoolData, memberInfo, slug)}
              </Fragment>
            )}
          </Suspense>
        </Grid> */}

        <CSSTransition
          in={isMemberSelected}
          timeout={{
            enter: 600,
            exit: 400
          }}
          classNames="fade"
          unmountOnExit
        >
          <SplitScreenWrapper>
            <Drawers height={this.state.membersViewHeight}>
              <Fragment>
                <ToggleVisibilityTablet>
                  {slidingDrawerState && <Drawer
                    variant="temporary"
                    anchor={theme.direction === "rtl" ? "right" : "left"}
                    open={this.state.mobileOpen}

                    onClose={this.handleDrawerToggle}
                    className={classes.drawerRoot}
                    classes={{
                      paper: classes.drawerPaper
                    }}
                  >
                    {drawer}
                  </Drawer>}
                </ToggleVisibilityTablet>

                <ToggleVisibilityTablet show>
                  <FixedDrawer variant="permanent">
                    {drawer}
                  </FixedDrawer>
                </ToggleVisibilityTablet>
              </Fragment>
            </Drawers>


            <SchoolMemberWrapper
              id="school-member-wrapper"
            >
              <Suspense fallback={<Loading />}>
                <SchoolMemberInfo
                  selectedSchoolData={find(schoolData, { _id: memberInfo.schoolId })}
                  memberInfo={memberInfo}
                  handleInput={this.handleInput}
                  saveAdminNotesInMembers={this.saveAdminNotesInMembers}
                  disabled={slug ? false : true}
                  view={view}
                  cardsView={isMemberSelected ? 'list' : 'grid'}
                  classTypeData={get(this.props, "classTypeData", [])}
                  handleMemberDetailsToRightPanel={
                    this.handleMemberDetailsToRightPanel
                  }
                  handleDrawerToggle={this.handleDrawerToggle}
                  isAdmin={isAdmin}
                  notClassmatePage={get(this.props.location, 'pathname', null) != "/classmates" ? true : false}
                />
                {this.renderSchoolMedia(schoolData, memberInfo, slug)}
              </Suspense>

              <ReactResizeDetector
                handleWidth
                handleHeight
                querySelector={"#school-member-wrapper"}
                onResize={this.handleElementResize} />
            </SchoolMemberWrapper>

          </SplitScreenWrapper>
        </CSSTransition>


        <CSSTransition
          in={!isMemberSelected}
          timeout={{
            enter: 600,
            exit: 400
          }}
          classNames="fade"
          unmountOnExit
        >
          <Suspense fallback={<Loading />}>
            <MembersScreenWrapper>
              <SchoolMemberFilter
                stickyPosition={this.state.sticky}
                ref="SchoolMemberFilter"
                handleClassTypeDataChange={this.handleClassTypeDataChange}
                handleMemberNameChange={this.handleMemberNameChange}
                classTypeData={classTypeData}
                filters={filters}
                isAdmin={isAdmin}
                cardsView={isMemberSelected ? 'list' : 'grid'}
                view={view}
              />
              {view == 'admin' && !_.isEmpty(adminsData) ?
                <SchoolAdminsList
                  collectionData={adminsData}
                  handleMemberDetailsToRightPanel={
                    this.handleMemberDetailsToRightPanel
                  }
                  isAdmin={isAdmin}
                  superAdminId={superAdminId}
                  view={view}
                /> :
                <SchoolMembersList
                  filters={schoolMemberListFilters}
                  handleMemberDetailsToRightPanel={
                    this.handleMemberDetailsToRightPanel
                  }
                  view={view}
                  isAdmin={isAdmin}
                />}
            </MembersScreenWrapper>
          </Suspense>
        </CSSTransition>
      </Wrapper>
    );
  }
}

export default createContainer(props => {
  let slug = get(props.params, 'slug', props.slug);
  let schoolData = [];
  let isLoading = true;
  let classTypeData = [];
  let filters = { ...props.filters, slug };
  let schoolAdmin = false;
  let adminsIds;
  let schoolId;
  let classPricing, monthlyPricing, enrollmentFee, isAdmin = false, adminsData = [], classSubscription, classSubscriptionData
    , purchaseData = [], purchaseSubscription, filter, purchaseByUserId, superAdminId;
  ;
  let subscription = Meteor.subscribe(
    "schoolMemberDetails.getSchoolMemberWithSchool",
    filters
  );
  if (subscription && subscription.ready()) {
    classTypeData = ClassType.find().fetch();

    if (slug) {
      schoolData = School.find({ slug: slug }).fetch();

    } else {
      schoolData = School.find().fetch();
    }
    //find school id
    schoolId = !isEmpty(schoolData) && schoolData[0]._id;
    filter = { schoolId }
    purchaseSubscription = Meteor.subscribe("purchases.getPurchasesListByMemberId", filter);
    classSubscription = Meteor.subscribe('classSubscription.findDataById', filter);
    if (purchaseSubscription && purchaseSubscription.ready() && classSubscription && classSubscription.ready()) {
      purchaseData = Purchases.find().fetch();
      classSubscriptionData = ClassSubscription.find().fetch();
      purchaseData = concat(purchaseData, classSubscriptionData);
      purchaseByUserId = groupBy(purchaseData, 'userId')
    }
    //find all classpricing from subscription for displaying in add new member popup
    let classPricingSubscription = Meteor.subscribe("classPricing.getClassPricing", { schoolId })
    //find all enrollmentFee from subscription for displaying in add new member popup
    let enrollmentFeeSubscription = Meteor.subscribe("enrollmentFee.getEnrollmentFee", { schoolId })
    //find all monthlyPricing from subscription for displaying in add new member popup
    let monthlySubscription = Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId })
    if (classPricingSubscription.ready() && enrollmentFeeSubscription.ready() && monthlySubscription.ready()) {
      classPricing = ClassPricing.find().fetch();
      enrollmentFee = EnrollmentFees.find().fetch();
      monthlyPricing = MonthlyPricing.find().fetch();
      isLoading = false;
    }
    if (!isEmpty(schoolData) && schoolData[0].admins) {
      adminsIds = schoolData[0].admins;
      superAdminId = schoolData[0].superAdmin || null
      adminsIds.push(superAdminId)
      if (includes(adminsIds, Meteor.userId())) {
        schoolAdmin = true;
      }
      if (schoolAdmin) {
        Meteor.subscribe("user.findAdminsDetails", adminsIds)
        adminsData = Meteor.users.find().fetch();
        isAdmin = true;
        let x = findIndex(adminsIds, (o) => { return o == Meteor.userId() })
        if (x == -1) {
          adminData = remove(adminsData, (o) => { return o._id == Meteor.userId() });
        }
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
    enrollmentFee,
    monthlyPricing,
    adminsIds,
    isAdmin,
    adminsData,
    purchaseByUserId,
    superAdminId
  };
}, withStyles(styles, { withTheme: true })(DashBoardView));
