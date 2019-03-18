import { get } from 'lodash';

export const sortByView = (view, collectionData) => {
	let membersByName;
	if (view == 'classmates') {
		membersByName = _.groupBy(collectionData && collectionData, function (item) {
			return get(item, 'profile.profile.firstName', get(item, 'profile.profile.name', get(item, 'profile.emails[0].address', '0')))[0].toUpperCase();
		});

	} else {
		membersByName = _.groupBy(collectionData && collectionData, function (item) {
			return get(item, 'profile.firstName', get(item, 'profile.name', get(item, 'profile.emails[0].address', '0')))[0].toUpperCase();
		});
	}

	return membersByName;
}