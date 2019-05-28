import { check } from 'meteor/check';
import ClaimSchoolRequest from './fields';
import { sendClaimASchoolEmail, sendConfirmationEmail } from '/imports/api/email';
import { contains } from 'lodash';
import School from '/imports/api/school/fields';
import { getUserFullName } from '/imports/util/getUserData';

Meteor.methods({
  'claimSchoolRequest.createClaimSchoolRequest': (payload) => {
    check(payload, Object);
    const doc = Object.assign(payload);
    const currentUser = Meteor.users.findOne(doc.userId);
    const schoolData = School.findOne(doc.schoolId);
    const pendingClaimRequest = ClaimSchoolRequest.findOne({
      userId: doc.userId,
      status: 'pending',
      schoolId: doc.schoolId,
    });
    const rejectedClaimRequest = ClaimSchoolRequest.findOne({
      userId: doc.userId,
      status: 'rejected',
      schoolId: doc.schoolId,
    });
    // Claim request status is pending OR rejected.
    if (pendingClaimRequest) {
      return { pendingRequest: true };
    } else if (rejectedClaimRequest) {
      return { alreadyRejected: true };
    }
    // No school email exists then just Make the user Admin of that school by System.
    if (!schoolData.email && !schoolData.superAdmin) {
      const data = {};
      const schoolEmail = currentUser.emails && currentUser.emails[0].address;

      data.admins = [this.userId];
      data.superAdmin = this.userId;
      data.claimed = 'Y';
      data.email = schoolEmail;
      doc.schoolEmail = schoolEmail;
      School.update({ _id: schoolData._id }, { $set: data });

      Meteor.users.update(
        { _id: doc.userId },
        {
          $addToSet: {
            'profile.schoolId': { $each: [doc.schoolId] },
          },
        },
      );
      doc.status = 'approved';
      doc.approvedBy = 'superadmin';
      doc.createdAt = new Date();
      ClaimSchoolRequest.insert(doc);
      return { claimRequestApproved: true };
    }
    doc.userName = getUserFullName(currentUser);
    doc.createdAt = new Date();
    doc.status = 'pending';
    const claimRequestId = ClaimSchoolRequest.insert(doc);
    const schoolAdminUser = Meteor.users.findOne({
      'emails.address': doc.schoolEmail,
    });
    let manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&schoolRegister=true`;
    if (schoolAdminUser) {
      manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&redirectUrl=SchoolAdmin/${
        doc.schoolId
      }/edit&type=reject`;
    }
    const ROOT_URL = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}`;
    const schoolAdminRec = Meteor.users.findOne(schoolData.userId);

    const modifyUsersRoles = {
      keepMeSuperAdmin: `${ROOT_URL}&keepMeSuperAdmin=true`,
      makeRequesterSuperAdmin: `${ROOT_URL}&makeRequesterSuperAdmin=true`,
      removeMeAsAdmin: `${ROOT_URL}&removeMeAsAdmin=true`,
    };

    sendClaimASchoolEmail(
      doc,
      ROOT_URL,
      manageBySelfUrl,
      schoolAdminRec,
      schoolData,
      modifyUsersRoles,
    );
    sendConfirmationEmail(currentUser, schoolData);
    return { emailSuccess: true };
  },
  'claimSchoolRequest.approveSchoolClaimRequest': (
    claimRequestId,
    status,
  ) => {
    check(claimRequestId, String);
    check(status, String);
    if (!this.userId) {
      throw new Meteor.Error(
        'You need to login as a super admin of this school to approve the request',
      );
    }
    const claimRequestRec = ClaimSchoolRequest.findOne(claimRequestId);
    const schoolData = School.findOne(claimRequestRec.schoolId);
    const {superAdmin} = schoolData; 
    if (superAdmin !== this.userId) {
      throw new Meteor.Error(
        'You need to login as a super admin of this school to approve the request',
      );
    } else if (claimRequestRec.status === 'approved') {
      throw new Meteor.Error('This request has already been approved!');
    } else {
      delete schoolData._id;
      let approveRequest = false;
      if (status && status.keepMeSuperAdmin) {
        // Just keep me as a Super Admin.
        schoolData.superAdmin = this.userId;
        // Make requester as an admin.
        const existingAdmins = schoolData.admins && schoolData.admins.length > 0
          ? schoolData.admins
          : [];
        existingAdmins.push(claimRequestRec.userId);
        schoolData.admins = existingAdmins;
        approveRequest = true;
      } else if (status && status.removeMeAsAdmin) {
        approveRequest = true;
        // Just Make Requester as a Super Admin and Remove me as an admin.
        schoolData.superAdmin = claimRequestRec.userId;
        if (claimRequestRec.userEmail) {
          schoolData.email = claimRequestRec.userEmail;
        }
        // Remove me as an admin.
        if (schoolData.admins && contains(schoolData.admins, this.userId)) {
          const index = schoolData.admins.indexOf(this.userId);
          let modifiedAdmins;
          // Remove me as an admin so just pull my user id from `admins` of `School` rec
          if (index > -1) {
            modifiedAdmins = schoolData.admins.filter(item => item !== schoolData.admins[index]);
          }
          schoolData.admins = modifiedAdmins;
          if (claimRequestRec.userEmail) {
            schoolData.email = claimRequestRec.userEmail;
          }
        }
      } else if (status && status.makeRequesterSuperAdmin) {
        approveRequest = true;
        // Make Requester Super Admin.
        schoolData.superAdmin = claimRequestRec.userId;
        // Make me as an admin.
        const existingAdmins = schoolData.admins && schoolData.admins.length > 0
          ? schoolData.admins
          : [];
        existingAdmins.push(claimRequestRec.userId);
        schoolData.admins = existingAdmins;
      } else if (!status) {
        // Just approve the request.
        approveRequest = true;
      }
      // Approve Request case:
      if (approveRequest) {
        // Needs to update role and Email in `Users` rec.
        School.update({ _id: claimRequestRec.schoolId }, { $set: schoolData });

        Meteor.users.update(
          { _id: claimRequestRec.userId },
          {
            $addToSet: {
              'profile.schoolId': { $each: [claimRequestRec.schoolId] },
            },
          },
        );

        ClaimSchoolRequest.update(
          { _id: claimRequestId },
          {
            $set: {
              status: 'approved',
            },
          },
        );
        return { message: 'Request has been approved!' };
      }
      // Just reject the request.
      ClaimSchoolRequest.update(
        { _id: claimRequestId },
        {
          $set: {
            status: 'rejected',
          },
        },
      );
      return { message: 'Request has been rejected!' };
    }
  },
});
