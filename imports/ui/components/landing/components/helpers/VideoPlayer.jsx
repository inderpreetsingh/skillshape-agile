import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Player, BigPlayButton } from 'video-react';

import { heavyBoxShadow } from '/imports/ui/components/landing/components/jss/helpers.js';

import '/node_modules/video-react/dist/video-react.css';

const Wrapper = styled.div`
	max-width: 100%;
	width: 100%;
	box-shadow: ${heavyBoxShadow};
`;

class VideoPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFullscreen: false
		};
	}
	componentDidMount() {
		// subscribe state change
		this.player.subscribeToStateChange(this.handleStateChange);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.onFullScreenChange) {
			prevProps.onFullScreenChange(this.state.isFullscreen);
		}
	}

	setupVideoPlayer = (player) => {
		this.player = player;
	};

	handleStateChange = (state) => {
		this.setState((prevState) => {
			return {
				...prevState,
				isFullscreen: state.isFullscreen
			};
		});
	};

	render() {
		const { props } = this;

		return (
			<Wrapper className="ss-vid-player">
				<Player ref={this.setupVideoPlayer} {...props}>
					<BigPlayButton />
					<source src={props.src} />
				</Player>
			</Wrapper>
		);
	}
}

VideoPlayer.propTypes = {
	src: PropTypes.string,
	poster: PropTypes.string,
	onFullScreenChange: PropTypes.func
};

VideoPlayer.defaultProps = {
	src: 'https://youtu.be/2kMi6MfmGM8',
	poster: '/images/school/solution-gifs/filter-content.png'
};

export default VideoPlayer;
