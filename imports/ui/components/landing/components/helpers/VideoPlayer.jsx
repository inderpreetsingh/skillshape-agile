import React from 'react';
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

const VideoPlayer = (props) => {
	return (
		<Wrapper className="ss-vid-player">
			<Player {...props}>
				<BigPlayButton />
				<source src={props.src} />
			</Player>
		</Wrapper>
	);
};

VideoPlayer.propTypes = {
	src: PropTypes.string,
	poster: PropTypes.string
};

VideoPlayer.defaultProps = {
	src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
	poster: '/images/school/solution-gifs/filter-content.png'
};

export default VideoPlayer;
