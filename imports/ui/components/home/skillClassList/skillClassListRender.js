import React from 'react';

export default function() {
	//listContainerClass
	console.log("SkillClassListRender collectionData -->>",this.props.collectionData)
	return ( 
		<div>
			{this.showClassTypes({classType: this.makeCategorization({items: this.props.collectionData})})}
    	</div>
	)
}