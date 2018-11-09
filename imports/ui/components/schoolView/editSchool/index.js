import { createContainer } from "meteor/react-meteor-data";
import React from "react";
import { browserHistory } from "react-router";
import SchoolEditRender from "./schoolEditRender";
import ClassType from "/imports/api/classType/fields";
import School from "/imports/api/school/fields";
import SLocation from "/imports/api/sLocation/fields";
import config from "/imports/config";
import get from 'lodash/get';
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
    console.log('cwm run')
    if (this.props.location.query.tabValue) {
      // We should set state for class details tab so that it opens automatically.
      this.setState({ queryTabValue: this.props.location.query.tabValue });
    }
     if (get(this.props.route,'name',0) == "SchoolMemberView"){
      this.setState({ tabValue: 6 });
    }
     if (get(this.props.route,'name',0) == "Financials"){
      this.setState({ tabValue: 8 });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.defaultTab(get(nextProps.route,'name',0));
  }
  defaultTab = (routeName) => {
      if(routeName == "SchoolMemberView"){
        this.setState({ tabValue: 6 });
      }
      else if(routeName == "Financials") {
        this.setState({ tabValue: 8 });
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
  let { schoolId,slug } = props.params;
  let subscription;
  let schoolData;
  let locationData;
  let moduleData;
  let isLoading = true;
  let currency;
if(slug && !schoolId){
 subscription = Meteor.subscribe("schoolMemberDetails.getSchoolMemberWithSchool", {slug});
 if(subscription && subscription.ready()){
   schoolId = School.find({ slug: slug }).fetch()[0]._id;
 }
}
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
