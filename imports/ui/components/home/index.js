import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import HomeBase from './homeBase';
import HomeRender from './homeRender';
import { Session } from 'meteor/session';
import { withSubscriptionAndPagination } from '/imports/util';

class Home extends HomeBase {
    render() {
        return HomeRender.call(this, this.props, this.state);
    }
}

export default withSubscriptionAndPagination(Home, {collection: ClassType, subscriptionName: "School", filter: {}, recordLimit: 10});