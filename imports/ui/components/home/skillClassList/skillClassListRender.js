import React from 'react';

export default function() {
	//listContainerClass
	// console.log("SkillClassListRender -->>",this.props)
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