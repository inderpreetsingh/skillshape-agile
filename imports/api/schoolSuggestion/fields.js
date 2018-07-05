import config from '/imports/config';
import SkillCategory from '/imports/api/skillCategory/fields.js';
import SkillSubject from '/imports/api/skillSubject/fields.js';

const SchoolSuggestion = new Mongo.Collection(config.collections.schoolSuggestion);

const priceSchema = new SimpleSchema({
  min: {
    type: Number,
    optional: true
  },
  max: {
    type: Number,
    optional: true
  }
});

export const schoolSuggestionSchema = new SimpleSchema({
  schoolName: {
    type: String,
  },
  locationName: {
    type: String,
    optional: true
  },
  skillCategoryIds: {
    type: [String],
    optional: true
  },
  experienceLevel: {
    type: [String],
    optional: true
  },
  skillSubjectIds: {
    type: [String],
    optional: true
  },
  classPrice: {
    type: priceSchema,
    optional: true
  },
  monthPrice: {
    type: priceSchema,
    optional: true,
  },
  age: {
    type: Number,
    optional: true
  },
  gender: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
  }
});

SchoolSuggestion.attachSchema(schoolSuggestionSchema);

SchoolSuggestion.join(SkillCategory,'skillCategoryIds','skillCategories',['name']);
SchoolSuggestion.join(SkillSubject,'skillSubjectIds','skillSubjects',['name']);

export default SchoolSuggestion;
