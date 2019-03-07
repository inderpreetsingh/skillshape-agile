import get from 'lodash/get';
import Typography from 'material-ui/Typography';
import React from 'react';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';


const MessageWrapper = styled.div`
	color:'blue'
`
class VerifyEmail extends React.Component {

	state = {
		isLoading: true,
		error: null,
	}

	componentWillMount() {
		const { token } = this.props.params;
		if(token) {
			Accounts.verifyEmail(token ,(err) => {
				let stateObj = { isLoading: false}
				if(err) {
					stateObj.error = err.message || err.reason;
				}
				this.setState(stateObj)
			});
		} else {
			this.setState({ isLoading: false, error: "Something went wrong!!!"})
		}
	}

	render() {
		const verificationStatus = get(this.props, "currentUser.emails[0].verified", null);
		if(this.state.isLoading) {
			return <Preloader/>
		}

		return (
			<DocumentTitle title={this.props.route.name}>
			
				{
					this.state.error ? (
				        <Typography color='error' type="display2" gutterBottom align="center">
							{this.state.error}
				        </Typography>
					) : (
						<MessageWrapper>
							{
								this.props.currentUser && (
									<Typography color='primary' type="display2" gutterBottom align="center">
										{
											verificationStatus ? "Your email is Verified!"
										    : "Your email is not verified!"
										}
				        			</Typography>
								)
							}
						</MessageWrapper>
					)
				}
			</DocumentTitle>
		)
	}
}

export default VerifyEmail
