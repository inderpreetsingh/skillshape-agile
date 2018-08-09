import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import School from "/imports/api/school/fields";
import ManageMyCalendar from "/imports/ui/components/users/manageMyCalendar/index.js";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";

class SchoolCalenderView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
      // Get height of document
      function getDocHeight(doc) {
          doc = doc || document;
          // from http://stackoverflow.com/questions/1145850/get-height-of-entire-document-with-javascript
          var body = doc.body,
              html = doc.documentElement;
          var height = Math.max(body.scrollHeight, body.offsetHeight,
              html.clientHeight, html.scrollHeight, html.offsetHeight);
          return doc.getElementById('UserMainPanel').offsetHeight;
      }
      // send docHeight onload
      function sendDocHeightMsg(e) {
        setTimeout(()=> {
          var ht = getDocHeight();
          parent.postMessage(JSON.stringify({ 'docHeight': ht, 'iframeId' : 'ss-school-calender-view'}), '*');
        }, 3000)
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
          <ManageMyCalendar schoolCalendar={true} {...this.props} />
        )}
      </div>
    );
  }
}

export default createContainer(props => {
  const { slug } = props.params;
  Meteor.subscribe("UserSchoolbySlug", slug);
  let subscription = Meteor.subscribe("UserSchoolbySlug", slug);
  const subsReady = subscription && subscription.ready();
  const schoolData = School.findOne({ slug: slug });
  const schoolId = schoolData && schoolData._id;
  let classTimesData;
  if (schoolId) {
    Meteor.subscribe("classTypeBySchool", { schoolId });
    let schoolData = School.findOne({ _id: schoolId })
    let classType = ClassType.find({ schoolId: schoolId }).fetch();
    let classTypeIds = classType && classType.map((data) => data._id);
    Meteor.subscribe("classTimes.getclassTimesByClassTypeIds", { schoolId, classTypeIds });
    classTimesData = ClassTimes.find({ schoolId }, { sort: { _id: -1 } }).fetch();
  }
  return {
    ...props,
    schoolId: schoolId,
    schoolData: schoolData,
    subsReady: subsReady,
    classTimesData,
    currentUser: Meteor.user()
  };
}, SchoolCalenderView);
