import React, { Fragment } from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import Multiselect from 'react-widgets/lib/Multiselect';
import { withStyles } from "material-ui/styles";
import Typography from 'material-ui/Typography';

import ClassType from "/imports/api/classType/fields";
import School from "/imports/api/school/fields";
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";

import List from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Input from 'material-ui/Input';
import isEmpty from "lodash/isEmpty";


import SchoolMemberListItems from '/imports/ui/components/schoolMembers/schoolMemberList/index.js';
import SchoolMemberFilter from "../filter";
import SchoolMemberInfo from "../schoolMemberInfo";
import MemberDialogBox from "/imports/ui/components/landing/components/dialogs/MemberDetails.jsx";
import { ContainerLoader } from '/imports/ui/loading/container.js';
import SchoolMemberMedia from "/imports/ui/components/schoolMembers/mediaDetails";
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';

const styles = theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        padding: theme.spacing.unit * 2
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
        memberInfo:{},
        classTypesData: [],
        error: ""
    };

    /*Just empty `memberInfo` from state when another `members` submenu is clicked from `School` menu.
    so that right panel gets removed from UI*/
    componentWillReceiveProps(nextProps) {
        if(nextProps.schoolData !== this.props.schoolData) {
            this.setState({ memberInfo:{} })
        }
        if(!isEmpty(nextProps.classTypeData)) {
            this.props.setClassTypeData(nextProps.classTypeData)
        }
    }

    renderStudentAddModal = () => {
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
                  required={true}
                  onBlur={this.handlePhoneChange}
                />
                {
                    this.state.showErrorMessage && <Typography color="error" type="caption">
                        Not a valid Phone number
                    </Typography>
                }
            </Grid>

            <Grid item sm={6} xs={12}>
                <MaterialDatePicker
                    required={true}
                    floatingLabelText={"DOB *"}
                    hintText={"Date Of Birth"}
                    value={this.state.startDate}
                    onChange={this.handleChangeDate.bind(this, "startDate")}
                    fullWidth={true}
                />
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
        let phoneRegex = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/g;
        const inputPhoneNumber = this.phone.value;
        if(!inputPhoneNumber.match(phoneRegex)) {
            alert('invalid phone');
            return;
        }
        let payload = {};
        payload.firstName = this.firstName.value;
        payload.lastName = this.lastName.value;
        payload.email = this.email.value;
        payload.phone = this.phone.value;
        payload.schoolId = this.props.schoolData._id;
        payload.classTypeIds = this.state.selectedClassTypes;
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
        if(inputPhoneNumber.match(phoneRegex)) {
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
                    adminNotes:memberInfo.adminNotes
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
    // Return Dash view from here
    render() {
        console.log("DashBoardView props -->>",this.props);
        const { classes, theme, schoolData, classTypeData} = this.props;
        const { renderStudentModal,memberInfo } = this.state;
        const drawer = (
            <div>
                <List>
                    <SchoolMemberListItems
                        filters={{
                           ...this.props.filters,
                           schoolId:schoolData && schoolData._id
                        }}
                        handleMemberDetailsToRightPanel={this.handleMemberDetailsToRightPanel}
                    />
                </List>
            </div>
        );

        if(this.props.isLoading) {
            return <Preloader/>
        }

        return (
            <Fragment>
                <Grid item sm={4} xs={12} md={4} className="leftSideMenu" style={{position: 'absolute',width: '100%',top: '160px',height: '100%'}}>
                { this.state.isLoading && <ContainerLoader /> }
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
                <Grid item sm={12} xs={12} md={12} style={{display:'flex',flexDirection: 'row-reverse'}}>
                    <Button raised color="primary" onClick={()=>this.setState({renderStudentModal:true})}>
                      Add New Student
                    </Button>
                </Grid>
                <div>
                    <Hidden mdUp>
                      {drawer}
                    </Hidden>
                    <Hidden smDown>
                        {drawer}
                    </Hidden>
                </div>
                </Grid>
                <Grid item sm={8} xs={12} md={8} className="rightPanel" style={{ height: '100vh'}}>
                  { !isEmpty(memberInfo) &&
                    <Fragment>
                        <SchoolMemberInfo
                            memberInfo={memberInfo}
                            handleInput={this.handleInput}
                            saveAdminNotesInMembers={this.saveAdminNotesInMembers}
                        />
                        <SchoolMemberMedia
                            schoolData={schoolData}
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
                    </Fragment>
                  }
                  </Grid>
            </Fragment>
        )
    }
}

export default createContainer(props => {
    let { slug  } = props.params
    let schoolData;
    let isLoading = true;
    let classTypeData = [];
    let filters = {...props.filters, slug};

    let subscription = Meteor.subscribe("schoolMemberDetails.getSchoolMemberWithSchool", filters);

    if(subscription && subscription.ready()) {
        isLoading = false;
        schoolData = School.findOne({ slug: slug })
        classTypeData = ClassType.find().fetch();
    }

    return { ...props,
        schoolData,
        classTypeData,
        isLoading
    };

},withStyles(styles)(DashBoardView));
