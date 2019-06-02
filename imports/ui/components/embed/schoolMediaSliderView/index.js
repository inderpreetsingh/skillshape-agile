import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import School from '/imports/api/school/fields';
import MediaList from '/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList/';

class SchoolMediaSliderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
    };
  }

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
        parent.postMessage(JSON.stringify({ docHeight: ht, iframeId: 'ss-school-mediaslider-view' }), '*');
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

  changeLimit = () => {
    const incerementFactor = 1;
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

export default createContainer((props) => {
  const { slug } = props.params;
  const subscription = Meteor.subscribe('UserSchoolbySlug', slug);
  const subsReady = subscription && subscription.ready();
  let schoolData; let
    schoolId;
  if (subsReady) {
    schoolData = School.findOne({ slug });
    schoolId = schoolData && schoolData._id;
  }
  return {
    ...props,
    subsReady,
    schoolId,
  };
}, SchoolMediaSliderView);
