import React, {Fragment} from 'react';

export default function() {
	
	// console.log("Map view Render -->>",this.props.classType)
	const {
		classType,
		school,
		skillClass,
	} = this.state;

	return ( 
		<Fragment>
			<div className="col-md-6 mapview" style={{ height:'700px'}}>
	          	<div id="google-map" style={{height:'700px'}}>
	        	</div>
	      	</div>
	      	
      	</Fragment>
	)
}