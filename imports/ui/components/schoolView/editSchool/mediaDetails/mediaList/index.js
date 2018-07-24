import React from "react";
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';

import MediaListRender from "./mediaListRender";
import { withSubscriptionAndPagination } from '/imports/util';
import Media from "/imports/api/media/fields";
import { Session } from 'meteor/session';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const ErrorText = styled.p`
	font-size: ${helpers.baseFontSize}px;
	font-family: ${helpers.specialFont};
	margin: 0;
	color: ${helpers.black};
`;

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

MediaList.defaultProps = {
  noMediaFound: <ErrorText>No Media Found</ErrorText>
}

export default createContainer(props => {
    let { schoolId, limit,schoolData } = props;
    let collectionData = [];
    let mediaSubscription;
    if (schoolId) {
        mediaSubscription = Meteor.subscribe("media.getMedia", { ...props.filters, schoolId, limit:limit});
        collectionData = Media.find({schoolId}).fetch();
    }
    return { ...props,
        collectionData,
        mediaSubscriptionReady: mediaSubscription.ready(),
        schoolData: schoolData
    };
}, MediaList);


// export default withSubscriptionAndPagination(MediaList, {collection: Media, subscriptionName: "media.getMedia", filter: {}, recordLimit: 30});
