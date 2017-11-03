
export function validateImage(currentUser) {
	
	let imageUrl = "/images/profile.png";
	if(currentUser && currentUser.profile && currentUser.profile.pic) {
		imageUrl = currentUser.profile.pic
	}
	return imageUrl;
}