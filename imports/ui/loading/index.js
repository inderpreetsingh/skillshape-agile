import React from 'react';

export class Loading extends React.Component {

	render() {
		return (
			<div id="load-icon" className="row col-xs-12 none" style={{textAlign: "center"}}>
				<img style={{height: "40px"}} src="/images/infiniteloading.gif"/>
			</div>
		)
	}
}