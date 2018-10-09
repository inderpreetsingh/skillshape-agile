import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';

import { lightenDarkenColor } from '/imports/util';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { cardImgSrc } from '/imports/ui/components/landing/site-settings.js';
import { CSSTransition } from 'react-transition-group';

const CardWrapper = styled.article`
  max-width: 400px;    
  width: 100%;
  border-radius: ${helpers.rhythmDiv * 2}px;
  cursor: pointer;
  background-image: url('${(props) => props.active && props.bgImage}');
  padding: ${helpers.rhythmDiv * 2}px;
  height: 100%;
  background-color: ${(props) => props.active && props.cardBgColor};
  transition: 0.2s background-color ease-in, 0.2s background-image ease-in;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet}px ) {
    margin-right: ${helpers.rhythmDiv * 2}px;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

const CardContent = Text.extend`
	margin: 0;
	line-height: 1.2;
	${(props) => (props.showContent ? `display: block` : 'display: none')};
`;

const CardTitle = styled.h3`
	font-size: ${helpers.baseFontSize * 1.5}px;
	font-weight: 500;
	font-style: italic;
	font-family: ${helpers.specialFont};
	margin: 0;
	margin-bottom: ${helpers.rhythmDiv}px;
	line-height: 1;
	text-transform: lowercase;

	:first-letter {
		text-transform: capitalize;
	}

	@media screen and (max-width: ${helpers.tablet + 100}px) {
		font-size: ${helpers.baseFontSize * 1.5}px;
	}
`;

const SolutionContent = styled.div`
	display: none;

	@media screen and (max-width: ${helpers.mobile}px) {
		display: ${(props) => (props.showContent ? 'block' : 'none')};	
		max-width: 500px;
		width: 100%;
		height: 300px;
		background-image: url('${(props) => props.solutionContent}');
		background-position: 50% 50%;
		background-size: cover;
	}

`;

class SchoolSolutionCard extends Component {
	render() {
		// console.log(this.state,"adsljfj")
		const { active, cardBgColor, bgImage, title, content, onCardClick, solutionContent } = this.props;
		return (
			<CardWrapper
				cardBgColor={cardBgColor}
				bgImage={bgImage}
				active={active}
				itemScope
				itemType="http://schema.org/Service"
				onClick={onCardClick}
			>
				<SolutionContent showContent={active} solutionContent={solutionContent} />
				<CardTitle>{title}</CardTitle>
				<CSSTransition
					in={active}
					timeout={{
						enter: 300,
						exit: 300
					}}
					classNames="fade"
				>
					<CardContent showContent={active}>{content}</CardContent>
				</CSSTransition>
			</CardWrapper>
		);
	}
}

SchoolSolutionCard.propTypes = {
	name: PropTypes.string,
	classes: PropTypes.object.isRequired,
	content: PropTypes.string,
	tagline: PropTypes.string,
	title: PropTypes.string,
	bgImage: PropTypes.string,
	cardBgColor: PropTypes.string,
	marginTop: PropTypes.string,
	onCardClick: PropTypes.func
};

export default SchoolSolutionCard;
