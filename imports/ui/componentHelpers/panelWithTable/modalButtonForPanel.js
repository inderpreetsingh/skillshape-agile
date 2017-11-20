import React from "react";

export default function (props) {
	const { title, openModal  } = props;

	return (
		<li className="filter-archive filter-evaluation active col-md-3 col-sm-3 col-xs-12">
		  <a onClick={openModal} id="add_location" data-toggle="tab" className="cpointer" aria-expanded="false">
		  <i className="fa fa-plus" aria-hidden="true"></i> {title}
		  <div className="ripple-container"></div>
		  </a>
		</li>
	)
}