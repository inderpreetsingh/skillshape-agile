import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import School from "/imports/api/school/fields";
import MediaList from "/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList/index.js";

class SchoolMediaSliderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4
    };
  }

  changeLimit = () => {
    let incerementFactor = 1;
    this.setState({ limit: this.state.limit + incerementFactor });
  };

  render() {
    const { schoolId } = this.props;
    // Get media gallery data of any School on the basis of filters.
    const filters = { schoolId: this.props.schoolId };
    return (
      <div className="wrapper">
        {this.props.subsReady && (
          <MediaList
            changeLimit={this.changeLimit}
            limit={this.state.limit}
            schoolId={this.props.schoolId}
          />
        )}
      </div>
    );
  }
}

export default createContainer(props => {
  const { slug } = props.params;
  let subscription = Meteor.subscribe("UserSchoolbySlug", slug);
  const subsReady = subscription && subscription.ready();
  let schoolData, schoolId;
  if (subsReady) {
    schoolData = School.findOne({ slug: slug });
    schoolId = schoolData && schoolData._id;
  }
  return {
    ...props,
    subsReady: subsReady,
    schoolId: schoolId
  };
}, SchoolMediaSliderView);
