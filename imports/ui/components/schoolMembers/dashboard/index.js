import React, { Fragment } from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import Multiselect from 'react-widgets/lib/Multiselect';
import { withStyles } from "material-ui/styles";
import Typography from 'material-ui/Typography';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';

import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';

import List from 'material-ui/List';
import Hidden from 'material-ui/Hidden';
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import MenuIcon from 'material-ui-icons/Menu';
import ClassType from "/imports/api/classType/fields";
import School from "/imports/api/school/fields";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';



import { phoneRegex } from '/imports/util';
import SchoolMemberListItems from '/imports/ui/components/schoolMembers/schoolMemberList/index.js';
import SchoolMemberFilter from "../filter";
import SchoolMemberInfo from "../schoolMemberInfo";
import MemberDialogBox from "/imports/ui/components/landing/components/dialogs/MemberDetails.jsx";
import { ContainerLoader } from '/imports/ui/loading/container.js';
import SchoolMemberMedia from "/imports/ui/components/schoolMembers/mediaDetails";
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';


const drawerWidth = 400;

const styles = theme => ({
      root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    [theme.breakpoints.down('sm')]: {
        width: `${drawerWidth}px !important`
    },
    boxShadow:'none !important',
    height: '100vh',
    overflow: 'auto',
    padding:'0px !important',
    paddingLeft:'16px !important',
    overflowX: 'hidden !important'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  drawerIcon: {
    top: '10px',
    left: '388px',
    width: '100px',
    height: '30px',
    position: 'absolute',
    float: 'right'
  },
  rightPanel: {
    flexGrow: 1,
    backgroundColor: '#fafafa',
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing.unit,
    },
    [theme.breakpoints.down('sm')]: {
        paddingTop: '90px !important'
    },
    background: '#ffff'
  },
  sideMenu: {
    paddingRight: '0px',
    background: 'white',
    border: 'solid 3px #dddd',
    paddingTop: '0px !important',
  },
  btnBackGround:{
    background:`${helpers.action}`
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
        memberInfo:{},
        classTypesData: [],
        error: "",
        birthYear: (new Date()).getFullYear() - 28,
        filters: {
            classTypeIds: [],
            memberName: "",
        },
    };

    /*Just empty `memberInfo` from state when another `members` submenu is clicked from `School` menu.
    so that right panel gets removed from UI*/
    componentWillReceiveProps(nextProps) {
        if(nextProps.schoolData !== this.props.schoolData) {
            this.setState({ memberInfo:{} })
        }
    }

    renderStudentAddModal = () => {
        var currentYear = (new Date()).getFullYear();
        let birthYears = []
        for(let i=0; i<60; i++) {
            birthYears[i] = currentYear-i;
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
                      inputRef = {(ref) => {this.firstName = ref}}
                      required={true}
                    />
                </Grid>
                {
                    this.state.isLoading && <ContainerLoader />
                }
                <Grid item xs={12} sm={6}>
                    <TextField
                      id="lastName"
                      label="Last Name"
                      margin="normal"
                      fullWidth
                      inputRef = {(ref) => {this.lastName = ref}}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                      id="email"
                      type="email"
                      label="Email"
                      margin="normal"
                      fullWidth
                      inputRef = {(ref) => {this.email = ref}}
                      required={true}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                      id="phone"
                      label="Phone"
                      margin="normal"
                      inputRef = {(ref) => {this.phone = ref}}
                      fullWidth
                      onBlur={this.handlePhoneChange}
                    />
                    {
                        this.state.showErrorMessage && <Typography color="error" type="caption">
                            Not a valid Phone number
                        </Typography>
                    }
                </Grid>

                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth margin='dense'>
                        <InputLabel htmlFor="birthYear">Birth Year</InputLabel>
                        <Select
                            required={true}
                            input={<Input id="birthYear"/>}
                            value={this.state.birthYear}
                            onChange={(event) => this.setState({ birthYear: event.target.value })}
                            fullWidth
                        >
                            {
                                birthYears.map((index, year) => {
                                    return <MenuItem key={birthYears[year]} value={birthYears[year]}>{birthYears[year]}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} style={{marginTop: '26px'}}>
                  <Multiselect
                    textField={"name"}
                    valueField={"_id"}
                    data={this.props.classTypeData}
                    placeholder="Available Classes"
                    onChange={this.collectSelectedClassTypes}
                  />
                </Grid>
                <Grid item sm={12} xs={12} md={12} style={{display:'flex',justifyContent: 'flex-end'}}>
                    {this.state.error && <ErrorWrapper>{this.state.error}</ErrorWrapper>}
                    <PrimaryButton formId="addUser" type="submit" label="Add a New Member"/>
                    <PrimaryButton formId="cancelUser" label="Cancel" onClick={() => this.setState({renderStudentModal:false})}/>
                </Grid>
            </Grid>
        )
    }

    addNewMember = (event) => {
        console.log("Add addNewMember",this)
        event.preventDefault();
        const { schoolData } = this.props;

        if(!isEmpty(schoolData)) {

            let payload = {};
            payload.firstName = this.firstName.value;
            payload.lastName = this.lastName.value;
            payload.email = this.email.value;
            payload.phone = this.phone.value;
            payload.schoolId = schoolData[0]._id;
            payload.classTypeIds = this.state.selectedClassTypes;
            payload.birthYear = this.state.birthYear;
            // Show Loading
            this.setState({isLoading:true});
            // Add a new member in School.
            Meteor.call('school.addNewMember',payload , (err,res)=> {

                let state = {
                    isLoading:false,
                }

                if(err) {
                    state.error = err.reason || err.message;
                }
                if(res) {
                    state.renderStudentModal = false;
                }

                this.setState(state);
            });
        }
    }

    handleMemberDialogBoxState = () => {
        this.setState({renderStudentModal:false})
    }

    handleChangeDate = (fieldName, date) => {
        console.log("handleChangeDate -->>",fieldName, date)
        this.setState({[fieldName]: new Date(date)})
    }

    handlePhoneChange = (event) => {
        const inputPhoneNumber = event.target.value;
        let phoneRegex = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/g;
        console.log("inputPhoneNumber.match(phoneRegex)",inputPhoneNumber.match(phoneRegex))
        let showErrorMessage;
        if(inputPhoneNumber.match(phoneRegex) || inputPhoneNumber == "") {
            showErrorMessage = false;
        } else {
            showErrorMessage = true;
        }
        this.setState(
            {
              showErrorMessage:showErrorMessage
            }
        );

    }

    collectSelectedClassTypes = (data) => {
        console.log("collectSelectedClassTypes",data);
        let classTypeIds = data.map((item) => {return item._id})
        this.setState({selectedClassTypes:classTypeIds})
    }

    handleMemberDetailsToRightPanel = (memberId) => {
        console.log("handleMemberDetailsToRightPanel===>",memberId);
        let memberInfo = SchoolMemberDetails.findOne(memberId);
        // memberInfo = this.state.memberInfo
        console.log("memberInfo before===>",memberInfo)
        this.setState(
            {
                memberInfo: {
                    _id: memberInfo._id,
                    memberId: memberInfo._id,
                    name:memberInfo.firstName,
                    phone:memberInfo.phone,
                    email:memberInfo.email,
                    schoolId: memberInfo.schoolId,
                    adminNotes:memberInfo.adminNotes,
                    classmatesNotes: memberInfo.classmatesNotes,
                },
                schoolMemberDetailsFilters: { _id: memberId }
            }
        )
        console.log("memberInfo after===>",this);
    }
    // This is used to save admin notes in `Members` information.
    saveAdminNotesInMembers = (event) => {
        console.log("saveAdminNotesInMembers",event.target.value);
        let memberInfo = this.state.memberInfo;
        memberInfo.adminNotes = event.target.value;
        memberInfo.schoolId = this.props.schoolData && this.props.schoolData._id;
        Meteor.call('school.saveAdminNotesToMember', memberInfo, (err,res) => {
            if(res) {
                console.log("Upadted School Notes",res);
            }
        });
    }

    handleInput = (event) => {
        console.log("oldMemberInfo",event.target.value)
        // this.setState({adminNotes:event.target.value});
        let oldMemberInfo = {...this.state.memberInfo};
        oldMemberInfo.adminNotes = event.target.value;
        this.setState({memberInfo:oldMemberInfo});
    }

    handleTaggingMembers = () => {
        console.log("handleTaggingMembers")
    }

    renderSchoolMedia = (schoolData, memberInfo, slug) => {
        console.log("renderSchoolMedia -->>",schoolData, memberInfo)
        const school = find(schoolData, {_id: memberInfo.schoolId});
        console.log("renderSchoolMedia school-->>",school)
        if(isEmpty(school)) {
            return
        } else {
            return <SchoolMemberMedia
                showUploadImageBtn={slug ? true : false}
                schoolData={school}
                memberInfo={memberInfo}
                schoolMemberDetailsFilters={this.state.schoolMemberDetailsFilters}
                handleTaggingMembers={this.handleTaggingMembers}
                mediaListfilters={
                  {
                    '$or': [
                        { taggedMemberIds: { '$in': [memberInfo.memberId]} },
                    ]
                  }
                }
            />
        }
    }

    handleMemberNameChange = (event) => {
        console.log("handleMemberNameChange -->",event.target.value)
        this.setState({
            filters: {
                ...this.state.filters,
                memberName: event.target.value,
            }
        });
    }

    handleClassTypeDataChange = (data) => {
        let classTypeIds = data.map((item) => {
            return item._id;
        })
        this.setState({
            filters: {
                ...this.state.filters,
                classTypeIds: classTypeIds,
            }
        });
    }

    // setInitialClassTypeData = (data) => {
    //     this.refs.SchoolMemberFilter.setClassTypeData(data);
    // }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };
    // Return Dash view from here
    render() {
        console.log("DashBoardView props -->>",this.props);
        console.log("DashBoardView state -->>",this.state);
        const { classes, theme, schoolData, classTypeData, slug, schoolAdmin} = this.props;
        const { renderStudentModal,memberInfo } = this.state;

        let schoolMemberListFilters = {...this.state.filters};
        if(slug) {
            schoolMemberListFilters.schoolId = !isEmpty(schoolData) && schoolData[0]._id;
        }

        let { currentUser, isUserSubsReady } = this.props;
        let filters = {...this.state.filters};

        if(!slug)  {
            filters.activeUserId = currentUser && currentUser._id;
        }

        // Not allow accessing this URL to non admin user.
        if(!schoolAdmin && slug) {
            return  <Typography type="display2" gutterBottom align="center">
                To access this page you need to login as an admin.
            </Typography>
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
                    {
                        slug && (
                            <Grid item sm={12} xs={12} md={12} style={{display:'flex',flexDirection: 'row-reverse', padding: '16px'}}>
                                <Button raised className={classes.btnBackGround} color="primary" onClick={()=>this.setState({renderStudentModal:true})}>
                                  Add New Student
                                </Button>
                            </Grid>
                        )
                    }
                    <SchoolMemberListItems
                        filters={schoolMemberListFilters}
                        handleMemberDetailsToRightPanel={this.handleMemberDetailsToRightPanel}
                    />
                </List>
            </div>
        );

        if(this.props.isLoading) {
            return <Preloader/>
        }

        return (
            <Grid container className={classes.root}>
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
                      Foldeable search popover
                    </Typography>
                  </Toolbar>
                </AppBar>
                { !isEmpty(schoolData) &&
                    <div>
                        <form noValidate autoComplete="off">
                            {
                              renderStudentModal &&
                                <MemberDialogBox
                                    open={renderStudentModal}
                                    renderStudentAddModal = {this.renderStudentAddModal}
                                    addNewMember={this.addNewMember}
                                    onModalClose={() => this.setState({renderStudentModal:false})}
                               />
                            }
                        </form>
                    </div>
                }
                <Grid item md={4} style={{paddingRight:'0px'}} className={classes.sideMenu}>
                    <Hidden mdUp>
                      <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        style={{position:'absolute'}}
                        classes={{
                          paper: classes.drawerPaper,
                        }}
                      >
                        {drawer}
                      </Drawer>
                    </Hidden>
                    <Hidden  smDown>
                      <div
                        variant="permanent"
                        open
                        className={classes.drawerPaper}
                      >
                        {drawer}
                      </div>
                    </Hidden>
                </Grid>
                <Grid item sm={12} xs={12} md={8} className={classes.rightPanel} style={{ height: '100vh',overflow:'auto',overflowX:'hidden'}}>
                  { !isEmpty(memberInfo) &&
                    <Fragment>
                        <SchoolMemberInfo
                            memberInfo={memberInfo}
                            handleInput={this.handleInput}
                            saveAdminNotesInMembers={this.saveAdminNotesInMembers}
                            disabled={slug ? false : true}
                            view={slug ? "admin" : "classmates"}
                        />
                        { this.renderSchoolMedia(schoolData, memberInfo, slug) }
                    </Fragment>
                  }
                  </Grid>
            </Grid>
        )
    }
}

export default createContainer(props => {
    let { slug  } = props.params
    let schoolData = [];
    let isLoading = true;
    let classTypeData = [];
    let filters = {...props.filters, slug};
    let schoolAdmin;

    let subscription = Meteor.subscribe("schoolMemberDetails.getSchoolMemberWithSchool", filters);
    if(subscription && subscription.ready()) {
        isLoading = false;
        classTypeData = ClassType.find().fetch();

        if(slug) {
            schoolData = School.find({ slug: slug }).fetch()
        } else {
            schoolData = School.find().fetch()
        }
        if(!isEmpty(schoolData) && schoolData[0].admins) {
            let currentUser = Meteor.user();
            if(_.contains(schoolData[0].admins, currentUser._id) || schoolData[0].superAdmin == currentUser._id) {
                schoolAdmin = true;
            }
        }
    }

    return { ...props,
        schoolData,
        classTypeData,
        isLoading,
        slug,
        schoolAdmin
    };

}, withStyles(styles, { withTheme: true })(DashBoardView));
