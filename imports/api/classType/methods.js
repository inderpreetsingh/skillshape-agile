import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import ClassType from "./fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import SLocation from "/imports/api/sLocation/fields";
import School from "/imports/api/school/fields";
import ClassTimesRequest from "/imports/api/classTimesRequest/fields";
import ClassTypeLocationRequest from "/imports/api/classTypeLocationRequest/fields";
import { sendEmailToStudentForClassTimeUpdate, sendClassTypeLocationRequestEmail } from "/imports/api/email";
import { getUserFullName } from '/imports/util/getUserData';

Meteor.methods({
    "classType.getClassType": function({schoolId}) {

        return ClassType.find({schoolId}).fetch();
    },
    "classType.getClassTypeByTextSearch": function({schoolId, textSearch}) {

        return ClassType.find({schoolId: schoolId, name: { $regex: new RegExp(textSearch, 'mi') }},{limit: 10,fields:{name:1}}).fetch();
    },
    "classType.addClassType": function({doc}) {
         const user = Meteor.users.findOne(this.userId);
        // console.log("classType.addClassType methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            const schoolData = School.findOne({_id: doc.schoolId})
            // doc.remoteIP = this.connection.clientAddress;
            const temp = {...doc, isPublish:true};
            temp.filters =  temp.filters ? temp.filters : {};

            if(schoolData.name) {
                temp.filters["schoolName"] = schoolData.name;
            }

            if(temp.locationId) {
                const location = SLocation.findOne(doc.locationId);
                temp.filters["location"] = location.loc;
                // doc.filters["state"] = location.state;
                temp.filters["locationTitle"] = `${location.state}, ${location.city}, ${location.country}`;
            }

            temp.createdAt = new Date();

            return ClassType.insert(temp);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.editClassType": function({doc_id, doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("classType.editClassType methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            let classTypeData = ClassType.findOne({_id: doc_id});

            const temp = {...doc, filters: classTypeData.filters || {} };

            if(temp.locationId) {
                const location = SLocation.findOne(temp.locationId);
                // temp.filters =  temp.filters ? temp.filters : {};
                temp.filters["location"] = location.loc;
                // temp.filters["state"] = location.state;
                temp.filters["locationTitle"] = `${location.state}, ${location.city}, ${location.country}`;
            }

            return ClassType.update({ _id: doc_id }, { $set: temp });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.removeClassType": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("classType.removeClassType methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            ClassTimes.remove({classTypeId: doc._id})
            ClassInterest.remove({classTypeId: doc._id})
            return ClassType.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.notifyToStudentForClassTimes": function({schoolId, classTypeId, classTypeName}) {
        if(this.userId) {
            const classTimesRequestData = ClassTimesRequest.find({schoolId,classTypeId,notification: true}).fetch()
            if(!isEmpty(classTimesRequestData)) {
                for(let obj of classTimesRequestData) {
                    const userData = Meteor.users.findOne({_id: obj.userId});
                    const schoolData = School.findOne({_id: obj.schoolId})

                    if(userData && schoolData) {
                        ClassTimesRequest.update({ _id: obj._id }, { $set: {notification: false} })
                        sendEmailToStudentForClassTimeUpdate(userData, schoolData, classTypeName)
                    }
                }
            }
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.requestClassTypeLocation": function({schoolId, classTypeId, classTypeName}) {
        if (this.userId && schoolId) {
                const classTypeLocationRequest = ClassTypeLocationRequest.findOne({schoolId, classTypeId,userId: this.userId });
                console.log("classTypeLocationRequest -->>",classTypeLocationRequest)
                // Request Pending
                if(classTypeLocationRequest) {
                    throw new Meteor.Error("Your Class Type request has already been created!!!");
                } else {
                    const requestObj = {
                        schoolId,
                        createdAt: new Date(),
                        notification: true,
                        userId: this.userId,
                        classTypeId:classTypeId,
                        classTypeName:classTypeName
                    }
                    ClassTypeLocationRequest.insert(requestObj);
                }
                let schoolData = School.findOne(schoolId);
                let ownerName;
                console.log("schoolData==>",schoolData)
                if(schoolData && schoolData.superAdmin) {
                    // Get Admin of School As school Owner
                    let adminUser = Meteor.users.findOne(schoolData.superAdmin);
                    ownerName= getUserFullName(adminUser);
                }
                // Optional if Owner name not found then owner name will be `Sam`
                if(!ownerName) {
                    // Owner Name will be Sam
                    ownerName = 'Sam'
                }
                // Send Email to Admin of School if admin available
                const toEmail = 'sam@skillshape.com'; // Needs to replace by Admin of School
                const fromEmail = 'Notices@SkillShape.com';
                let currentUser = Meteor.users.findOne(this.userId);
                let currentUserName = getUserFullName(currentUser);
                sendClassTypeLocationRequestEmail({toEmail, fromEmail, currentUserName,ownerName});
                return {emailSent:true};

        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});