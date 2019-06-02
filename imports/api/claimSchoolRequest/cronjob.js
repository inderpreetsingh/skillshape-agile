import ClaimSchoolRequest from '/imports/api/claimSchoolRequest/fields';
import isEmpty from 'lodash/isEmpty';
import School from '/imports/api/school/fields';
import { sendClaimASchoolEmail, sendEmailToRequester } from '/imports/api/email';

function sendClaimSchoolEmail(doc, claimRequestId, To) {
  // Whenever a user claim for a School need to get admin user record to send email.
  const schoolAdminUser = Meteor.users.findOne({
    'emails.address': doc.schoolEmail,
  });

  // If School is managed by admin itself.
  const manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&redirectUrl=SchoolAdmin/${doc.schoolId}/edit&type=reject`;

  const ROOT_URL = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}`;

  /** Needs to handle these cases:
          1. Yes, make them an Admin, and keep me as SuperAdministrator.
          2. Yes, make them SuperAdministrator and keep me as an Administrator.
          3. Yes, make them SuperAdministrator and remove me as Administrator.
          4. No, deny their request.
          5. I have no idea what this is about.
      */
  const modifyUsersRoles = {
    keepMeSuperAdmin: `${ROOT_URL}&keepMeSuperAdmin=true`,
    makeRequesterSuperAdmin: `${ROOT_URL}&makeRequesterSuperAdmin=true`,
    removeMeAsAdmin: `${ROOT_URL}&removeMeAsAdmin=true`,
  };

  const schoolData = School.findOne({ _id: doc.schoolId });
  sendClaimASchoolEmail(
    doc,
    ROOT_URL,
    manageBySelfUrl,
    schoolAdminUser,
    schoolData,
    modifyUsersRoles,
    To,
  );

  return { emailSuccess: true };
}

// if (Meteor.isServer) {
// import ClaimSchoolEmailCronJob from "/imports/api/claimSchoolEmailCronJob/fields.js";
SyncedCron.add({
  name: 'Claim School Request Cron Job',
  schedule(parser) {
    // parser is a later.parse object
    return parser.text('at 3:27 pm');
  },
  job() {
    const pendingClaimSchoolRequest = ClaimSchoolRequest.find({ status: 'pending' }).fetch();
    if (!isEmpty(pendingClaimSchoolRequest)) {
      let emailSuccess;
      pendingClaimSchoolRequest.forEach((obj) => {
        let toField;
        const requestObj = Object.assign(obj);
        if (requestObj && requestObj.emailCount < 3) {
          requestObj.emailCount += 1;
          // This needs to be replaced with School Admin.
          if (process.env.NODE_ENV === 'development') {
            toField = 'naruto@ryaz.io';
          }
          // Update count in `ClaimSchoolRequest`.
          ClaimSchoolRequest.update({ _id: requestObj._id }, { $set: requestObj });
          emailSuccess = sendClaimSchoolEmail(requestObj, requestObj._id, toField);
        } else if (requestObj && requestObj.emailCount === 3) {
          // To: should be Super Admin.
          requestObj.emailCount += 1;
          toField = 'help@skillshape.com';
          if (process.env.NODE_ENV === 'development') {
            toField = 'naruto@ryaz.io';
          }
          ClaimSchoolRequest.update({ _id: requestObj._id }, { $set: requestObj });
          emailSuccess = sendClaimSchoolEmail(requestObj, requestObj._id, toField);
        } else if (requestObj && requestObj.emailCount === 10) {
          requestObj.emailCount += 1;
          ClaimSchoolRequest.update({ _id: requestObj._id }, { $set: requestObj });
          sendEmailToRequester(requestObj.userEmail, requestObj.userName, requestObj.schoolName);
        } else {
          requestObj.emailCount += 1;
          ClaimSchoolRequest.update({ _id: requestObj._id }, { $set: requestObj });
        }
      });
      return emailSuccess;
    }
    return null;
  },
});
// }
