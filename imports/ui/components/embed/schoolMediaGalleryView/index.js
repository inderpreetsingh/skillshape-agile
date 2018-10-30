import { createContainer } from "meteor/react-meteor-data";
import React from "react";
import School from "/imports/api/school/fields";
import ImageGridGallery from "/imports/ui/components/schoolView/editSchool/mediaDetails/gridGallery/gridGalleryView.js";

class SchoolMediaGalleryView extends React.Component {
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
      var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      return doc.getElementById("UserMainPanel").offsetHeight;
    }
    // send docHeight onload
    function sendDocHeightMsg(e) {
      setTimeout(() => {
        var ht = getDocHeight();
        parent.postMessage(
          JSON.stringify({
            docHeight: ht,
            iframeId: "ss-school-mediagallery-view"
          }),
          "*"
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
            this.props.route &&
            this.props.route.name === "EmbedMediaGalleryView"
          }
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
}, SchoolMediaGalleryView);
