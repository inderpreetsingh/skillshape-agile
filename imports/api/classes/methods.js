import Classes from './fields';
import {get,isEmpty,uniq,includes} from 'lodash';

Meteor.methods({
    "classes.handleInstructors":function(payLoad){
        if(payLoad.action=='add'){
            let record;
            record = Meteor.users.findOne({'emails.address':payLoad.email});
            if(!isEmpty(record)){
                payLoad.instructors.push(record._id);
                payLoad.instructors = uniq(payLoad.instructors);
                Classes.update({_id:payLoad._id},{$set:payLoad});
                return 'added';
            }
            else{
                return 'emailNotFound';
            }
        }
        else if(payLoad.action =='remove'){
            Classes.update({_id:payLoad._id},{$pull:{instructors:payLoad.instructorId}});
            return true;
        }
    }
})