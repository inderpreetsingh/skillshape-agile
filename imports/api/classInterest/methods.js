import ClassInterest from "./fields";
import {sendJoinClassEmail} from "/imports/api/email";
import { getUserFullName } from '/imports/util/getUserData';
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import School from "/imports/api/school/fields";


Meteor.methods({
    "classInterest.addClassInterest": function({doc}) {
        doc.createdAt = new Date();
        if(this.userId && this.userId == doc.userId) {
            return ClassInterest.insert(doc,()=> {
                let currentUserRec = Meteor.users.findOne(this.userId);
                let classTypeData = ClassType.findOne(doc.classTypeId);
                let classTimes = ClassTimes.findOne(doc.classTimeId);
                let schoolData = School.findOne(classTypeData.schoolId);
                let schoolAdminRec = Meteor.users.findOne(schoolData.superAdmin);
                const currentUserName = getUserFullName(currentUserRec);
                const schoolAdminName = getUserFullName(schoolAdminRec);
                sendJoinClassEmail({currentUserName,
                    schoolAdminName,
                    classTypeName: classTypeData.name,
                    classTimeName: classTimes.name
                });
            });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classInterest.editClassInterest": function({doc_id, doc}) {
        if (this.userId === doc.userId) {
            return ClassInterest.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classInterest.removeClassInterest": function({doc}) {
        if (this.userId) {
            return ClassInterest.remove({ _id: doc._id, userId: this.userId });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classInterest.removeClassInterestByClassTimeId": function({classTimeId}) {
        console.log("classInterest.removeClassInterestByClassTimeId -->>",classTimeId)
        if (this.userId && classTimeId) {
            return ClassInterest.remove({ userId: this.userId, classTimeId });
        } else {
            throw new Meteor.Error("Unable to delete due to insufficient information!!");
        }
    },
});