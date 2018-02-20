import Media from "../fields";

Meteor.publish("media.getMedia", function({ schoolId, memberId, mediaName, startDate, endDate, limit }) {
	console.log("<<<< media.getMedia called--->>>",schoolId, memberId, mediaName, startDate, endDate)
	let filters = {
		schoolId: schoolId
	};

	if(mediaName) {
		filters["$text"] = { $search: mediaName }
	}

	if(startDate && endDate) {
		filters.createdAt = {
			$gte: startDate,
        	$lt: endDate
		}
	}
	if(memberId) {
		filters.memberId = memberId;
	}

	let cursor = Media.find(filters, {limit: limit});
	// console.log("Final filters -->>",filters)
    return Media.publishJoinedCursors(cursor,{ reactive: true }, this);
});