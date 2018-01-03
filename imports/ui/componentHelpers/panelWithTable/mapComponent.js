import React from 'react';
import { initializeSchoolEditLocationMap } from '/imports/util';

export default class MapComponent extends React.Component {

	componentDidMount() {
		initializeSchoolEditLocationMap(this.props.mapData)
	}

	componentWillReceiveProps(nextProps) {
		initializeSchoolEditLocationMap(nextProps.mapData)
  	}

	render() {
		// console.log("MapComponent props -->>",this.props);
		const { mapData } = this.props;
		return (
			<div style={{height: '100%', minHeight: 250}} id={`goolge-map-${mapData._id}`}>
			</div>
		)
	}
}