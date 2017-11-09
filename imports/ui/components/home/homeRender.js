import React from 'react';
import SkillClassFilter from './filter';
import { Loading } from '/imports/ui/loading';
import SkillClassList from './skillClassList';

export default function() {
  const { 
  	gridView, 
  	mapView, 
  	listContainerClass, 
  	isLoading,
  	currentAddress,
  } = this.state
  
	return(
		<div className="content">
      <div className="container-fluid">
        <SkillClassFilter 
        	currentAddress={currentAddress} 
        	onSearch={this.onSearch}
        	onSearchTag={this.onSearchTag}
        	filters={this.state.filters}
        />
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
		            id="view_list"
		            onClick={this.handleListView}
		            className="btn btn-default btn-grid btn-custom-active"
		          >
			          <i className="material-icons card-material-icon" title="GridView">
			            grid_on
			          </i>
		          </button>
		          <button
		            id="map_view"
		            onClick={this.handleMapView}
		            className="btn btn-default btn-map"
		          >
		            <i className="material-icons card-material-icon" title="Map">
		              map
		            </i>
		          </button>
		        </div>
		      </div>
		    </div>
		    <div className={this.state.listContainerClass} id="skillList"> 
		    	 {!isLoading && <SkillClassList  {...this.props} {...this.state}/>}
		    </div>
		    {
		      mapView && (<div className="col-md-6 mapview" style={{ height:'700px'}}>
		          <div id="google-map" style={{height:'700px'}}>
		        </div>
		      </div>)
		    }
      </div>
    </div>
	)
}