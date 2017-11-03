import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import HomeBase from './homeBase';
import HomeRender from './homeRender';
import { Session } from 'meteor/session';

class Home extends HomeBase {

    render() {
        return HomeRender.call(this, this.props, this.state);
    }
}

export default createContainer(props => {
    const classTypeCursor = ClassType.find({});
    const classType = classTypeCursor.fetch();
    const currentUser = Meteor.user();
    let pagesToload = Session.get("pagesToload") || 1;
    let subscription = Meteor.subscribe("School", { limit: pagesToload * 8 });
    let hasMore = true;
    const loadMore = () => {
        if (subscription.ready() && classTypeCursor.count() + 8 > pagesToload * 8) {
            Session.set("pagesToload", pagesToload + 1);
        }
    }
    if (subscription.ready()) {
        if (classTypeCursor.count() < pagesToload * 8) {
            hasMore = false;
        }
    }
    return { ...props, classType, hasMore, currentUser, loadMore, loadMoreEnabled: subscription.ready() };
}, Home);