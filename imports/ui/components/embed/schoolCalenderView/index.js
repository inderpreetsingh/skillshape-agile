import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import School from '/imports/api/school/fields';
import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar/index';
import ClassType from '/imports/api/classType/fields';
import ClassTimes from '/imports/api/classTimes/fields';

class SchoolCalenderView extends React.Component {
  componentDidUpdate() {
    // Get height of document
    function getDocHeight(doc) {
      doc = doc || document;
      return doc.getElementById('UserMainPanel').offsetHeight;
    }
    // send docHeight onload
    function sendDocHeightMsg(e) {
      setTimeout(() => {
        const ht = getDocHeight();
        parent.postMessage(JSON.stringify({ docHeight: ht, iframeId: 'ss-school-calender-view' }), '*');
      }, 3000);
    }
    // assign onload handler
    sendDocHeightMsg();
    // if (window.addEventListener) {
    //     window.addEventListener('load', sendDocHeightMsg, false);
    // } else if (window.attachEvent) { // ie8
    //     window.attachEvent('onload', sendDocHeightMsg);
    // }
  }

  render() {
    return (
      <div className="wrapper">
        {this.props.subsReady && (
          <ManageMyCalendar schoolCalendar {...this.props} />
        )}
      </div>
    );
  }
}

export default createContainer((props) => {
  const { slug } = props.params;
  Meteor.subscribe('UserSchoolbySlug', slug);
  const subscription = Meteor.subscribe('UserSchoolbySlug', slug);
  const subsReady = subscription && subscription.ready();
  let schoolData = School.findOne({ slug });
  const schoolId = schoolData && schoolData._id;
  let classTimesData;
  if (schoolId) {
    Meteor.subscribe('classTypeBySchool', { schoolId });
    schoolData = School.findOne({ _id: schoolId });
    const classType = ClassType.find({ schoolId }).fetch();
    const classTypeIds = classType && classType.map(data => data._id);
    Meteor.subscribe('classTimes.getclassTimesByClassTypeIds', { schoolId, classTypeIds });
    classTimesData = ClassTimes.find({ schoolId }, { sort: { _id: -1 } }).fetch();
  }
  return {
    ...props,
    schoolId,
    schoolData,
    subsReady,
    classTimesData,
    currentUser: Meteor.user(),
  };
}, SchoolCalenderView);
