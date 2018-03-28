import ClaimSchoolRequest from "/imports/api/claimSchoolRequest/fields.js";
import isEmpty from "lodash/isEmpty";
import School from "/imports/api/school/fields";
import { sendClaimASchoolEmail } from "/imports/api/email";



// if (Meteor.isServer) {
    // import ClaimSchoolEmailCronJob from "/imports/api/claimSchoolEmailCronJob/fields.js";
    SyncedCron.add({
      name: 'Crunch some important numbers for the marketing department',
      schedule: function(parser) {
        // parser is a later.parse object
        console.log("numbersCrunched",SyncedCron._collection.find().fetch());
        return parser.text('every 15 seconds');
      },
      job: function() {
        let pendingClaimSchoolRequest = ClaimSchoolRequest.find({"status" : "pending"}).fetch();
        // console.log("pendingClaimSchoolRequest",pendingClaimSchoolRequest);
        if(isEmpty(pendingClaimSchoolRequest)) {
            // Stop the crone job
            SyncedCron.stop();
        } else {
            // Pending claim school request found then need to send an email
            var numbersCrunched;
            pendingClaimSchoolRequest.forEach( (requestObj) => {
                console.log("requestObj.emailCount",typeof(requestObj.emailCount),requestObj.emailCount,requestObj.emailCount < 3)
                // console.log(requestObj && requestObj.emailCount && requestObj.emailCount < 3);
                if(requestObj && requestObj.emailCount < 3) {
                    requestObj.emailCount+=1;
                    // Update count in `ClaimSchoolRequest`.
                    ClaimSchoolRequest.update({ _id: requestObj._id }, { $set: requestObj })
                    numbersCrunched = sendClaimSchoolEmail(requestObj,requestObj._id);
                } else {
                    console.log("no need to send email as its count is 3")
                }

            })
            return numbersCrunched;
        }
      }
    });
// }

function sendClaimSchoolEmail(doc,claimRequestId) {
    let claimingUserRec = Meteor.users.findOne(doc.userId);

    // Whenever a user claim for a School need to get admin user record to send email.
    let schoolAdminUser = Meteor.users.findOne({
        "emails.address": doc.schoolEmail
    });

    // If School is managed by admin itself.
    manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&redirectUrl=SchoolAdmin/${doc.schoolId}/edit&type=reject`;

    let ROOT_URL = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}`;

    /** Needs to handle these cases:
        1. Yes, make them an Admin, and keep me as SuperAdministrator.
        2. Yes, make them SuperAdministrator and keep me as an Administrator.
        3. Yes, make them SuperAdministrator and remove me as Administrator.
        4. No, deny their request.
        5. I have no idea what this is about.
    */
    let modifyUsersRoles = {
        keepMeSuperAdmin: `${ROOT_URL}&keepMeSuperAdmin=true`,
        makeRequesterSuperAdmin: `${ROOT_URL}&makeRequesterSuperAdmin=true`,
        removeMeAsAdmin: `${ROOT_URL}&removeMeAsAdmin=true`
    };

    let schoolData = School.findOne({"_id":doc.schoolId});
    console.log("schoolData",schoolData)

    return (sendClaimASchoolEmail(
        doc,
        ROOT_URL,
        manageBySelfUrl,
        schoolAdminUser,
        schoolData,
        modifyUsersRoles
    ));
}