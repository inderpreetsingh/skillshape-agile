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

export const sendJoinClassEmail = function({classTypeData}) {
    var user = Meteor.users.findOne(classTypeData.userId);
    let school = School.findOne(classTypeData.schoolId);
    let classTimes = ClassTimes.findOne(classTypeData.classTimeId);
    let classType = ClassType.findOne(classTypeData.classTypeId);
    let studentName = user.profile && user.profile.firstName;
    if (Meteor.isServer) {
        Email.send({
            to: 'sam@skillshape.com',
            from: config.fromEmailForJoiningClass,
            subject: 'Join Class Request Recieved',
            html: `<b>${studentName}</b> has showed interest in joining your : <b>${classType.name}</b> at <b>${classTimes.name}</b>.`
        });
    }
}