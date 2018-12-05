import React from 'react';

import SchoolMemberListRender from "./schoolMemberListRender";
import { withSubscriptionAndPagination } from '/imports/util';
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";


class SchoolMemberListItems extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return SchoolMemberListRender.call(this, this.props, this.state);
  }
}

export default withSubscriptionAndPagination(SchoolMemberListItems, {collection: SchoolMemberDetails, subscriptionName: "MembersBySchool", recordLimit: 20});
