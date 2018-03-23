import React from 'react';
import SVGInline from "react-svg-inline";
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';

const TrendingIcon = (props) => (
  <SVGInline
    height={props.height}
    width={props.width}
    className={props.className}
    svg={`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	     viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
      <polygon style="fill:#F14742;" points="463.515,0 48.485,0 48.485,512 256,381.446 463.515,512 "/>
      <path style="fill:#FFD24D;" d="M388.692,162.487c-0.882-2.716-3.758-5.228-8.513-5.515l-84.734-5.664l-31.571-78.837
      	c-1.742-4.433-5.021-6.392-7.876-6.392s-6.134,1.959-7.876,6.392l-31.571,78.837l-84.734,5.664
      	c-4.755,0.287-7.631,2.799-8.513,5.515c-0.882,2.715-0.032,6.439,3.645,9.465l65.222,54.387l-20.797,82.336
      	c-1.197,4.61,0.305,8.124,2.613,9.801c2.309,1.677,6.114,2.018,10.129-0.544L256,272.712l71.88,45.222
      	c4.015,2.562,7.819,2.221,10.129,0.544c2.31-1.678,3.81-5.192,2.613-9.801l-20.797-82.336l65.221-54.387
      	C388.725,168.926,389.575,165.201,388.692,162.487z"/>
      </svg>`}
  />
);

TrendingIcon.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string
}

TrendingIcon.defaultProps = {
  height: (helpers.baseFontSize * 2) + 'px',
  width: (helpers.baseFontSize * 2) + 'px',
}

export default TrendingIcon;
