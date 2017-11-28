import SkillCategory from "./fields";

Meteor.methods({
    "getSkillCategory": function({textSearch}) {
    	console.log("getSkillCategory called fn",textSearch);
    	let filter = { $text: { $search: textSearch, $caseSensitive: false } }
    	return SkillCategory.find(filter).fetch();
    }
});