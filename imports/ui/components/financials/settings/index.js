import React from "react";
import Card from "material-ui/Card";
import { withPopUp } from "/imports/util";
import get from 'lodash/get';
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
  
  componentWillMount() {
    const {schoolData} = this.props;
    let superAdmin = get(schoolData,'superAdmin',null)
    this.setState({superAdmin});
    Meteor.call("stripe.findAdminStripeAccount",superAdmin,(err,res)=>{
      this.setState({status:res});      
    })
  }
  
  render() {
    const role = this.props && this.props.currentUser && _.indexOf(this.props.currentUser.roles, "Superadmin");
    const {status,superAdmin} = this.state; 
    const {popUp} = this.props;
    return (
      <div>
            <div>
              {status ? (
                <center>
                  <Card>
                    {" "}
                    <div style={{ height: "60px" }}>
                      <h3>
                        Already Connected to Stripe.<button
                          style={{
                            backgroundColor: "#4CAF50",
                            border: "none",
                            color: "white",
                            padding: "15px 32px",
                            textAlign: "center",
                            textDecoration: "none",
                            display: "inline-block",
                            fontSize: "16px",
                            marginBottom: "5px",
                            marginTop: "5px"
                          }}
                          onClick={this.disconnectStripe}
                        >
                          Disconnect Stripe
                        </button>
                      </h3>
                    </div>
                  </Card>
                </center>
              ) : (
                <center>
                  <Card>
                    {" "}
                    <div style={{ height: "60px" }}>
                      <h3>
                        Connect your Stripe Account to SkillShape.<button
                          style={{
                            backgroundColor: "#f44336",
                            border: "none",
                            color: "white",
                            padding: "15px 32px",
                            textAlign: "center",
                            textDecoration: "none",
                            display: "inline-block",
                            fontSize: "16px",
                            marginBottom: "5px",
                            marginTop: "5px"
                          }}
                          onClick={() => {
                            if(superAdmin==Meteor.userId()){
                              location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${ Meteor.settings.public.stripeClientId }&scope=read_write&redirect_uri=${Meteor.absoluteUrl()}redirect-to-stripe`;
                            }
                            else{
                              popUp.appear("alert", { title: "Error", content: "Only super admin of school can control stripe."});
                            }
                          }}
                        >
                          Connect Stripe
                        </button>
                      </h3>
                    </div>
                  </Card>
                </center>
              )}
            </div>
          
      </div>
    );
  }
}
export default withPopUp(Settings);
