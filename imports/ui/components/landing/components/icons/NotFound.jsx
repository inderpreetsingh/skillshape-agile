import React from 'react';
import SVGInline from "react-svg-inline";
import PropTypes from 'prop-types';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const NotFound = (props) => (
  	<div>
    	<SVGInline height={props.height} width={props.width} svg={`<svg fill="#E9B942" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    		<path d="M0 0h24v24H0z" fill="none"/>
    		<path d="M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/>
			</svg>`}
		/>
  </div>
);

NotFound.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
}

NotFound.defaultProps = {
  height: (helpers.baseFontSize * 12) + 'px',
  width: (helpers.baseFontSize * 12) + 'px'
}

export default NotFound;
