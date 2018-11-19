import Classes from './fields';
import {get,isEmpty,uniq,includes} from 'lodash';

Meteor.methods({
    "classes.handleInstructors":function(payLoad){
        if(payLoad.action=='add'){
            let record;
            record = Meteor.users.findOne({'emails.address':payLoad.email});
            if(payLoad.classTimeForm && !isEmpty(record)){
                return record._id;
            }
            else if(isEmpty(record)){
                return 'emailNotFound';
            }
            else{
                payLoad.instructors.push(record._id);
                payLoad.instructors = uniq(payLoad.instructors);
                Classes.update({_id:payLoad._id},{$set:payLoad});
                return 'added';
            }
           
        }
        else if(payLoad.action =='remove'){
            Classes.update({_id:payLoad._id},{$pull:{instructors:payLoad.instructorId}});
            return true;
        }
    }
})