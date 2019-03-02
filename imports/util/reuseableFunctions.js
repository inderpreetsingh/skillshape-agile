import { isEmpty, cloneDeep } from 'lodash';
import {confirmationDialog} from "/imports/util";
export const sendEmail = (data) => {
    const {popUp,onModalClose} = data;
    if(!isEmpty(data)){
        Meteor.call("emailMethods.sendEmail",data,(err,res)=>{
			if(res){
                confirmationDialog({popUp,defaultDialog:true,onModalClose});
            }
            else if(err){
                confirmationDialog({popUp,errDialog:true,onModalClose});
            }
        })
    }
    else{
        confirmationDialog({popUp,errDialog:true,onModalClose});
    }
}
export function handleIsSavedState () {
    if(this.state.isSaved){
      this.setState({isSaved:false})
    }
}

export function unSavedChecker ()  {
    const {isSaved} = this.state;
    const {onClose,popUp} = this.props;
    if(isSaved){
      onClose();
    }else{
      let data = {};
      data = {
        popUp,
        title: 'Oops',
        type: 'alert',
        content: 'You have still some unsaved changes. Please save first.',
        buttons: [{ label: 'Close Anyway', onClick:onClose, greyColor: true },{ label: 'Ok', onClick:()=>{}}]
      }
      confirmationDialog(data);
    }
  }

