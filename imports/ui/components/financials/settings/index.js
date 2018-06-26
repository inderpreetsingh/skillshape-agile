import React from "react";
import Card from "material-ui/Card";
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null
    };
  }

  render() {
    {
      console.log("Meteor.user()", Meteor.user());
    }
    return (
      <div>
        {" "}
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
                    }&scope=read_write`;
                  }}
                >
                  Connect To Stripe
                </button>
              </h3>
            </div>
          </Card>
        </center>
      </div>
    );
  }
}
