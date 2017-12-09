import React from "react";
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

export default withSubscriptionAndPagination(MediaList, {collection: Media, subscriptionName: "media.getMedia", filter: {}, recordLimit: 30});
