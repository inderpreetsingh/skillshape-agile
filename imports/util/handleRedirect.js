import { isEmpty } from 'lodash';
import { browserHistory } from 'react-router';
import ClassInterest from "/imports/api/classInterest/fields";

export function goToSchoolPage(schoolId,slug) {
  if(slug){
    browserHistory.push(`/schools/${slug}`)
  }
  else if(schoolId) {
  Meteor.call("school.findSuperAdmin",null,schoolId,(err,res)=>{
      if(res){
        const schoolData = res;
        if(schoolData && schoolData.slug) {
          browserHistory.push(`/schools/${schoolData.slug}`)
        }
      }
    })
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