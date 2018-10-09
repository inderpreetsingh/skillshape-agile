import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import isEmpty from 'lodash/isEmpty';

import ClaimSchoolListRender from './claimSchoolListRender';
import { Session } from 'meteor/session';
import { withPopUp, withSubscriptionAndPagination } from '/imports/util';
import { withStyles } from 'material-ui/styles';
import { emailRegex } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import School from '/imports/api/school/fields';

class ClaimSchoolList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listLoaded: false
		};
	}

	// componentDidMount() {
	//   this.setState({
	//     listLoaded: true
	//   })
	// }

	componentWillUnmount() {
		Session.set('pagesToload', 1);
	}

	render() {
		return ClaimSchoolListRender.call(this, this.props, this.state);
	}
}

export default withSubscriptionAndPagination(withPopUp(ClaimSchoolList), {
	collection: School,
	subscriptionName: 'ClaimSchoolFilter',
	recordLimit: 10
});

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
