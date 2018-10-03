import ClassSubscription from "../fields";
Meteor.publish("classSubscription.findDataById",function(userId){
    return ClassSubscription.find({});
})