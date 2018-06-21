import React from "react";
import DocumentTitle from "react-document-title";
import { Loading } from "/imports/ui/loading";
import { browserHistory, Link } from "react-router";
import ResponsiveTabs from "/imports/util/responsiveTabs";
import Typography from "material-ui/Typography";
import Students from "./students";
import Payouts from "./payouts";
import Transactions from "./transactions";
import Settings from "./settings";
export default class Financials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null,
      tabValue: 0
    };
  }
  onTabChange = tabValue => {
    this.setState({ tabValue });
  };

  render() {
    return (
      <DocumentTitle title="Financials">
        <div>
          <ResponsiveTabs
            tabs={["Settings", "Payouts", "Transactions", "Students"]}
            color="primary"
            onTabChange={this.onTabChange}
            tabValue={this.state.tabValue}
            queryTabValue={this.state.queryTabValue}
            page="Financials"
          />
          <div>
            {this.state.tabValue === 0 && <Settings />}
            {this.state.tabValue === 1 && <Payouts />}
            {this.state.tabValue === 2 && <Transactions />}
            {this.state.tabValue === 3 && <Students />}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
