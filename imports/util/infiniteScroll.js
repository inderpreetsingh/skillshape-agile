import React from 'react';
import OnVisible from 'react-on-visible';

export class InfiniteScroll extends React.Component {
  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
  }

  loadMore = (isloadingVisible) => {
    if (isloadingVisible) {
      this.props.loadMore((this.pageLoaded += 1));
    }
  };

  render() {
    const { props } = this;
    const childrenWithProps = React.Children.map(props.children, child => React.cloneElement(child, {
      ...props,
    }));
    return (
      <div>
        {' '}
        {childrenWithProps}
        {' '}
        {props.hasMore && (
          <OnVisible percent={100} bounce onChange={this.loadMore} className="my-container">
            {props.loader}
          </OnVisible>
        )}
        {' '}
      </div>
    );
  }
}
