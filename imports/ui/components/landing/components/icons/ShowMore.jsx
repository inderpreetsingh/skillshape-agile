import React from 'react';
import SVGInline from 'react-svg-inline';
import PropTypes from 'prop-types';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const ShowMore = (props) => (
  <SVGInline height={props.height} width={props.width} svg={`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
    <g>
    	<circle style="fill:${props.color}" cx="57.264" cy="256" r="57.264"/>
    	<circle style="fill:${props.color}" cx="256" cy="256" r="57.264"/>
    	<circle style="fill:${props.color}" cx="454.736" cy="256" r="57.264"/>
    </g>
  </svg>
`} />
);

ShowMore.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string
}

ShowMore.defaultProps = {
  height: (helpers.baseFontSize) + 'px',
  width: (helpers.baseFontSize) + 'px',
  color: helpers.black
}

export default ShowMore;
