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
    },
    "classes.getClassData":function(filter){
        return Classes.findOne(filter);
    },
    "classes.updateClassData":function(filter,status){
		console.log("​filter", filter)
        try{
            if(filter == null)
            filter = {};
            let obj = {userId:this.userId,status};
            if(!filter._id){
                filter.students=[obj];
                console.log("1");
                return Classes.insert(filter);
            }
            else{
                if(filter.students){
                    console.log("2");
                    filter.students.push(obj);
                    filter.students = uniq(filter.students);
                    return Classes.update({_id:filter._id},{$set:filter});
                }
                else{
                    console.log("3");
                    filter.students=[obj];
                    return Classes.update({_id:filter._id},{$set:filter});
                }
            }  
        }catch(error){
		console.log("classes.updateClassData in error", error)

        }
             
    }
})