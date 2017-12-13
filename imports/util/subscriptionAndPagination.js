import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { InfiniteScroll } from '/imports/util';
import { Loading } from '/imports/ui/loading';
// This function takes a component...
export function withSubscriptionAndPagination(WrappedComponent, params) {
  // ...and returns another component...
    let {collection, subscriptionName , recordLimit } = params;
    let Container = createContainer(props => {
    console.log("createContainer ",props);
    const query = props.location && props.location.query;
    let filters = props.filters ? props.filters : {};
    if(filters.is_map_view) {
      if(query && query.NEPoint && query.SWPoint) {
        filters.NEPoint = query.NEPoint.split(",").map(Number)
        filters.SWPoint = query.SWPoint.split(",").map(Number)
      }
    }
    
    const collectionCursor = collection.find({});
    const collectionData = collectionCursor.fetch();
    const currentUser = Meteor.user();
    let pagesToload = Session.get("pagesToload") || 1;
    let subscription = Meteor.subscribe(subscriptionName, { limit: pagesToload * recordLimit, ...filters });
    let hasMore = true;
    const loadMore = () => {
        if (subscription.ready() && collectionCursor.count() + recordLimit > pagesToload * recordLimit) {
            Session.set("pagesToload", pagesToload + 1);
        }
    }
    if (subscription.ready()) {
        if ((collectionCursor.count() + recordLimit < pagesToload * recordLimit) || (collectionCursor.count() < recordLimit)) {
          hasMore = false;
        }
    }
    return { ...props,
      collectionData,
      hasMore,
      currentUser,
      loadMoreEnabled: subscription.ready(),
      pageStart:0,
      loadMore: (pageToLoad)=>{loadMore(pageToLoad)},
      threshold:100,
      loader: (<Loading/>)
    };
}, InfiniteScroll);

  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      // ... that takes care of the subscription...
    }

    componentWillUnmount() {
      Session.set("pagesToload", 1);
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      // console.log("Container", Container);
      return  <Container {...this.props}>
        <WrappedComponent/>
      </Container>
    }
  };
}

