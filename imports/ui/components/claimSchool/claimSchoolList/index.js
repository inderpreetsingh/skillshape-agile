import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import ClaimSchoolListRender from "./claimSchoolListRender";
import { Session } from 'meteor/session';
import { withSubscriptionAndPagination } from '/imports/util';
import { withStyles } from 'material-ui/styles';

import School from "/imports/api/school/fields";
import {danger,rhythmDiv} from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = {
  buttonStyles: {
    fontWeight: 600,
    borderRadius: 10,
    backgroundColor: danger,
    color: 'white',
    marginRight: rhythmDiv * 2
  }
}

class ClaimSchoolList extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      schoolSuggestionDialog: false
    }
  }

  componentWillUnmount() {
    Session.set("pagesToload",1)
  }

  handleSchoolSuggestionDialogState = (state) => () => {
    this.setState({
      schoolSuggestionDialog: state
    })
  }

  render() {
    return ClaimSchoolListRender.call(this, this.props, this.state)
  }
}

export default withSubscriptionAndPagination(withStyles(styles)(ClaimSchoolList), {collection: School, subscriptionName: "ClaimSchoolFilter", recordLimit: 10});


// export default createContainer(props => {
//   let pagesToload = Session.get("pagesToload") || 1;
//   let subscription = Meteor.subscribe("ClaimSchoolFilter", { limit: pagesToload * 10, ...props.filters });
//   let hasMore = true;
//   let schoolListCursor = School.find();
//   let schoolList = schoolListCursor.fetch();
//   const loadMore = () => {
//     if (subscription.ready() && schoolListCursor.count() + 10 > pagesToload * 10) {
//       Session.set("pagesToload", pagesToload + 1);
//     }
//   }
//   if (subscription.ready()) {
//     if (schoolListCursor.count() + 10 < pagesToload * 10) {
//       hasMore = false;
//     }
//   }

//   return {...props, schoolList, hasMore, loadMore, loadMoreEnabled: subscription.ready()};
// }, ClaimSchoolList );
