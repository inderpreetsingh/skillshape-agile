import config from "/imports/config";
import get from "lodash/get";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";
import EmailSignature from "./signature.js";
import { getUserFullName } from "/imports/util/getUserData";
let platform=Meteor.settings.platform;
export const sendNewSchoolSuggestionEmail = function({ newSuggestionLink }) {
  let to;
  if(platform == 'local'){
    to='ramesh.bansal@daffodilsw.com';
  }
  else {
    to = config.skillshapeAdminEmail;
  }
  Email.send({
    to: to,
    from: "Notices@SkillShape.com",
    subject: "New School Suggestion",
    html: `Dear admin, <br><br>You have recieved a new school suggestion. In order to view all the suggestions, click the following link.<br><br>
    ${newSuggestionLink}`
  });
};
//1.Button on which admin click.
//2.It will redirect to the school edit page.
//3.Need to open the package modal
export const sendPackagePurchaseEmail = function({
  to,
  buyer,
  packageName,
  schoolAdminName,
  schoolId
}) {
  let To;
  if(platform == 'local'){
    To='ramesh.bansal@daffodilsw.com';
  }
  else {
    To = config.skillshapeAdminEmail;
  }
  Email.send({
    to: To,
    from: config.fromEmailForPurchasePackage,
    subject: "Package Purchase Request Recieved",
    html: `Dear ${schoolAdminName},<br/><b>${buyer}</b> has expressed interest in <b>${packageName}</b> class package.
            <a href=${Meteor.absoluteUrl(
              `SchoolAdmin/${schoolId}/edit`
            )}>Click here</a> to go to School page.
            <br/><br/>
            <br/><br/>
            ${EmailSignature}`
  });
};

// Send Email to school admin when user wants to join a class.
export const sendJoinClassEmail = function({
  currentUserName,
  schoolAdminName,
  classTypeName,
  classTimeName,
  classLink, // Relevant links for class interests.
  memberLink
}) {
  let to;
  if(platform == 'local'){
    to='ramesh.bansal@daffodilsw.com';
  }
  else {
    to = config.skillshapeAdminEmail;
  }
  if (Meteor.isServer) {
    Email.send({
      to: to, // Replace value of `to` with Admin email if Admin exists.
      from: config.fromEmailForJoiningClass,
      subject: "Join Class Request Recieved",
      html: `Hi ${schoolAdminName}, <br/><b>${currentUserName}</b> has showed interest in joining your class: <b>${classTypeName}</b> , <b>${classTimeName}</b>.
                <br/>You can visit the following link OR links to know more about this request:
                ${
                  classLink
                    ? `<a href=${classLink} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Link to Class</a><br/>`
                    : ""
                }
                ${
                  memberLink
                    ? `<a href=${memberLink} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Link to Member</a><br/>`
                    : ""
                }
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
  modifyUsersRoles,
  To
) {
  if (Meteor.isServer) {
    const schoolOwnerName = getUserFullName(schoolAdminRec);
    if (!To) {
      To = config.skillshapeAdminEmail;
    }
    let to;
  if(platform == 'local'){
    to='ramesh.bansal@daffodilsw.com';
  }
  else if(platform == 'dev'){
    to = config.skillshapeAdminEmail;
  }
  else{
    to=To ? To : config.skillshapeAdminEmail
  }
    Email.send({
      to: to, // Replace value of `to` with Admin email if Admin exists.
      from: config.fromEmailForJoiningClass,
      subject: "Claim A school request received",
      html: `
                    Hi${schoolOwnerName || ""},<br/>
                   <b>${
                     claimSchoolData.userName
                   }</b> has requested permission to manage <b>${
                    school && school.name
      }</b>. You are listed as the admin. <br/>Do you approve this?<br/><br/>
                   <div>
                       <a href=${
                         modifyUsersRoles.keepMeSuperAdmin
                       } style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Yes, make them an Admin, and keep me as SuperAdministrator.</a><br/>
                       <a href=${
                         modifyUsersRoles.makeRequesterSuperAdmin
                       } style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Yes, make them SuperAdministrator and keep me as an Administrator.</a><br/>
                       <a href=${
                         modifyUsersRoles.removeMeAsAdmin
                       } style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Yes, make them SuperAdministrator and remove me as Administrator.</a><br/>
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
    let to;
  if(platform == 'local'){
    to='ramesh.bansal@daffodilsw.com';
  }
  else {
    to = config.skillshapeAdminEmail;
  }
 
    Email.send({
      to: to, // Replace value of `to` with Admin email if Admin exists.
      from: config.fromEmailForJoiningClass,
      subject: "Confirmation regarding your school claim request received",
      html: `Hi ${(userRec && userRec.profile.firstName) || ""},<br/>
                We have sent your request to the email on file for ${
                  school.name
                }. We will resolve this as soon as possible.
                <br/><br/>
                <br/><br/>
                ${EmailSignature}`
    });
  }
};

//NOTE : Unifying the request emails.
// export const sendClassTimesRequestEmail = function({
//     toEmail,
//     fromEmail,
//     schoolPageLink,
//     updateClassTimesLink,
//     memberLink,
//     ownerName,
//     classTypeName,
//     currentUserName
// }) {
//     if (Meteor.isServer) {
//         Email.send({
//             to: toEmail, //emailObj.to
//             from: fromEmail,
//             replyTo: "Notices@SkillShape.com",
//             subject: "Schedule request received",
//             html: `Dear ${ownerName}, <br />${currentUserName} ${memberLink || ''}
//             saw your listing on SkillShape.com ${classTypeName && `for ${classTypeName} `}
//             at <br />${schoolPageLink} <br /> and would you like to update your schedule <br />${updateClassTimesLink}
//             <br />
//             <br />
//             Thanks,
//             <br />
//             <br />
//             ${EmailSignature}`
//         });
//     }
// };

export const sendClassTimesRequest = function({
  currentUserData,
  schoolOwnerData,
  superAdminData,
  schoolId,
  classTypeName
}) {
  let emailObj = {};
  if (schoolOwnerData && currentUserData) {
    const schoolOwnerName = getUserFullName(schoolOwnerData);
    const userName = getUserFullName(currentUserData);
    emailObj.to = schoolOwnerData.emails[0].address;
    emailObj.subject = "Class Interest";
    emailObj.text = `Hi ${schoolOwnerName}, \n${userName} is interested in learning more about your ${classTypeName} class. \nPlease click this link to update your listing: \n${Meteor.absoluteUrl(
      `SchoolAdmin/${schoolId}/edit`
    )} \n\nThanks, \n\n${EmailSignature}`;
  } else {
    emailObj.to = superAdminData.emails[0].address;
    const schoolData = School.findOne({ _id: schoolId });
    (emailObj.subject = "School Admin not found"),
      (emailObj.text = `Hi SuperAdmin, \nCorresponding to this school ${
        schoolData.name
      } there is no admin assign yet \n\nThanks, \n\n${EmailSignature}`);
  }
  if (Meteor.isServer) {
    let to;
  if(platform == 'local'){
    to='ramesh.bansal@daffodilsw.com';
  }
  else {
    to = config.skillshapeAdminEmail;
  }
  
    Email.send({
      to: to, //emailObj.to
      from: "Notices@SkillShape.com",
      replyTo: "Notices@SkillShape.com",
      subject: emailObj.subject,
      html: emailObj.text
    });
  }
};

export const sendEmailToStudentForClassTypeUpdation = function(
  userData,
  schoolData,
  classTypeName,
  subject
) {
  if (Meteor.isServer) {
    let to;
    if(platform == 'local'){
      to='ramesh.bansal@daffodilsw.com';
    }
    else {
      to = config.skillshapeAdminEmail;
    }
   
    const userName = getUserFullName(userData);
    Email.send({
      to: to, //userData.emails[0].address
      from: "Notices@SkillShape.com",
      subject: subject,
      html: `${userName}, <br/>${
        schoolData.name
      } has updated their listing for ${classTypeName}. Please go to <br/> ${Meteor.absoluteUrl(
        `schools/${schoolData.slug}`
      )} to view their new information and join the class! <br/><br/>Thanks, <br/><br/>${EmailSignature}`
    });
  }
};

// This function is used to send user registration email and email verification link together.
export const userRegistrationAndVerifyEmail = function(
  user,
  verificationToken,
  passwd,
  fromEmail,
  toEmail,
  schoolName
) {
  Email.send({
    from: fromEmail,
    to: toEmail,
    replyTo: fromEmail,
    subject: "SkillShape Registration",
    html: `Hi ${user.profile.firstName || user.profile.name},
            <br/><br/>
                Your Email: ${user.emails[0].address} has been registered ${schoolName ? `with ${schoolName}` : ''}.
            <br/>
                Please click on the button below to verify your email address and set your password.
            <br/><br/>
            <div>
               <a href=${verificationToken} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Set Password</a>
            </div>
            <br/><br/>
                If the link doesn't work, copy and paste this address into your browser.
            <br/>
                ${verificationToken}
            <br/>
                Your temporary password is  : ${passwd}
            <br/>
            <br/><br/>Thanks, <br/><br/>${EmailSignature}`
  });
};

//NOTE: Unifying request emals.
// export const sendPriceInfoRequestEmail = function({
//     toEmail,
//     fromEmail,
//     schoolPageLink,
//     updatePriceLink,
//     memberLink,
//     ownerName,
//     classTypeName,
//     currentUserName
// }) {
//
//     if (Meteor.isServer) {
//         Email.send({
//             to: toEmail, //emailObj.to
//             from: fromEmail,
//             replyTo: "Notices@SkillShape.com",
//             subject: "Pricing info request received",
//             html: `Dear ${ownerName}, <br />${currentUserName} ${memberLink || ''} saw your listing on SkillShape.com ${classTypeName && `for ${classTypeName} `}at <br />${schoolPageLink} <br /> and would you like to update your pricing <br />${updatePriceLink}
//             <br />
//             <br />
//             Thanks,
//             <br />
//             <br />
//             ${EmailSignature}`
//             // html: `Hi ${ownerName}, \n${currentUserName} is interested in learning more about your prices. \nPlease click this link to update your listing: \n${updatePriceLink}
//             // \n\nThanks, \n\n${EmailSignature}`
//         });
//     }
// };

export const sendEmailForSubscription = function({
  toEmail,
  fromEmail,
  subject,
  updateFor,
  currentUserName,
  unsubscribeLink,
  joinSkillShapeLink
}) {
  if (Meteor.isServer) {
    Email.send({
      to: toEmail, //emailObj.to
      from: fromEmail,
      replyTo: "Notices@SkillShape.com",
      subject: subject,
      html: `Dear ${currentUserName},<br /> You have joined the SkillShape list in order to get updates for ${updateFor}.
          <br />If you don't remember signing up, click here:
          <br />${unsubscribeLink}
          <br />
          <br />
          If you want to join SkillShape to register for classes, manage your media, and connect with other members. (FREE membership!), click here:
          <br />${joinSkillShapeLink}
          <br />
          <br />Thanks,
          <br />
          <br />
          ${EmailSignature}`
    });
  }
};

export const sendEmailToStudentForPriceInfoUpdate = function(
  userData,
  schoolData
) {
  
  if (Meteor.isServer) {
    const userName = getUserFullName(userData);
    Email.send({
      to: userData.emails[0].address || "sam@skillshape.com", // Needs to replace this with requester's Email.
      from: "Notices@SkillShape.com",
      subject: "School has updated pricing info",
      html: `Hi ${userName}, \n${
        schoolData.name
      } has updated their prices. Please go to \n ${Meteor.absoluteUrl(
        `SchoolAdmin/${schoolData._id}/edit`
      )} to view their new information! \n\nThanks, \n\n${EmailSignature}`
    });
  }
};
// Click <b>${newlyCreatedUser ? "Claim your account" : "To accept the invitation"}</b> to accept the invitation :<br/>

export const sendEmailToStudentForClaimAsMember = function(
  currentUserData,
  schoolData,
  user,
  passwd,
  fromEmail,
  toEmail,
  ROOT_URL,
  rejectionUrl,
  newlyCreatedUser
) {
  if (Meteor.isServer) {
    const adminName = getUserFullName(currentUserData);
    const userName = getUserFullName(user);
    Email.send({
      to: toEmail,
      from: fromEmail,
      subject: "School member invitation received",
      html: `
        Hi ${userName},<br/>
        ${adminName} from ${schoolData.name}  has invited you to claim your account on <a href="https://www.skillshape.com/">skillshape.com</a>.
            <br/>
            <div>
              <center><a href=${ROOT_URL} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">
                ${newlyCreatedUser ? "Click here to claim and accept the invitation" : "Click here to join "+ schoolData.name}
              </a></center>
              <br/>
               ${ rejectionUrl
                   ? `<center> 
                        <a href=${rejectionUrl} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">
                          If this is a mistake, click here to reject the invitation
                        </a>
                      </center><br/>`
                   : ""
               }
            </div>
            ${ passwd
                ? `Your temporary password is  : ${passwd} You will be asked to make your own when you click the link above.`
                : ""
            }
             \n\nThanks, \n\n${EmailSignature}`
    });
  }
};

// NOTE: This email is used to send request received in case of class type location, times, and then pricing.
export const sendRequestReceivedEmail = function({
  toEmail,
  fromEmail,
  schoolPageLink,
  updateLink,
  memberLink,
  ownerName,
  requestFor,
  classTypeName,
  currentUserName
}) {
  if (Meteor.isServer) {
    Email.send({
      to: toEmail, //emailObj.to
      from: fromEmail,
      replyTo: "Notices@SkillShape.com",
      subject: `${requestFor} request received`,
      html: `Dear ${ownerName}, <br />${currentUserName} ${memberLink || ""}
            saw your listing on SkillShape.com ${classTypeName &&
              `for ${classTypeName} `}
            at <br />${schoolPageLink} <br /> and would you like to update your ${requestFor} <br />${updateLink}
            <br />
            <br />
            Thanks,
            <br />
            <br />
            ${EmailSignature}`
    });
  }
};

export const sendClassTypeLocationRequestEmail = function({
  toEmail,
  fromEmail,
  updatePriceLink,
  ownerName,
  currentUserName
}) {
  if (Meteor.isServer) {
    Email.send({
      to: "ramesh.bansal@daffodilsw.com", //emailObj.to
      from: fromEmail,
      replyTo: "Notices@SkillShape.com",
      subject: "Class Type location request received",
      html: `Hi ${ownerName}, \n${currentUserName} is interested in learning more about your prices. \nPlease click this link to update your listing: \n${updatePriceLink}
            \n\nThanks, \n\n${EmailSignature}`
    });
  }
};

export const sendEmailToSchool = function(
  message,
  studentName,
  contactName,
  schoolData,
  subject,
  yourEmail,
  yourName
) {
  let to;
  if(platform == 'local'){
    to ='ramesh.bansal@daffodilsw.com';
  }
  else if(platform == 'dev'){
    to = config.skillshapeAdminEmail;
  }
  else{
    to = schoolData.email;
  }
  if (Meteor.isServer) {
    Email.send({
      to:  to, // Needs to replace this with requester's Email.
      from: "Notices@SkillShape.com",
      subject: subject,
      html: `Hi, ${contactName}<br/>
                   ${yourEmail ? `User Email: ${yourEmail}<br/>` : ""}
                   ${yourName ? `User Name:${yourName}<br/>` : ""}
                   ${studentName} saw your listing on SkillShape.com ${Meteor.absoluteUrl(
        `schools/${schoolData.slug}`
      )} and has the following message for you:
                   <br/> ${message} <br/>Thanks, <br/>${EmailSignature}`
    });
  }
};
//Send email to student when their package is expired
export const sendPackageExpiredEmail = (To, userName, packageName) => {
  let to;
  if(platform == 'local'){
    to ='ramesh.bansal@daffodilsw.com';
  }
  else if(platform == 'dev'){
    to = config.skillshapeAdminEmail;
  }
  else{
    to = To;
  }
  Email.send({
    to: to, // Needs to replace this with requester's Email.
    from: "Notices@SkillShape.com",
    subject: "Skillshape Package Expired",
    html: `Hi  ${userName}<br/>
             your ${packageName} is expired today.To continue our services you have to buy a new package.<br/>
             Thanks<br/>${EmailSignature}`
  });
};
//Send email to school when their student package is expired.
export const sendPackageExpiredEmailToSchool = (schoolName, schoolEmail, userName, userEmail, packageName) => {
  let to;
  if(platform == 'local'){
    to ='ramesh.bansal@daffodilsw.com';
  }
  else if(platform == 'dev'){
    to = config.skillshapeAdminEmail;
  }
  else{
    to = schoolEmail;
  }
  Email.send({
    to: to, // Needs to replace this with requester's Email.
    from: "Notices@SkillShape.com",
    subject: "Student Package Expired",
    html: `Hi  ${schoolName}<br/>
             your student name ${userName} and email Id ${userEmail} 's package name ${packageName} is expired today.
             Thanks<br/>${EmailSignature}`
  });
};
// send email notification to school when student successfully purchased a package.
export const sendPackagePurchasedEmailToStudent = ( userName, userEmail, packageName) => {
  let to;
  if(platform == 'local'){
    to ='ramesh.bansal@daffodilsw.com';
  }
  else if(platform == 'dev'){
    to = config.skillshapeAdminEmail;
  }
  else{
    to = userEmail;
  }
  Email.send({
    to: to, // Needs to replace this with requester's Email.
    from: "Notices@SkillShape.com",
    subject: "Package Purchased successfully",
    html: `Hi  ${userName}<br/>
             You have successfully purchased package name ${packageName}.Thank you for using skillshape.com .<br/>
             We hope you will come again soon.
             Thank you for using skillshape.com <br/>${EmailSignature}`
  });
};

// send email notification to student when student successfully purchased a package.
export const sendPackagePurchasedEmailToSchool = (schoolName, schoolEmail, userName, userEmail, packageName) => {
  let to;
  if(platform == 'local'){
    to ='ramesh.bansal@daffodilsw.com';
  }
  else if(platform == 'dev'){
    to = config.skillshapeAdminEmail;
  }
  else{
    to = schoolEmail;
  }
  Email.send({
    to: to, // Needs to replace this with requester's Email.
    from: "Notices@SkillShape.com",
    subject: "New Package Purchased by Student",
    html: `Hi  ${schoolName}<br/>
             Your student name ${userName} and email Id ${userEmail} 's package name ${packageName} is purchased successfully.
             Thank you for using skillshape.com <br/>${EmailSignature}`
  });
};
export const sendSkillShapeJoinInvitation = (to,userName,schoolName,password)=>{
  Email.send({
    to: to, // Needs to replace this with requester's Email.
    from: "Notices@SkillShape.com",
    subject: "SkillShape Join Invitation",
    html: `Hi  ${userName}<br/>
              School ${schoolName} want you to become admin of their school on skillShape.<br/>
              Please Join Skillshape by Clicking Here.<a href=${Meteor.absoluteUrl()} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Join Skillshape</a> <br/>
              Your Temporary password is this :- ${password}       
    `
  })
}
export const adminInvitation = (to,userName,schoolName,action,adminName)=>{
  let content;
  if(action=='add'){
    content=`Hi ${userName}<br/>
    ${adminName} from ${schoolName} added you as an admin to their school on skillShape.<br/>
     This will allow you to manage classes, members, and much more. To log in, click the button below.<br/>
     <a href=${Meteor.absoluteUrl()} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Skillshape</a>        
     <br/>
     Thanks<br/>
     The SkillShape Team<br/>
    `;
  }
  else{
    content=`Hi ${userName}
    You have been removed as an admin from ${schoolName} on skillShape. If you believe this is a mistake,<br/>
     contact the administrator of the school.<br/>
     <a href=${Meteor.absoluteUrl()} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Skillshape</a>        
     <br/>
    Thanks<br/>
    The SkillShape Team<br/>
    `;
  }
  Email.send({
    to: to, // Needs to replace this with requester's Email.
    from: "Notices@SkillShape.com",
    subject: `SkillShape Admin ${action =='add'? "Invitation" : "Removal"}`,
    html: content
  })
}
export const sendEmailToRequester = (userEmail,userName,schoolName)=>{
  let to;
  if(platform == 'local'){
    to ='ramesh.bansal@daffodilsw.com';
  }
  else if(platform == 'dev'){
    to = config.skillshapeAdminEmail;
  }
  else{
    to = userEmail;
  }
  Email.send({
    to: to, // Needs to replace this with requester's Email.
    from: "Notices@SkillShape.com",
    subject: "School Claim Request Rejected",
    html: `Hi  ${userName}<br/>
              You have requested for claim the ${schoolName}. We have sent your request to <br/>
              the ${schoolName} administrators and they have not responded.If you believe <br/>
              there is an error you can try your request again or contact the school directly.<br/>
              Thanks<br/>
              The SkillShape Team<br/>
              ${EmailSignature}
    `
  })
}
export const sendPackageLink = function({
  userEmail,
  userName,
  link,
  schoolName,
  className
}) {
  if (Meteor.isServer) {
    let to;
    if(platform == 'local'){
      to ='ramesh.bansal@daffodilsw.com';
    }
    else if(platform == 'dev'){
      to = config.skillshapeAdminEmail;
    }
    else{
      to = userEmail;
    }
    Email.send({
      to: to, //emailObj.to
      from: "Notices@SkillShape.com",
      subject: "Package Purchase Invitation",
      html: `Hi ${userName}<br/>
              You can <a href=${link}>click here </a> to purchase a package to join ${className} at ${schoolName}.<br/>
              Thanks.<br/>
              ${schoolName} at SkillShape.<br/>
              ${EmailSignature}

      `
    });
  }
};