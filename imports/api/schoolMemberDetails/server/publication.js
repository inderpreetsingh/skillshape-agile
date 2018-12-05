import isEmpty from "lodash/isEmpty";
import flatten from "lodash/flatten";
import isArray from "lodash/isArray";
import SchoolMemberDetails from "../fields";
import School from "/imports/api/school/fields.js";
import ClassType from "/imports/api/classType/fields.js";
import { check } from 'meteor/check';

Meteor.publish("schoolMemberDetails.getSchoolMemberWithSchool", function ({
  slug,
  classTypeIds,
  memberName
}) {
  // console.log("slug, classTypeIds, memberName",slug, classTypeIds, memberName)

  if (this.userId && slug) {
    let schoolMemberfilter = {};
    let schoolCursor = School.find({ slug: slug });
    let schoolData = schoolCursor.fetch();
    if (isEmpty(schoolData)) {
      return [];
    } else {
      // console.log("schoolData",schoolData)
      // console.log("ClassType",ClassType.find({schoolId: schoolData[0]._id}).fetch())
      return [schoolCursor, ClassType.find({ schoolId: schoolData[0]._id })];
    }
  } else if (this.userId) {
    let activeUserRec = SchoolMemberDetails.find({
      activeUserId: this.userId
    }).fetch();
    // console.log("activeUserRec -->>",activeUserRec)
    let classTypeIdsArray = activeUserRec.map(data => data.classTypeIds);
    let schoolIds = activeUserRec.map(data => data.schoolId);

    if (!isEmpty(activeUserRec) && !isEmpty(classTypeIdsArray)) {
      classTypeIdsArray = flatten(classTypeIdsArray);
      // console.log("classTypeIdsArray -->>",classTypeIdsArray)
      // console.log("schoolIds -->>",schoolIds)
      return [
        ClassType.find({ _id: { $in: classTypeIdsArray } }),
        School.find({ _id: { $in: schoolIds } })
      ];
    } else {
      return [];
    }
  } else {
    throw new Meteor.Error("Access Denied!!!");
  }
});

// Categorise students on the basis of their first Name
Meteor.publish("MembersBySchool", function ({
  schoolId,
  memberName,
  classTypeIds,
  limit,
  activeUserId
}) {
  // console.log(schoolId, memberName, classTypeIds, limit)
  if (this.userId) {
    const classfilter = {
    };

    //findout current user classmates
    if (activeUserId) {
      const SchoolMemberDetailsData = SchoolMemberDetails.find({
        activeUserId: activeUserId
      }).fetch();
      const classTypeIdsArr = SchoolMemberDetailsData.map(
        data => data.classTypeIds
      );
      // console.log("classTypeIdsArr 2-->>",classTypeIdsArr)

      if (isArray(classTypeIdsArr)) {
        classfilter["classTypeIds"] = { $in: flatten(classTypeIdsArr) };
      } else {
        classfilter["classTypeIds"] = { $in: [] };
      }
     // classfilter["activeUserId"] = { $ne: activeUserId };
    }

    if (memberName) {
      classfilter["firstName"] = { $regex: new RegExp(memberName, "mi") };
      // classfilter["$text"] = { $search: memberName };
    }
    if (schoolId) {
      classfilter["schoolId"] = schoolId;
    }
    if (classTypeIds && classTypeIds.length > 0) {
      classfilter["classTypeIds"] = { $in: classTypeIds };
    }
    // console.log("SchoolMemberDetails called",classfilter);
    // console.log("MembersRec",SchoolMemberDetails.find(classfilter,{ limit: limit ? limit : 4 },{sort: {firstName: 1}}).fetch());
    let cursor = SchoolMemberDetails.find(
      classfilter,
      { limit: limit ? limit : 4 },
      { sort: { firstName: 1 } }
    );
    return SchoolMemberDetails.publishJoinedCursors(cursor, { reactive: true }, this);
  } else {
    throw new Meteor.Error("Access Denied!!!");
  }
});
Meteor.publish("schoolMemberDetails.getschoolMemberDetailsByMemberId", function (
  filter
) {
  check(filter, Object);

  return SchoolMemberDetails.find(filter);
});
