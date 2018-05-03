import Media from "../fields";

Meteor.publish("media.getMedia", function({ schoolId, mediaName, startDate, endDate, limit, $or }) {
	// console.log("<<<< media.getMedia called--->>>",schoolId, mediaName, startDate, endDate)
    // console.log("<<<<<<<<<<<<<<<<media.getMediafilter>>>>>>>>>>>>>>>", JSON.stringify($or, null, "  "));

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
	// Publish those media in which this `User` is tagged or created by this `User`.
	if($or) {
		filters['$or'] = $or;
	}

	let cursor = Media.find(filters, {limit: limit});
	// console.log("Final filters -->>",filters)
    return Media.publishJoinedCursors(cursor,{ reactive: true }, this);
});