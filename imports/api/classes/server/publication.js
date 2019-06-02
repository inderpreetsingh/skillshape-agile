import { isEmpty } from 'lodash';
import Classes from '../fields';

Meteor.publish('classes.getClassesData', (filter) => {
  try {
    let record;
    record = Classes.findOne(filter);
    if (isEmpty(record) && filter.scheduled_date) {
      Classes.insert(filter);
    }
    return Classes.find(filter);
  } catch (error) {
    console.log('​ error in classes.getClassesData ', error);
  }
});
