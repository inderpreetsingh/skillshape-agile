import Media from "../fields";

Meteor.publish("media.getMedia", function({ schoolId, name, startDate, endDate, limit }) {
	// console.log("<<<< media.getMedia called--->>>",schoolId, name, startDate, endDate)
	let filters = {
		schoolId: schoolId
	};

	if(name) {
		filters["$text"] = { $search: name }
	}

	if(startDate && endDate) {
		filters.createdAt = {
			$gte: startDate,
        	$lt: endDate
		}
	}

	let cursor = Media.find(filters, {limit: limit});
	// console.log("Final filters -->>",filters)
    return Media.publishJoinedCursors(cursor,{ reactive: true }, this);
});