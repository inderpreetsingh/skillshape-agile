import SkillSubject from "./fields";

Meteor.methods({
	"getSkillSubjectBySkillCategory": function({skillCategoryIds, textSearch}) {
		console.log("getSkillSubjectBySkillCategory -->>",skillCategoryIds, textSearch)
		return SkillSubject.find({skillCategoryId: { $in: skillCategoryIds}, name: { $regex: new RegExp(textSearch, 'mi') }},{limit: 10}).fetch();
	},
    "getSkillSubject": function({textSearch}) {
    	let filter = { $text: { $search: textSearch } }
    	return SkillSubject.find(filter).fetch();
    }
});