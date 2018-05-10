import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import School from "/imports/api/school/fields";
import ClassType from "/imports/api/classType/fields";
import ClassTypeList from "/imports/ui/components/landing/components/classType/classTypeList.jsx";
import ImageGridGallery from "/imports/ui/components/schoolView/editSchool/mediaDetails/gridGallery/gridGalleryView.js";

class SchoolMediaGalleryView extends React.Component {
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
        <ImageGridGallery filters={filters} hideCustomControls={this.props.route && this.props.route.name === "EmbedMediaGalleryView"}/>
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
}, SchoolMediaGalleryView);
