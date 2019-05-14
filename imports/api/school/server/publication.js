import { isEmpty, size, uniq } from 'lodash';
import { check } from 'meteor/check';
import School from '../fields';
import ClassPricing from '/imports/api/classPricing/fields';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassType from '/imports/api/classType/fields';
import EnrollmentFees from '/imports/api/enrollmentFee/fields';
import Media from '/imports/api/media/fields.js';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import SchoolMemberDetails from '/imports/api/schoolMemberDetails/fields';
import SkillCategory from '/imports/api/skillCategory/fields';
import SkillSubject from '/imports/api/skillSubject/fields';
import SLocation from '/imports/api/sLocation/fields';
import config from '/imports/config';


Meteor.publish('UserSchool', function (schoolId) {
  const schoolCursor = School.find({ _id: schoolId });
  const schoolData = schoolCursor.fetch();

  if (this.userId && !isEmpty(schoolData)) {
    if (checkIsAdmin({ user: Meteor.user(), schoolData: schoolData[0] })) {
      return schoolCursor;
    }
    return [];
  }
  return [];
});

Meteor.publish('UserSchoolbySlug', (slug, _id) => {
  let filter = {};
  if (slug) filter = { slug };
  else filter = { _id };
  const schoolCursor = School.find(filter);
  const schoolData = schoolCursor.fetch();
  if (!isEmpty(schoolData)) {
    if (schoolData[0].isPublish) {
      return schoolCursor;
    }
    if (checkIsAdmin({ user: Meteor.user(), schoolData: schoolData[0] })) {
      return schoolCursor;
    }
    return [];
  }
  return [];
});

Meteor.publish('classTypeBySchool', ({ schoolId, limit }) => [
  ClassType.find({ schoolId }),
]);

Meteor.publish('school.getSchoolClasses', ({
  is_map_view,
  schoolId,
  user_id,
  coords,
  NEPoint,
  SWPoint,
  skill,
  _classPrice,
  _monthPrice,
  textSearch,
  limit,
  selectedTag,
}) => {
  const classfilter = { isPublish: true };
  if (is_map_view && schoolId) {
    classfilter.schoolId = schoolId;
  }
  if (textSearch) {
    classfilter.$text = { $search: textSearch };
  }
  if (coords && !NEPoint && !SWPoint) {
    // place variable will have all the information you are looking for.
    let maxDistance = 50;
    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    maxDistance /= 63;
    classfilter['filters.location.loc'] = {
      $geoWithin: { $center: [[coords[1], coords[0]], maxDistance] },
    };
  } else if (NEPoint && SWPoint) {
    classfilter['filters.location.loc'] = {
      $geoWithin: { $box: [[SWPoint[1], SWPoint[0]], [NEPoint[1], NEPoint[0]]] },
    };
  }

  if (_classPrice) {
    const minPrice = parseInt(_classPrice[0]);
    const maxPrice = parseInt(_classPrice[1]);
    classfilter['filters.classPriceCost'] = {
      $gte: minPrice,
      $lt: maxPrice,
    };
  }
  if (_monthPrice) {
    const minMonthPrice = parseInt(_monthPrice[0]);
    const maxMonthPrice = parseInt(_monthPrice[1]);
    classfilter.$or = [
      {
        'filters.monthlyPriceCost.oneMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.threeMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.sixMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.annualCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.lifetimeCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
    ];
  }
  //     "<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>",
  //     JSON.stringify(classfilter, null, "  ")
  // );
  //     "<<<<<<<<<<<<<<<<class type data >>>>>>>>>>>>>>>",
  //     ClassType.find(classfilter).fetch()
  // );
  const classTypeCursor = ClassType.find(classfilter, {
    limit: is_map_view ? undefined : limit,
  });
  const classTypeIds = classTypeCursor.map(classTypeData => classTypeData._id);
  const schoolIds = [];
  const classTimesCursor = ClassTimes.find({
    classTypeId: { $in: classTypeIds },
  });
  const locationIds = [];
  if ((is_map_view && schoolId) || !is_map_view) {
    classTimesCursor.map((classData) => {
      schoolIds.push(classData.schoolId);
      // classTypeIds.push(classData.classTypeId);
      locationIds.push(classData.locationId);
    });
    return [
      classTimesCursor,
      classTypeCursor,
      SLocation.find({ _id: { $in: locationIds } }),
      // ClassType.find({ _id: { $in: classTypeIds } }),
      School.find({ _id: { $in: schoolIds } }),
    ];
  }
  classTimesCursor.map((classData) => {
    locationIds.push(classData.locationId);
  });
  return [SLocation.find({ _id: { $in: locationIds } })];
});

// This publication run on skillshape homepage and give the data of class type by categorization of skill category.
Meteor.publish('school.getClassTypesByCategory', function ({
  is_map_view,
  schoolId, /* schoolId filter is used when we click on marker on map on home page */
  user_id,
  coords,
  NEPoint,
  SWPoint,
  skill,
  _classPrice,
  _monthPrice,
  textSearch,
  limit,
  skillCategoryIds,
  skillSubjectIds,
  gender,
  age,
  experienceLevel,
  skillCategoryClassLimit,
  mainSearchText,
  schoolName,
  skillTypeText,
  locationText,
  applyFilterStatus,
}) {
  const classfilter = { isPublish: true, $or: [] };
  const skillCategoryFilter = {};

  if (is_map_view && schoolId) {
    classfilter.schoolId = schoolId;
  }

  if (schoolName) {
    classfilter.$text = { $search: schoolName };
  }


  const isAllZero = coords && coords.some(el => el !== 0);
  if (coords && !is_map_view) {
    if (isAllZero) {
      // place variable will have all the information you are looking for.
      let maxDistance = 50;
      // we need to convert the distance to radians
      // the raduis of Earth is approximately 6371 kilometers
      maxDistance /= 63;
      classfilter.$or.push({
        'filters.location.loc': {
          $geoWithin: { $center: [[coords[0], coords[1]], maxDistance] },
        },
      });
    }
  }

  // If no location is available and user has an address in their profile: Show classes in categories based on address.
  if (!coords && !locationText && !skillCategoryIds && !age && !gender && !experienceLevel && !skillCategoryClassLimit && !schoolName && !skillTypeText && !skillSubjectIds) {
    const user = this.userId && Meteor.users.findOne(this.userId);
    if (user && user.profile && user.profile.coords) {
      classfilter.$or.push({
        'filters.location.loc': {
          $geoWithin: { $center: [[user.profile.coords[1], user.profile.coords[0]], 30 / 111.12] },
        },
      });
    } else {
      try {
        const myIp = this.connection.clientAddress;
        const url = `https://freegeoip.net/json/${myIp}`;
        const result = Meteor.http.call('GET', url);
        if (result && result.data && result.data.latitude && result.data.longitude) {
          classfilter.$or.push({
            'filters.location.loc': {
              $geoWithin: { $center: [[result.data.longitude, result.data.latitude], 30 / 111.12] },
            },
          });
        }
      } catch (err) {
      }
    }
  }

  // NEPoint and SWPoint these are NorthEast and SouthWest map Bounds value. These value change when we move the map
  if (NEPoint && SWPoint && is_map_view) {
    classfilter['filters.location.loc'] = {
      $geoWithin: { $box: [[SWPoint[1], SWPoint[0]], [NEPoint[1], NEPoint[0]]] },
    };
    classfilter.$or.push({
      'filters.location.loc': {
        $geoWithin: { $box: [[SWPoint[1], SWPoint[0]], [NEPoint[1], NEPoint[0]]] },
      },
    });
  } else if (!NEPoint && !SWPoint && is_map_view) {
    // when map view is on, NEPoint and SWPoint are empty then send empty data.
    return [];
  }

  if (_classPrice) {
    const minPrice = parseInt(_classPrice[0]);
    const maxPrice = parseInt(_classPrice[1]);
    classfilter['filters.classPriceCost'] = {
      $gte: minPrice,
      $lt: maxPrice,
    };
  }

  if (_monthPrice) {
    const minMonthPrice = parseInt(_monthPrice[0]);
    const maxMonthPrice = parseInt(_monthPrice[1]);
    classfilter.$or = [
      {
        'filters.monthlyPriceCost.oneMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.threeMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.sixMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.annualCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.lifetimeCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
    ];
  }

  if (gender) {
    classfilter.gender = gender;
  }

  if (age) {
    classfilter.ageMin = { $lte: age };
    classfilter.ageMax = { $gte: age };
  }

  if (skillSubjectIds && skillSubjectIds.length > 0) {
    classfilter.skillSubject = { $in: skillSubjectIds };
  }

  if (experienceLevel && experienceLevel.length > 0) {
    classfilter.experienceLevel = { $in: experienceLevel };
  }

  if (!_.isEmpty(skillCategoryIds)) {
    if (is_map_view) {
      // when map view enable on homepage, Then send the classType data without categorization of skill category.
      classfilter.skillCategoryId = { $in: skillCategoryIds };
    } else {
      skillCategoryFilter._id = { $in: skillCategoryIds };
    }
  }

  // skillTypeText is text value that search on skill category or skill subject.
  if (skillTypeText) {
    skillCategoryFilter.$or = [];

    // first find in skill subject collections
    const skillSubjectData = SkillSubject.find({
      $text: { $search: skillTypeText },
    }).fetch();

    // if we have any skill subject data corresponding to skill type then filter out skill category Id from skill subject data.
    if (!_.isEmpty(skillSubjectData)) {
      const skillCategoryIds = skillSubjectData.map(
        data => data.skillCategoryId,
      );
      skillCategoryFilter.$or.push({ _id: { $in: skillCategoryIds } });
    }

    skillCategoryFilter.$or.push({ $text: { $search: skillTypeText } });
  }

  // locationText is a text value that search on classType data.
  if (locationText) {
    classfilter.$or.push({ $text: { $search: locationText } });
    const classTypeExitWithLocationFilter = ClassType.findOne(classfilter);
    // if there is not data found corresponding to locationText filter then remove this filter from classType filter.
    // if (!classTypeExitWithLocationFilter) {
    //     delete classfilter["$text"];
    // }

    // if (!_.isEmpty(classfilter["filters.location"])) {
    //     delete classfilter["filters.location"];
    // }
  }
  if (_.isEmpty(classfilter.$or)) {
    delete classfilter.$or;
  }

  let classTypeIds = [];
  let schoolIds = [];
  let locationIds = [];
  // let classTypeCursor;
  let skillCategoryCursor;
  const collectSkillCategoriesIds = [];

  // when map view enable on homepage, Then send the classType data without categorization of skill category.
  if (is_map_view) {
    classTypeCursor = ClassType.find(classfilter, { limit: undefined }).fetch();

    classTypeCursor.forEach((classTypeData) => {
      classTypeData.filters && classTypeData.filters.location && classTypeData.filters.location.map((current) => {
        current && current.loc && current.loc.locationId && locationIds.push(current.loc.locationId);
      });

      classTypeIds.push(classTypeData._id);
      schoolIds.push(classTypeData.schoolId);
    });
  } else {
    // when map view disable on homepage, Then send the classType data by categorization of skill category.

    skillCategoryCursor = categorizeClassTypeData({
      classTypeIds,
      schoolIds,
      locationIds,
      skillCategoryFilter,
      skillCategoryClassLimit,
      is_map_view,
      classfilter,
      collectSkillCategoriesIds,
    });
    classTypeIds = skillCategoryCursor.classTypeIds;
    schoolIds = skillCategoryCursor.schoolIds;
    locationIds = skillCategoryCursor.locationIds;
  }

  // const classTypesCursor = ClassType.find({ _id: { $in: classTypeIds } });


  /* If there is no filter and no class type data found correspond to user's location
    then need to show default classes to user. */
  if (!applyFilterStatus && _.isEmpty(ClassType.find({ _id: { $in: classTypeIds } }).fetch())) {
    // delete location filter from classType filter, Because initially corresponding to user location data not found then show our featured classType.
    if (classfilter['filters.location.loc']) {
      delete classfilter['filters.location.loc'];
    }

    for (const itemObj of config.defaultClassType) {
      const skillCategoryFilter = {
        $or: [],
      };
      const skillSubjectData = SkillSubject.find({
        $text: { $search: itemObj.skillType },
      }).fetch();

      if (!_.isEmpty(skillSubjectData)) {
        const skillCategoryIds = skillSubjectData.map(
          data => data.skillCategoryId,
        );
        skillCategoryFilter.$or.push({
          _id: { $in: skillCategoryIds },
        });
      }

      skillCategoryFilter.$or.push({
        $text: { $search: itemObj.skillType },
      });

      // ///////////////////////////////////////////////////////// ///////////////////////////////////
      skillCategoryCursor = categorizeClassTypeData({
        classTypeIds,
        schoolIds,
        locationIds,
        skillCategoryFilter,
        skillCategoryClassLimit,
        is_map_view,
        classfilter,
        collectSkillCategoriesIds,
      });
      classTypeIds = skillCategoryCursor.classTypeIds;
      schoolIds = skillCategoryCursor.schoolIds;
      locationIds = skillCategoryCursor.locationIds;
    }
  }

  const cursors = [
    ClassType.find({ _id: { $in: uniq(classTypeIds) } }),
    SLocation.find({ _id: { $in: uniq(locationIds) } }),
    School.find({ _id: { $in: uniq(schoolIds) } }),
    ClassTimes.find({ classTypeId: { $in: uniq(classTypeIds) } }),
    SkillCategory.find({ _id: { $in: uniq(collectSkillCategoriesIds) } }),
  ];

  return cursors;
});
Meteor.publish('school.getSchoolBySchoolId', (schoolId) => {
  check(schoolId, String);

  const result = School.find({ _id: schoolId });
  return result;
});
Meteor.publish('ClaimSchoolFilter', (tempFilter) => {
  const filterObj = removeKeyValue(tempFilter);

  let {
    schoolName,
    coords,
    role,
    gender,
    age,
    limit,
    _monthPrice,
    _classPrice,
    experienceLevel,
    skillCategoryIds,
    skillSubjectIds,
    locationName,
  } = filterObj;


  const schoolFilter = { isPublish: true };
  const classTypeFilter = { isPublish: true };
  limit = { limit };
  /*  removed filter because we need to show all school */
  // if (this.userId) {
  //     schoolFilter["admins"] = { '$nin': [this.userId] };
  // }


  if (schoolName) {
    schoolName = schoolName.split(' ');
    const schoolNameRegEx = [];
    schoolName.map((str) => {
      schoolNameRegEx.push(new RegExp(`.*${str}.*`, 'i'));
    });

    classTypeFilter['filters.schoolName'] = { $in: schoolNameRegEx };
    schoolFilter.name = { $in: schoolNameRegEx };

    if (size(filterObj) == 2) {
      return School.find(schoolFilter, limit);
    }
  }

  // if (locationName) {
  //     classTypeFilter["$text"] = { $search: locationName };
  // }
  if (gender) {
    classTypeFilter.gender = gender;
  }

  if (age) {
    classTypeFilter.ageMin = { $lte: age };
    classTypeFilter.ageMax = { $gte: age };
  }

  if (!_.isEmpty(skillCategoryIds)) {
    classTypeFilter.skillCategoryId = { $in: skillCategoryIds };
  }

  if (!_.isEmpty(skillSubjectIds)) {
    classTypeFilter.skillSubject = { $in: skillSubjectIds };
  }

  if (!_.isEmpty(experienceLevel)) {
    classTypeFilter.experienceLevel = { $in: experienceLevel };
  }

  if (_classPrice) {
    const minPrice = parseInt(_classPrice[0]);
    const maxPrice = parseInt(_classPrice[1]);
    classTypeFilter['filters.classPriceCost'] = {
      $gte: minPrice,
      $lt: maxPrice,
    };
  }
  if (_monthPrice) {
    const minMonthPrice = parseInt(_monthPrice[0]);
    const maxMonthPrice = parseInt(_monthPrice[1]);
    classTypeFilter.$or = [
      {
        'filters.monthlyPriceCost.oneMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.threeMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.sixMonCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.annualCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
      {
        'filters.monthlyPriceCost.lifetimeCost': {
          $gte: minMonthPrice,
          $lt: maxMonthPrice,
        },
      },
    ];
  }


  const schoolIds = [];

  if (coords && locationName && size(filterObj) == 3) {
    // place variable will have all the information you are looking for.
    let maxDistance = 200;
    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    maxDistance /= 63;
    classTypeFilter['filters.location.loc'] = {
      $geoWithin: {
        $center: [[coords[1], coords[0]], maxDistance],
      },
    };

    const slocations = SLocation.find({
      loc: {
        $geoWithin: {
          $center: [[coords[1], coords[0]], maxDistance],
        },
      },
    }).fetch();

    slocations.map((data) => {
      schoolIds.push(data.schoolId);
    });

    schoolFilter._id = { $in: schoolIds };
  }


  if (_.isEmpty(classTypeFilter)) {
    return School.find(schoolFilter, limit);
  }
  const classTypeData = ClassType.find(classTypeFilter).fetch();
  classTypeData.map(data => schoolIds.push(data.schoolId));
  schoolFilter._id = { $in: uniq(schoolIds) };

  return School.find(schoolFilter, limit);
});

// This publication is used to get media uploaded by admin of a School OR member's media
Meteor.publish('school.getSchoolWithConnectedTagedMedia', function ({ email }) {
  check(email, String);

  if (email && this.userId) {
    const schoolIds = [];
    let schoolCursor;

    // Fetch member's media for `/media` route.
    const schoolMemberCursor = SchoolMemberDetails.find({ email });
    const memberData = schoolMemberCursor.fetch();
    // Fetch media uploaded by School admin for `/media` route.
    const adminMedia = Media.find({ createdBy: this.userId }).fetch();

    adminMedia.map(data => schoolIds.push(data.schoolId));
    memberData.map(data => schoolIds.push(data.schoolId));

    if (!_.isEmpty(schoolIds)) {
      schoolCursor = School.find({ _id: { $in: uniq(schoolIds) } });
    }

    return [
      schoolCursor,
      schoolMemberCursor,
    ];
  }
});


// //////////////////// Helper function ///////////////////////////////////
function removeKeyValue(object) {
  const temp = { ...object };
  for (const key in temp) {
    if (!temp[key] || (temp[key] && _.isEmpty(temp[key]) && typeof temp[key] === 'object')) {
      delete temp[key];
    }
  }
  return temp;
}


function categorizeClassTypeData({
  classTypeIds = [],
  schoolIds = [],
  locationIds = [],
  is_map_view,
  skillCategoryFilter,
  skillCategoryClassLimit,
  classfilter,
  collectSkillCategoriesIds,
}) {
  const skillCategoryCursor = SkillCategory.find(skillCategoryFilter);
  skillCategoryClassLimit || {};
  const newClassFilters = { ...classfilter };
  // Test query
  // db.ClassType.find({ "filters.location.loc" : { "$geoWithin" : { "$center" : [ [35.6894875,139.69170639999993] , 50 ] } } })
  skillCategoryCursor.forEach((skillCategory) => {
    newClassFilters.skillCategoryId = { $in: [skillCategory._id] };
    // Initially(classType limit not set) fetch only 4(default) classType for a particular skill category.
    const limit = (skillCategoryClassLimit && skillCategoryClassLimit[skillCategory.name]) || 4;
    const classTypeCursor = ClassType.find(newClassFilters, {
      limit: is_map_view ? undefined : limit,
    }).fetch();

    // db.ClassType.find({ "isPublish": true, "$or": [{ "filters.location.loc": { "$geoWithin": { "$center": [[-117.16108380000003, 32.715738], 0.26997840172786175] } } }, {"ageMin": { "$lte": "10" }},{"ageMax": { "$gte": "10" }},{"skillCategoryId": { "$in": ["zmB8mKh6gvLm6pJTv"] }}] }).pretty()


    // findout location and school for a class type.
    classTypeCursor.forEach((classTypeData) => {
      collectSkillCategoriesIds.push(skillCategory._id);
      // if (classTypeData.locationId) {
      //     locationIds.push(classTypeData.locationId);
      // }
      classTypeData.filters && classTypeData.filters.location && classTypeData.filters.location.map((current) => {
        current && current.loc && current.loc.locationId && locationIds.push(current.loc.locationId);
      });
      classTypeIds.push(classTypeData._id);
      schoolIds.push(classTypeData.schoolId);
    });
  });
  const filter = { locationIds, schoolIds, classTypeIds };

  return filter;
}
Meteor.publish('school.findSchoolByIds', (schoolIds) => {
  check(schoolIds, Array);
  return School.find({ _id: { $in: schoolIds } });
});

Meteor.publish('school.getUserCompletePromptData', function (slug, schoolId) {
  try {
    let userData = []; let schoolData = []; let classTypeData = []; let classTimeData = []; let schoolLocationData = []; let classPriceData = []; let monthlyPriceData = []; let
      enrollmentPriceData = [];
    userData = Meteor.users.find({ _id: this.userId });
    if (schoolId) { schoolData = School.find({ _id: schoolId }); } else { schoolData = School.find({ $or: [{ admins: { $in: [this.userId] } }, { superAdmin: this.userId }] }); }
    if (schoolData.fetch().length == 1) {
      const { _id: schoolId } = schoolData.fetch()[0];
      const filter = { schoolId };
      classTypeData = ClassType.find(filter);
      classTimeData = ClassTimes.find(filter);
      schoolLocationData = SLocation.find(filter);
      classPriceData = ClassPricing.find(filter);
      monthlyPriceData = MonthlyPricing.find(filter);
      enrollmentPriceData = EnrollmentFees.find(filter);
      return [userData, schoolData, classTypeData, classTimeData, schoolLocationData, classPriceData, monthlyPriceData, enrollmentPriceData];
    }
    return [userData, schoolData];
  } catch (error) {
    console.log('error in school.getUserCompletePromptData', error);
  }
});
