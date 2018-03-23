
export function checkDemoUser(currentUser) {
	if(currentUser && currentUser.profile && currentUser.profile.is_demo_user)
    return true;
  return false;
}

export function checkSuperAdmin(currentUser) {
  if(currentUser)
    return Roles.userIsInRole(Meteor.userId(),"Superadmin");
  return false;
}