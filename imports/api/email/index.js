import config from "/imports/config";

import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";


export const sendPackagePurchaseEmail = function({to, buyer, packageName }) {
    Email.send({
        to: 'sam@skillshape.com',
        from: config.fromEmailForPurchasePackage,
        subject: 'Package Purchase Request Recieved',
        html: `<b>${buyer}</b> has requested this package : <b>${packageName}</b>`
    });
}

// Send Email to school admin when user wants to join a class.
export const sendJoinClassEmail = function({classTypeData}) {
    let user = Meteor.users.findOne(classTypeData.userId);
    let school = School.findOne(classTypeData.schoolId);
    let classTimes = ClassTimes.findOne(classTypeData.classTimeId);
    let classType = ClassType.findOne(classTypeData.classTypeId);
    let studentName = user.profile && user.profile.firstName;
    let schoolAdminRec = Meteor.users.findOne(school.userId);
    if (Meteor.isServer) {
        Email.send({
            to: 'sam@skillshape.com',
            from: config.fromEmailForJoiningClass,
            subject: 'Join Class Request Recieved',
            html: `Hi ${schoolAdminRec.profile.firstName}, <br/><b>${studentName}</b> has showed interest in joining your : <b>${classType.name}</b> at <b>${classTimes.name}</b>.`
        });
    }
}

// Send Email to school admin when user claim for a school.
export const sendClaimASchoolEmail = function(claimSchoolData) {
    console.log("claimSchoolData",claimSchoolData)
    // let user = Meteor.users.findOne(claimSchoolData.userId);
    let school = School.findOne(claimSchoolData.schoolId);
    let schoolAdminRec = Meteor.users.findOne(school.userId);
    if (Meteor.isServer) {
        Email.send({
            to: 'rajat.rastogi@daffodilsw.com',
            from: config.fromEmailForJoiningClass,
            subject: 'Claim A school request received',
            html: `Hi ${schoolAdminRec.profile.firstName}, <br/><b>${claimSchoolData.userName}</b> has sent claim request for : <b>${school.name}</b> at <b>${claimSchoolData.createdAt}</b>.`
        });
    }
}