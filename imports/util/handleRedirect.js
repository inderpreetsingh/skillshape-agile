import School from "/imports/api/school/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import { browserHistory } from 'react-router';
import { isEmpty } from 'lodash';

export function goToSchoolPage(schoolId) {
  console.log("goToSchoolPage --->>",schoolId)
  if(schoolId) {
    const schoolData = School.findOne({_id: schoolId});
    if(schoolData && schoolData.slug) {
      browserHistory.push(`/schools/${schoolData.slug}`)
    }
  }
}

export function goToClassTypePage(className,classId) {
   browserHistory.push(`/classType/${className}/${classId}`)
}

// This is used so that we know which button needs to show. i.e `Add to my Calander` OR `Remove From Calander`.
export function checkForAddToCalender(data) {
    const userId = Meteor.userId();
    if(isEmpty(data) || isEmpty(userId)) {
        return true;
    } else {
        return isEmpty(ClassInterest.find({classTimeId: data._id, userId}).fetch());
    }
}