import React from "react";
import { createContainer } from 'meteor/react-meteor-data';

import MediaListRender from "./mediaListRender";
import { withSubscriptionAndPagination } from '/imports/util';
import Media from "/imports/api/media/fields";
import { Session } from 'meteor/session';

class MediaList extends React.Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  componentWillUnmount() {
    Session.set("pagesToload",1)
  }

  render() {
    return MediaListRender.call(this, this.props);
  }

}
export default createContainer(props => {
    // console.log("MediaList props -->>",props)
    let { schoolId, limit } = props;
    let collectionData = [];
    let mediaSubscription;
    if (schoolId) {
        mediaSubscription = Meteor.subscribe("media.getMedia", { ...props.filters,schoolId, limit:limit});
        collectionData = Media.find({schoolId}).fetch();
    }
    return { ...props,
        collectionData,
        mediaSubscriptionReady: mediaSubscription.ready()
    };
}, MediaList);

// export default withSubscriptionAndPagination(MediaList, {collection: Media, subscriptionName: "media.getMedia", filter: {}, recordLimit: 30});
