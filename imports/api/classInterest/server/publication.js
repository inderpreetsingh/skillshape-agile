import ClassInterest from "../fields";

Meteor.publish("classInterest.getClassInterest", function() {
	// console.log("classInterest.getClassInterest -->>",this.userId)
	if(this.userId) {
    	return ClassInterest.find({ userId: this.userId});
	}
	return [];
});