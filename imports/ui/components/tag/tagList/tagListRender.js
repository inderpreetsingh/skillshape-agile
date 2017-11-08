import React from 'react';

export default function() {
	let tags = this.props.tagsData || []
	console.log("taglist props -->",tags)
	return (
		<div>
		{
			tags.map((tag,index) => {
				return (<span 
					key={index}
					style={{cursor: 'pointer', fontSize: 'x-small'}}
				>
					{tag.tag}&nbsp;&nbsp;
				</span>)
			})
		}
		</div>
	)
}