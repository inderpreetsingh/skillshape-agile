import {confirmationDialog,getUserFullName } from '/imports/util';
import {isEmpty} from 'lodash';
export function handleJoin() {
    this.setState({isLoading:true});
   const {checkBoxes,checkBoxesData:{classInterestData,notification:{classTimesRequest,classTypeLocationRequest}}} = this.state;
   const {classTimeId,classTypeId,schoolId,popUp,onModalClose,name:classTypeName} = this.props;
   let userId = Meteor.userId();
   if(!userId){
    let data = {};
    data = {
      popUp,
      title: 'Oops',
      type: 'alert',
      content: 'Please Login First.',
      buttons: [{ label: 'Ok', onClick:onModalClose, greyColor: true }]
    }
    confirmationDialog(data);
   }
   else{
       if(checkBoxes[0]){
           let data = {doc:{classTimeId,classTypeId,schoolId,userId}};
           callMethod("classInterest.addClassInterest",data,popUp,onModalClose);
       }
       else if(!checkBoxes[0] && !isEmpty(classInterestData)){
           let data = {doc:{_id:classInterestData._id,userId}}
            callMethod("classInterest.removeClassInterest",data,popUp,onModalClose);
       }
       const currentUser = Meteor.user();
       const userName = getUserFullName(currentUser);
       if(!isEmpty(currentUser)){
       let data = {
         name: userName,
         email: currentUser.emails[0].address,
         schoolId: schoolId,
         classTypeId: classTypeId,
         userId,
         notification: checkBoxes[1],
         createdAt: new Date(),
         classTypeName,
         existingUser: true
       };
       let memberData = {
        activeUserId:userId,
        schoolId:schoolId,
        classTypeId:classTypeId,
        from:'classes'
    }   
       callMethod("schoolMemberDetails.addNewMember",memberData,popUp,onModalClose)
       callMethod("classTypeLocationRequest.updateRequest",data,popUp,onModalClose)
       let self = this;
       callMethod("classTimesRequest.updateRequest",data,popUp,onModalClose,true,self)
    }
   }
}
callMethod = (methodName,data,popUp,onModalClose,showDialog,self) => {
    Meteor.call(methodName,data,(err,res)=>{
        if(showDialog){
            self.setState({isLoading:false});
            let data = {};
            data = {
              popUp,
              title: 'Success',
              type: 'success',
              content: 'Operation Completed Successfully.',
              buttons: [{ label: 'Ok', onClick:onModalClose, greyColor: true }]
            }
            confirmationDialog(data);
        }
    })
}