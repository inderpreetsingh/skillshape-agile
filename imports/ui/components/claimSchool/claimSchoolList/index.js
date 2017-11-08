import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import ClaimSchoolListRender from "./claimSchoolListRender";
import { Session } from 'meteor/session';
import { withSubscriptionAndPagination } from '/imports/util';

class ClaimSchoolList extends React.Component {

  componentWillUnmount() {
    Session.set("pagesToload",1)
  }

  render() {
    return ClaimSchoolListRender.call(this, this.props, this.state)
  }
}

export default withSubscriptionAndPagination(ClaimSchoolList, {collection: School, subscriptionName: "ClaimSchoolFilter", recordLimit: 10});


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
