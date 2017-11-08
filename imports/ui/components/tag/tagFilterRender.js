import React from 'react';
import TagList from './tagList';

export default function() {
	console.log("this.props.selectedSkill",this.props.selectedSkill)
	return (
		<div>
			{
				this.props.selectedSkill && (
					<div>
						<span className="fa fa-tag" id="{{tag_id}}" style={{cursor:'pointer'}}></span>
						<input 
							id="searchTag" 
							type="text" 
							className="input-xs" 
							size="20" 
							style={{marginTop: '10px', marginLeft: '10px', marginRight: '10px'}} 
							autoComplete="off" 
							data-className="{{tag_className}}" 
							placeholder={`Search ${this.props.selectedSkill} ...`}
							onChange={(e)=> this.filterTag(e.target.value)} 
						/>
						<TagList
							filterTag={this.state.tagStr}
						/> 
					</div>
				)
			}
		</div>
	)
}