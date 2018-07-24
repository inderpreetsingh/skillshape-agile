import SchoolSuggestion from "../fields";

Meteor.publish("schoolSuggestion.getAllSuggestions", function() {
  const userId = this.userId;
  const user = Meteor.users.findOne({_id: userId});
  if(checkMyAccess({user})) {
	  const cursor = SchoolSuggestion.find();
    return SchoolSuggestion.publishJoinedCursors(cursor, {reactive: true}, this);
  }else {
    throw new Meteor.error("Access Denied!");
  }
});
