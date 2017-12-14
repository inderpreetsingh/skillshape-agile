permissions = {
	school_edit_view : ["SuperAdmin"],
	modules_CUD : ["SuperAdmin"],
	classType_CUD: ["SuperAdmin"],
}

checkMyAccess = ({user,schoolId,viewName}) => {

  if(user && user.roles && user.roles.indexOf("Superadmin") >= 0 ) {
 	 return true;
  } else {
 	  if(user && user.profile && user.profile.schoolId &&user.profile.schoolId == schoolId) {
 	  	return true;
 	  }
  }
  return viewName && permissions[viewName].indexOf("Any") >= 0;
}  