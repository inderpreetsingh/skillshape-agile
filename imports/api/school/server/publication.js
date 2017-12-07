import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import Classes from "/imports/api/classes/fields";

Meteor.publish("school.getSchoolClasses", function({ is_map_view, schoolId ,user_id, coords, NEPoint, SWPoint, skill, _classPrice, _monthPrice, textSearch, limit, selectedTag }) {
    console.log("schoolId-->>",schoolId)
    console.log("is_map_view-->>", is_map_view)
    console.log("_monthPrice", _monthPrice);
    console.log("coords", coords);
    console.log("NEPoint", NEPoint);
    const classfilter = {};
    if(is_map_view && schoolId) {
        classfilter["schoolId"] = schoolId;
    }
    if (textSearch) {
        classfilter["$text"] = { $search: textSearch };
    }
    if (coords && !NEPoint && !SWPoint) {
        // place variable will have all the information you are looking for.
        var maxDistance = 50;
        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 63;
        classfilter["filters.location"] = {
            "$geoWithin": { "$center": [coords, maxDistance] }
        }
    } else if (NEPoint && SWPoint) {
        classfilter["filters.location"] = { $geoWithin: { $box: [NEPoint, SWPoint] } }
    }

    if (_classPrice) {
        let minPrice = parseInt(_classPrice[0]);
        let maxPrice = parseInt(_classPrice[1]);
        classfilter["filters.classPriceCost"] = { $gte: minPrice, $lt: maxPrice };
    }
    if (_monthPrice) {
        let minMonthPrice = parseInt(_monthPrice[0]);
        let maxMonthPrice = parseInt(_monthPrice[1]);
        classfilter["$or"] = [
            { "filters.monthlyPriceCost.oneMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.threeMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.sixMonCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.annualCost": { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { "filters.monthlyPriceCost.lifetimeCost": { $gte: minMonthPrice, $lt: maxMonthPrice } }
        ]

    }
    console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", JSON.stringify(classfilter, null, "  "));
    console.log("<<<<<<<<<<<<<<<<classfilter>>>>>>>>>>>>>>>", SLocation.find({loc: classfilter["filters.location"]}, { limit: limit || 10 }).fetch());
    let classesCursor = Classes.find(classfilter, { limit: is_map_view ? undefined : limit})
    let schoolIds = [];
    let classTypeIds = [];
    let locationIds = [];
    if((is_map_view && schoolId) || !is_map_view) {
	    classesCursor.map((classData) => {
	        schoolIds.push(classData.schoolId);
	        classTypeIds.push(classData.classTypeId);
	        locationIds.push(classData.locationId);
	    })
	    return [
	        classesCursor,
	        SLocation.find({ _id: { $in: locationIds } }),
	        ClassType.find({ _id: { $in: classTypeIds } }),
	        School.find({ _id: { $in: schoolIds } }),
	    ];
    } else {
    	classesCursor.map((classData) => {

	        locationIds.push(classData.locationId);
	    })
	    return [
	    	SLocation.find({ _id: { $in: locationIds } })
	    ]
    }
})