import React from "react";
import ReactDOM from 'react-dom';

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

export class InfiniteScroll extends React.Component {
    // getDefaultProps() {                                                                                     
    //   return {                                                                                                        
    //     pageStart: 0,                                                                                                 
    //     hasMore: false,                                                                                               
    //     loadMore: function () {},                                                                                      
    //     threshold: 250                                                                                                
    //   };                                                                                                               
    // }                                                                                                                
    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }
    componentDidUpdate() {
        this.attachScrollListener();
    }
    render() {
        var props = this.props;
        return (
            <div>
               {props.children}
               {props.hasMore && props.loader}
            </div>
          )
    }
    scrollListener() {
        var el = ReactDOM.findDOMNode(this);
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
            this.detachScrollListener();
            // call loadMore after detachScrollListener to allow                                                        
            // for non-async loadMore functions
            if(this.props.loadMoreEnabled) {
              this.props.loadMore(this.pageLoaded += 1);
            }                                                                          
        }
    }
    attachScrollListener() {
        if (!this.props.hasMore) {
            return;
        }
        window.addEventListener('scroll', this.scrollListener.bind(this));
        window.addEventListener('resize', this.scrollListener.bind(this));
        this.scrollListener();
    }
    detachScrollListener() {
        window.removeEventListener('scroll', this.scrollListener.bind(this));
        window.removeEventListener('resize', this.scrollListener.bind(this));
    }
    componentWillUnmount() {
        this.detachScrollListener();
    }
};