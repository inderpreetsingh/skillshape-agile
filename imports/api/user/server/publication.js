Meteor.publish("myInfo", function() {
  return Meteor.users.find({_id: this.userId});
});