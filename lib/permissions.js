import {isEmpty,isArray,includes} from 'lodash';
import School from '/imports/api/school/fields.js';
permissions = {
	school_suggestions: ["SuperAdmin"],
	school_edit_view : ["SuperAdmin"],
	modules_CUD : ["SuperAdmin"],
	classType_CUD: ["SuperAdmin", "School"],
	csvUpload_Schools: ["SuperAdmin"],
	SLocation_CUD: ["SuperAdmin","School"],
	monthlyPricing_CUD: ["SuperAdmin","School"],
	enrollmentFee_CUD: ["SuperAdmin","School"],
	classPricing_CUD: ["SuperAdmin","School"],
	ClassTimes_CUD: ["SuperAdmin","School"],
	schoolMemberDetails_CUD: ["SuperAdmin","School"],
}

checkMyAccess = ({user,schoolId,viewName}) => {
	if(schoolId){
		let schoolData  = School.findOne({_id:schoolId});
		return checkIsAdmin({user,schoolData});
	}
	return false;
}
checkIsAdmin = ({user,schoolData}) => {
	if(user && user.roles && user.roles.indexOf("Superadmin") >= 0 ) {
		return true;
	}
	else if(!isEmpty(user) && !isEmpty(schoolData)){
		let { superAdmin, admins } = schoolData;
		let {_id:userId} = user;
		if(superAdmin == userId){
			return true;
		}
		else{
			return includes(admins,userId);
		}
	}
	else {
		return false;
	}
}
