import Skills from "./fields";

Meteor.methods({
    "getSkills": function({textSearch}) {
    	console.log("getSkills -->>",textSearch);
    	let filter = { $text: { $search: textSearch, $caseSensitive: true } }
    	return Skills.find(filter).fetch();
    }
});