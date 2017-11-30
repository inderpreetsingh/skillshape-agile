import React from "react";
import MediaListRender from "./mediaListRender";
import { withSubscriptionAndPagination } from '/imports/util';
import Media from "/imports/api/media/fields";

class MediaList extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return MediaListRender.call(this, this.props);
  }

}

export default withSubscriptionAndPagination(MediaList, {collection: Media, subscriptionName: "media.getMedia", filter: {}, recordLimit: 30});
