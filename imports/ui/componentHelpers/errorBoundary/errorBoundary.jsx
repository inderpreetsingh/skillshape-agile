import React from 'react';
import {get} from 'lodash';
export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
			hasError: true
		  })
	}
  
	render() {
	  if (this.state.hasError) {
        let error = get(this.state,'error','error name').toString();
        let errorInfo = get(this.state,"errorInfo.componentStack",'error stack info');
        Meteor.call("urlToBase64.errorBoundary",{error,errorInfo});
        return   (
			<div>
				<center>
					<h2>Oops Something Went Wrong.</h2><br/>
                    <h4>An Email is sent about this bug to technical team.</h4>
					<details style={{ whiteSpace: 'pre-wrap' }}>
					<h3>	{error}
						<br />
						{errorInfo}</h3>
					</details>
				</center>
			</div>);
		
	  }
	  return this.props.children;
	}
  }