import React from 'react';
import { CircularProgress } from 'material-ui/Progress';


export class Loading extends React.Component {

	render() {
		return (
			<div id="load-icon" className="row col-xs-12 none" style={{textAlign: "center"}}>
				<CircularProgress
                color="primary"
                thickness={5}
            />
			</div>
		)
	}
}