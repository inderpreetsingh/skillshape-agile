import { isEmpty, cloneDeep } from 'lodash';
import {confirmationDialog} from "/imports/util";
export const sendEmail = (data) => {
    const {popUp,onModalClose} = data;
    if(!isEmpty(data)){
        Meteor.call("emailMethods.sendEmail",data,(err,res)=>{
			if(res){
                const {studentName} = data;
                const content = `Your message to ${studentName} was successfully sent.`
                confirmationDialog({popUp,defaultDialog:true,onModalClose,content});
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
export function handleIsSavedState (isSaved) {
    if(this.state.isSaved != isSaved){
      this.setState({isSaved})
    }
}

export function unSavedChecker ()  {
    const {onClose,popUp,isSaved,handleIsSavedState} = this.props;
    if(isSaved){
      handleIsSavedState && handleIsSavedState(true);
      onClose && onClose();
    }else{
      let data = {};
      data = {
        popUp,
        title: 'Oops',
        type: 'alert',
        content: 'You have still some unsaved changes. Please save first.',
        buttons: [{ label: 'Close Anyway', onClick:()=>{
            onClose && onClose();
            handleIsSavedState ? handleIsSavedState(true) : this.setState({isSaved:true});
        }, greyColor: true },{ label: 'Ok', onClick:()=>{}}]
      }
      confirmationDialog(data);
    }
  }

  export const handleOnBeforeUnload = e => {
    console.log('TCL: e', e)
    const message = 'Are you sure?';
    e.returnValue = message;
    return message;
  };

  /* 
  SignUp FLow Functions
  */
 export function handleSignUpSubmit (payload, event){
    event.preventDefault();
    let obj = {};
    const {password,confirmPassword} = payload;
    if(!payload.name || !payload.email) {
        obj.errorText = "* fields are mandatory";
    }
    else if(!password || !confirmPassword){
        obj.errorText = 'Password is Required.';
    }
    else if(password.length < 6 || confirmPassword.length < 6){
        obj.errorText = 'Password should be at least of length 6.';
    }
    else if(password != confirmPassword){
        obj.errorText = 'Password not matched.';
    }
    else if(!payload.skillShapeTermsAndConditions){
        obj.errorText = 'Please agree to Terms & Conditions.'
    }
    else if(!payload.captchaValue) {
        obj.errorText = "You can't leave Captcha empty";
    }
    else {
        obj.errorText = null;
        obj.userData = {...this.state.userData, ...payload};
     }
     this.setState(obj);
     if(obj.errorText == null){
        this.setState({isBusy: true},()=>{
            const { popUp } = this.props;
        Meteor.call("user.createUser", {...obj.userData, signUpType: 'skillshape-signup'}, (err, res) => {
            // console.log("user.createUser err res -->>",err,res)
            let modalObj = {
                open: false,
                signUpDialogBox: false,
                isBusy: false,
            }
            if(err) {
                modalObj.errorText = err.reason || err.message;
                modalObj.signUpDialogBox = true;
                this.setState(modalObj)
                 }

                 if (res) {
                     this.setState(modalObj, () => {
                         popUp.appear('success', { content: "Successfully registered, Please check your email." })
                     })
                     const { email, password } = res;
                     Meteor.loginWithPassword(email, password, (err, res) => {
                     console.log('TCL: handleSignUpSubmit -> err, res', err, res)
                     });
                 }
             })
         });

     }
 }

export function handleLoginGoogle ()  {
    let self = this;
    Meteor.loginWithGoogle({}, function(err,result) {
        let modalObj = {
            open: false,
            signUpDialogBox: false,
            isBusy: false,
        }
        if(err) {
            modalObj.errorText = err.reason || err.message;
            modalObj.signUpDialogBox = true;
        } else {
            Meteor.call("user.onSocialSignUp", {...self.state.userData}, (err, res) => {
                if(err) {
                    modalObj.errorText = err.reason || err.message;
                    modalObj.signUpDialogBox = true;
                }
            })
        }
        self.setState(modalObj)
    });
}
export function handleLoginFacebook  ()  {
    let self = this;
    Meteor.loginWithFacebook({
        requestPermissions: ['user_friends', 'public_profile', 'email']
    }, function(err, result) {

        let modalObj = {
            open: false,
            signUpDialogBox: false,
            isBusy: false,
        }
        if (err) {
            modalObj.errorText = err.reason || err.message;
            modalObj.signUpDialogBox = true;
        } else {
            Meteor.call("user.onSocialSignUp", { ...self.state.userData }, (err, res) => {
                if (err) {
                    modalObj.errorText = err.reason || err.message;
                    modalObj.signUpDialogBox = true;
                }
            })
        }
        self.setState(modalObj)
    });
}
/* 
listenOnUrlChange going to listen on url change and 
whenever url going to change it will call callback
*/
export const listenOnUrlChange = (callBack) => {
    /* These are the modifications: */
    history.pushState = (f => function pushState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = (f => function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replaceState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
    });
    window.addEventListener('locationchange', function () {
        callBack();
    })
}