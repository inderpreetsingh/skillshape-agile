import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import MembersList from "./presentational/MembersList.jsx";
import AddInstructorDialogBox from "/imports/ui/components/landing/components/dialogs/AddInstructorDialogBox";
import { membersList } from "/imports/ui/components/landing/constants/classDetails";
import {isEmpty,get} from 'lodash';
import ClassTypePackages from '/imports/ui/components/landing/components/dialogs/classTypePackages.jsx';

class MembersListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachersFilterWith: "",
      studentsFilterWith: "",
      addInstructorDialogBoxState: false
    };
  }
  
  componentWillMount() {
    this.studentsData(this.props);
  }
  studentsData = (props)=>{
    let studentsIds = [];
    const {classData} = props;
    if(classData){
    get(classData[0],'students',[]).map((obj,index)=>{
      studentsIds.push(obj.userId);
       })
    if(!isEmpty(studentsIds)){
      Meteor.call('user.getUsersFromIds',studentsIds,(err,res)=>{
        if(res){
          this.setState({studentsData:res});
        }
      })
    }   
  }
  }
 componentWillReceiveProps(nextProps) {
  this.studentsData(nextProps);
 }
 
 
  handleAddInstructorDialogBoxState = (dialogBoxState,text) => () => {
    this.setState(state => {
      return {
        ...state,
        addInstructorDialogBoxState: dialogBoxState,
        text
      };
    });
  };

  handleSearchChange = type => e => {
    const value = e.target.value;
    this.setState(state => {
      return {
        ...state,
        [type]: value
      };
    });
  };

  getParticularEntityFromMembersList = entityType => {
    const { membersList } = this.props;
    const entities = membersList.filter(member => {
      if (typeof entityType == "string") return member.type == entityType;
      else return entityType.indexOf(member.type) !== -1;
    });
    // console.group("entities");
    // console.info(entities);
    // console.groupEnd();
    return entities;
  };
  studentsListMaker = (studentsData,classData) =>{
    let studentStatus = classData && classData[0] ? classData[0].students :[];
    studentsData && studentsData.map((obj,index)=>{
      studentStatus.map((obj1,index2)=>{
        if(obj1.userId == obj._id){
          obj.status = obj1.status;
        }
      })
    })
    return studentsData;
  }
  render() {
    const { studentsList, instructorsList, currentView,classData,instructorsData,popUp,instructorsIds,schoolId,params } = this.props;
    const { addInstructorDialogBoxState,studentsData ,text,classTypePackages,userId} = this.state;
    // console.log(currentView, "From inside membersList");
    // const currentView =
    //   location.pathname === "/classdetails-student"
    //     ? "studentsView"
    //     : "instructorsView";
    return (
      <Fragment>
        {addInstructorDialogBoxState && (
          <AddInstructorDialogBox
            open={addInstructorDialogBoxState}
            onModalClose={this.handleAddInstructorDialogBoxState(false)}
            classData={classData}
            popUp={popUp}
            schoolId={schoolId}
            instructorsIds={instructorsIds}
            text={text}
          />
        )}
        {classTypePackages && <ClassTypePackages 
                    schoolId = {schoolId}
                    open={classTypePackages}
                    onClose={()=>{this.setState({classTypePackages:false})}}
                    params= {params}
                    classTypeId = {get(classData[0],'classTypeId',null)}
                    userId={userId}
                    />}
        <MembersList
          viewType={currentView}
          onSearchChange={this.handleSearchChange("teachersFilterWith")}
          data={instructorsData}
          entityType={"teachers"}
          searchedValue={this.state.teachersFilterWith}
          onAddIconClick={this.handleAddInstructorDialogBoxState(true,"Instructor")}
          classData={classData}
          popUp={popUp}
          instructorsIds={instructorsIds}
          addInstructor

        />
        <MembersList
          viewType={currentView}
          searchedValue={this.state.studentsFilterWith}
          onSearchChange={this.handleSearchChange("studentsFilterWith")}
          data={ this.studentsListMaker(studentsData,classData) }
          entityType={"students"}
          searchedValue={this.state.studentsFilterWith}
          classData={classData}
          popUp={popUp}
          instructorsIds={instructorsIds}
          onAddIconClick={this.handleAddInstructorDialogBoxState(true,"Student")}
          addStudent
          onViewStudentClick={(userId)=>{this.setState({classTypePackages:true,userId})}}
        />
      </Fragment>
    );
  }
}

MembersListContainer.propTypes = {
  data: PropTypes.object,
  membersList: PropTypes.array
};

MembersListContainer.defaultProps = {
  membersList: membersList
};

export default MembersListContainer;
