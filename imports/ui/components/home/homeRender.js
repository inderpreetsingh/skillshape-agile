import React from 'react';
import SearchControl from '/imports/ui/components/searchControl';
import { InfiniteScroll } from '/imports/util';

export default function() {
	return(
		<div className="content">
        <div className="container-fluid">
          <SearchControl/>
          <div className="row">
            <div className="col-sm-12 grid-map-wrap">
              <div className="col-sm-5 p0">
                <p className="search-no text-center-xs">
                  46 Classes Found
                </p>
              </div>
              <div className="col-sm-7 text-right p0">
                <p className="dispInBlk text-center-xs dispBlk-xs">
                  Choose View:
                </p>
                <button
                  onClick={()=>{this.setState({gridView: true,mapView: false})}}
                  className="btn btn-default btn-grid btn-custom-active"
                >
                  <i className="material-icons card-material-icon" title="GridView">
                    grid_on
                  </i>
                </button>
                <button
                  onClick={()=>{this.setState({gridView: false,mapView: true})}}
                  className="btn btn-default btn-map"
                >
                  <i className="material-icons card-material-icon" title="Map">
                    map
                  </i>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 pt-15">
              {/*{{#if hasSkillValue}}
                {{ > selectTags tag_class=skillvalue tag_filter="yes" tag_count=10  }}
              {{/if}}*/}
            </div>
          </div>
          <div className="row">
            <InfiniteScroll
              pageStart={0}
              loadMore={(pageToLoad)=>{this.props.loadMore(pageToLoad)}}
              hasMore={this.props.hasMore}
              threshold={100}
              loadMoreEnabled={this.props.loadMoreEnabled}
              loader={<div id="load-icon" className="row col-xs-12 none" style={{textAlign: "center"}}><img style={{height: "40px"}} src="/images/infiniteloading.gif"/></div>}
              getMainPanelRef={this.props.getMainPanelRef}
            >
            {
						  this.props.classType.map((classByClassType, index) => {
						    return this.showSkillClass(classByClassType)
						  })
						}
            </InfiniteScroll>
          </div>
        </div>
      </div>
	)
}