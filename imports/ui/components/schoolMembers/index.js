import React from 'react';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import Multiselect from 'react-widgets/lib/Multiselect';
import { withStyles } from "material-ui/styles";

import ClassType from "/imports/api/classType/fields";
import DashViewRender from './dashViewRender';
import School from "/imports/api/school/fields";
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";

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
class DashView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        renderStudentModal: false,
        startDate: new Date(),
        selectedClassTypes: null,
        memberInfo:{}
    };

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
                  fullWidth
                  inputRef = {(ref) => {this.phone = ref}}
                  required={true}
                  type="number"
                />
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
                data={this.props.classType}
                placeholder="Available Classes"
                onChange={this.collectSelectedClassTypes}
              />
            </Grid>
            <Grid item sm={12} xs={12} md={12} style={{float:'right'}}>
                <PrimaryButton formId="addUser" type="submit" fullWidth label="Add a New Member"/>
          </Grid>
          </Grid>
      )
    }

    addNewMember = (event) => {
        console.log("Add addNewMember",this)
        event.preventDefault();
        this.setState({isLoading:true});
        let payload = {};
        payload.firstName = this.firstName.value;
        payload.lastName = this.lastName.value;
        payload.email = this.email.value;
        payload.phone = this.phone.value;
        payload.schoolId = this.props.schoolData._id;
        payload.classTypeIds = this.state.selectedClassTypes;
        // Add a new member in School.
        Meteor.call('school.addNewMember',payload , ()=> {
            this.setState({renderStudentModal:false});
            // Stop Loading
            this.setState({isLoading:false})
        });
    }
    handleMemberDialogBoxState = () => {
        this.setState({renderStudentModal:false})
    }

    handleChangeDate = (fieldName, date) => {
        console.log("handleChangeDate -->>",fieldName, date)
        this.setState({[fieldName]: new Date(date)})
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
            {   memberInfo:
                    {
                        memberId:memberInfo._id,
                        name:memberInfo.firstName,
                        phone:memberInfo.phone,
                        email:memberInfo.email,
                        adminNotes:memberInfo.adminNotes
                    }
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
    // Return Dash view from here
    render() {
        console.log("111111111111",this)
        const { classes, theme } = this.props;
        return DashViewRender.call(this);
    }
}

export default createContainer(props => {
    let { schoolId, slug } = props.params
    let schoolData;
    let classType;

    if (slug) {
        Meteor.subscribe("UserSchoolbySlug", slug);
        schoolData = School.findOne({ slug: slug })
        schoolId = schoolData && schoolData._id
    }

    if (schoolId) {
        Meteor.subscribe("classTypeBySchool", {schoolId});
        classType = ClassType.find({ schoolId: schoolId }).fetch();
    }
    return { ...props,
        schoolData,
        classType,
    };
},withStyles(styles)(DashView));

// export default withStyles(styles)(toastrModal(ContactUs))