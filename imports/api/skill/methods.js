import Skills from "./fields";

Meteor.methods({
    "getSkills": function({textSearch}) {
    	let filter = { $text: { $search: textSearch } }
    	return Skills.find(filter).fetch();
    }
});