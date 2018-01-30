import React from 'react';
import SVGInline from "react-svg-inline";
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';

const Badge = (props) => (
  <SVGInline className={props.className} height={props.height} width={props.width} svg={`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 280.047 280.047" style="enable-background:new 0 0 280.047 280.047;" xml:space="preserve">
<g>
	<path style="fill:#E2574C;" d="M96.262,0h87.509c9.661,0,17.502,7.832,17.502,17.502v87.509l-61.256,35.003L78.76,105.01V17.502
		C78.76,7.832,86.601,0,96.262,0z"/>
	<polygon style="fill:#EBEBEB;" points="166.269,0 113.763,0 113.763,125.015 140.016,140.014 166.269,125.015 	"/>
	<path style="fill:#EFC75E;" d="M226.886,170.257c-1.523-4.507-5.399-7.815-10.081-8.532l-45.539-6.992l-19.803-42.424
		c-2.074-4.454-6.537-7.307-11.446-7.307c-4.9,0-9.355,2.853-11.446,7.307l-19.786,42.433l-45.539,6.992
		c-4.682,0.718-8.567,4.025-10.072,8.532c-1.505,4.524-0.368,9.503,2.94,12.908l33.367,34.4l-7.745,47.71
		c-0.788,4.804,1.234,9.635,5.189,12.435c2.17,1.54,4.725,2.328,7.281,2.328c2.091,0,4.2-0.525,6.108-1.584l39.703-22.061
		l39.703,22.061c1.916,1.059,4.017,1.584,6.108,1.584c2.564,0,5.11-0.788,7.289-2.328c3.955-2.8,5.968-7.631,5.18-12.435
		l-7.745-47.71l33.385-34.4C227.244,179.76,228.365,174.781,226.886,170.257z"/>
	<path style="fill:#D7B354;" d="M140.016,183.768c9.661,0,17.502,7.841,17.502,17.502c0,9.67-7.841,17.502-17.502,17.502
		s-17.502-7.832-17.502-17.502C122.514,191.6,130.355,183.768,140.016,183.768z"/>
	<path style="fill:#D65348;" d="M183.77,0H96.262C86.601,0,78.76,7.832,78.76,17.502h122.512C201.281,7.832,193.44,0,183.77,0z"/>
	<rect x="113.763" style="fill:#DFDFDF;" width="52.505" height="17.502"/>
</g>
</svg>`} />
);

Badge.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string,
}

Badge.defaultProps = {
  height: '32px',
  width: '32px'
}

export default Badge;