import Classes from "../fields";
import {get,isEmpty} from 'lodash';
Meteor.publish("classes.getClassesData", function(filter) {
try{
	let record;
	record = Classes.findOne(filter);
	if(isEmpty(record)){
		Classes.insert(filter);
	}
	return Classes.find(filter);
	
}catch(error){
console.log("​ error in classes.getClassesData ", error)
}
});