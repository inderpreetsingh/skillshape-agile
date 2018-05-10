import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import School from "/imports/api/school/fields";
import ClassType from "/imports/api/classType/fields";
import ClassTypeList from "/imports/ui/components/landing/components/classType/classTypeList.jsx";
import MediaList from "/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList/index.js";

class SchoolMediaSliderView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { schoolId } = this.props;
    // Get media gallery data of any School on the basis of filters.
    const filters = { schoolId: this.props.schoolId };
    console.log("this------------",this)
    return (
      <div className="wrapper" style={{ padding: 20 }}>
        <MediaList
          changeLimit = {this.changeLimit}
          limit= {10}
          schoolId={schoolId}
        />
      </div>
    );
  }
}

export default createContainer(props => {
  const { slug } = props.params;
  Meteor.subscribe("UserSchoolbySlug", slug);
  const schoolData = School.findOne({ slug: slug });
  const schoolId = schoolData && schoolData._id;
  console.log("schoolData=============>", schoolData);
  return {
    ...props,
    schoolId: schoolId
  };
}, SchoolMediaSliderView);
