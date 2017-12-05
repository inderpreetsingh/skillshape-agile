import React, {Fragment} from 'react';

export default function() {
	
	// console.log("Map view Render -->>",this.props.classType)
	return ( 
		<Fragment>
			<div className="col-md-6 mapview" style={{ height:'700px'}}>
	          	<div id="google-map" style={{height:'700px'}}>
	        	</div>
	      	</div>
	      	<div className="col-md-6 map-view-container" id="skillList"> 
	      		{
					this.props.classType.map((classByClassType, index) => {
						return this.showSkillClass(classByClassType)
					})
				}
	      	</div>
      	</Fragment>
	)
}