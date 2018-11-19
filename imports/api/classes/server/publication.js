import Classes from "../fields";
import {get,isEmpty} from 'lodash';
Meteor.publish("classes.getClassesData", function(filter) {
try{
	let record;
	filter.scheduled_date = new Date (filter.scheduled_date);
	record = Classes.findOne(filter);
	if(isEmpty(record)){
		Classes.insert(filter);
	}
	return Classes.find(filter);
	
}catch(error){
console.log("​ error in classes.getClassesData ", error)
}
});