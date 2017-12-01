import React from "react";
import DatePicker from 'react-datepicker';

export default function(){

	return (
	<div className='container-fluid' >
        <div className="card" id="scr_affix">

	        <div className="col-sm-2 form-group">
	        	<strong>Image Search</strong>
	        </div>
	        <div className="col-sm-2">
	            <div className="form-group label-floating is-empty has-warning">
	                <input
	                  className="form-control"
	                  type="text"
	                  aria-required="true"
	                  placeholder="name"
	                  ref= { (ref) => {this.imageName = ref} }
	                />
	              <span className="material-input"/>
	              <span className="material-input"/>
	            </div>
	        </div>
            <div className="col-sm-5">
            	<div className="col-sm-6 form-group label-floating is-empty has-warning">
	            	<div className="col-sm-8">
		                <DatePicker
		                	className="form-control"
		                	placeholderText="From"  
		                	selected={this.state.startDate} 
		                	selectsStart 
		                	startDate={this.state.startDate} 
		                	endDate={this.state.endDate} 
		                	onChange={(date)=> {this.startDate = date._d;this.setState({startDate: date})}} 
		                />
			            
	            	</div>
            	</div>
            	<div className="col-sm-6 form-group label-floating is-empty has-warning">
	            	<div className="col-sm-8">
		                <DatePicker
		                	placeholderText="To"
		                	className="form-control" 
		                	selected={this.state.endDate} 
		                	selectsEnd 
		                	startDate={this.state.startDate} 
		                	endDate={this.state.endDate} 
		                	onChange={(date)=> {this.endDate = date._d;this.setState({endDate: date})}} 
		                />
	            	</div>
            	</div>
            </div>
          <div className="col-sm-3" style={{paddingTop: 10}}>
            <a onClick={() => this.props.onSearch(this) } style={{marginRight: '4px'}} id="search" title="Search" className="btn btn-warning btn-sm search">
               Search
            </a>
            <a onClick={() => {this.endDate=null;this.startDate=null;this.setState({startDate:null,endDate:null});this.props.resetFilter(this)} } id="view_list" title="reset filter" className="btn btn-warning btn-sm clear_filter">
            	Clear    
            </a>
          </div>
        </div>
      </div>
	)
}