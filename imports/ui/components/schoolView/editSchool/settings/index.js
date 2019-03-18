import React from "react";
import { withPopUp } from "/imports/util";
import get from 'lodash/get';
import {settingsRender} from './settingsRender';
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null,
      status: false
    };
  }

  disconnectStripe = () => {
    const { popUp } = this.props;
    let {superAdmin} = this.state;
    if(superAdmin==Meteor.userId()){
      Meteor.call("stripe.disconnectStripeUser", superAdmin,(error, result) => {
        this.setState({status:false});
        popUp.appear("success", { title: "Success", content: result});
      });
    }else{
      popUp.appear("alert", { title: "Error", content: "Only super admin of school can control stripe."});
    }
  };
  handleDeleteButtonClick = () => {
    const { popUp } = this.props;
    let { superAdmin } = this.state;
    if (superAdmin == Meteor.userId()) {
      popUp.appear("success", { title: "Oops", content: 'Delete school functionality coming soon...' });
    } else {
      popUp.appear("alert", { title: "Error", content: "Only super admin of school can delete School." });
    }
  }
  handleStripeButtonClick = () => {
    const { status ,superAdmin} = this.state;
    const {popUp} = this.props;
    if(status){
      this.disconnectStripe();
    }
    else{
      if(superAdmin==Meteor.userId()){
        location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${ Meteor.settings.public.stripeClientId }&scope=read_write&redirect_uri=${Meteor.absoluteUrl()}redirect-to-stripe`;
      }
      else{
        popUp.appear("alert", { title: "Error", content: "Only super admin of school can control stripe."});
      }
    }
  }
  componentWillMount() {
    const {schoolData} = this.props;
    let superAdmin = get(schoolData,'superAdmin',null)
    Meteor.call("stripe.findAdminStripeAccount",superAdmin,(err,res)=>{
      this.setState({status:res,superAdmin});      
    })
  }
  
  render() {
    return (
      settingsRender.call(this)
    );
  }
}
export default withPopUp(Settings);
