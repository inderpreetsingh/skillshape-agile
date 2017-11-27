import SkillSubject from "./fields";

Meteor.methods({
    "getSkillSubject": function({textSearch}) {
    	let filter = { $text: { $search: textSearch, $caseSensitive: false } }
    	return SkillSubject.find(filter).fetch();
    }
});