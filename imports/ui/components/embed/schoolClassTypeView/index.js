import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import School from "/imports/api/school/fields";
import ClassType from "/imports/api/classType/fields";
import ClassTypeList from "/imports/ui/components/landing/components/classType/classTypeList.jsx";

class SchoolClassTypeView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("SchoolClassTypeView props-->>", this.props);
    const { schoolId } = this.props;
    return (
      <div className="wrapper" style={{ padding: 20 }}>
        <ClassTypeList
          containerPaddingTop="0px"
          locationName={null}
          mapView={false}
          filters={{ schoolId: schoolId, limit: 4 }}
          splitByCategory={false}
          classTypeBySchool="classTypeBySchool"
          handleSeeMore={this.handleSeeMore}
          schoolView={true}
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
  return {
    ...props,
    schoolId: schoolId
  };
}, SchoolClassTypeView);
