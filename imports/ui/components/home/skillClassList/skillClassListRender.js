import React from 'react';

export default function() {
	//listContainerClass
	console.log("SkillClassListRender collectionData -->>",this.props.collectionData)
	return ( 
		<div>
      		{
				this.props.collectionData.map((classByClassType, index) => {
					return this.showSkillClass(classByClassType)
				})
			}
    	</div>
	)
}