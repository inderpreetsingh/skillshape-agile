import React from 'react';
import {get} from 'lodash';
import styled from "styled-components";
const BackGround = styled.div`
  background-image: linear-gradient(
    41deg,
    #ee617d 25%,
    #3d6f8e 25%,
    #3d6f8e 50%,
    #ee617d 50%,
    #ee617d 75%,
    #3d6f8e 75%,
    #3d6f8e 100%
  );
  background-size: 60.97px 53px;
  height: -webkit-fill-available;
  padding: 10px;
  font-family: monospace;
  font-size: large;
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
        let error = get(this.state,'error','error name').toString();
        let errorInfo = get(this.state,"errorInfo.componentStack",'error stack info');
				let url = document.URL;
				Meteor.call("urlToBase64.errorBoundary",{error,errorInfo,url});
        return   (
			<BackGround>
				<center>
					<h2>Oops Something Went Wrong at {url}</h2><br/>
                    <h4>An Email is sent about this bug to technical team.</h4>
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