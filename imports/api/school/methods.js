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

Meteor.methods({
    editSchool: function(id, data) {
        console.log("editSchool >>> ", data, id);
        let schoolData = School.findOne({ _id: id });
        if (schoolData && data.name && schoolData.name !== data.name) {
            ClassType.update(
                { schoolId: id },
                { $set: { "filters.schoolName": data.name } }
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
    "school.getMySchool": function(school_id, userId) {
        console.log("school.getMySchool -->>", school_id);
        school = School.findOne({ _id: school_id });
        if (school) {
        } else {
            Meteor.users.update(
                { _id: userId },
                { $set: { "profile.schoolId": " " } }
            );
        }
        return School.find({ _id: school_id }).fetch();
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
    "school.publishSchool": function(schoolId, is_publish) {
        return School.update(
            { _id: schoolId },
            { $set: { is_publish: is_publish } }
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
        let pendingClaimRequest = ClaimSchoolRequest.findOne({
            userId: doc.userId,
            status: "pending"
        });
        let rejectedClaimRequest = ClaimSchoolRequest.findOne({
            userId: doc.userId,
            status: "rejected",
            schoolId: doc.schoolId
        });
        console.log("pendingClaimRequest", pendingClaimRequest);
        console.log("rejectedClaimRequest", rejectedClaimRequest);
        // Claim request status is pending
        if (pendingClaimRequest) {
            if (pendingClaimRequest.schoolId == doc.schoolId) {
                // User's request is already pending for this school
                return { pendingRequest: true };
            } else {
                // Users can not do more than one claim request.
                return {
                    onlyOneRequestAllowed: true,
                    schoolName: pendingClaimRequest.schoolName
                };
            }
        } else if (rejectedClaimRequest) {
            return { alreadyRejected: true };
        } else if (currentUser.profile && currentUser.profile.schoolId) {
            return { alreadyManage: true };
        }
        // No school email exists then just Make the user Admin of that school by System.
        if (!doc.schoolEmail) {
            let schoolEmail = currentUser.emails[0].address;
            let data = {};
            data.userId = this.userId;
            data.claimed = "Y";
            data.email = schoolEmail;
            doc.schoolEmail = schoolEmail;
            School.update({ _id: schoolData._id }, { $set: data });
            Meteor.users.update(
                { _id: doc.userId },
                {
                    $set: {
                        "profile.schoolId": doc.schoolId,
                        "profile.acess_type": "school"
                    }
                }
            );
            doc.status = "approved";
            doc.approvedBy = "superadmin";
            doc.createdAt = new Date();
            ClaimSchoolRequest.insert(doc);
            return { claimRequestApproved: true };
        } else {
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
            sendClaimASchoolEmail(
                doc,
                ROOT_URL,
                manageBySelfUrl,
                schoolAdminRec,
                schoolData
            );
            sendConfirmationEmail(currentUser, schoolData);
            return { emailSuccess: true };
        }
    },
    "school.approveSchoolClaimRequest": function(claimRequestId, status) {
        let claimRequestRec = ClaimSchoolRequest.findOne(claimRequestId);
        console.log("approveSchoolClaimRequest", claimRequestRec, status);
        if (claimRequestRec && claimRequestRec.status != "approved") {
            let data = {};
            data.userId = claimRequestRec.userId;
            data.claimed = "Y";
            data.email = claimRequestRec.schoolEmail;
            School.update({ _id: claimRequestRec.schoolId }, { $set: data });
            Meteor.users.update(
                { _id: data.userId },
                {
                    $set: {
                        "profile.schoolId": claimRequestRec.schoolId,
                        "profile.acess_type": "school"
                    }
                }
            );
            ClaimSchoolRequest.update(
                { _id: claimRequestId },
                {
                    $set: {
                        status:
                            status && status.rejected ? "rejected" : "approved"
                    }
                }
            );
            return true;
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
                // Update `notification: false` in `PriceInfoRequest` so that duplicate entries not created for `PriceInfoRequest`;
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
                let currentUser = Meteor.users.findOne(schoolData.userId);
                ownerName= currentUser.profile.firstName;
            }
            if(!ownerName) {
                // Owner Name will be Sam
                ownerName = 'Sam'
            }
            let currentUser = Meteor.users.findOne(this.userId);
            console.log("currentUser===>",currentUser);
            if(currentUser) {
                let currentUserName = currentUser.profile.firstName;
                sendPriceInfoRequestEmail({toEmail,fromEmail,updatePriceLink, ownerName, currentUserName});
                return {emailSent:true}
            } else {
                return {login:false}
            }

        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});
