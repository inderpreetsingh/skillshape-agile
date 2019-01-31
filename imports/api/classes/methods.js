import Classes from './fields';
import {get,isEmpty,uniq,includes,flatten} from 'lodash';
import School from "../school/fields";
import ClassType from "/imports/api/classType/fields.js"
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
    "classes.updateClassData":function(filter,status,purchaseId,packageType,from){
        try{
            if(from == 'purchasePackage'){
             filter.students = get(Classes.findOne({_id:filter._id}),"students",[]);
            }
            if(filter == null)
            filter = {};
            let obj = {userId:filter.userId ? filter.userId :this.userId,status,purchaseId,packageType};
            if(status=='checkIn' || status=='checkOut'){
               // Entry in the transaction page.
               const {userId,schoolId,classId,classTypeId} = filter;
               !purchaseId && filter.students.map((obj)=>{
                   if(obj.userId == filter.userId)
                   purchaseId = obj.purchaseId;
                })
                if(purchaseId){
                   let data = {userId,schoolId,classId,purchaseId,classTypeId};
                   let profile = Meteor.users.findOne({_id:userId},{fields:{'profile':1}}).profile;
                   data.userName = get(profile,'name',get(profile,'firstName',get(profile,'lastName','Old Data'))); 
                   let purchaseData = Meteor.call('purchases.getDataForTransactionEntry',purchaseId);
                   delete purchaseData._id;
                   let schoolData = School.findOne({_id:schoolId},{fields:{'name':1,'slug':1}});
                   data.schoolName = schoolData.name;
                   data.schoolSlug = schoolData.slug;
                   data.transactionType = 'attendance';
                   data.transactionDate = new Date();
                   data.purchaseId = purchaseId;
                   data.classTypeName = ClassType.findOne({_id:classTypeId},{fields:{"name":1}}).name;
                   data.action = 'add';
                   let payLoad = {...data,...purchaseData}
                   Meteor.call("transactions.handleEntry",payLoad);
               }
                status  = status == 'checkOut' ? 'signIn' : status;
            }
         
            // Add or remove record in the add to calendar collection.
            let addToCalendarCondition = "classTimeId" in  filter && 'classTypeId' in filter && 'schoolId' in filter;
            if(addToCalendarCondition && status == 'signIn' || status == "signOut"){
                let methodName;
                let data = {classTypeId,classTimeId,schoolId} = filter;
                data.userId = filter.userId ? filter.userId : this.userId;
                data.from = 'signHandler';
                status == 'signIn' ? methodName = 'classInterest.addClassInterest' : status == 'signOut' ? methodName = 'classInterest.removeClassInterest' : '';
                delete data._id;
                Meteor.call(methodName,{doc:data});
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
                                index = i;
                        }
                      })
                      if (index > -1) {
                        filter.students.splice(index, 1);
                      }
                      if(status != 'signOut')
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