import React from 'react';
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
		return   (
			<div>
				<center>
					<h2>Oops Something Went Wrong.</h2>
					<details style={{ whiteSpace: 'pre-wrap' }}>
					<h3>	{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}</h3>
					</details>
				</center>
			</div>);
		
	  }
	  return this.props.children;
	}
  }