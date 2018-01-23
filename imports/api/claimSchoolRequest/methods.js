import ClaimSchoolRequest from "./fields";
import {sendClaimASchoolEmail} from "/imports/api/email";
import School from "/imports/api/school/fields";



Meteor.methods({
    "school.claimSchoolRequest": function(doc) {
        console.log("doc in claimSchoolRequest",doc)
        let currentUser = Meteor.users.findOne(doc.userId);
        console.log("currentUser",currentUser)
        let schoolData = School.findOne(doc.schoolId);
        if(!doc.schoolEmail) {
            let schoolEmail = currentUser.emails[0].address;
            let data = {}
            data.userId = this.userId;
            data.claimed = 'Y'
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
            if(currentUser.profile && currentUser.profile.schoolId && currentUser.profile.schoolId.length > 1) {
                return { message: "You already manage a school. You cannot claim another School. Please contact admin for more details" }
                // toastr.error("You already manage a school. You cannot claim another School. Please contact admin for more details","Error");
              } else {
                let claimRequest = ClaimSchoolRequest.find().fetch()
                console.log("claimRequest",claimRequest)
                /*As we publish claim requests of current users only so if a claim request
                already exists then need to show this message on client.*/
                if(claimRequest && claimRequest.length> 0) {
                  return { message:"We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience."};
                }
                if(schoolData.claimed == "Y") {
                    return { message:{claimRequestModal: true} }
                }
              }
            doc.createdAt = new Date();
            ClaimSchoolRequest.insert(doc);
            sendClaimASchoolEmail(doc);
            return true;
        }
    },
});