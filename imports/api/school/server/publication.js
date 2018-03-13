import School from "../fields";
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import Media from "/imports/api/media/fields.js"
import config from "/imports/config";
import size from 'lodash/size';
import uniq from 'lodash/uniq';
// import { buildAggregator } from 'meteor/lamoglia:publish-aggregation';
// import ClientReports from '/imports/startup/client';

Meteor.publish("UserSchool", function(schoolId) {
    return School.find({ _id: schoolId });
});

Meteor.publish("UserSchoolbySlug", function(slug) {
    return School.find({ slug: slug });
});

Meteor.publish("classTypeBySchool", function({ schoolId, limit }) {
    return [
        ClassType.find({ schoolId: schoolId }, { limit: limit ? limit : 4 })
    ];
});

Meteor.publish("school.getSchoolClasses", function({
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
    selectedTag
}) {
    console.log("schoolId-->>", schoolId);
    console.log("is_map_view-->>", is_map_view);
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
            $geoWithin: { $center: [coords, maxDistance] }
        };
    } else if (NEPoint && SWPoint) {
        classfilter["filters.location"] = {
            $geoWithin: { $box: [NEPoint, SWPoint] }
        };
    }

    if (_classPrice) {
        let minPrice = parseInt(_classPrice[0]);
        let maxPrice = parseInt(_classPrice[1]);
        classfilter["filters.classPriceCost"] = {
            $gte: minPrice,
            $lt: maxPrice
        };
    }
    if (_monthPrice) {
        let minMonthPrice = parseInt(_monthPrice[0]);
        let maxMonthPrice = parseInt(_monthPrice[1]);
        classfilter["$or"] = [
            {
                "filters.monthlyPriceCost.oneMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.threeMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.sixMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.annualCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.lifetimeCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            }
        ];
    }
    console.log(
        "<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>",
        JSON.stringify(classfilter, null, "  ")
    );
    // console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", SLocation.find({loc: classfilter["filters.location"]}, { limit: limit || 10 }).fetch());
    console.log(
        "<<<<<<<<<<<<<<<<class type data >>>>>>>>>>>>>>>",
        ClassType.find(classfilter).fetch()
    );
    let classTypeCursor = ClassType.find(classfilter, {
        limit: is_map_view ? undefined : limit
    });
    let classTypeIds = classTypeCursor.map(classTypeData => {
        return classTypeData._id;
    });
    let schoolIds = [];
    let classTimesCursor = ClassTimes.find({
        classTypeId: { $in: classTypeIds }
    });
    let locationIds = [];
    if ((is_map_view && schoolId) || !is_map_view) {
        classTimesCursor.map(classData => {
            schoolIds.push(classData.schoolId);
            // classTypeIds.push(classData.classTypeId);
            locationIds.push(classData.locationId);
        });
        return [
            classTimesCursor,
            classTypeCursor,
            SLocation.find({ _id: { $in: locationIds } }),
            // ClassType.find({ _id: { $in: classTypeIds } }),
            School.find({ _id: { $in: schoolIds } })
        ];
    } else {
        classTimesCursor.map(classData => {
            locationIds.push(classData.locationId);
        });
        return [SLocation.find({ _id: { $in: locationIds } })];
    }
});

// This publication run on skillshape homepage and give the data of class type by categorization of skill category.
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
    schoolName,
    skillTypeText,
    locationText,
    applyFilterStatus
}) {
    // console.log("applyFilterStatus-->>", applyFilterStatus);
    // console.log("schoolId-->>", schoolId);
    console.log("skillTypeText-->>", skillTypeText);
    console.log("locationText-->>", locationText);
    console.log("skillCategoryClassLimit-->>", skillCategoryClassLimit);
    // console.log("is_map_view-->>", is_map_view);
    // console.log("skillTypeText-->>", skillTypeText);
    // console.log("locationText-->>", locationText);
    // console.log("_monthPrice", _monthPrice);
    // console.log("coords", coords);
    // console.log("NEPoint", NEPoint);
    // console.log("skillCategoryIds", skillCategoryIds);
    const classfilter = {};
    const skillCategoryFilter = {};

    if (is_map_view && schoolId) {
        classfilter["schoolId"] = schoolId;
    }

    if (schoolName) {
        classfilter["$text"] = { $search: schoolName };
    }

    if (coords && !is_map_view) {
        // place variable will have all the information you are looking for.
        var maxDistance = 50;
        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 63;
        classfilter["filters.location"] = {
            $geoWithin: { $center: [coords, 30 / 111.12] }
        };
    }

    // NEPoint and SWPoint these are NorthEast and SouthWest map Bounds value. These value change when we move the map
    if (NEPoint && SWPoint && is_map_view) {
        classfilter["filters.location"] = {
            $geoWithin: { $box: [NEPoint, SWPoint] }
        };
    } else if (!NEPoint && !SWPoint && is_map_view) {
        // when map view is on, NEPoint and SWPoint are empty then send empty data.
        return [];
    }

    if (_classPrice) {
        let minPrice = parseInt(_classPrice[0]);
        let maxPrice = parseInt(_classPrice[1]);
        classfilter["filters.classPriceCost"] = {
            $gte: minPrice,
            $lt: maxPrice
        };
    }

    if (_monthPrice) {
        let minMonthPrice = parseInt(_monthPrice[0]);
        let maxMonthPrice = parseInt(_monthPrice[1]);
        classfilter["$or"] = [
            {
                "filters.monthlyPriceCost.oneMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.threeMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.sixMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.annualCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.lifetimeCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            }
        ];
    }

    if (gender) {
        classfilter["gender"] = gender;
    }

    if (age) {
        classfilter["ageMin"] = { $lte: age };
        classfilter["ageMax"] = { $gte: age };
    }

    if (skillSubjectIds && skillSubjectIds.length > 0) {
        classfilter["skillSubject"] = { $in: skillSubjectIds };
    }

    if (experienceLevel && experienceLevel.length > 0) {
        classfilter["experienceLevel"] = { $in: experienceLevel };
    }

    if (!_.isEmpty(skillCategoryIds)) {
        if (is_map_view) {
            // when map view enable on homepage, Then send the classType data without categorization of skill category.
            classfilter["skillCategoryId"] = { $in: skillCategoryIds };
        } else {
            skillCategoryFilter["_id"] = { $in: skillCategoryIds };
        }
    }

    //skillTypeText is text value that search on skill category or skill subject.
    if (skillTypeText) {
        skillCategoryFilter["$or"] = [];

       // first find in skill subject collections
        const skillSubjectData = SkillSubject.find({
            $text: { $search: skillTypeText }
        }).fetch();

        // if we have any skill subject data corresponding to skill type then filter out skill category Id from skill subject data.
        if (!_.isEmpty(skillSubjectData)) {
            const skillCategoryIds = skillSubjectData.map(
                data => data.skillCategoryId
            );
            skillCategoryFilter["$or"].push({ _id: { $in: skillCategoryIds } });
        }

        skillCategoryFilter["$or"].push({ $text: { $search: skillTypeText } });
    }

    // locationText is a text value that search on classType data.
    if (locationText) {
        classfilter["$text"] = { $search: locationText };

        const classTypeExitWithLocationFilter = ClassType.findOne(classfilter);
        // if there is not data found corresponding to locationText filter then remove this filter from classType filter.
        if (!classTypeExitWithLocationFilter) {
            delete classfilter["$text"];
        }

        if (!_.isEmpty(classfilter["filters.location"])) {
            delete classfilter["filters.location"];
        }
    }
    console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>",JSON.stringify(classfilter, null, "  "));
    console.log("<<<<<<<<<<<<<<<<skillCategoryFilter>>>>>>>>>>>>>>>",JSON.stringify(skillCategoryFilter, null, "  "));
    // console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", SLocation.find({loc: classfilter["filters.location"]}, { limit: limit || 10 }).fetch());
    // console.log("<<<<<<<<<<<<<<<<class type data >>>>>>>>>>>>>>>", ClassType.find(classfilter).fetch());

    let classTypeIds = [];
    let schoolIds = [];
    let locationIds = [];
    // let classTypeCursor;
    let skillCategoryCursor;

    // when map view enable on homepage, Then send the classType data without categorization of skill category.
    if (is_map_view) {
        classTypeCursor = ClassType.find(classfilter, { limit: undefined });

        console.log("classTypes count --->>", classTypeCursor.count());
        classTypeCursor.forEach(classTypeData => {
            locationIds.push(classTypeData.locationId);
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
        })
    }

    // const classTypesCursor = ClassType.find({ _id: { $in: classTypeIds } });

    console.log("ClassType Data -->>", ClassType.find({ _id: { $in: classTypeIds } }).count());

    /*If there is no filter and no class type data found correspond to user's location
    then need to show default classes to user.*/
    if(!applyFilterStatus && _.isEmpty(ClassType.find({ _id: { $in: classTypeIds } }).fetch())) {

        for (let itemObj of config.defaultClassType) {
            let skillCategoryFilter = {
                ["$or"]: []
            };
            const skillSubjectData = SkillSubject.find({
                $text: { $search: itemObj.skillType }
            }).fetch();

            if (!_.isEmpty(skillSubjectData)) {
                const skillCategoryIds = skillSubjectData.map(
                    data => data.skillCategoryId
                );
                skillCategoryFilter["$or"].push({
                    _id: { $in: skillCategoryIds }
                });
            }

            skillCategoryFilter["$or"].push({
                $text: { $search: itemObj.skillType }
            });

            console.log("applyFilterStatus skillCategoryFilter",JSON.stringify(skillCategoryFilter, null, "  "));
            /////////////////////////////////////////////////////////// ///////////////////////////////////
            skillCategoryCursor = categorizeClassTypeData({
                classTypeIds,
                schoolIds,
                locationIds,
                skillCategoryFilter,
                skillCategoryClassLimit,
                is_map_view,
                classfilter,
            })
        }
    }

    console.log("Final ClassType Data -->>", ClassType.find({ _id: { $in: classTypeIds } }).count());
    const cursors = [
        ClassType.find({ _id: { $in: uniq(classTypeIds) } }),
        SLocation.find({ _id: { $in: uniq(locationIds) } }),
        School.find({ _id: { $in: uniq(schoolIds) } }),
        ClassTimes.find({ classTypeId: { $in: uniq(classTypeIds) } })
    ];

    if (skillCategoryCursor) {
        cursors.push(skillCategoryCursor);
    }

    return cursors;

});

Meteor.publish("ClaimSchoolFilter", function(tempFilter) {

    const filterObj = removeKeyValue(tempFilter)

    let {
        schoolName,
        coords,
        role,
        limit,
        gender,
        age,
        _monthPrice,
        _classPrice,
        experienceLevel,
        skillCategoryIds,
        skillSubjectIds,
        locationName
    } = filterObj

    console.log("removeKeyValue filterObj -->>",filterObj)


    const schoolFilter = {};
    const classTypeFilter = {};
    limit = { limit: limit};

    if(this.userId) {
        schoolFilter["admins"] = { '$nin': [this.userId]};
    }

    // console.log("argument -->>",arguments['0'], size(arguments['0']))

    if(schoolName) {
        classTypeFilter["filters.schoolName"] = { $regex: "" + schoolName + "", $options: "-i" };
        schoolFilter["name"] = { $regex: "" + schoolName + "", $options: "-i" };

        if(size(filterObj) == 2) {
            return School.find(schoolFilter, limit);
        }
    }

    if (locationName) {
        classTypeFilter["$text"] = { $search: locationName };
    }
    if (gender) {
        classTypeFilter["gender"] = gender;
    }

    if (age) {
        classTypeFilter["ageMin"] = { $lte: age };
        classTypeFilter["ageMax"] = { $gte: age };
    }

    if (!_.isEmpty(skillCategoryIds)) {
        classTypeFilter["skillCategoryId"] = { $in: skillCategoryIds };
    }

    if (!_.isEmpty(skillSubjectIds)) {
        classTypeFilter["skillSubject"] = { $in: skillSubjectIds };
    }

    if (!_.isEmpty(experienceLevel)) {
        classTypeFilter["experienceLevel"] = { $in: experienceLevel };
    }

    if (_classPrice) {
        let minPrice = parseInt(_classPrice[0]);
        let maxPrice = parseInt(_classPrice[1]);
        classTypeFilter["filters.classPriceCost"] = {
            $gte: minPrice,
            $lt: maxPrice
        };
    }
    if (_monthPrice) {
        let minMonthPrice = parseInt(_monthPrice[0]);
        let maxMonthPrice = parseInt(_monthPrice[1]);
        classTypeFilter["$or"] = [
            {
                "filters.monthlyPriceCost.oneMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.threeMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.sixMonCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.annualCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            },
            {
                "filters.monthlyPriceCost.lifetimeCost": {
                    $gte: minMonthPrice,
                    $lt: maxMonthPrice
                }
            }
        ];
    }


    let schoolIds = [];

    if (coords && locationName && size(filterObj) == 3) {
        // place variable will have all the information you are looking for.
        var maxDistance = 50;
        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 63;
        let slocations = SLocation.find({
            loc: {
                $near: coords,
                $maxDistance: maxDistance
            }
        }).fetch();

        slocations.map(function(data) {
            schoolIds.push(data.schoolId)
            return
        });

        schoolFilter['_id'] = { '$in': schoolIds }
    }

    console.log("classTypeFilter -->>",JSON.stringify(classTypeFilter, null, "  "));
    console.log("schoolFilter -->>",JSON.stringify(schoolFilter, null, "  "));

    if(_.isEmpty(classTypeFilter)) {
        return School.find(schoolFilter, limit);
    } else {
        let classTypeData = ClassType.find(classTypeFilter).fetch();
        classTypeData.map((data) => schoolIds.push(data.schoolId));
        schoolFilter['_id'] = { '$in': uniq(schoolIds) };
        console.log("schoolIds -->>",uniq(schoolIds));

        return School.find(schoolFilter, limit);
    }
});

// This publication is used to get media uploaded by admin of a School OR member's media
Meteor.publish("school.getSchoolWithConnectedTagedMedia", function({ email }) {
    if (email && this.userId) {
        let schoolIds = [];
        let schoolCursor;

        // Fetch member's media for `/media` route.
        let schoolMemberCursor = SchoolMemberDetails.find({ email });
        let memberData = schoolMemberCursor.fetch();
        // Fetch media uploaded by School admin for `/media` route.
        let adminMedia = Media.find({createdBy:this.userId}).fetch();

        adminMedia.map(data => schoolIds.push(data.schoolId));
        memberData.map(data => schoolIds.push(data.schoolId));

        if(!_.isEmpty(schoolIds)) {
            schoolCursor = School.find({ _id: { $in: uniq(schoolIds) } })
        }

        return [
            schoolCursor,
            schoolMemberCursor
        ]
    }
});


////////////////////// Helper function ///////////////////////////////////
function removeKeyValue(object) {
    let temp = {...object}
    for(key in temp) {
        if(_.isEmpty(temp[key])) {
            delete temp[key]
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
}) {
    let skillCategoryCursor = SkillCategory.find(skillCategoryFilter);
    skillCategoryClassLimit ? skillCategoryClassLimit : {};
    skillCategoryCursor.forEach(skillCategory => {
        classfilter["skillCategoryId"] = { $in: [skillCategory._id] };
        // Initially(classType limit not set) fetch only 4(default) classType for a particular skill category.
        let limit = (skillCategoryClassLimit && skillCategoryClassLimit[skillCategory.name]) ||4;
        let classTypeCursor = ClassType.find(classfilter, {
            limit: is_map_view ? undefined : limit
        });
        console.log("limit -->>>",skillCategory.name, {
            limit: is_map_view ? undefined : limit
        },classTypeCursor.count())

        // console.log("classTypeCursor count --->>",classTypeCursor.count())

        // findout location and school for a class type.
        classTypeCursor.forEach(classTypeData => {
            // console.log("classTypeData --->>",classTypeData)
            if(classTypeData.locationId) {
                locationIds.push(classTypeData.locationId);
            }
            classTypeIds.push(classTypeData._id);
            schoolIds.push(classTypeData.schoolId);
        });
    });
    // console.log("classTypeIds 1--->>",classTypeIds)

    return skillCategoryCursor
}