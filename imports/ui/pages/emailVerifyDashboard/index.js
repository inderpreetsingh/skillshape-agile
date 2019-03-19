import { get, isEmpty } from 'lodash';
import { Component } from "react";
import {EmailVerifyDashboardRender} from './emailVerifyDashboardRender';
import {redirectToThisUrl,withPopUp} from '/imports/util';
class EmailVerifyDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { emailSend:false};
  }
  
  componentWillMount() {
    const {currentUser} = this.props;
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
  reSendEmailVerificationLink = () => {
    this.setState({ isLoading: true ,disabled:true,});
    const{popUp}= this.props;
    Meteor.call(
      "user.sendVerificationEmailLink",
      this.state.email,
      (err, res) => {
        this.setState({ isLoading: false, emailSend:true});
        if (err) {
          let errText = err.reason || err.message;
          popUp.appear("error",{content: errText});
        }
        if (res) {
          this.countdown();
        }
      }
    );
  };

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

