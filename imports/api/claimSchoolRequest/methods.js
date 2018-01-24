import ClaimSchoolRequest from "./fields";
import { sendClaimASchoolEmail } from "/imports/api/email";
import { sendConfirmationEmail } from "/imports/api/email";
import School from "/imports/api/school/fields";



Meteor.methods({
    "school.claimSchoolRequest": function(doc) {
        console.log("doc in claimSchoolRequest", doc)
        let currentUser = Meteor.users.findOne(doc.userId);
        let schoolData = School.findOne(doc.schoolId);
        console.log("schoolData", schoolData);
        // User's claim requests exists already in DB then need to send this message to user.
        let pendingClaimRequest = ClaimSchoolRequest.findOne({ userId: doc.userId, status: 'pending' });
        let rejectedClaimRequest = ClaimSchoolRequest.findOne({ userId: doc.userId, status: 'rejected', schoolId: doc.schoolId });
        console.log("pendingClaimRequest", pendingClaimRequest);
        console.log("rejectedClaimRequest", rejectedClaimRequest);
        // Claim request status is pending
        if (pendingClaimRequest) {
            if (pendingClaimRequest.schoolId == doc.schoolId) {
                // User's request is already pending for this school
                return { pendingRequest: true };
            } else {
                // Users can not do more than one claim request.
                return { onlyOneRequestAllowed: true, schoolName: pendingClaimRequest.schoolName };
            }
        } else if (rejectedClaimRequest) {
            return ({ alreadyRejected: true });
        } else if (currentUser.profile && currentUser.profile.schoolId) {
            return { alreadyManage: true }
        }
        // No school email exists then just Make the user Admin of that school by System.
        if (!doc.schoolEmail) {
            let schoolEmail = currentUser.emails[0].address;
            let data = {}
            data.userId = this.userId;
            data.claimed = 'Y';
            data.email = schoolEmail;
            doc.schoolEmail = schoolEmail;
            School.update({ _id: schoolData._id }, { $set: data });
            Meteor.users.update({ _id: doc.userId }, { $set: { "profile.schoolId": doc.schoolId, "profile.acess_type": "school" } });
            doc.status = 'approved';
            doc.approvedBy = 'superadmin';
            doc.createdAt = new Date();
            ClaimSchoolRequest.insert(doc);
            return { message: "Claim request approved." }
        } else {
            doc.createdAt = new Date();
            doc.status = 'pending';
            let claimRequestId = ClaimSchoolRequest.insert(doc);
            sendClaimASchoolEmail(doc, claimRequestId,schoolData.email);
            sendConfirmationEmail(doc);
            return true;
        }
    },
    'approveSchoolClaimRequest': function(claimRequestId, status) {
        let claimRequestRec = ClaimSchoolRequest.findOne(claimRequestId);
        console.log("approveSchoolClaimRequest", claimRequestRec, status);
        if (claimRequestRec && claimRequestRec.status != 'approved') {
            let data = {}
            data.userId = claimRequestRec.userId;
            data.claimed = 'Y';
            data.email = claimRequestRec.schoolEmail;
            School.update({ _id: claimRequestRec.schoolId }, { $set: data });
            Meteor.users.update({ _id: data.userId }, { $set: { "profile.schoolId": claimRequestRec.schoolId, "profile.acess_type": "school" } });
            ClaimSchoolRequest.update({ _id: claimRequestId }, { $set: { "status": status && status.rejected ? 'rejected' : 'approved' } });
            return true;
        }
    }
});