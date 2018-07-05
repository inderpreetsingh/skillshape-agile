import SchoolSuggestion from "../fields";

Meteor.publish("schoolSuggestion.getAllSuggestions", function() {
  const user = Meteor.users.findOne({this.userId});
  if(checkMyAccess({user})) {
	  const cursor = SchoolSuggestion.find();
    return SchoolSuggestion.publishJoinedCursors(cursor,{ reactive: true }, this);
  }else {
    throw new Meteor.error("Access Denied!");
  }
});
