import { get, isEmpty } from 'lodash';
import { Component } from "react";
import {EmailVerifyDashboardRender} from './emailVerifyDashboardRender';
import {redirectToThisUrl,withPopUp} from '/imports/util';
class EmailVerifyDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { };
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
    this.setState({ isLoading: true });
    const{popUp}= this.props;
    Meteor.call(
      "user.sendVerificationEmailLink",
      this.state.email,
      (err, res) => {
        this.setState({ isLoading: false });
        if (err) {
          let errText = err.reason || err.message;
          popUp.appear("error",{content: errText});
        }
        if (res) {
          popUp.appear("success", {content: "We send a email verification link, Please check your inbox!!"});
        }
      }
    );
  };
  render() {
  
    return (
      EmailVerifyDashboardRender.call(this)
    );
  }
}
export default withPopUp(EmailVerifyDashboard);

