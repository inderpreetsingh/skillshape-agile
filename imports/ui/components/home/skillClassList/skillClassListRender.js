import React from 'react';

export default function() {
	//listContainerClass
	return ( 
		<div>
			{this.showClassTypes({classType: this.makeCategorization({items: this.props.collectionData})})}
    	</div>
	)
}