import config from "/imports/config";
import get from "lodash/get";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";


export const sendPackagePurchaseEmail = function({ to, buyer, packageName }) {
    Email.send({
        to: 'sam@skillshape.com',
        from: config.fromEmailForPurchasePackage,
        subject: 'Package Purchase Request Recieved',
        html: `<b>${buyer}</b> has requested this package : <b>${packageName}</b>`
    });
}

// Send Email to school admin when user wants to join a class.
export const sendJoinClassEmail = function({ classTypeData }) {
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
export const sendClaimASchoolEmail = function(claimSchoolData, claimRequestId, schoolEmail) {
    console.log("claimSchoolData>>>>>>>>>>>>>>>>>>>>>>>>", schoolEmail)
    let schoolAdminUser = Meteor.users.findOne({"emails.address":schoolEmail});
    let manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&schoolRegister=true`;
    if(schoolAdminUser) {
        manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&redirectUrl=SchoolAdmin/${claimSchoolData.schoolId}/edit`;
    }
    console.log("schoolAdminUser",schoolAdminUser)
    let school = School.findOne(claimSchoolData.schoolId);
    let ROOT_URL = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}`;
    let schoolAdminRec = Meteor.users.findOne(school.userId);
    console.log("schoolAdminRec", schoolAdminRec)
    console.log("ROOT_URL", ROOT_URL)
    if (Meteor.isServer) {
        Email.send({
            to: 'sam@skillshape.com',
            from: config.fromEmailForJoiningClass,
            subject: 'Claim A school request received',
            html: `Hi${(schoolAdminRec && schoolAdminRec.name) || ''},<br/>
                   <b>${claimSchoolData.userName}</b> has requested permission to manage <b>${school.name}</b>. You are listed as the admin. Do you approve this?<br/>
                   <li><a href=${ROOT_URL}>Yes, Approve Request</a></li><li><a href=${manageBySelfUrl}>No, I will manage the school</a></li><li><a href=${ROOT_URL}>I don't know anything about this</li><br/><br/>
                   Thanks,<br/>
                   <b>The SkillShape Team</b>`
        });
    }
}
// Send Confirmation email to Member who do claim request for school.
export const sendConfirmationEmail = function(claimSchoolData) {
    console.log("claimSchoolData", claimSchoolData)
    let userRec = Meteor.users.findOne(claimSchoolData.userId);
    let school = School.findOne(claimSchoolData.schoolId);
    console.log("userRec", userRec)
    if (Meteor.isServer) {
        Email.send({
            to: 'sam@skillshape.com',
            from: config.fromEmailForJoiningClass,
            subject: 'Confirmation regarding your school claim request received',
            html: `Hi ${(userRec && userRec.profile.firstName) || ''},<br/>
                   We have sent your request to the email on file for ${school.name}. We will resolve this as soon as possible.<br/><br/>
                   Thanks,<br/>
                   The SkillShape Team`
        });
    }
}

export const sendClassTimesRequest = function({currentUserData, schoolOwnerData, superAdminData, schoolId, classTypeName}) {

    let emailObj = {};
    if(schoolOwnerData && currentUserData) {
        const schoolOwnerName = get(schoolOwnerData, "profile.name") || `${get(schoolOwnerData, "profile.firstName")} ${get(schoolOwnerData, "profile.lastName")}`;
        const userName = get(currentUserData, "profile.name") || `${get(currentUserData, "profile.firstName")} ${get(currentUserData, "profile.lastName")}`;
        emailObj.to = schoolOwnerData.emails[0].address;
        emailObj.subject = "Class Interest";
        emailObj.text = `Hi ${schoolOwnerName}, \n${userName} is interested in learning more about your ${classTypeName} class. \nPlease click this link to update your listing: \n${Meteor.absoluteUrl(`SchoolAdmin/${schoolId}/edit`)} \n\nThanks, \n\nEveryone from SkillShape.com`;
    } else {
        emailObj.to = superAdminData.emails[0].address;
        emailObj.subject = "School Admin not found",
        emailObj.text = `Hi SuperAdmin, \nCorresponding to this schoolId ${schoolId} there is no admin assign yet \n\nThanks, \n\nEveryone from SkillShape.com`;
    }
    if (Meteor.isServer) {
        Email.send({
            to: 'sam@skillshape.com', //emailObj.to
            from: "Notices@SkillShape.com",
            replyTo: "Notices@SkillShape.com",
            subject: emailObj.subject,
            text: emailObj.text,
        });
    }
}

export const sendEmailToStudentForClassTimeUpdate = function(userData, schoolData, classTypeName) {
    if (Meteor.isServer) {
        const userName = get(userData, "profile.name") || `${get(userData, "profile.firstName")} ${get(userData, "profile.lastName")}`;
        Email.send({
            to: 'sam@skillshape.com', //userData.emails[0].address;,
            from: "Notices@SkillShape.com",
            subject: "School Updated",
            text: `${userName}, \n${schoolData.name} has updated their listing for ${classTypeName}. Please go to \n ${Meteor.absoluteUrl(`schools/${schoolData.slug}`)} to view their new information and join the class! \n\nThanks, \n\nEveryone from SkillShape.com`,
        });
    }
}