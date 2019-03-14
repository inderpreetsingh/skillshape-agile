import React from 'react';
import { get } from 'lodash';
import styled from "styled-components";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";

const H2 = styled.h2`
  word-break: break-word;
`;
const H3 = styled.h3`
  max-height: 267px;
  overflow: scroll;
  overflow-x: hidden;
  @media screen and (max-width: 600px) {
    max-height: 190px;
  }
`;
const BackGround = styled.div`
  background-color: dimgrey;
  background-image: url("https://s3-us-west-1.amazonaws.com/skillshape/schools/e537fa24-3624-4cf8-9765-59e4aed9d7e0.jpg");
  height: -webkit-fill-available;
  padding: 10px;
  font-family: monospace;
  font-size: large;
  background-size: cover;
`;
const Details = styled.details`
  margin-top: 14px;
  white-space: pre-line;
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
						<H2>Oops Something Went Wrong at {url}</H2><br />
						<h4>An Email is sent about this bug to technical team.</h4>
							<PrimaryButton
								onClick={() => document.location.reload(true)}
								label="Refresh"
								noMarginBottom
							/>
						<Details>
							<H3>	{error}
								<br />
								{errorInfo}</H3>
						</Details>
					</center>
				</BackGround>);

		}
		return this.props.children;
	}
}