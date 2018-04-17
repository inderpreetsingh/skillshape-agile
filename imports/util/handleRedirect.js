import School from "/imports/api/school/fields";
import { browserHistory } from 'react-router';

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