import ClassType from "/imports/api/classType/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import School from "./fields";
import {sendPackagePurchaseEmail} from "/imports/api/email";

Meteor.methods({
	editSchool: function (id, data) {
        console.log("editSchool >>> ", data, id)
        let schoolData = School.findOne({_id: id});
        if(schoolData && data.name && schoolData.name !== data.name) {
            ClassType.update({schoolId: id}, { $set:{ "filters.schoolName": data.name }})
        }
        return School.update({ _id: id }, { $set: data });
    },
	getClassesForMap: function ({schoolId}) {
		return {
			school: School.findOne({ _id: schoolId}),
		}
	},
	"school.getConnectedSchool": function (userId) {
        let schoolList = []
        const user = Meteor.users.findOne({ _id: userId });
        if (user && user.profile && user.profile.classIds && user.profile.classIds.length > 0) {
	        classIds = user.profile.classIds
	        let demand = Demand.find({ userId: userId, classId: { $in: classIds } })
	        schoolList = demand.map(function (a) {
	          return a.schoolId
	        })
        }
        return School.find({ _id: { $in: schoolList } }).fetch();
    },
    "school.getMySchool": function (school_id, userId) {
        console.log("school.getMySchool -->>",school_id);
        school = School.findOne({ _id: school_id });
        if (school) {

        } else {
        	Meteor.users.update({ _id: userId }, { $set: { "profile.schoolId": " " } });
        }
      	return School.find({ _id: school_id }).fetch();
    },
    "school.claimSchool": function (userId, schoolId) {
        const data = {}
        data.userId = userId;
        data.claimed = 'Y'
        School.update({ _id: schoolId }, { $set: data });
        return Meteor.users.update({ _id: data.userId }, { $set: { "profile.schoolId": schoolId, "profile.acess_type": "school" } });
    },
    "school.publishSchool": function (schoolId, is_publish) {

        return School.update({ _id: schoolId }, { $set: { "is_publish": is_publish } });
    },
    'school.purchasePackage': function({typeOfTable, tableId, schoolId}) {
        // Do validation
        let PricingTable = "";
        if (!typeOfTable || !tableId || !schoolId) {
            throw new Meteor.Error("Some fields missing!", "Error while purchasing");
        }
        if(typeOfTable == 'MP') {
            PricingTable = MonthlyPricing;
        } else if (typeOfTable == 'CP') {
            PricingTable = ClassPricing;
        } else if (typeOfTable == 'EP') {
            PricingTable = EnrollmentFees;
        }
        let packageData = PricingTable.findOne(tableId);
        const packageName = typeOfTable == 'EP' ? packageData.name : packageData.packageName;
        // if Email exists then send Email to School.
        let school = School.findOne(schoolId);
        let currentUser = Meteor.users.findOne(this.userId);
        let emailAddress = school && school.email;
        if (!emailAddress) {
            let adminUser = Meteor.users.findOne({'profile.schoolId': schoolId});
            emailAddress = adminUser.emails[0].address;
        }
        if(emailAddress) {
            sendPackagePurchaseEmail({packageName, to: emailAddress, buyer:currentUser.emails[0].address})
            return {emailSent: true}
        }
        return {emailSent: false};
    }
})