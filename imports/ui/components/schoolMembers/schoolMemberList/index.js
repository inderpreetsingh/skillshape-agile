import React from 'react';
import SchoolMemberCards from './SchoolMemberCards';
import SchoolMemberDetails from '/imports/api/schoolMemberDetails/fields';
import { withSubscriptionAndPagination } from '/imports/util';


class SchoolMemberListItems extends React.Component {
  render() {
    // console.log(this.props, "SCHOOL MEMBERS LIST");
    return SchoolMemberCards();
  }
}

export default withSubscriptionAndPagination(SchoolMemberListItems, { collection: SchoolMemberDetails, subscriptionName: 'MembersBySchool', recordLimit: 10 });
