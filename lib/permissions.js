permissions = {
	school_edit_view : ["SuperAdmin"],
	modules_CUD : ["SuperAdmin"],
	classType_CUD: ["SuperAdmin", "School"],
	csvUpload_Schools: ["SuperAdmin"],
	SLocation_CUD: ["SuperAdmin","School"],
	monthlyPricing_CUD: ["SuperAdmin","School"],
	enrollmentFee_CUD: ["SuperAdmin","School"],
	classPricing_CUD: ["SuperAdmin","School"],
	ClassTimes_CUD: ["SuperAdmin","School"],
}

checkMyAccess = ({user,schoolId,viewName}) => {
	// console.log("user>>> ", JSON.stringify(user, null, 2))
  if(user && user.roles && user.roles.indexOf("Superadmin") >= 0 ) {
 	 return true;
  } else {
 	  if(user && user.profile && user.profile.schoolId && user.profile.schoolId == schoolId) {
 	  	return true;
 	  }
  }
  return viewName && permissions[viewName].indexOf("Any") >= 0;
}