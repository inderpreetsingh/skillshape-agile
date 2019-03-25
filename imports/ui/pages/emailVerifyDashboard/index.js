import { get, isEmpty } from 'lodash';
import { Component } from "react";
import {EmailVerifyDashboardRender} from './emailVerifyDashboardRender';
import {redirectToThisUrl,withPopUp,confirmationDialog} from '/imports/util';
class EmailVerifyDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { emailSend:false};
  }
  
  componentWillMount() {
    this.setEmail(this.props);
  }
  componentWillReceiveProps(nextProps){
    this.setEmail(nextProps);
  }
  setEmail = (props) =>{
    const {currentUser} = props;
    if(!isEmpty(currentUser)){
      const {emails} = currentUser;
      if(get(emails[0],'verified',false)){
        redirectToThisUrl("");
      }
      else{
        this.setState({email:get(emails[0],'address',null)})
      }
    }else{
      redirectToThisUrl("");
    }
  }
  reSendEmailVerificationLink = (newEmail) => {
    this.setState({ isLoading: true ,disabled:true,errorMessage:'',changeEmail:false});
    const{popUp}= this.props;
    Meteor.call(
      "user.sendVerificationEmailLink",
      newEmail || this.state.email,
      (err, res) => {
				console.log("TCL: EmailVerifyDashboard -> reSendEmailVerificationLink -> err", err)
        this.setState({ isLoading: false, emailSend:true});
        if (err) {
          let content = err.reason || err.message;
          confirmationDialog({popUp,errDialog:true,content});
        }
        if (res) {
          this.countdown();
        }
      }
    );
  };
  handleState = (key,value)=>{
    this.setState({[key]:value});
  }
  onSubmit = (e) =>{
    e.preventDefault();
    let newEmail = document.getElementById('emailField').value;
    if(newEmail){
      Meteor.call("user.changeEmailAddress",newEmail,(err,res)=>{
				if(err){
          const {reason:errorMessage} = err;
          this.setState({errorMessage});
        }
        else {
          this.reSendEmailVerificationLink(newEmail);
        }
        
      })
    }
    /* 
    1. Is already exist.
    2. Chang email in db.
    */

  }
 countdown =() => {
    let seconds = 10;
     tick =() => {
        let counter = document.getElementById("counter");
        seconds--;
        counter.innerHTML = "Wait 00:" + (seconds < 10 ? "0" : "") + String(seconds);
        if( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            counter.innerHTML = ``;
            this.setState({disabled:false,emailSend:false});
        }
    }
    tick();
}

  render() {
  
    return (
      EmailVerifyDashboardRender.call(this)
    );
  }
}
export default withPopUp(EmailVerifyDashboard);

