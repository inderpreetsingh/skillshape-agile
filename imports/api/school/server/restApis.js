import bodyParser from 'body-parser';
import { isArray, isEmpty, uniq } from 'lodash';
import School from '../fields';
import ClassType from '/imports/api/classType/fields';

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route('/api/v1/schools', (params, req, res, next) => {
  try {
    let payload = {};
    let {
      schoolName,
      coords,
      skillCategoryIds,
      skillSubjectIds,
      experienceLevel,
      gender,
      age,
      locationName,
    } = req.body;
    const filter = {};
    const classTypeFilter = { isPublish: true };

    // Add schoolName Filter if schoolName Available
    if (schoolName) {
      schoolName = schoolName.split(' ');
      const schoolNameRegEx = [];
      schoolName.map((str) => {
        schoolNameRegEx.push(new RegExp(`.*${str}.*`, 'i'));
      });
      filter.name = { $in: schoolNameRegEx };
    }

    // Add Gender Filter for class type
    if (gender) {
      classTypeFilter.gender = gender;
    }

    // Add Age Filter for class type
    if (age) {
      age = Number(age);
      classTypeFilter.ageMin = { $lte: age };
      classTypeFilter.ageMax = { $gte: age };
    }

    // Add experienceLevel Filter for class type
    if (experienceLevel) {
      classTypeFilter.experienceLevel = experienceLevel;
    }

    //  Add skillCategory Filter for class type;
    if (skillCategoryIds && !isEmpty(JSON.parse(skillCategoryIds))) {
      skillCategoryIds = JSON.parse(skillCategoryIds);
      classTypeFilter.skillCategoryId = { $in: skillCategoryIds };
    }

    // Add SkillSubjects Filter for class type;
    if (skillSubjectIds && !isEmpty(JSON.parse(skillSubjectIds))) {
      skillSubjectIds = JSON.parse(skillSubjectIds);
      classTypeFilter.skillSubject = { $in: skillSubjectIds };
    }

    // Add Location Name Filter for class type;
    if (locationName) {
      classTypeFilter.$text = { $search: locationName };
    }

    // Add Coords Filter for class type;
    if (coords) {
      coords = JSON.parse(coords);
      let maxDistance = 50;
      maxDistance /= 63;
      if (isArray(coords)) {
        classTypeFilter['filters.location.loc'] = {
          $geoWithin: { $center: [[coords[1], coords[0]], maxDistance] },
        };
      }
    }

    if (!isEmpty(classTypeFilter)) {
      const classTypeData = ClassType.find(classTypeFilter).fetch();
      if (!isEmpty(classTypeData)) {
        let schoolIds = [];
        classTypeData.map((obj) => {
          if (obj.schoolId) schoolIds.push(obj.schoolId);
        });
        schoolIds = uniq(schoolIds);
        if (!isEmpty(schoolIds)) {
          filter._id = { $in: schoolIds };
        }
      }
    }
    let result = [];
    if (!isEmpty(filter)) { result = School.find(filter, { fields: { name: 1 } }).fetch(); }
    payload = { result };
    res.end(JSON.stringify(payload));
  } catch (error) {
    console.log('Error in /api/v1/schools', error);
    payload = { error: 'Something Went Wrong' };
    res.end(JSON.stringify(payload));
  }
});
