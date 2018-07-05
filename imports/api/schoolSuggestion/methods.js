import SchoolSuggestion , {schoolSuggestionSchema} from './fields.js';
import {sendNewSchoolSuggestionEmail} from '/imports/api/email';

Meteor.methods({
  'schoolSuggestion.addSuggestion': function(data) {
    const validationContext = schoolSuggestionSchema.newContext();
    data.createdAt = new Date();
    const isValid = validationContext.validate(data);
    if(isValid) {
      const suggestionId = SchoolSuggestion.insert(data);
      const newSuggestionLink = `${Meteor.absoluteUrl()}school-suggestions`;
      // Then send a mail to the admin.
      sendNewSchoolSuggestionEmail({newSuggestionLink});
      return {
        success: suggestionId
      }
    }else {
      const invalidData = validationContext.invalidKeys()[0];
      console.log(invalidData,validationContext.invalidKeys);
      throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
    }
  }
})
