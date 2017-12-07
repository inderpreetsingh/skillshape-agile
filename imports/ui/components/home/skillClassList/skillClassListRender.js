import React from 'react';

export default function() {
	//listContainerClass
	console.log("SkillClassListRender collectionData -->>",this.props.collectionData)
	return ( 
		<div>
      		{
				this.props.collectionData.map((data, index) => {
					
					return this.showSkillClass({classType: data})
				})
			}
    	</div>
	)
}