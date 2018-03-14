import React, {Fragment} from 'react';
import DocumentTitle from 'react-document-title';
import get from 'lodash/get';
import styled from 'styled-components';

const MessageWrapper = styled.div`
	color: 'blue'
`

class VerifyEmail extends React.Component {

	componentWillMount() {
		const { token } = this.props.params;
		if(token) {
			Accounts.verifyEmail(token);
		}
	}

	render() {
		const verificationStatus = get(this.props, "currentUser.emails[0].verified", null);
		return (
			<DocumentTitle title={this.props.route.name}>
				<MessageWrapper>
					{
						this.props.currentUser &&
						<Fragment>
							{
								verificationStatus ? "Your email is Verified!"
							    : "Your email is not verified!"
							}
						</Fragment>
					}
				</MessageWrapper>
			</DocumentTitle>
		)
	}
}

export default VerifyEmail