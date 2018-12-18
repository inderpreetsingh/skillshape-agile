import PackageRequest from "../fields";

Meteor.publish("packageRequest.getInfoFromId", function(filter) {
  return PackageRequest.find(filter);
});
