import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import ClassType from "/imports/api/classType/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import School from "./fields";
import { sendPackagePurchaseEmail } from "/imports/api/email";
import ClaimSchoolRequest from "/imports/api/claimSchoolRequest/fields.js";
import PriceInfoRequest from "/imports/api/priceInfoRequest/fields.js";
import { sendClaimASchoolEmail } from "/imports/api/email";
import { sendConfirmationEmail } from "/imports/api/email";
import { sendPriceInfoRequestEmail } from "/imports/api/email";
import { sendEmailToStudentForClaimAsMember } from "/imports/api/email";
import { getUserFullName } from '/imports/util/getUserData';
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";

// console.log("getUserFullName -->>",getUserFullName)
Meteor.methods({
    editSchool: function(id, data) {
        console.log("editSchool >>> ", data, id);
        let schoolData = School.findOne({ _id: id });
        if (schoolData && data.name && schoolData.name !== data.name) {
            ClassType.update(
                { schoolId: id },
                { $set: { "filters.schoolName": data.name } },
                { multi: true}
            );
        }
        return School.update({ _id: id }, { $set: data });
    },
    getClassesForMap: function({ schoolId }) {
        return {
            school: School.findOne({ _id: schoolId }),
            classTypes: ClassType.find({ schoolId }).fetch()
        };
    },
    "school.getConnectedSchool": function(userId) {
        let schoolList = [];
        const user = Meteor.users.findOne({ _id: userId });
        if (
            user &&
            user.profile &&
            user.profile.classIds &&
            user.profile.classIds.length > 0
        ) {
            classIds = user.profile.classIds;
            let demand = Demand.find({
                userId: userId,
                classId: { $in: classIds }
            });
            schoolList = demand.map(function(a) {
                return a.schoolId;
            });
        }
        return School.find({ _id: { $in: schoolList } }).fetch();
    },
    "school.getMySchool": function() {
        if(this.userId) {
            return School.find({ admins: { $in: [this.userId] } }).fetch();
        }
    },
    "school.claimSchool": function(userId, schoolId) {
        const data = {};
        data.userId = userId;
        data.claimed = "Y";
        School.update({ _id: schoolId }, { $set: data });
        return Meteor.users.update(
            { _id: data.userId },
            {
                $set: {
                    "profile.schoolId": schoolId,
                    "profile.acess_type": "school"
                }
            }
        );
    },
    "school.publishSchool": function({schoolId, isPublish}) {
        ClassType.update(
            { schoolId: schoolId },
            { $set: { isPublish: isPublish },  },
            { multi: true}
        );
        return School.update(
            { _id: schoolId },
            { $set: { isPublish: isPublish } }
        );
    },
    "school.purchasePackage": function({ typeOfTable, tableId, schoolId }) {
        // Do validation
        let PricingTable = "";
        if (!typeOfTable || !tableId || !schoolId) {
            throw new Meteor.Error(
                "Some fields missing!",
                "Error while purchasing"
            );
        }
        if (typeOfTable == "MP") {
            PricingTable = MonthlyPricing;
        } else if (typeOfTable == "CP") {
            PricingTable = ClassPricing;
        } else if (typeOfTable == "EP") {
            PricingTable = EnrollmentFees;
        }
        let packageData = PricingTable.findOne(tableId);
        const packageName =
            typeOfTable == "EP" ? packageData.name : packageData.packageName;
        // if Email exists then send Email to School.
        let school = School.findOne(schoolId);
        let currentUser = Meteor.users.findOne(this.userId);
        let emailAddress = school && school.email;
        if (!emailAddress) {
            let adminUser = Meteor.users.findOne({
                "profile.schoolId": schoolId
            });
            emailAddress = adminUser.emails[0].address;
        }
        if (emailAddress) {
            sendPackagePurchaseEmail({
                packageName,
                to: emailAddress,
                buyer: currentUser.emails[0].address
            });
            return { emailSent: true };
        }
        return { emailSent: false };
    },
    "school.claimSchoolRequest": function(doc) {
        console.log("doc in claimSchoolRequest", doc);
        let currentUser = Meteor.users.findOne(doc.userId);
        let schoolData = School.findOne(doc.schoolId);
        console.log("schoolData", schoolData);
        // User's claim requests exists already in DB then need to send this message to user.
        const pendingClaimRequest = ClaimSchoolRequest.findOne({
            userId: doc.userId,
            status: "pending",
            schoolId: doc.schoolId
        });
        const rejectedClaimRequest = ClaimSchoolRequest.findOne({
            userId: doc.userId,
            status: "rejected",
            schoolId: doc.schoolId
        });
        console.log("pendingClaimRequest", pendingClaimRequest);
        console.log("rejectedClaimRequest", rejectedClaimRequest);
        // Claim request status is pending
        if (pendingClaimRequest) {
            return { pendingRequest: true };
        } else if (rejectedClaimRequest) {
            return { alreadyRejected: true };
        } /*else if (currentUser.profile && currentUser.profile.schoolId) {
            return { alreadyManage: true };
        }*/
        console.log("doc===>",doc)
        // No school email exists then just Make the user Admin of that school by System.
        if (!schoolData.email && !schoolData.superAdmin) {
            let data = {};
            let schoolEmail = currentUser.emails ? currentUser.emails[0].address : currentUser.services.google.email ;

            data.admins = [this.userId];
            data.superAdmin = this.userId
            data.claimed = "Y";
            data.email = schoolEmail;
            doc.schoolEmail = schoolEmail;
            School.update({ _id: schoolData._id }, { $set: data });
            console.log("====After School update ===")

            let x = Meteor.users.update(
                { _id: doc.userId },
                {
                    $addToSet: {
                        "profile.schoolId": { $each: [doc.schoolId] },
                    }
                }
            );
            console.log("xxxxxxxxxxxxxxx",x)
            doc.status = "approved";
            doc.approvedBy = "superadmin";
            doc.createdAt = new Date();
            ClaimSchoolRequest.insert(doc);
            return { claimRequestApproved: true };
        } else {
            doc.userName = getUserFullName(currentUser);
            doc.createdAt = new Date();
            doc.status = "pending";
            let claimRequestId = ClaimSchoolRequest.insert(doc);
            let schoolAdminUser = Meteor.users.findOne({
                "emails.address": doc.schoolEmail
            });
            let manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&schoolRegister=true`;
            /*User is school Admin in this case we need to send that user to school admin page if user login otherwise
            let him login and then redirect to school admin page.*/
            if (schoolAdminUser) {
                manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&redirectUrl=SchoolAdmin/${doc.schoolId}/edit&type=reject`;
            }
            let ROOT_URL = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}`;
            let schoolAdminRec = Meteor.users.findOne(schoolData.userId);

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
            }

            sendClaimASchoolEmail(
                doc,
                ROOT_URL,
                manageBySelfUrl,
                schoolAdminRec,
                schoolData,
                modifyUsersRoles
            );
            sendConfirmationEmail(currentUser, schoolData);
            return { emailSuccess: true };
        }
    },
    "school.approveSchoolClaimRequest": function(claimRequestId, status) {
        if(!this.userId) {
            return;
        }
        let claimRequestRec = ClaimSchoolRequest.findOne(claimRequestId);
        /*
             ***** `status` can be one of the following:****
             * Keep Me SuperAdmin and Make Requester Admin.
             * Keep me Admin and Make Requester Super Admin.
             * Make Requester Super Admin and remove me admin.
             * rejected.
             * approved.
         */
        let schoolData = School.findOne(claimRequestRec.schoolId);
        schoolData && delete schoolData._id
        let approveRequest = false;
        if (status && status.keepMeSuperAdmin) {
            // Just keep me as a Super Admin.
            schoolData.superAdmin = this.userId;
            // Make requester as an admin.
            let existingAdmins = schoolData.admins && schoolData.admins.length > 0 ? schoolData.admins : [];
            existingAdmins.push(claimRequestRec.userId);
            schoolData.admins = existingAdmins;
            approveRequest = true;

        } else if (status && status.removeMeAsAdmin) {
            approveRequest = true;
            // Just Make Requester as a Super Admin and Remove me as an admin.
            schoolData.superAdmin = claimRequestRec.userId;
            if(claimRequestRec.userEmail) {
                schoolData.email = claimRequestRec.userEmail;
            }
            // Remove me as an admin.
            if(schoolData.admins && _.contains(schoolData.admins, this.userId)) {
                let index = schoolData.admins.indexOf(this.userId);
                let modifiedAdmins;
                // Remove me as an admin so just pull my user id from `admins` of `School` rec
                if (index > -1) {
                    modifiedAdmins = schoolData.admins.filter(function(item) {
                                        return item !== schoolData.admins[index];
                                    });
                }
                schoolData.admins = modifiedAdmins;
                if(claimRequestRec.userEmail) {
                    schoolData.email = claimRequestRec.userEmail;
                }
            }
        } else if (status && status.makeRequesterSuperAdmin) {
            approveRequest = true;
            // Make Requester Super Admin.
            schoolData.superAdmin = claimRequestRec.userId;
            // Make me as an admin.
            let existingAdmins = schoolData.admins && schoolData.admins.length > 0 ? schoolData.admins : [];
            existingAdmins.push(claimRequestRec.userId);
            schoolData.admins = existingAdmins;
        } else if (!status) {
            // Just approve the request.
            approveRequest = true;
        }
        // Approve Request case:
        if (approveRequest) {

            // Needs to update role and Email in `Users` rec.
            School.update({ _id: claimRequestRec.schoolId }, {$set:schoolData});

            Meteor.users.update({ _id: claimRequestRec.userId }, {
                $addToSet: {
                    "profile.schoolId": { $each: [claimRequestRec.schoolId] },
                }
            });

            ClaimSchoolRequest.update({ _id: claimRequestId }, {
                $set: {
                    status: "approved"
                }
            });

        } else {
            // Just reject the request.
            ClaimSchoolRequest.update({ _id: claimRequestId }, {
                $set: {
                    status: "rejected"
                }
            });
        }
    },
    "school.requestPricingInfo": function(schoolData) {
        if (this.userId && schoolData._id) {
            console.log("classTimesRequest.notifyToSchool -->>", schoolData._id)
            const schoolId = schoolData._id;
            // Check if reuest for this user already exist in DB then just update `notification` and send Email.
            const priceInfoRequest = PriceInfoRequest.findOne({schoolId, userId: this.userId });
            console.log("priceInfoRequest -->>",priceInfoRequest)
            if(priceInfoRequest) {
                if(priceInfoRequest.notification) {
                    throw new Meteor.Error("You pricing request has already been created!!!");
                }
                // Update `notification: true` in `PriceInfoRequest` so that duplicate entries not created for `PriceInfoRequest`;
                PriceInfoRequest.update({_id:priceInfoRequest._id},{$set:{notification: true}});
            } else {
                const requestObj = {
                    schoolId,
                    createdAt: new Date(),
                    notification: true,
                    userId: this.userId,
                }
                PriceInfoRequest.insert(requestObj);

                let superAdminData;
                const currentUserData = Meteor.users.findOne({_id: this.userId});
                const schoolOwnerData = Meteor.users.findOne({"profile.schoolId": schoolId});

                if(!schoolOwnerData) {
                    superAdminData = Meteor.users.findOne({"roles": "Superadmin"});
                }
            }
            // Send Email to Admin of School if admin available
            const toEmail = 'sam@skillshape.com'; // Needs to replace by Admin of School
            const fromEmail = 'Notices@SkillShape.com';
            const updatePriceLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolData._id}/edit`;
            let ownerName;
            if(schoolData && schoolData.userId) {
                // Get Admin of School As school Owner
                let adminUser = Meteor.users.findOne(schoolData.userId);
                ownerName= getUserFullName(adminUser);
            }
            if(!ownerName) {
                // Owner Name will be Sam
                ownerName = 'Sam'
            }
            let currentUser = Meteor.users.findOne(this.userId);
            let currentUserName = getUserFullName(currentUser);
            sendPriceInfoRequestEmail({toEmail,fromEmail,updatePriceLink, ownerName, currentUserName});
            return {emailSent:true};

        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    /*** This function is used to add a school member in `School`.
      * Here we check if user not exist then need to create new user and send invitation
      * to this user so that it can become active member by clicking on it.
      * if user is already a skillshape user then just make them as a member of School.
    */
    "school.addNewMember": function(doc) {
        // Validations
        const schoolAdminRec = Meteor.users.findOne({ "profile.schoolId": doc.schoolId });
        const currentUserData  = Meteor.users.findOne(this.userId);
        console.log("currentUserData",currentUserData);
        console.log("doc",doc);
        // Admin needs to login and should not be able to create members with their own email.
        if (!this.userId || !schoolAdminRec) {
            throw new Meteor.Error("You are not allowed to add a new member!!");
        } else if((currentUserData && (doc.email == currentUserData.emails[0].address))) {
            throw new Meteor.Error("You cannot add yourself as a member!!");
        }else {
            const userRecExist = Meteor.users.findOne({ "emails.address": doc.email });
            let insertMember, memberDetail, newlyCreatedUser;
            // Not an active user in skillshape then need to create user and add them as a member of a particular class in a School.
            if (!userRecExist) {
                doc.sendMeSkillShapeNotification = true;
                doc.name = doc.firstName;
                newlyCreatedUser = Meteor.call("user.createUser", { ...doc, signUpType: 'member-signup' });
                doc.activeUserId = newlyCreatedUser.user._id;
            } else {
                // User is already a member in skillshape then need to make them as a School member if they are not member in a Class.
                let filters = { email: doc.email, schoolId: doc.schoolId };

                if (isArray(doc.classIds)) {
                    filters.classIds = { $in: doc.classIds }
                }

                memberDetail = SchoolMemberDetails.findOne(filters);

                if (!memberDetail) {
                    doc.activeUserId = (userRecExist && userRecExist._id) || (googleUserRec && googleUserRec._id);
                } else {
                    insertMember = true;
                }

            }
            if (!insertMember) {
                doc.createdBy = this.userId;
                doc.inviteAccepted = false;
                // Create new member
                let memberId = SchoolMemberDetails.insert(doc);

                // console.log("doc======>", doc)
                let claimingMemberRec = Meteor.users.findOne({ _id: doc.activeUserId });
                let password = newlyCreatedUser ? newlyCreatedUser.password : null;
                let fromEmail = "Notices@SkillShape.com";

                console.log("claimingMemberRec", claimingMemberRec)
                // To: can be from user's email OR from google services
                let toEmail = get(claimingMemberRec, "emails[0].address") || get(claimingMemberRec, "google.services.email");

                let ROOT_URL = `${Meteor.absoluteUrl()}?acceptInvite=${true}&memberId=${memberId}&schoolId=${doc.schoolId}`
                let rejectionUrl;
                // Active member found, then need to send notification to the member with a button to reject the school.
                if(!newlyCreatedUser) {
                    rejectionUrl = `${Meteor.absoluteUrl()}?rejectInvite=${true}&memberId=${memberId}&schoolId=${doc.schoolId}`
                }
                // const currentUserData = Meteor.users.findOne({ _id: this.userId });
                const schoolData = School.findOne(doc.schoolId);
                /*Need to send Email to User so that they get confirmation that their account has been
                linked as a member in School.*/
                sendEmailToStudentForClaimAsMember(currentUserData, schoolData, claimingMemberRec, password, fromEmail, toEmail, ROOT_URL, rejectionUrl);
                return { addedNewMember: true };
            } else {
                throw new Meteor.Error("Member Already exist!!");
            }
        }
    },
    // This is used to save admin notes in School Members.
    "school.saveAdminNotesToMember" : function(doc) {
        // Validations
        // Only school admin can add a new Memeber.
        console.log("saveAdminNotesToMember",doc)
        doc.updatedBy = this.userId;
        const schoolAdminRec = Meteor.users.findOne({"profile.schoolId": doc.schoolId});
        if(!schoolAdminRec) {
            return {accessDenied:true};
        }
        SchoolMemberDetails.update({_id:doc.memberId},{$set:{adminNotes:doc.adminNotes}});
        return {updatedNotes:true};
    },
    "school.updateInviteAcceptedToMemberRec": function({memberId,schoolId,acceptInvite}) {
        let schoolMemberDetails = SchoolMemberDetails.find({_id:memberId,schoolId:schoolId});
        let currentUser = Meteor.users.findOne(this.userId);
        let email = (currentUser.emails && currentUser.emails[0].address) || currentUser.services.google.email;
        if(this.userId && schoolMemberDetails.email == email) {
            SchoolMemberDetails.update({_id:memberId},{$set:{inviteAccepted:true}});
        } else {
            return {memberLogin:false};
        }
        return {inviteAccepted:true};
    },
    "school.addNewSchool": function(doc) {
        const currentUser = doc || Meteor.users.findOne(this.userId);
        if(!this.userId) {
            throw new Meteor.Error(
                "Access denied",
                "Error while adding new school"
            );
        }
        const schoolInsertDoc = {
            email: currentUser.emails.address,
            isPublish: true,
            superAdmin: currentUser._id,
            admins: [currentUser._id],
            aboutHtml:"",
            descHtml:"",
            name:"my-school"
        }
        let schoolId = School.insert(schoolInsertDoc);
        // Needs to make current user admin of this School.
        Meteor.users.update(
            { _id: this.userId },
            {
                $addToSet: {
                    "profile.schoolId": schoolId,
                }
            }
        );
        let schoolEditViewLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolId}/edit`;
        return schoolEditViewLink;
    },
    "school.addNewMemberWithoutEmail": function(doc) {
        const schoolAdminRec = Meteor.users.findOne({ "profile.schoolId": doc.schoolId });
        const currentUserRec = Meteor.users.findOne({ _id: this.userId });
        let schoolIds = [];
        if (currentUserRec) {
            schoolIds = get(currentUserRec, "profile.schoolId");
        }
        // Member insertion is allowed only to School Admin.
        if (this.userId && schoolAdminRec && (schoolAdminRec._id == this.userId || _.contains(schoolIds, doc.schoolId))) {
            doc.createdBy = this.userId;
            doc.inviteAccepted = false;
            let memberId = SchoolMemberDetails.insert(doc);
            return { addedNewMember: true };
        } else {
            throw new Meteor.Error("Access Denied!!!!");
        }
    }
});


/*name, email, userType, sendMeSkillShapeNotification*/
