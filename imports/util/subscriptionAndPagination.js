import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import { Loading } from '/imports/ui/loading';
import { InfiniteScroll } from '/imports/util';
// This function takes a component...
export function withSubscriptionAndPagination(WrappedComponent, params) {
  // ...and returns another component...
  const { collection, subscriptionName, recordLimit } = params;
  const Container = createContainer((props) => {
    // console.log("createContainer ",props);
    const query = props.location && props.location.query;
    const filters = props.filters ? props.filters : {};
    if (filters.is_map_view) {
      if (query && query.NEPoint && query.SWPoint) {
        filters.NEPoint = query.NEPoint.split(',').map(Number);
        filters.SWPoint = query.SWPoint.split(',').map(Number);
      }
    }

    const collectionCursor = collection.find({});
    const collectionData = collectionCursor.fetch();
    const currentUser = Meteor.user();
    const pagesToload = Session.get('pagesToload') || 1;
    const subscription = Meteor.subscribe(subscriptionName, {
      limit: pagesToload * recordLimit,
      ...filters,
    });
    let hasMore = true;
    const loadMore = () => {
      if (
        subscription.ready()
        && collectionCursor.count() + recordLimit > pagesToload * recordLimit
      ) {
        Session.set('pagesToload', pagesToload + 1);
      }
    };
    if (subscription.ready()) {
      if (
        collectionCursor.count() + recordLimit < pagesToload * recordLimit
        || collectionCursor.count() < recordLimit
      ) {
        hasMore = false;
      }
    }
    return {
      ...props,
      collectionData,
      hasMore,
      currentUser,
      loadMoreEnabled: subscription.ready(),
      pageStart: 0,
      loadMore: () => {
        loadMore();
      },
      threshold: 100,
      isLoading: !subscription.ready(),
      loader: <Loading />,
    };
  }, InfiniteScroll);

  return class extends React.Component {
    componentDidMount() {
      // ... that takes care of the subscription...
    }

    componentWillUnmount() {
      Session.set('pagesToload', 1);
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      // console.log("Container", Container);
      return (
        <Container {...this.props}>
          <WrappedComponent />
        </Container>
      );
    }
  };
}
