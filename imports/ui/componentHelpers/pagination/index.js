"use strict";

import React from "react"
import ReactPaginate from 'react-paginate';
import './pagination.css';

/**
 * @memberof PaginationViewComponent
 * @class
 * @exports
 * @extends React.Component
 */
export default class Pagination extends React.Component {

	constructor(props) {
		super(props);
	}

	state = {

	}

	/**
   * @memberof PaginationViewComponent
   * @method
   * @instance
   * @desc Give active page number
   */
	handlePageClick = (data)=> {
		console.log("Pagination offSet -->>",data,this.props.perPage)
		let selected = data.selected
	  	let offSet = Math.ceil(selected * this.props.perPage);
	  	this.props.onChange({skip: offSet })
	}

	render() {
		console.log("Pagination props -->>",this.props)
	  	return (
			<div className="pagination-container" style={{...this.props.style}}>
			   <ReactPaginate
		           containerClassName={"pagination"}
		           subContainerClassName={"pages pagination"}
			   	   previousLabel={"Back"}
		           previousLinkClassName={"back-link"}
		           nextLabel={"Next"}
		           nextLinkClassName={"next-link"}
		           disabledClassName={"disabled"}
		           breakLabel={<a href="">...</a>}
		           breakClassName={"break-me"}
		           pageCount={this.props.pageCount}
		           marginPagesDisplayed={2}
		           pageRangeDisplayed={5}
		           extraAriaContext={"/"}
		           onPageChange={this.handlePageClick}
		           activeClassName={"active"} />
			</div>
	  	)
	}
}