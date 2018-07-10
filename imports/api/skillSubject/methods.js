import SkillSubject from "./fields";

Meteor.methods({
	"getSkillSubjectBySkillCategory": function({skillCategoryIds, textSearch, limit = 10}) {
		let filter = {};
        if(skillCategoryIds && skillCategoryIds.length > 0) {
            filter = {skillCategoryId: { $in: skillCategoryIds}}
        }
        filter = {...filter, name: { $regex: new RegExp(textSearch, 'mi') }}
		return SkillSubject.find(filter,{limit: limit}).fetch();
	},
    "getSkillSubject": function({textSearch}) {
    	let filter = { $text: { $search: textSearch } }
    	return SkillSubject.find(filter).fetch();
    }
});
