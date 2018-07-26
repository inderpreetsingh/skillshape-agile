import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import SchoolEditRender from "./schoolEditRender";
import { browserHistory } from "react-router";
import config from "/imports/config";
// import collection definition over here
// import Modules from "/imports/api/modules/fields";
import Skills from "/imports/api/skill/fields";
import SLocation from "/imports/api/sLocation/fields";
import School from "/imports/api/school/fields";
import ClassType from "/imports/api/classType/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";

class SchoolEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "school_details",
      queryTabValue: null
    };
  }
  componentWillMount() {
    // Listen for `?classDetails=true` so that we can click on tab.
    
    if (this.props.location.query.tabValue) {
      // We should set state for class details tab so that it opens automatically.
      this.setState({ queryTabValue: this.props.location.query.tabValue });
    }
  }
  checkSchoolAccess = (currentUser, schoolId) => {
    if (!currentUser || !schoolId) {
      browserHistory.push("/");
      return false;
    } else if (checkMyAccess({ user: currentUser, schoolId })) {
      return true;
    } else if (
      (currentUser.profile &&
        currentUser.profile.schoolId &&
        currentUser.profile.schoolId != schoolId) ||
      !currentUser.profile ||
      !currentUser.profile.schoolId
    ) {
      browserHistory.push("/");
      return false;
    }
  };

  moveTab = tabId => {
    this.refs[tabId] && this.refs[tabId].click();
  };
  moveToNextTab = value => {
    this.setState({ tabValue: value });
  };

  showFormBuilderModal = ({
    type,
    tableData,
    formFieldsValues,
    parentData
  }) => {
    this.setState(
      {
        formBuilderModal: {
          modalType: type,
          tableData: tableData,
          formFieldsValues: formFieldsValues,
          parentData: parentData
        }
      },
      () => {
        this.formBuilderModal.show();
      }
    );
  };

  onTabChange = tabValue => {
    this.setState({ tabValue });
  };

  render() {
    return SchoolEditRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  const { schoolId } = props.params;
  let subscription;
  let schoolData;
  let locationData;
  let moduleData;
  let isLoading = true;
  let currency;

  if (props.isUserSubsReady) {
    subscription = Meteor.subscribe("UserSchool", schoolId);
    Meteor.subscribe("location.getSchoolLocation", { schoolId });
    Meteor.subscribe("classtype");
    Meteor.subscribe("SkillType");
    Meteor.subscribe("SkillClassbySchool", schoolId);
    // Meteor.subscribe("modules.getModules", {schoolId});
    // Meteor.subscribe("classType.getclassType", {schoolId});
  }
  let classTypeData;
  Meteor.subscribe("classType.getclassType", {
    schoolId
  });
  if (subscription && subscription.ready()) {
    isLoading = false;
    schoolData = School.findOne({ _id: schoolId });
    currency = schoolData && schoolData.currency ? schoolData.currency : config.defaultCurrency;
    locationData = SLocation.find().fetch();
    classTypeData = ClassType.find({ schoolId: schoolId }).fetch();
  }

  return {
    ...props,
    schoolId,
    schoolData,
    locationData,
    moduleData,
    isLoading,
    classTypeData,
    currency
  };
}, SchoolEditView);
