import {uniqBy} from 'lodash';

import SkillSubject from "./fields";
import SkillCategory from '/imports/api/skillCategory/fields.js';

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
  },
	"getSkillCategoryIdsFromSkillSubjects": function({skillSubjectIds}) {
		// console.log(skillSubjectIds,"skillSubjectIds");
		const skillSubjects = SkillSubject.find({_id : {$in : skillSubjectIds}}).fetch();
		const uniqueSkillSubjects = uniqBy(skillSubjects,"skillCategoryId").map(x => x.skillCategoryId);
		if(uniqueSkillSubjects.length > 0 && skillSubjectIds.length > 0) {
			return uniqueSkillSubjects;
		}else {
			return SkillCategory.find({name: "Others"}).fetch().map(x => x._id);
		}
	}
});
