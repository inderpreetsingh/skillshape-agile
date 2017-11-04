import React from "react";
import ReactDOM from 'react-dom';

export class InfiniteScroll extends React.Component {
    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }
    render() {
        var props = this.props;
        return ( <div> { props.children } { props.hasMore && props.loader } </div>)
    }
    scrollListener() {
        var el = ReactDOM.findDOMNode(this);
        // var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var scrollTop = $("#UserMainPanel").scrollTop();
        var threshold, target = $("#load-icon");
        if (!target.length) return;
        threshold = $("#UserMainPanel").scrollTop() + $(window).height() - target.height();
        if (target.offset().top <= $(window).height()) {
            this.detachScrollListener();
            if (this.props.loadMoreEnabled) {
                this.props.loadMore(this.pageLoaded += 1);
            }
        }
    }
    attachScrollListener() {
        if (!this.props.hasMore) {
            return;
        }
        $("#UserMainPanel").on('scroll', this.scrollListener.bind(this));
        $("#UserMainPanel").on('resize', this.scrollListener.bind(this));
        this.scrollListener();
    }
    detachScrollListener() {
        $("#UserMainPanel").off('scroll', this.scrollListener.bind(this));
        $("#UserMainPanel").off('resize', this.scrollListener.bind(this));
    }
    componentWillUnmount() {
        this.detachScrollListener();
    }
};