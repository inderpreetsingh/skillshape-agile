import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import Events from '/imports/util/events';
import PrimaryButton from '../buttons/PrimaryButton.jsx';
import TextField from 'material-ui/TextField';
import VideoPlayer from '/imports/ui/components/landing/components/helpers/VideoPlayer.jsx';

import * as helpers from '../jss/helpers.js';
import { schoolDoorImgSrc } from '../../site-settings.js';

const styles = {
	root: {
		['@media screen and (max-width : ' + helpers.tablet + 'px)']: {
			boxShadow: helpers.inputBoxShadow
		},
		['@media screen and (max-width : ' + helpers.mobile + 'px)']: {
			width: '100%'
		}
	},
	formControl: {
		width: 250,
		height: helpers.rhythmDiv * 6,
		['@media screen and (max-width : ' + helpers.mobile + 'px)']: {
			width: '100%'
		}
	},
	userEmailInput: {
		padding: `0 ${helpers.rhythmDiv}px`,
		background: helpers.lightTextColor,
		fontFamily: helpers.specialFont,
		fontStyle: 'italic',
		borderRadius: 3,
		height: '100%'
	},
	userEmailInputInkBar: {
		'&:after': {
			backgroundColor: helpers.darkBgColor
		}
	}
};

const OuterWrapper = styled.div`
  background-color: ${helpers.schoolPageColor};
  position: relative;
  z-index: 1;
  ${(props) => !props.isVideoInFullScreenMode && `clip-path: ${helpers.clipPathCurve}`};
  		
`;

const Wrapper = styled.div`
	max-width: ${helpers.schoolPageContainer}px;
	max-height: 600px;
	height: 100vh;
	margin: 0 auto;
	background-image: url(${(props) => props.bgSrc});
	background-size: 500px;
	background-position: 100% calc(100% - 14px);
	background-repeat: no-repeat;
	position: relative;

	@media screen and (max-width: ${helpers.tablet}px) {
		background-position: calc(100% + 125px) calc(100% - 14px);
		min-height: auto;
		height: auto;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		background-position: calc(100% + 250px) calc(100% - 14px);
	}
`;

const HeaderOverlay = styled.div`
	display: none;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: ${helpers.overlayColor};
	z-index: -1;

	@media screen and (max-width: ${helpers.tablet}px) {
		display: block;
	}
`;

const HeaderContent = styled.div`
	width: 500px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 500px;
	padding: ${helpers.rhythmDiv * 2}px;
`;

const Title = styled.h2`
	font-weight: 600;
	font-family: ${helpers.specialFont};
	font-size: ${helpers.baseFontSize * 3}px;
	color: ${helpers.black};
	margin: 0;
	line-height: 1;
	margin-bottom: ${helpers.rhythmDiv}px;

	@media screen and (max-width: ${helpers.tablet}px) {
		font-size: ${helpers.baseFontSize * 2.5}px;
	}
`;

const Content = styled.h3`
	margin: 0;
	line-height: 1;
	font-family: ${helpers.specialFont};
	font-size: ${helpers.baseFontSize * 2}px;
	font-style: italic;
	color: ${helpers.black};
	font-weight: 400;
	margin-bottom: ${helpers.rhythmDiv * 2}px;
	@media screen and (max-width: ${helpers.tablet}px) {
		font-size: ${helpers.baseFontSize * 1.5}px;
	}
`;

const HeaderContentWrapper = styled.div`
	${helpers.flexCenter} justify-content: flex-start;
	height: 100%;
	position: relative;
	z-index: 0;
`;

const FieldsWrapper = styled.div`
	display: flex;
	align-items: center;

	@media screen and (max-width: ${helpers.mobile}px) {
		flex-direction: column;
		margin-bottom: ${helpers.rhythmDiv * 4}px;
	}
`;

const VideoPlayerWrapper = styled.div`
	padding-right: 80px;
	margin-bottom: ${helpers.rhythmDiv}px;

	@media screen and (max-width: ${helpers.mobile}px) {
		padding-right: 0;
		height: 100%;
		width: 100%;
	}
`;

const ButtonWrapper = styled.div`@media screen and (max-width: ${helpers.tablet}px) {display: none;}`;

const ButtonSmallWrapper = styled.div`
	display: none;

	@media screen and (max-width: ${helpers.tablet}px) {
		display: block;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		width: 100%;
		margin-top: ${helpers.rhythmDiv}px;
		margin-left: 0;
	}
`;

class SchoolHeader extends Component {
	state = {
		userEmail: '',
		isVideoInFullScreenMode: false
	};

	handleFullScreenModeChange = (videoState) => {
		if (this.state.isVideoInFullScreenMode !== videoState) {
			this.setState((state) => {
				return {
					...state,
					isVideoInFullScreenMode: videoState
				};
			});
		}
	};

	handleInputChange = (e) => {
		this.setState({ userEmail: e.target.value });
	};

	handleSignUpButtonClick = () => {
		Events.trigger('registerAsSchool', {
			userType: 'School',
			userEmail: this.state.userEmail
		});
	};

	render() {
		const { props } = this;
		const { isVideoInFullScreenMode } = this.state;
		return (
			<OuterWrapper isVideoInFullScreenMode={isVideoInFullScreenMode}>
				<Wrapper bgSrc={props.schoolHeaderImgSrc}>
					<HeaderContentWrapper>
						<HeaderContent>
							{/*<VideoPlayerWrapper>
								<VideoPlayer onFullScreenChange={this.handleFullScreenModeChange} />
							</VideoPlayerWrapper>*/}
							<Title>{props.title}</Title>
							<Content>{props.content}</Content>
							<FieldsWrapper>
								<TextField
									id="user-email"
									placeholder="Enter Your Email Id"
									type="email"
									color={helpers.lightTextColor}
									className={props.classes.root}
									onChange={this.handleInputChange}
									InputProps={{
										disableUnderline: true,
										classes: {
											root: props.classes.formControl,
											input: props.classes.userEmailInput,
											inkbar: props.classes.userEmailInputInkBar
										}
									}}
								/>
								<ButtonWrapper>
									<PrimaryButton
										label="Join for free"
										increaseHeight
										noMarginBottom
										onClick={this.handleSignUpButtonClick}
									/>
								</ButtonWrapper>
								<ButtonSmallWrapper>
									<PrimaryButton
										label="Join for free"
										increaseHeight
										noMarginBottom
										boxShadow
										onClick={this.handleSignUpButtonClick}
									/>
								</ButtonSmallWrapper>
							</FieldsWrapper>
						</HeaderContent>

						<HeaderOverlay>
							{/* This div adds an overlay over the background in smaller sizes */}
						</HeaderOverlay>
					</HeaderContentWrapper>
				</Wrapper>
			</OuterWrapper>
		);
	}
}

SchoolHeader.propTypes = {
	title: PropTypes.string,
	content: PropTypes.string,
	schoolHeaderImgSrc: PropTypes.string
};

SchoolHeader.defaultProps = {
	title: 'This is your school',
	content: 'Amazing things happen when people enter these doors',
	schoolHeaderImgSrc: schoolDoorImgSrc
};

export default withStyles(styles)(SchoolHeader);
