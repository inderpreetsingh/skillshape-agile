import SchoolSuggestion , {schoolSuggestionSchema} from './fields.js';

Meteor.methods({
  'schoolSuggestion.addSuggestion': function(data) {
    const validationContext = schoolSuggestionSchema.newContext();
    data.createdAt = new Date();
    const isValid = validationContext.validate(data);
    console.log(isValid,"inserting data...");
    if(isValid) {
      console.log('iNserting data...');
      return SchoolSuggestion.insert(data);
      // Then send a mail to the admin.
    }else {
      const invalidData = validationContext.invalidKeys()[0];
      console.log(invalidData,validationContext.invalidKeys);
      throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
    }
  }
})
