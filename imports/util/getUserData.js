import {get,isEmpty} from 'lodash';

export function validateImage(currentUser) {

	let imageUrl = "/images/profile.png";
	if(currentUser && currentUser.profile && currentUser.profile.pic) {
		imageUrl = currentUser.profile.pic
	}
	return imageUrl;
}

export function getUserFullName(currentUser={}) {
	let userName = "";
	if(isEmpty(currentUser)){
		currentUser = Meteor.user();
	}
	if(currentUser) {
		let name = get(currentUser, "profile.name");
		let firstName = get(currentUser, "profile.firstName");
		let lastName = get(currentUser, "profile.lastName");
		if(name) {
			userName = name;
		} else if(firstName && lastName) {
			userName = `${firstName} ${lastName}`;
		} else if(firstName) {
			userName = firstName;
		}
	}
	return userName;
}