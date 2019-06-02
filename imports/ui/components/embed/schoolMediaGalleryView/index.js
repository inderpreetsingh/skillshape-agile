import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import School from '/imports/api/school/fields';
import ImageGridGallery from '/imports/ui/components/schoolView/editSchool/mediaDetails/gridGallery/gridGalleryView';

class SchoolMediaGalleryView extends React.Component {
  componentDidUpdate() {
    // Get height of document
    function getDocHeight(doc) {
      doc = doc || document;

      html = doc.documentElement;

      return doc.getElementById('UserMainPanel').offsetHeight;
    }
    // send docHeight onload
    function sendDocHeightMsg(e) {
      setTimeout(() => {
        const ht = getDocHeight();
        parent.postMessage(
          JSON.stringify({
            docHeight: ht,
            iframeId: 'ss-school-mediagallery-view',
          }),
          '*',
        );
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
    const { schoolId } = this.props;
    // Get media gallery data of any School on the basis of filters.
    const filters = { schoolId: this.props.schoolId };
    return (
      <div className="wrapper">
        <ImageGridGallery
          filters={filters}
          hideCustomControls={
            this.props.route
            && this.props.route.name === 'EmbedMediaGalleryView'
          }
        />
      </div>
    );
  }
}

export default createContainer((props) => {
  const { slug } = props.params;
  Meteor.subscribe('UserSchoolbySlug', slug);
  const schoolData = School.findOne({ slug });
  const schoolId = schoolData && schoolData._id;
  return {
    ...props,
    schoolId,
  };
}, SchoolMediaGalleryView);
