import { isEmpty } from 'lodash';
import { check } from 'meteor/check';
import Classes from '../fields';

Meteor.publish('classes.getClassesData', (filter) => {
  check(filter, Object);
  try {
    const record = Classes.findOne(filter);
    if (isEmpty(record) && filter.scheduled_date) {
      Classes.insert(filter);
    }
    return Classes.find(filter);
  } catch (error) {
    console.log('​ error in classes.getClassesData ', error);
  }
  return null;
});
