import SkillCategory from "../fields";


Meteor.publish("skillCategory.get", function() {
    return  SkillCategory.find({});
});