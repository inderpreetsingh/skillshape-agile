import React from 'react';
import { get } from 'lodash';
import styled from "styled-components";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";


const BackGround = styled.div`
  background-image: url('/images/landing/covergb.jpg');
  height: -webkit-fill-available;
  padding: 10px;
  font-family: monospace;
	font-size: large;
	background-size: cover;
`;

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
			let error = get(this.state, 'error', 'error name').toString();
			let errorInfo = get(this.state, "errorInfo.componentStack", 'error stack info');
			let url = document.URL;
			Meteor.call("urlToBase64.errorBoundary", { error, errorInfo, url });
			return (
				<BackGround>
					<center>
						<h2>Oops Something Went Wrong at {url}</h2><br />
						<h4>An Email is sent about this bug to technical team.</h4>
							<PrimaryButton
								onClick={() => document.location.reload(true)}
								label="Refresh"
								noMarginBottom
							/>
						<details style={{ whiteSpace: 'pre-wrap' }}>
							<h3>	{error}
								<br />
								{errorInfo}</h3>
						</details>
					</center>
				</BackGround>);

		}
		return this.props.children;
	}
}