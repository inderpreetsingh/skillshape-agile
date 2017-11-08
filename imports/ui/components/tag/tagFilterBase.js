import React from 'react';

export default class TagFilterBase extends React.Component {

	constructor(props){
		super(props)
		this.state = {
		}
	}

	filterTag = (tagStr) => {
		this.setState({
			tagStr
		})
	}
}