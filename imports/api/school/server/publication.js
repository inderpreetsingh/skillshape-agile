import School from "../fields";
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import ClassTimes from "/imports/api/classTimes/fields";

Meteor.publish("UserSchool", function(schoolId) {
    return School.find({ _id: schoolId });
});

Meteor.publish("UserSchoolbySlug", function(slug) {
    return School.find({ slug: slug });
});

Meteor.publish("classTypeBySchool", function({ schoolId, limit }) {
    return [
        ClassType.find({ schoolId: schoolId }, { limit: limit ? limit : 4 })
    ]
});

Meteor.publish("school.getSchoolClasses", function({ is_map_view, schoolId, user_id, coords, NEPoint, SWPoint, skill, _classPrice, _monthPrice, textSearch, limit, selectedTag }) {
    console.log("schoolId-->>", schoolId)
    console.log("is_map_view-->>", is_map_view)
    console.log("_monthPrice", _monthPrice);
    console.log("coords", coords);
    console.log("NEPoint", NEPoint);
    const classfilter = {};
    if (is_map_view && schoolId) {
        classfilter["schoolId"] = schoolId;
    }
    if (textSearch) {
        classfilter["$text"] = { $search: textSearch };
    }
    if (coords && !NEPoint && !SWPoint) {
        // place variable will have all the information you are looking for.
        var maxDistance = 50;
        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 63;
        classfilter["filters.location"] = {
            "$geoWithin": { "$center": [coords, maxDistance] }
        }
    } else if (NEPoint && SWPoint) {
        classfilter["filters.location"] = { $geoWithin: { $box: [NEPoint, SWPoint] } }
    }

    if (_classPrice) {
        let minPrice = parseInt(_classPrice[0]);
        let maxPrice = parseInt(_classPrice[1]);
        classfilter["filters.classPriceCost"] = { $gte: minPrice, $lt: maxPrice };
    }
    if (_monthPrice) {
        let minMonthPrice = parseInt(_monthPrice[0]);
        let maxMonthPrice = parseInt(_monthPrice[1]);
        classfilter["$or"] = [
            { "filters.monthlyPriceCost.oneMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.threeMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.sixMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.annualCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.lifetimeCost": { $gte: minMonthPrice, $lt: maxMonthPrice } }
        ]

    }
    console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", JSON.stringify(classfilter, null, "  "));
    // console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", SLocation.find({loc: classfilter["filters.location"]}, { limit: limit || 10 }).fetch());
    console.log("<<<<<<<<<<<<<<<<class type data >>>>>>>>>>>>>>>", ClassType.find(classfilter).fetch());
    let classTypeCursor = ClassType.find(classfilter, { limit: is_map_view ? undefined : limit });
    let classTypeIds = classTypeCursor.map((classTypeData) => {
        return classTypeData._id;
    })
    let schoolIds = [];
    let classTimesCursor = ClassTimes.find({ classTypeId: { $in: classTypeIds } });
    let locationIds = [];
    if ((is_map_view && schoolId) || !is_map_view) {
        classTimesCursor.map((classData) => {
            schoolIds.push(classData.schoolId);
            // classTypeIds.push(classData.classTypeId);
            locationIds.push(classData.locationId);
        })
        return [
            classTimesCursor,
            classTypeCursor,
            SLocation.find({ _id: { $in: locationIds } }),
            // ClassType.find({ _id: { $in: classTypeIds } }),
            School.find({ _id: { $in: schoolIds } }),
        ];
    } else {
        classTimesCursor.map((classData) => {

            locationIds.push(classData.locationId);
        })
        return [
            SLocation.find({ _id: { $in: locationIds } })
        ]
    }
})

Meteor.publish("school.getClassTypesByCategory", function({
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
    skillCategoryIds,
    skillSubjectIds,
    gender,
    age,
    experienceLevel,
    skillCategoryClassLimit
}) {
    console.log("schoolId-->>", schoolId)
    // console.log("is_map_view-->>", is_map_view)
    // console.log("_monthPrice", _monthPrice);
    console.log("coords", coords);
    // console.log("NEPoint", NEPoint);
    console.log("skillCategoryIds", skillCategoryIds);
    const classfilter = {};
    const skillCategoryFilter = {};
    if (is_map_view && schoolId) {
        classfilter["schoolId"] = schoolId;
    }
    if (textSearch) {
        classfilter["$text"] = { $search: textSearch };
    }
    if (coords && !NEPoint && !SWPoint) {
        // place variable will have all the information you are looking for.
        var maxDistance = 50;
        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 63;
        classfilter["filters.location"] = {
            "$geoWithin": { "$center": [coords, 30/111.12] }
            // "$geoWithin": { $box: [coords.NEPoint, coords.SWPoint] }
        }
    } else if (NEPoint && SWPoint) {
        classfilter["filters.location"] = { $geoWithin: { $box: [NEPoint, SWPoint] } }
    }

    if (_classPrice) {
        let minPrice = parseInt(_classPrice[0]);
        let maxPrice = parseInt(_classPrice[1]);
        classfilter["filters.classPriceCost"] = { $gte: minPrice, $lt: maxPrice };
    }
    if (_monthPrice) {
        let minMonthPrice = parseInt(_monthPrice[0]);
        let maxMonthPrice = parseInt(_monthPrice[1]);
        classfilter["$or"] = [
            { "filters.monthlyPriceCost.oneMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.threeMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.sixMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.annualCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.lifetimeCost": { $gte: minMonthPrice, $lt: maxMonthPrice } }
        ]

    }

    if(gender) {
        classfilter["gender"] = gender
    }

    if(age) {
        classfilter["ageMin"] = { $lte: age };
        classfilter["ageMax"] = { $gte: age };
    }

    if(skillSubjectIds && skillSubjectIds.length > 0) {
        classfilter["skillSubject"] = skillSubjectIds;
    }

    if(experienceLevel && experienceLevel.length > 0) {
        classfilter["experienceLevel"] = {$in: experienceLevel};
    }

    if(!_.isEmpty(skillCategoryIds)) {
        skillCategoryFilter["_id"] = { $in: skillCategoryIds };
    }

    console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", JSON.stringify(classfilter, null, "  "));
    console.log("<<<<<<<<<<<<<<<<skillCategoryFilter>>>>>>>>>>>>>>>", JSON.stringify(skillCategoryFilter, null, "  "));
    // console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", SLocation.find({loc: classfilter["filters.location"]}, { limit: limit || 10 }).fetch());
    // console.log("<<<<<<<<<<<<<<<<class type data >>>>>>>>>>>>>>>", ClassType.find(classfilter).fetch());



    let cursors = []
    let classTypeIds = [];
    let schoolIds = [];
    // let skillCategoryCursor = SkillCategory.find(skillCategoryFilter,{limit});
    let skillCategoryCursor = SkillCategory.find(skillCategoryFilter);
    cursors.push(skillCategoryCursor);

    console.log("skillCategoryClassLimit",skillCategoryClassLimit)
    skillCategoryClassLimit ? skillCategoryClassLimit : {};
        // console.log("filters -->>",classfilter)

    skillCategoryCursor.forEach((skillCategory) => {
        console.log("skillCategory data -->>",skillCategory)
        classfilter["skillCategoryId"] = {$in: [skillCategory._id]};
        let limit =  (skillCategoryClassLimit && skillCategoryClassLimit[skillCategory.name]) || 4
        console.log("class type filters -->>",classfilter)
        let classTypeCursor = ClassType.find(classfilter, { limit: is_map_view ? undefined : limit });
        // console.log("classTypeCursor", classfilter, classTypeCursor.fetch());
        classTypeCursor.forEach((classTypeData) => {
            // console.log("classTypeData --->>",classTypeData)
            classTypeIds.push(classTypeData._id);
            schoolIds.push(classTypeData.schoolId);
        })
    })

    let classTimesCursor = ClassTimes.find({ classTypeId: { $in: classTypeIds } });
    let locationIds = [];
    classTimesCursor.map((classData) => {
        locationIds.push(classData.locationId);
    })
    if ((is_map_view && schoolId) || !is_map_view) {
    console.log("tes>>>>>>>>>",classTypeIds);

        return [
            classTimesCursor,
            ClassType.find({ _id: { $in: classTypeIds } }),
            SLocation.find({ _id: { $in: locationIds } }),
            School.find({ _id: { $in: schoolIds } }),
            skillCategoryCursor,
        ];
    } else {
        return [
            SLocation.find({ _id: { $in: locationIds } })
        ]
    }
})

Meteor.publish("ClaimSchoolFilter", function ({phone, website, name, coords, cskill, role, limit}) {
    filter = {}
    limit = { limit: limit }
    schoolList = School.find({ is_publish: 'N' }).fetch();
    // UnPublishSchoolIds = schoolList.map(function (a) { return a._id });
    if (phone) {
      filter.phone = { '$regex': '' + phone + '', '$options': '-i' };
    }
    if (website) {
      filter.website = { '$regex': '' + website + '', '$options': '-i' };
    }
    if (name) {
      filter.name = { '$regex': '' + name + '', '$options': '-i' };
    }
    AllSchoolIds = []
    console.log(coords);
    if (coords) {
      // place variable will have all the information you are looking for.
      var maxDistance = 50;
      // we need to convert the distance to radians
      // the raduis of Earth is approximately 6371 kilometers
      maxDistance /= 63;
      slocations = SLocation.find({
        loc: {
          $near: coords,
          $maxDistance: maxDistance
        }
      }).fetch();
      schoolIds = slocations.map(function (a) {
        return a.schoolId;
      });
      console.log(schoolIds);
      filter._id = { $in: schoolIds };
      AllSchoolIds = schoolIds;
    }
    if (cskill) {
      class_type = ClassType.find({ skillTypeId: cskill }).fetch()
      schoolIds = class_type.map(function (a) {
        return a.schoolId;
      });
      console.log(schoolIds);
      AllSchoolIds = schoolIds.concat(AllSchoolIds)
      if (AllSchoolIds.length > 0) {
        filter._id = { $in: AllSchoolIds };
      } else {
        filter._id = { $in: schoolIds };
      }

    }
    if (role && role == "Superadmin") {


    } else {
      /*result = {}
      result = _.extend(result,filter._id, {$nin:UnPublishSchoolIds});*/
      filter.is_publish = { $ne: 'N' }
    }
    /*filter.claimed = { $ne : 'Y' }*/
    console.log(filter);
    return School.find(filter, limit);


  });