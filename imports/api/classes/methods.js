import Classes from './fields';
import {get,isEmpty,uniq,includes,flatten} from 'lodash';

Meteor.methods({
    "classes.handleInstructors":function(payLoad){
        if(payLoad && payLoad.students && !isEmpty(payLoad.students)){
            payLoad.students.map((obj,index)=>{
            let memberData = {
                activeUserId:obj.userId,
                schoolId:payLoad.schoolId,
                classTypeId:payLoad.classTypeId,
                from:'classes'
            }
            Meteor.call("schoolMemberDetails.addNewMember",memberData);
            })
        }
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
    "classes.updateClassData":function(filter,status,purchaseId,packageType){
        try{
          
            if(filter == null)
            filter = {};
            let obj = {userId:this.userId,status,purchaseId,packageType};
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
                            if(status!='signOut'){
                                obj.status = status;
                                purchaseId ? obj.purchaseId = purchaseId : '';
                            }else if(status == 'signOut'){
                                index = i;
                            }
                            found = true;
                        }
                      })
                      if(!found)
                     filter.students.push(obj);
                     filter.students = uniq(filter.students);
                      if (index > -1) {
                        filter.students.splice(index, 1);
                      }
                    return Classes.update({_id:filter._id},{$set:filter});
                }
                else{
                    filter.students=[obj];
                    filter.students = uniq(filter.students);
                    return Classes.update({_id:filter._id},{$set:filter});
                }
            }  
            if(filter && filter.students && !isEmpty(filter.students)){
                filter.students.map((obj,index)=>{
                let memberData = {
                    activeUserId:obj.userId,
                    schoolId:filter.schoolId,
                    classTypeId:filter.classTypeId,
                    from:'classes'
                }
                Meteor.call("schoolMemberDetails.addNewMember",memberData);
                })
            }
        }catch(error){
		console.log("classes.updateClassData in error", error)

        }
             
    }
})