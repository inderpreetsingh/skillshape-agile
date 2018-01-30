import School from "../fields";
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
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
    skillCategoryClassLimit,
    mainSearchText,
}) {
    console.log("schoolId-->>", schoolId)
    console.log("is_map_view-->>", is_map_view)
    // console.log("_monthPrice", _monthPrice);
    console.log("coords", coords);
    console.log("NEPoint", NEPoint);
    console.log("skillCategoryIds", skillCategoryIds);
    const classfilter = {};
    const skillCategoryFilter = {};

    if (is_map_view && schoolId) {
        classfilter["schoolId"] = schoolId;
    }

    if (textSearch) {
        classfilter["$text"] = { $search: textSearch };
    }

    if (coords && !is_map_view) {
        // place variable will have all the information you are looking for.
        var maxDistance = 50;
        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 63;
        classfilter["filters.location"] = {
            "$geoWithin": { "$center": [coords, 30/111.12] }
            // "$geoWithin": { $box: [coords.NEPoint, coords.SWPoint] }
        }
    }

    if (NEPoint && SWPoint && is_map_view) {
        classfilter["filters.location"] = { $geoWithin: { $box: [NEPoint, SWPoint] } }
    } else if(!NEPoint && !SWPoint && is_map_view) {
        return [];
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
        classfilter["skillSubject"] = {$in: skillSubjectIds};
    }

    if(experienceLevel && experienceLevel.length > 0) {
        classfilter["experienceLevel"] = {$in: experienceLevel};
    }

    if(!_.isEmpty(skillCategoryIds)) {
        if(is_map_view) {
            classfilter["skillCategoryId"] = { $in: skillCategoryIds };
        } else {
            skillCategoryFilter["_id"] = { $in: skillCategoryIds };
        }
    }

    if(!_.isEmpty(mainSearchText)) {
        skillCategoryFilter["$or"] = [];
        const skillSubjectData = SkillSubject.find({ "$text" : { $search: mainSearchText } }).fetch();

        if(!_.isEmpty(skillSubjectData)) {
            const skillCategoryIds = skillSubjectData.map((data) => data.skillCategoryId);
            skillCategoryFilter["$or"].push({ _id: { $in: skillCategoryIds } })
        }

        skillCategoryFilter["$or"].push({ "$text": { $search: mainSearchText } })
        classfilter["$text"] = { $search: mainSearchText };

        const classTypeExitWithLocationFilter = ClassType.findOne(classfilter);

        if(!classTypeExitWithLocationFilter) {
            delete classfilter["$text"];
        }

        if(!_.isEmpty(classfilter["filters.location"])) {
            delete classfilter["filters.location"];
        }

    }
    console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", JSON.stringify(classfilter, null, "  "));
    console.log("<<<<<<<<<<<<<<<<skillCategoryFilter>>>>>>>>>>>>>>>", JSON.stringify(skillCategoryFilter, null, "  "));
    // console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", SLocation.find({loc: classfilter["filters.location"]}, { limit: limit || 10 }).fetch());
    // console.log("<<<<<<<<<<<<<<<<class type data >>>>>>>>>>>>>>>", ClassType.find(classfilter).fetch());



    // let cursors = []
    let classTypeIds = [];
    let schoolIds = [];
    let locationIds = [];
    let classTypeCursor;
    let skillCategoryCursor;
    // let skillCategoryCursor = SkillCategory.find(skillCategoryFilter,{limit});
    if(is_map_view) {

        classTypeCursor = ClassType.find(classfilter, { limit: undefined });
            // console.log("classTypeCursor", classfilter, classTypeCursor.fetch());
        console.log("classTypes count --->>",classTypeCursor.count())
        classTypeCursor.forEach((classTypeData) => {
            locationIds.push(classTypeData.locationId);
            classTypeIds.push(classTypeData._id);
            schoolIds.push(classTypeData.schoolId);
        })

    } else {
        skillCategoryCursor = SkillCategory.find(skillCategoryFilter);
        // cursors.push(skillCategoryCursor);

        // console.log("skillCategoryClassLimit",skillCategoryClassLimit)
        skillCategoryClassLimit ? skillCategoryClassLimit : {};
            // console.log("filters -->>",classfilter)

        skillCategoryCursor.forEach((skillCategory) => {
            // console.log("skillCategory data -->>",skillCategory)
            classfilter["skillCategoryId"] = {$in: [skillCategory._id]};
            let limit =  (skillCategoryClassLimit && skillCategoryClassLimit[skillCategory.name]) || 4
            // console.log("class type filters -->>",classfilter)
            classTypeCursor = ClassType.find(classfilter, { limit: is_map_view ? undefined : limit });
            // console.log("classTypeCursor", classfilter, classTypeCursor.fetch());
            classTypeCursor.forEach((classTypeData) => {
                // console.log("classTypeData --->>",classTypeData)
                locationIds.push(classTypeData.locationId);
                classTypeIds.push(classTypeData._id);
                schoolIds.push(classTypeData.schoolId);
            })
        })

    }

    let cursors = [
        ClassType.find({ _id: { $in: classTypeIds } }),
        SLocation.find({ _id: { $in: locationIds } }),
        School.find({ _id: { $in: schoolIds } }),
        ClassTimes.find({ classTypeId: { $in: classTypeIds } }),
    ];

    if(skillCategoryCursor) {
        cursors.push(skillCategoryCursor)
    }

    return cursors;
    // if ((is_map_view && schoolId) || !is_map_view) {

    // } else {
    //     return [
    //         SLocation.find({ _id: { $in: locationIds } })
    //     ]
    // }
})

Meteor.publish("ClaimSchoolFilter", function ({schoolName, coords, skillCat, role, limit}) {
    filter = {}
    limit = { limit: limit }
    schoolList = School.find({ is_publish: 'N' }).fetch();
    if (schoolName) {
      filter.name = { '$regex': '' + schoolName + '', '$options': '-i' };
    }
    let currentUser = Meteor.users.findOne(this.userId);
    if(currentUser) {
        filter = { $and: [ { userId: { $ne: this.userId } }, { email: { $ne: currentUser.emails.address } } ] };
    }
    AllSchoolIds = []
    console.log("coords",coords);
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
    console.log("cskill===>",skillCat)
    if (skillCat && skillCat.length > 0) {
      class_type = ClassType.find({ skillCategoryId: { $in: skillCat } }).fetch()
      console.log("class_type",class_type)
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
    console.log("filter",filter);
    return School.find(filter, limit);


  });