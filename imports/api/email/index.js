import config from "/imports/config";
import get from "lodash/get";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";
import EmailSignature from './signature.js';

export const sendPackagePurchaseEmail = function({ to, buyer, packageName }) {
    Email.send({
        to: "sam@skillshape.com", // Replace value of `to` with Admin email if Admin exists.
        from: config.fromEmailForPurchasePackage,
        subject: "Package Purchase Request Recieved",
        html: `<b>${buyer}</b> has requested this package : <b>${packageName}</b>
            <br/><br/>
            <br/><br/>
            ${EmailSignature}`
    });
};

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
            to: "sam@skillshape.com", // Replace value of `to` with Admin email if Admin exists.
            from: config.fromEmailForJoiningClass,
            subject: "Join Class Request Recieved",
            html: `Hi ${schoolAdminRec.profile
                .firstName}, <br/><b>${studentName}</b> has showed interest in joining your : <b>${classType.name}</b> at <b>${classTimes.name}</b>.
                <br/><br/>
                <br/><br/>
                ${EmailSignature}`
        });
    }
};

// Send Email to school admin when user claim for a school.
export const sendClaimASchoolEmail = function(
    claimSchoolData,
    ROOT_URL,
    manageBySelfUrl,
    schoolAdminRec,
    school,
    modifyUsersRoles
) {
    if (Meteor.isServer) {
        Email.send({
            to: "sam@skillshape.com", // Replace value of `to` with Admin email if Admin exists.
            from: config.fromEmailForJoiningClass,
            subject: "Claim A school request received",
            html: `
                    Hi${(schoolAdminRec && schoolAdminRec.name) || ""},<br/>
                   <b>${claimSchoolData.userName}</b> has requested permission to manage <b>${school.name}</b>. You are listed as the admin. <br/>Do you approve this?<br/><br/>
                   <div>
                       <a href=${modifyUsersRoles.keepMeSuperAdmin} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Yes, make them an Admin, and keep me as SuperAdministrator.</a><br/>
                       <a href=${modifyUsersRoles.makeRequesterSuperAdmin} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Yes, make them SuperAdministrator and keep me as an Administrator.</a><br/>
                       <a href=${modifyUsersRoles.removeMeAsAdmin} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Yes, make them SuperAdministrator and remove me as Administrator.</a><br/>
                       <a href=${manageBySelfUrl} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">No, deny their request.</a><br/>
                       <a href=${ROOT_URL}&approve=true style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">I have no idea what this is about.</a><br/>
                   </div>
                   <br/><br/>
                   <br/><br/>
                   ${EmailSignature}`
        });
    }
};
// Send Confirmation email to Member who do claim request for school.
export const sendConfirmationEmail = function(userRec, school) {
    if (Meteor.isServer) {
        Email.send({
            to: "sam@skillshape.com", // Replace value of `to` with Admin email if Admin exists.
            from: config.fromEmailForJoiningClass,
            subject:
                "Confirmation regarding your school claim request received",
            html: `Hi ${(userRec && userRec.profile.firstName) || ""},<br/>
                We have sent your request to the email on file for ${school.name}. We will resolve this as soon as possible.
                <br/><br/>
                <br/><br/>
                ${EmailSignature}`
        });
    }
};

export const sendClassTimesRequest = function({
    currentUserData,
    schoolOwnerData,
    superAdminData,
    schoolId,
    classTypeName
}) {
    let emailObj = {};
    if (schoolOwnerData && currentUserData) {
        const schoolOwnerName =
            get(schoolOwnerData, "profile.name") ||
            `${get(schoolOwnerData, "profile.firstName")} ${get(
                schoolOwnerData,
                "profile.lastName"
            )}`;
        const userName =
            get(currentUserData, "profile.name") ||
            `${get(currentUserData, "profile.firstName")} ${get(
                currentUserData,
                "profile.lastName"
            )}`;
        emailObj.to = schoolOwnerData.emails[0].address;
        emailObj.subject = "Class Interest";
        emailObj.text = `Hi ${schoolOwnerName}, \n${userName} is interested in learning more about your ${classTypeName} class. \nPlease click this link to update your listing: \n${Meteor.absoluteUrl(
            `SchoolAdmin/${schoolId}/edit`
        )} \n\nThanks, \n\n${EmailSignature}`;
    } else {
        emailObj.to = superAdminData.emails[0].address;
        (emailObj.subject = "School Admin not found"),
            (emailObj.text = `Hi SuperAdmin, \nCorresponding to this schoolId ${schoolId} there is no admin assign yet \n\nThanks, \n\n${EmailSignature}`);
    }
    if (Meteor.isServer) {
        Email.send({
            to: "sam@skillshape.com", //emailObj.to
            from: "Notices@SkillShape.com",
            replyTo: "Notices@SkillShape.com",
            subject: emailObj.subject,
            html: emailObj.text
        });
    }
};

export const sendEmailToStudentForClassTimeUpdate = function(
    userData,
    schoolData,
    classTypeName
) {
    if (Meteor.isServer) {
        const userName =
            get(userData, "profile.name") ||
            `${get(userData, "profile.firstName")} ${get(
                userData,
                "profile.lastName"
            )}`;
        Email.send({
            to: "sam@skillshape.com", //userData.emails[0].address;,
            from: "Notices@SkillShape.com",
            subject: "School Updated",
            html: `${userName}, \n${schoolData.name} has updated their listing for ${classTypeName}. Please go to \n ${Meteor.absoluteUrl(
                `SchoolAdmin/${schoolData._id}/edit?tabValue=2`
            )} to view their new information and join the class! \n\nThanks, \n\n${EmailSignature}`
        });
    }
};

// This function is used to send user registration email and email verification link together.
export const userRegistrationAndVerifyEmail = function(
    user,
    verificationToken,
    passwd,
    fromEmail,
    toEmail
) {
    Email.send({
        from: fromEmail,
        to: toEmail,
        replyTo: fromEmail,
        subject: "skillshape Registration",
        html: `Hi ${user.profile.name},
            Your Email: ${user.emails[0].address} has been registered.
            click on the following link to verify your email address:\n
            ${verificationToken}\n
            Your temporary password is  : ${passwd}
            ${Meteor.absoluteUrl()}
            You will be asked to make your own when you click the link above.
            \n\nThanks, \n\n${EmailSignature}`
    });
};


export const sendPriceInfoRequestEmail = function({
    toEmail,
    fromEmail,
    updatePriceLink,
    ownerName,
    currentUserName
}) {
    if (Meteor.isServer) {
        Email.send({
            to: toEmail, //emailObj.to
            from: fromEmail,
            replyTo: "Notices@SkillShape.com",
            subject: "Pricing info request received",
            html: `Hi ${ownerName}, \n${currentUserName} is interested in learning more about your prices. \nPlease click this link to update your listing: \n${updatePriceLink}
            \n\nThanks, \n\n${EmailSignature}`
        });
    }
};

export const sendEmailToStudentForPriceInfoUpdate = function(
    userData,
    schoolData
) {
    if (Meteor.isServer) {
        const userName =
            get(userData, "profile.name") ||
            `${get(userData, "profile.firstName")} ${get(
                userData,
                "profile.lastName"
            )}`;
        Email.send({
            to: "sam@skillshape.com", // Needs to replace this with requester's Email.
            from: "Notices@SkillShape.com",
            subject: "School has updated pricing info",
            html: `Hi ${userName}, \n${schoolData.name} has updated their prices. Please go to \n ${Meteor.absoluteUrl(
                `SchoolAdmin/${schoolData._id}/edit`)} to view their new information! \n\nThanks, \n\n${EmailSignature}`
            });
    }
};
