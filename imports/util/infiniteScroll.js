import React from "react";
import ReactDOM from 'react-dom';

export class InfiniteScroll extends React.Component {
    constructor(props){
        super(props)
        this.scrollListener = _.debounce(this.scrollListener, 500);
    }
    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }
    render() {
        var props = this.props;
        // console.log("InfiniteScroll -->>",props)
        const childrenWithProps = React.Children.map(props.children,
         (child) => React.cloneElement(child, {
           ...props
         })
        );
        return ( <div> { childrenWithProps } { props.hasMore && props.loader } </div>)
    }
    componentDidUpdate() {
        // console.log("InfiniteScroll componentDidUpdate-->>")
        this.detachScrollListener();
        this.attachScrollListener();
    }
    scrollListener() {
        // var el = ReactDOM.findDOMNode(this);
        // var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        let scrollOnId = this.props.scrollOnId || "UserMainPanel";
        var scrollTop = $(`#${scrollOnId}`).scrollTop();
        var threshold, target = $("#load-icon");
        if (!target.length) return;
        threshold = $(`#${scrollOnId}`).scrollTop() + $(window).height() - target.height();
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
        let scrollOnId = this.props.scrollOnId || "UserMainPanel";
        // console.log("attachScrollListener -->>",scrollOnId)
        $(`#${scrollOnId}`).on('scroll', this.scrollListener.bind(this));
        $(`#${scrollOnId}`).on('resize', this.scrollListener.bind(this));
        // this.scrollListener();
    }
    detachScrollListener() {
        let scrollOnId = this.props.scrollOnId || "UserMainPanel";
        $(`#${scrollOnId}`).off('scroll', this.scrollListener.bind(this));
        $(`#${scrollOnId}`).off('resize', this.scrollListener.bind(this));
    }
    componentWillUnmount() {
        this.detachScrollListener();
    }
};