import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import School from "/imports/api/school/fields";
import ManageMyCalendar from "/imports/ui/components/users/manageMyCalendar/index.js";

class SchoolCalenderView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrapper" style={{ padding: 20 }}>
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
  const schoolId = schoolData && schoolData._id;
  const schoolData = School.findOne({ slug: slug });

  return {
    ...props,
    schoolId: schoolId,
    schoolData: schoolData,
    subsReady: subsReady
  };
}, SchoolCalenderView);
