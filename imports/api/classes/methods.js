import Classes from './fields';
import {get,isEmpty,uniq,includes,flatten} from 'lodash';

Meteor.methods({
    "classes.handleInstructors":function(payLoad){
        if(payLoad.action=='add'){
            if(payLoad.classTimeForm ){
                return "record._id;"
            }
            else{
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