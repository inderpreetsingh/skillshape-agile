import React from 'react';
import { Session } from 'meteor/session';
import ListView from '/imports/ui/components/listView';
import config from '/imports/config';

// import collection definition over here
import ClassType from '/imports/api/classType/fields';
import SLocation from '/imports/api/sLocation/fields';
import School from '/imports/api/school/fields';

export default class SkillClassListBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentWillUnmount() {
    Session.set('pagesToload', 1);
  }

  makeCategorization = ({ items = [] }) => {
    if (items.length > 0) {
      const grouped = _.groupBy(items, (item) => {
        if (item.selectedSkillCategory && item.selectedSkillCategory.name) { return item.selectedSkillCategory.name; }
      });
      return grouped;
    }
  }

  viewImage = ({ classType, schoolData }) => {
    let image = config.defaultSchoolImage;
    if (classType && (classType.hasOwnProperty('classTypeImg') || classType.hasOwnProperty('classImagePath'))) {
      image = classType.classTypeImg || classType.classImagePath;
    } else if (schoolData && schoolData.mainImage) {
      image = schoolData.mainImage;
    }
    return image;
  }

  addressView = (locationId) => {
    const class_location = SLocation.findOne({ _id: locationId });
    if (class_location) {
      return `${!class_location.city ? '' : `${class_location.city}, `}${class_location.state ? '' : class_location.state}`;
    }
  }

  isMyClass = (schoolId) => {
    if (Meteor.user() && Meteor.user().profile.schoolId) {
      return Meteor.user().profile.schoolId == schoolId;
    }
    return false;
  }

  checkJoin = (class_id) => {
    let default_value = false;
    if (Meteor.user()) {
      if (Meteor.user().profile && Meteor.user().profile.classIds) {
        default_value = Meteor.user().profile.classIds.includes(class_id);
      }
    }
    return default_value;
  }

  showClassTypes = ({ classType }) => {
    if (classType && _.size(classType) > 0) {
      return Object.keys(classType).map((key, index) => (
        <div className="product-sort">
          <h5>{key}</h5>
          {
                    classType[key].map((data, i) => {
                      const { schoolId, locationId } = data;
                      const schoolData = School.findOne({ _id: schoolId });
                      const backgroundUrl = this.viewImage({ classType: data, schoolData });
                      const locationData = locationId && this.addressView(locationId);
                      return (
                        <ListView
                          key={i}
                          className={this.props.listClass || 'col-lg-6 col-md-6'}
                          school={schoolData}
                          classTypeData={data}
                          backgroundUrl={backgroundUrl}
                          locationData={locationData}
                        />
                      );
                    })
                }
        </div>
      ));


      // const checkJoin = this.checkJoin(classType._id)
      // const isMyClass = this.isMyClass(classType.schoolId)

      // console.log("showSkillClass school -->>",schoolData)
      // console.log("showSkillClass classType -->>",classType)
      // console.log("showSkillClass skillClass -->>",skillClassData)
      // if(schoolData) {
      //   return skillClassData.map((data, index) => {
      //     return <ListView
      //         key={index}
      //         className={this.props.listClass || "col-lg-6 col-md-6"}
      //         school={schoolData}
      //         classTypeData={classType}
      //         backgroundUrl={backgroundUrl}
      //         locationData={locationData}
      //         checkJoin={checkJoin}
      //         isMyClass={isMyClass}
      //       />
      //   })
      // }
    }
    return 'No Result Found';
  }
}
