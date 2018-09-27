import React from "react";
import Card from "material-ui/Card";
import { toastrModal } from "/imports/util";
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
    const { toastr } = this.props;
    Meteor.call("stripe.disconnectStripeUser", (error, result) => {
      toastr.success(result, "Success");
    });
  };

  render() {
    const role =
      this.props &&
      this.props.currentUser &&
      _.indexOf(this.props.currentUser.roles, "Superadmin");
    return (
      <div>
        
            <div>
              {this.props.currentUser.profile.stripeStatus ? (
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
                            location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${
                              Meteor.settings.public.stripeClientId
                            }&scope=read_write&redirect_uri=${Meteor.absoluteUrl()}redirect-to-stripe`;
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
export default toastrModal(Settings);
