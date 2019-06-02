import { get, isEmpty } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import { browserHistory } from 'react-router';
import SchoolEditRender from './schoolEditRender';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassType from '/imports/api/classType/fields';
import School from '/imports/api/school/fields';
import SLocation from '/imports/api/sLocation/fields';
import config from '/imports/config';
import { handleOnBeforeUnload, unSavedChecker, withPopUp } from '/imports/util';

class SchoolEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: 'school_details',
      queryTabValue: null,
      isSaved: true,
    };
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
  }

  routerWillLeave = (nextLocation) => {
    // return false to prevent a transition w/o prompting the user,
    // or return a string to allow the user to decide:
    // return `null` or nothing to let other hooks to be executed
    //
    // NOTE: if you return true, other hooks will not be executed!
    if (!this.state.isSaved) {
      window.history.pushState(null, null, this.props.currentLocationPathName);
      return 'Your work is not saved! Are you sure you want to leave?';
    }
  };

  componentWillMount() {
    // unregister onbeforeunload event handler
    window.onbeforeunload = null;
    // Listen for `?classDetails=true` so that we can click on tab.
    // if (this.props.location.query.tabValue) {
    //   // We should set state for class details tab so that it opens automatically.
    //   this.setState({ queryTabValue: this.props.location.query.tabValue });
    // }
    //  if (get(this.props.route,'name',0) == "SchoolMemberView"){
    //   this.setState({ tabValue: 6 });
    // }
    //  if (get(this.props.route,'name',0) == "Financials" && !this.state.tabValue){
    //   this.setState({ tabValue: 8 });
    // }
    const {
      params: { tabValue },
    } = this.props;
    if (tabValue) {
      this.setState({ tabValue: Number(tabValue) });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.defaultTab(get(nextProps.route, 'name', 0));
  }

  componentDidUpdate() {
    window.onbeforeunload = null;
    if (!this.state.isSaved) {
      window.onbeforeunload = handleOnBeforeUnload;
    }
  }

  defaultTab = (routeName) => {
    if (!this.state.tabValue) {
      if (routeName == 'SchoolMemberView') {
        this.setState({ tabValue: 6 });
      } else if (routeName == 'Financials') {
        this.setState({ tabValue: 8 });
      }
    }
  };

  moveTab = (tabId) => {
    this.refs[tabId] && this.refs[tabId].click();
  };

  moveToNextTab = (value) => {
    this.setState({ tabValue: value });
  };

  showFormBuilderModal = ({
    type, tableData, formFieldsValues, parentData,
  }) => {
    this.setState(
      {
        formBuilderModal: {
          modalType: type,
          tableData,
          formFieldsValues,
          parentData,
        },
      },
      () => {
        this.formBuilderModal.show();
      },
    );
  };

  onTabChange = (tabValue) => {
    if (!this.state.isSaved) {
      unSavedChecker.call(this);
    } else {
      this.setState({ tabValue, isSaved: true });
    }
  };

  render() {
    const { schoolData, isLoading } = this.props;
    if (
      (!isLoading && !isEmpty(schoolData) && !Meteor.userId())
      || (!isLoading && !checkIsAdmin({ user: Meteor.user(), schoolData }))
      || (!isLoading && isEmpty(schoolData))
    ) {
      browserHistory.push('/');
      return false;
    }
    return SchoolEditRender.call(this, this.props, this.state);
  }
}

export default createContainer((props) => {
  let { schoolId, slug } = props.params;
  let schoolData = {};
  let locationData;
  let moduleData;
  let isLoading = true;
  let currency;
  const userId = get(props, 'location.query.userId', null);
  let userSchoolSub;
  let locationSub;
  let classTypeSub;
  let skillClassSchoolSub;
  let schoolMemberDetailsSub;
  let classTimesData = [];
  let classTypeData = [];
  if (slug && !schoolId) {
    schoolMemberDetailsSub = Meteor.subscribe('schoolMemberDetails.getSchoolMemberWithSchool', {
      slug,
    });
    if (schoolMemberDetailsSub && schoolMemberDetailsSub.ready()) {
      schoolId = School.find({ slug }).fetch()[0]._id;
    }
  }
  if (schoolId) {
    userSchoolSub = Meteor.subscribe('UserSchool', schoolId);
    locationSub = Meteor.subscribe('location.getSchoolLocation', { schoolId });
    skillClassSchoolSub = Meteor.subscribe('SkillClassbySchool', schoolId);
    classTypeSub = Meteor.subscribe('classType.getclassType', { schoolId });
    const isAllSubsReady = userSchoolSub
      && userSchoolSub.ready()
      && locationSub
      && locationSub.ready()
      && skillClassSchoolSub
      && skillClassSchoolSub.ready()
      && classTypeSub
      && classTypeSub.ready();
    if (props.isUserSubsReady && isAllSubsReady) {
      schoolData = School.findOne({ _id: schoolId });
      currency = schoolData && schoolData.currency ? schoolData.currency : config.defaultCurrency;
      locationData = SLocation.find().fetch();
      classTypeData = ClassType.find({ schoolId }).fetch();
      const classTypeIds = classTypeData.map(data => data._id);
      const classTimesDataSubscription = Meteor.subscribe(
        'classTimes.getclassTimesByClassTypeIds',
        {
          schoolId,
          classTypeIds,
        },
      );
      if (classTimesDataSubscription && classTimesDataSubscription.ready()) {
        classTimesData = ClassTimes.find({ schoolId }).fetch();
        isLoading = false;
      }
    }
  }
  return {
    ...props,
    schoolId,
    schoolData,
    locationData,
    moduleData,
    isLoading,
    classTypeData: classTypeData.reverse(),
    classTimesData,
    currency,
    userId,
  };
}, withPopUp(SchoolEditView));
