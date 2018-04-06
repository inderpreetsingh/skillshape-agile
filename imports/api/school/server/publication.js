import School from "../fields";
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import Media from "/imports/api/media/fields.js"
import config from "/imports/config";
import { size, uniq, isEmpty, isArray } from 'lodash';
// import { checkSuperAdmin } from '/imports/util';
// import { buildAggregator } from 'meteor/lamoglia:publish-aggregation';
// import ClientReports from '/imports/startup/client';

Meteor.publish("UserSchool", function (schoolId) {
    const schoolCursor = School.find({ _id: schoolId })
    const schoolData = schoolCursor.fetch();

    if (this.userId && !isEmpty(schoolData)) {
        if (Roles.userIsInRole(this.userId, "Superadmin")) {
            return schoolCursor;
        } else if (isArray(schoolData[0].admins) && schoolData[0].admins.indexOf(this.userId) > -1) {
            return schoolCursor
        }
        return []
    }
    return []

});

Meteor.publish("UserSchoolbySlug", function (slug) {
    const schoolCursor = School.find({ slug: slug })
    const schoolData = schoolCursor.fetch();
    if (!isEmpty(schoolData)) {

        if (schoolData[0].isPublish) {
            return schoolCursor;
        } else if (this.userId) {
            if (Roles.userIsInRole(this.userId, "Superadmin")) {
                return schoolCursor;
            } else if (isArray(schoolData[0].admins) && schoolData[0].admins.indexOf(this.userId) > -1) {
                return schoolCursor
            } else {
                return []
            }
        }
        return []
    }
    return []
});

Meteor.publish("classTypeBySchool", function ({ schoolId, limit }) {
    return [
        ClassType.find({ schoolId: schoolId }, { limit: limit ? limit : 4 })
    ];
});

Meteor.publish("school.getSchoolClasses", function ({
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
    const classfilter = { isPublish: true };
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
Meteor.publish("school.getClassTypesByCategory", function ({
    is_map_view,
    schoolId, /*schoolId filter is used when we click on marker on map on home page*/
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
    // console.log("skillTypeText-->>", skillTypeText);
    // console.log("locationText-->>", locationText);
    // console.log("skillCategoryClassLimit-->>", skillCategoryClassLimit);
    // console.log("is_map_view-->>", is_map_view);
    // console.log("skillTypeText-->>", skillTypeText);
    // console.log("locationText-->>", locationText);
    // console.log("_monthPrice", _monthPrice);
    // console.log("coords", coords);
    // console.log("NEPoint", NEPoint);
    // console.log("skillCategoryIds", skillCategoryIds);
    const classfilter = { isPublish: true, "$or": [] };
    const skillCategoryFilter = {};

    if (is_map_view && schoolId) {
        classfilter["schoolId"] = schoolId;
    }

    if (schoolName) {
        classfilter["$text"] = { $search: schoolName };
    }

    // console.log("this====>",this)

    const isAllZero = coords && coords.some(el => el !== 0);
    if (coords && !is_map_view) {
        if (isAllZero) {
            // place variable will have all the information you are looking for.
            // var maxDistance = 50;
            // we need to convert the distance to radians
            // the raduis of Earth is approximately 6371 kilometers
            // maxDistance /= 63;
            classfilter["$or"].push({
                ["filters.location"]: {
                    $geoWithin: { $center: [coords, 30 / 111.12] }
                }
            });

        }
    }

    // If no location is available and user has an address in their profile: Show classes in categories based on address.
    if ((!coords || !isAllZero) && !locationText) {
        let user = this.userId && Meteor.users.findOne(this.userId);
        // console.log("inside profile coords");
        if (user && user.profile && user.profile.coords) {

            classfilter["$or"].push({
                ["filters.location"]: {
                    $geoWithin: { $center: [user.profile.coords, 30 / 111.12] }
                }
            });
        } else {
            try {
                const myIp = this.connection.clientAddress;
                const url = `https://freegeoip.net/json/${myIp}`;
                const result = Meteor.http.call("GET", url);
                if (result && result.data && result.data.latitude && result.data.longitude) {

                    classfilter["$or"].push({
                        ["filters.location"]: {
                            $geoWithin: { $center: [[result.data.latitude, result.data.longitude], 30 / 111.12] }
                        }
                    });
                }
            } catch (err) {
                console.log("err", err);
            }
        }
    }

    // NEPoint and SWPoint these are NorthEast and SouthWest map Bounds value. These value change when we move the map
    if (NEPoint && SWPoint && is_map_view) {
        classfilter["filters.location"] = {
            $geoWithin: { $box: [NEPoint, SWPoint] }
        };
        classfilter["$or"].push({
            ["filters.location"]: {
                $geoWithin: { $box: [NEPoint, SWPoint] }
            }
        });

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
        classfilter["$or"].push({ ["$text"]: { $search: locationText } });
        console.log("classfilter", JSON.stringify(classfilter, null, "  "))
        console.log("data with filter", ClassType.findOne(classfilter))
        const classTypeExitWithLocationFilter = ClassType.findOne(classfilter);
        // if there is not data found corresponding to locationText filter then remove this filter from classType filter.
        // if (!classTypeExitWithLocationFilter) {
        //     delete classfilter["$text"];
        // }

        // if (!_.isEmpty(classfilter["filters.location"])) {
        //     delete classfilter["filters.location"];
        // }
    }
    if (_.isEmpty(classfilter["$or"])) {
        delete classfilter["$or"];
    }
    console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", JSON.stringify(classfilter, null, "  "));
    console.log("<<<<<<<<<<<<<<<<skillCategoryFilter>>>>>>>>>>>>>>>", JSON.stringify(skillCategoryFilter, null, "  "));
    // console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", SLocation.find({loc: classfilter["filters.location"]}, { limit: limit || 10 }).fetch());
    // console.log("<<<<<<<<<<<<<<<<class type data >>>>>>>>>>>>>>>", ClassType.find(classfilter).fetch());

    let classTypeIds = [];
    let schoolIds = [];
    let locationIds = [];
    // let classTypeCursor;
    let skillCategoryCursor;
    let collectSkillCategoriesIds = [];

    // when map view enable on homepage, Then send the classType data without categorization of skill category.
    if (is_map_view) {
        classTypeCursor = ClassType.find(classfilter, { limit: undefined });

        // console.log("classTypes count --->>", classTypeCursor.count());
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
            collectSkillCategoriesIds,
        })
    }

    // const classTypesCursor = ClassType.find({ _id: { $in: classTypeIds } });


    /*If there is no filter and no class type data found correspond to user's location
    then need to show default classes to user.*/
    console.log("applyFilterStatus", applyFilterStatus);
    if (!applyFilterStatus && _.isEmpty(ClassType.find({ _id: { $in: classTypeIds } }).fetch())) {
        console.log("applyFilterStatus>>>>>>>>>>>>>>", applyFilterStatus);
        //delete location filter from classType filter, Because initially corresponding to user location data not found then show our featured classType.
        if (classfilter["filters.location"]) {
            delete classfilter["filters.location"]
        }

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

            // console.log("applyFilterStatus skillCategoryFilter",JSON.stringify(skillCategoryFilter, null, "  "));
            /////////////////////////////////////////////////////////// ///////////////////////////////////
            skillCategoryCursor = categorizeClassTypeData({
                classTypeIds,
                schoolIds,
                locationIds,
                skillCategoryFilter,
                skillCategoryClassLimit,
                is_map_view,
                classfilter,
                collectSkillCategoriesIds,
            })
        }
    }

    // console.log("collectSkillCategoriesIds --->>",collectSkillCategoriesIds)
    console.log("Final ClassType Data -->>", ClassType.find({ _id: { $in: classTypeIds } }).count());
    const cursors = [
        ClassType.find({ _id: { $in: uniq(classTypeIds) } }),
        SLocation.find({ _id: { $in: uniq(locationIds) } }),
        School.find({ _id: { $in: uniq(schoolIds) } }),
        ClassTimes.find({ classTypeId: { $in: uniq(classTypeIds) } }),
        SkillCategory.find({ _id: { $in: uniq(collectSkillCategoriesIds) } })
    ];

    return cursors;

});

Meteor.publish("ClaimSchoolFilter", function (tempFilter) {

    console.log("Before tempFilter -->>", tempFilter)

    const filterObj = removeKeyValue(tempFilter)

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
        locationName
    } = filterObj

    console.log("After filterObj -->>", filterObj, limit)


    const schoolFilter = { isPublish: true };
    const classTypeFilter = { isPublish: true };
    limit = { limit: limit };

    if (this.userId) {
        schoolFilter["admins"] = { '$nin': [this.userId] };
    }

    // console.log("argument -->>",arguments['0'], size(arguments['0']))

    if (schoolName) {
        classTypeFilter["filters.schoolName"] = { $regex: "" + schoolName + "", $options: "-i" };
        schoolFilter["name"] = { $regex: "" + schoolName + "", $options: "-i" };

        if (size(filterObj) == 2) {
            return School.find(schoolFilter, limit);
        }
    }

    // if (locationName) {
    //     classTypeFilter["$text"] = { $search: locationName };
    // }
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
        var maxDistance = 200;
        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 63;
        classTypeFilter["filters.location"] = {
            $geoWithin: {
                $center: [coords, maxDistance]
            }
        };

        let slocations = SLocation.find({
            loc: {
                $geoWithin: {
                    $center: [coords, maxDistance]
                }
            }
        }).fetch();

        slocations.map(function (data) {
            schoolIds.push(data.schoolId)
            return
        });

        schoolFilter['_id'] = { '$in': schoolIds }
    }

    console.log("classTypeFilter -->>", JSON.stringify(classTypeFilter, null, "  "));
    console.log("schoolFilter -->>", JSON.stringify(schoolFilter, null, "  "));

    if (_.isEmpty(classTypeFilter)) {
        return School.find(schoolFilter, limit);
    } else {
        let classTypeData = ClassType.find(classTypeFilter).fetch();
        classTypeData.map((data) => schoolIds.push(data.schoolId));
        schoolFilter['_id'] = { '$in': uniq(schoolIds) };
        console.log("schoolIds inside-->>", uniq(schoolIds));

        return School.find(schoolFilter, limit);
    }
});

// This publication is used to get media uploaded by admin of a School OR member's media
Meteor.publish("school.getSchoolWithConnectedTagedMedia", function ({ email }) {
    if (email && this.userId) {
        let schoolIds = [];
        let schoolCursor;

        // Fetch member's media for `/media` route.
        let schoolMemberCursor = SchoolMemberDetails.find({ email });
        let memberData = schoolMemberCursor.fetch();
        // Fetch media uploaded by School admin for `/media` route.
        let adminMedia = Media.find({ createdBy: this.userId }).fetch();

        adminMedia.map(data => schoolIds.push(data.schoolId));
        memberData.map(data => schoolIds.push(data.schoolId));

        if (!_.isEmpty(schoolIds)) {
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
    let temp = { ...object }
    for (key in temp) {
        if (!temp[key] || (temp[key] && _.isEmpty(temp[key]) && typeof temp[key] === "object")) {
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
    collectSkillCategoriesIds
}) {
    let skillCategoryCursor = SkillCategory.find(skillCategoryFilter);
    skillCategoryClassLimit ? skillCategoryClassLimit : {};
    let newClassFilters = { ...classfilter }
    // console.log("categorizeClassTypeData skillCategoryFilter",JSON.stringify(skillCategoryFilter, null, "  "));

    skillCategoryCursor.forEach(skillCategory => {
        newClassFilters["skillCategoryId"] = { $in: [skillCategory._id] };
        // Initially(classType limit not set) fetch only 4(default) classType for a particular skill category.
        // console.log("categorizeClassTypeData newClassFilters",JSON.stringify(newClassFilters, null, "  "));
        let limit = (skillCategoryClassLimit && skillCategoryClassLimit[skillCategory.name]) || 4;
        let classTypeCursor = ClassType.find(newClassFilters, {
            limit: is_map_view ? undefined : limit
        });

        // console.log("classTypeCursor count --->>",classTypeCursor.count())

        // findout location and school for a class type.
        classTypeCursor.forEach(classTypeData => {
            // console.log("classTypeData --->>",classTypeData)
            collectSkillCategoriesIds.push(skillCategory._id)
            if (classTypeData.locationId) {
                locationIds.push(classTypeData.locationId);
            }
            classTypeIds.push(classTypeData._id);
            schoolIds.push(classTypeData.schoolId);
        });
    });
    // console.log("classTypeIds 1--->>",classTypeIds)

    return skillCategoryCursor
}