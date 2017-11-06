import React from "react";
import {cutString} from '/imports/util';
import { InfiniteScroll } from '/imports/util';
import { Loading } from '/imports/ui/loading';

export default function (props) {
  let schools = this.props.schoolList || [];
  return (
      <div>
        <div className="clearfix"></div>
        <div className="col-md-12">
          <h3 style={{margin: '0 0 0 0'}}>Is your school one of these schools?</h3>
        </div>
        <div className="clearfix"></div>
        <div className="nopaadding">
        <InfiniteScroll
          pageStart={0}
          loadMore={(pageToLoad)=>{this.props.loadMore(pageToLoad)}}
          hasMore={this.props.hasMore}
          threshold={100}
          loadMoreEnabled={this.props.loadMoreEnabled}
          loader={<Loading/>}
          getMainPanelRef={this.props.getMainPanelRef}
        >
          {
            schools.map((school, index) => {
              return (
                  <div key={index} className="col-md-3 col-sm-6 npding">
                    <div className="card card-profile">
                      <a href="">
                        <h4 className="card-title" title={school.name}>{cutString(school.name, 27)}</h4>
                        <div className="card-content">
                          <div>
                            <div className="thumb" style={{
                              backgroundImage: `url(${school.mainImage})`,
                              height: '155px',
                              width: '100%',
                              cursor: 'pointer'
                            }}></div>
                          </div>
                        </div>
                      </a>
                      <div className="card-footer">
                        <div className="row">
                          <a href="" className="btn btn-rose" data-id="">View
                            <div className="ripple-container"></div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
              )
            })
          }
          </InfiniteScroll>
          <div className="col-md-12">
            <h3> No none of these are my school. Please let me start a new listing.</h3>
            <a href="#" className="btn btn-rose btn_claim">Start New School
              <div className="ripple-container"/>
            </a>
          </div>
        </div>
      </div>
  )
}