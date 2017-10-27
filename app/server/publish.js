Meteor.publish("school", function() {
    return School.find({});
});
Meteor.publish("salocation", function() {
    return SLocation.find({});
});
Meteor.publish("classtype", function() {
    return ClassType.find({});
});
Meteor.publish("sclass", function() {
    return Sclass.find({});
});
Meteor.publish("priceMonth", function() {
    return Pricemonthly.find({});
});
Meteor.publish("priceClass", function() {
    return Priceclass.find({});
});