import React from 'react';

export default function() {
	const { skillClass } = this.props;
	const { tagSelected } = this.state;

	let tags = this.props.tagsData || []

	console.log("taglist render props -->",this.props)
	return (
		<span>
		{
			tags.map((data,index) => {
				let tagClassName = "label label-default clickEntTag hvr-grow-rotate"
				if(data.tag == tagSelected) {
					tagClassName = "label label-success clickEntTag hvr-grow-rotate"
				}
				return (<span
					className={tagClassName} 
					key={index}
					id={data._id}
					tagclass={skillClass}
					enttag={data.tag}
					style={{cursor: 'pointer', fontSize: 'x-small', marginLeft: '2px'}}
					onClick={this.onTagClick.bind(this,data.tag)}
				>
					{data.tag}&nbsp;&nbsp;
				</span>)
			})
		}
		</span>
	)
}