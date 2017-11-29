import Media from "../fields";

Meteor.publish("media.getMedia", function({ schoolId }) {
	
	return Media.find({schoolId});
});