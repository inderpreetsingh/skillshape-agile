import ClassSubscription from "../fields";
Meteor.publish("classSubscription.findDataById",function(filter={}){
    filter.status = 'inProgress';
    return ClassSubscription.find(filter);
})