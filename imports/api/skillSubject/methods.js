import { uniqBy } from 'lodash';

import SkillSubject from './fields';
import SkillCategory from '/imports/api/skillCategory/fields.js';

Meteor.methods({
  getDefaultSubjectsList() {
    return SkillCategory.find({})
      .fetch()
      .map((cat) => {
        if (cat) {
          // console.log(cat, "cat..");
          const subject = SkillSubject.findOne({
            name: 'Others',
            skillCategoryId: cat._id,
          });
          // console.log(subject, "sub....");
          if (subject) {
            return {
              name: `${subject.name}  -- ${cat.name}`,
              skillCategoryId: cat._id,
              _id: subject._id,
            };
          }

          return { _id: null };
        }
      })
      .filter(listObj => listObj._id != null);
  },
  getSkillSubjectBySkillCategory({ skillCategoryIds, textSearch, limit = 0 }) {
    let filter = {};
    if (skillCategoryIds && skillCategoryIds.length > 0) {
      filter = { skillCategoryId: { $in: skillCategoryIds } };
    }
    filter = { ...filter, name: { $regex: new RegExp(textSearch, 'mi') } };
    return SkillSubject.find(filter, { limit }).fetch();
  },
  getSkillSubject({ textSearch }) {
    const filter = { $text: { $search: textSearch } };
    return SkillSubject.find(filter).fetch();
  },
  getSkillCategoryIdsFromSkillSubjects({ skillSubjectIds }) {
    // console.log(skillSubjectIds,"skillSubjectIds");
    const skillSubjects = SkillSubject.find({
      _id: { $in: skillSubjectIds },
    }).fetch();
    const uniqueSkillSubjects = uniqBy(skillSubjects, 'skillCategoryId').map(
      x => x.skillCategoryId,
    );
    if (uniqueSkillSubjects.length > 0 && skillSubjectIds.length > 0) {
      return uniqueSkillSubjects;
    }
    return SkillCategory.find({ name: 'Others' })
      .fetch()
      .map(x => x._id);
  },
  getAllSkillSubjects() {
    return SkillSubject.find({}).fetch();
  },
});
