import React, {Fragment} from 'react';
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
		)
	}
}

export default VerifyEmail