import Classes from './fields';
import {get,isEmpty,uniq,includes,flatten} from 'lodash';

Meteor.methods({
    "classes.handleInstructors":function(payLoad){
		console.log("​payLoad", payLoad)
		
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
            if(payLoad.instructorIds){
                Classes.update({_id:payLoad._id},{$set:{instructors:payLoad.instructorIds}});
            }
            Classes.update({_id:payLoad._id},{$pull:{instructors:payLoad.instructorId}});
            return true;
        }
    },
    "classes.getClassData":function(filter){
        filter.scheduled_date = new Date (filter.scheduled_date);
        let record = Classes.findOne(filter);
        if(!isEmpty(record)){
            return record;
        }
        else{
          let record = Classes.insert(filter);
          filter._id = record;
          return filter;
        }
    },
    "classes.updateClassData":function(filter,status){
        try{
            if(filter == null)
            filter = {};
            let obj = {userId:this.userId,status};
            if(status=='checkIn' || status=='checkOut'){
                Meteor.call("attendance.updateData",filter,(err,res)=>{

                })
            }
            if(!filter._id){
                filter.students=[obj];
                filter.scheduled_date = new Date (filter.scheduled_date);
                return Classes.insert(filter);
            }
            else{
                if(filter.students){
                    let found = false,index=-1;
                    userId = filter.userId ? filter.userId : Meteor.userId();
                    filter.students.map((obj,i)=>{
                        if(obj.userId == userId){
                            if(status!=='signOut'){
                                obj.status = status;
                            }else if(status == 'signOut'){
                                index = i;
                            }
                            found = true;
                        }
                      })
                      if (index > -1) {
                        filter.students.splice(index, 1);
                      }
                     if(!found)
                    filter.students.push(obj);
                    filter.students = uniq(filter.students);
                    
                    
                    return Classes.update({_id:filter._id},{$set:filter});
                }
                else{
                    filter.students=[obj];
                    filter.students = uniq(filter.students);
                    return Classes.update({_id:filter._id},{$set:filter});
                }
            }  
        }catch(error){
		console.log("classes.updateClassData in error", error)

        }
             
    }
})