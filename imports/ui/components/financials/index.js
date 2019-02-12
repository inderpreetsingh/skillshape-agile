import React from "react";
import Settings from "./settings";
import MyTransaction from "/imports/ui/components/users/myTransaction";
import ResponsiveTabs from "/imports/util/responsiveTabs";
import DocumentTitle from "react-document-title";
export default class Financials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null,
      tabValue: 0,
      adminPermission: false,
      filter: {
        limit: 10,
        skip: 0
      },
      pageCount: 0,
      totalCount: 0,
      perPage: 10
    };
  }

  changePageHandler = skip => {
    let oldFilter = { ...this.state.filter };
    oldFilter.skip = skip.skip;
    this.setState({ filter: oldFilter });
  };
  onTabChange = tabValue => {
    this.setState({ tabValue });
  };
  componentWillMount() {
    const {currentUser:user,schoolData} = this.props;
    let adminPermission = checkIsAdmin({user,schoolData});
    this.setState({adminPermission,schoolData})
  }

  render() {
    let { currentUser } = this.props;
    const {schoolData,adminPermission,queryTabValue,tabValue,pageCount,filter} = this.state;
    return (
      <DocumentTitle title="Financials">
        {(Meteor.settings.public.paymentEnabled &&
          adminPermission) ? (
          <div>
            <ResponsiveTabs
              tabs={["Transactions", "Settings"]}
              color="primary"
              onTabChange={this.onTabChange}
              tabValue={tabValue}
              queryTabValue={queryTabValue}
              page="Financials"
            />
            <div>
              {this.state.tabValue === 0 && (
                <MyTransaction
                schoolView = {true}
                schoolData = {schoolData}
                />
              )}
              {this.state.tabValue === 1 && (
                <Settings
                  {...this.props}
                  adminPermission={adminPermission}
                  schoolData = {schoolData}
                />
              )}
            </div>
          </div>
        ) : (
          <center>
            <div>
              <h1>Access Denied</h1>
            </div>
          </center>
        )}
      </DocumentTitle>
    );
  }
}
