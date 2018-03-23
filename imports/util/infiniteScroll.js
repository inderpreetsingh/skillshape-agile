import React from "react";
import ReactDOM from 'react-dom';
import OnVisible from 'react-on-visible';

export class InfiniteScroll extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
    }
    loadMore = (isloadingVisible)=> {
        if(isloadingVisible) {
            this.props.loadMore(this.pageLoaded += 1)
        }
    }
    render() {
        var props = this.props;
        const childrenWithProps = React.Children.map(props.children,
         (child) => React.cloneElement(child, {
           ...props
         })
        );
        return ( <div> { childrenWithProps } { props.hasMore && (<OnVisible percent={100} bounce ={true} onChange={ this.loadMore} className="my-container">{props.loader}</OnVisible>) } </div>)
    }
};