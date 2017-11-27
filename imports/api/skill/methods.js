import Skills from "./fields";

Meteor.methods({
    "getSkills": function({textSearch}) {
    	let filter = { $text: { $search: textSearch, $caseSensitive: false } }
    	return Skills.find(filter).fetch();
    }
});