import {get,isEmpty} from 'lodash';
import Typography from 'material-ui/Typography';
import React from 'react';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import { OnBoardingDialogBox } from '/imports/ui/components/landing/components/dialogs';


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
		if (token) {
			Accounts.verifyEmail(token, (err) => {
				let stateObj = { isLoading: false }
				if (err) {
					stateObj.error = err.message || err.reason;
				}
				else {
					this.checkOnBoardingDialogBox(this.props);
				}
				this.setState(stateObj)
			});
		} else {
			this.setState({ isLoading: false, error: "Something went wrong!!!" })
		}
	}
	checkOnBoardingDialogBox = (props) => {
		const { currentUser } = props;
		if (!isEmpty(currentUser)) {
			const { roles = [] } = currentUser;
			let isSchool = false;
			roles.map((role) => {
				if (role == 'School') {
					isSchool = true;
				}
			})
			Meteor.call("school.getMySchool", (err, res) => {
				if (isSchool && isEmpty(res)) {
					this.setState({ onBoardingDialogBox: true });
				}
				else {
					this.setState({ onBoardingDialogBox: false });
				}
			});
		}
	}
	render() {
		const verificationStatus = get(this.props, "currentUser.emails[0].verified", null);
		if (this.state.isLoading) {
			return <Preloader />
		}
		const {onBoardingDialogBox} = this.state;
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
								{onBoardingDialogBox && <OnBoardingDialogBox
									open={onBoardingDialogBox}
									onModalClose={() => { this.setState({ onBoardingDialogBox: false }) }}
								/>}
							</MessageWrapper>
						)
				}
			</DocumentTitle>
		)
	}
}

export default VerifyEmail
