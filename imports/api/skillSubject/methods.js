import SkillSubject from "./fields";

Meteor.methods({
	"getSkillSubjectBySkillCategory": function({skillCategoryId}) {
		console.log("getSkillSubjectBySkillCategory -->>",skillCategoryId)
		return SkillSubject.find({skillCategoryId}).fetch();
	},
    "getSkillSubject": function({textSearch}) {
    	let filter = { $text: { $search: textSearch, $caseSensitive: false } }
    	return SkillSubject.find(filter).fetch();
    }
});