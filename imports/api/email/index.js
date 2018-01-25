import config from "/imports/config";

import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";

const signature = `<div style="
    display: inline-flex;
    justify-content: center;
    align-items: center;
"><img style="height: 50px;" src="https://skillshape2.herokuapp.com/images/landing/logo.png">
<span style="margin-top: 21px;"><b>Thanks</b><br><b>The SkillShape Team</b></span></div>`;

export const sendPackagePurchaseEmail = function({ to, buyer, packageName }) {
    Email.send({
        to: "sam@skillshape.com", // Replace value of `to` with Admin email if Admin exists.
        from: config.fromEmailForPurchasePackage,
        subject: "Package Purchase Request Recieved",
        html: `<b>${buyer}</b> has requested this package : <b>${packageName}</b>`
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
                ${signature}`
        });
    }
};

// Send Email to school admin when user claim for a school.
export const sendClaimASchoolEmail = function(
    claimSchoolData,
    ROOT_URL,
    manageBySelfUrl,
    schoolAdminRec,
    school
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
                       <a href=${ROOT_URL} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Yes, Approve Request</a><br/>
                       <a href=${manageBySelfUrl} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">No, I will manage the school</a><br/>
                       <a href=${ROOT_URL} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">I don't know anything about this</a>
                   </div>
                   <br/><br/>
                   ${signature}`
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
                   We have sent your request to the email on file for ${school.name}. We will resolve this as soon as possible.<br/><br/>
                   ${signature}`
        });
    }
};
