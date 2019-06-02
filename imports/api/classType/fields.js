import config from '/imports/config';
import SkillCategory from '/imports/api/skillCategory/fields';
import SkillSubject from '/imports/api/skillSubject/fields';
import SLocation from '/imports/api/sLocation/fields';
import { find } from 'lodash';

const ClassType = new Mongo.Collection(config.collections.classType);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassType.attachSchema(
  new SimpleSchema({
    createdBy: {
      type: String,
      optional: true,
    },
    schoolId: {
      type: String,
      optional: true,
    },
    name: {
      type: String,
      optional: true,
    },
    enrollmentIds: {
      type: [String],
      optional: true,
    },
    desc: {
      type: String,
      optional: true,
    },
    skillTypeId: {
      type: String,
      optional: true,
    },
    classTypeImg: {
      type: String,
      optional: true,
    },
    medium: {
      type: String,
      optional: true,
    },
    low: {
      type: String,
      optional: true,
    },
    classes: {
      type: [String],
      optional: true,
    },
    gender: {
      type: String,
      optional: true,
    },
    ageMin: {
      type: Number,
      optional: true,
    },
    ageMax: {
      type: Number,
      optional: true,
    },
    experienceLevel: {
      type: String,
      optional: true,
    },
    skillCategoryId: {
      type: [String],
      optional: true,
    },
    skillSubject: {
      type: [String],
      optional: true,
    },
    locationId: {
      type: String,
      optional: true,
    },
    isPublish: {
      type: Boolean,
      optional: true,
    },
    filters: {
      type: Object,
      optional: true,
    },
    'filters.classPriceCost': {
      type: Number,
      optional: true,
      decimal: true,
      blackbox: true,
    },
    'filters.monthlyPriceCost': {
      type: Object,
      optional: true,
      blackbox: true,
    },
    'filters.location': {
      type: Array,
      optional: true,
    },
    'filters.location.$': {
      type: Object,
      optional: true,
    },
    'filters.location.$.loc': {
      type: Object,
      optional: true,
      index: '2dsphere',
    },
    'filters.location.$.loc.type': {
      type: String,
      optional: true,
    },
    'filters.location.$.loc.coordinates': {
      type: [Number],
      optional: true,
      decimal: true,
    },
    'filters.location.$.loc.title': {
      type: String,
      optional: true,
    },
    'filters.location.$.loc.locationId': {
      type: String,
      optional: true,
    },
    'filters.location.$.loc.classTimeId': {
      type: String,
      optional: true,
    },
    'filters.schoolName': {
      type: String,
      optional: true,
    },
    createdAt: {
      type: new Date(),
      optional: true,
    },
  }),
);

ClassType.join(SkillCategory, 'skillCategoryId', 'selectedSkillCategory', [
  'name',
]);

ClassType.join(SkillSubject, 'skillSubject', 'selectedSkillSubject', [
  'name',
  'skillCategoryId',
]);

ClassType.join(SLocation, 'locationId', 'selectedLocation', [
  'loc',
  'rooms',
  'address',
  'city',
  'country',
]);

Meteor.startup(() => {
  if (Meteor.isServer) {
    ClassType._ensureIndex({
      name: 'text',
      desc: 'text',
      'filters.locationTitle': 'text',
      'filters.schoolName': 'text',
    });


    const raw = ClassType.rawCollection();
    const indexes = Meteor.wrapAsync(raw.indexes, raw)();

    const found = find(indexes, index => index.key['filters.location'] === '2d');
    if (found) {
      ClassType._dropIndex({ 'filters.location': '2d' });
    }
  }
});

export default ClassType;
