import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import School from "/imports/api/school/fields";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassTypeList from "/imports/ui/components/landing/components/classType/classTypeList.jsx";
import config from "/imports/config.js";

class SchoolClassTypeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seeMoreCount: 4
    };
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
      var ht = getDocHeight();

      parent.postMessage(
        JSON.stringify({
          docHeight: ht,
          iframeId: "ss-school-classtype-view"
        }),
        "*"
      );
    }
    // assign onload handler
    sendDocHeightMsg();
    // if (window.addEventListener) {
    //     window.addEventListener('load', sendDocHeightMsg, false);
    // } else if (window.attachEvent) { // ie8
    //     window.attachEvent('onload', sendDocHeightMsg);
    // }
  }

  handleSeeMore = () => {
    // Attach count with skill cateory name so that see more functionlity can work properly.
    // console.log("handleSeeMore");
    let currentCount = this.state.seeMoreCount;
    this.setState({ seeMoreCount: config.seeMoreCount + currentCount });
  };

  render() {
    const { schoolId } = this.props;
    return (
      <div className="wrapper">
        <ClassTypeList
          containerPaddingTop="0px"
          locationName={null}
          mapView={false}
          filters={{ schoolId: schoolId, limit: this.state.seeMoreCount }}
          splitByCategory={false}
          classTypeBySchool="classTypeBySchool"
          handleSeeMore={this.handleSeeMore}
          schoolView={true}
          hideClassTypeOptions={this.props.route.name == "EmbedClassTypeView"}
          classTimesData={this.props.classTimesData}
        />
      </div>
    );
  }
}

export default createContainer(props => {
  const { slug } = props.params;
  let classTimesData;
  Meteor.subscribe("UserSchoolbySlug", slug);
  const schoolData = School.findOne({ slug: slug });
  const schoolId = schoolData && schoolData._id;
  //   console.log("schoolId----------->",schoolId)
  Meteor.subscribe("classTypeBySchool", { schoolId });
  if (schoolId) {
    Meteor.subscribe("classTimes.getclassTimesByClassTypeIds", {
      schoolId: schoolId
    });
    let classType = ClassType.find({ schoolId: schoolId }).fetch();
    // Class times subscription.
    let classTypeIds = classType && classType.map(data => data._id);
    if (classTypeIds) {
      Meteor.subscribe("classTimes.getclassTimesByClassTypeIds", {
        schoolId,
        classTypeIds
      });
    }
  }
  //   console.log("classTimesData----------->",classTimesData)
  return {
    ...props,
    classTimesData: classTimesData,
    schoolId: schoolId
  };
}, SchoolClassTypeView);
