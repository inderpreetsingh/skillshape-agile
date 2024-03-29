import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';

const CardWrapper = styled.article`
  width: 100%;
  height: 100%;
  border-radius: ${helpers.rhythmDiv * 2}px;
  cursor: pointer;
  background-image: url('${(props) => props.active && props.bgImage}');
  padding: ${helpers.rhythmDiv * 2}px;
  background-color: ${(props) => props.active && props.cardBgColor};
  transition: 0.2s background-color ease-in, 0.2s background-image ease-in, 0.2s height linear;
  margin-bottom: ${helpers.rhythmDiv}px; 
  position: relative;
  z-index: 2;	

  @media screen and (max-width: ${helpers.tablet + 50}px ) {
	height: auto;	
  }
`;

const CardContent = Text.extend`
	display: flex;
	margin: 0;
	line-height: 1.2;
	transition: 0.2s max-height linear, 0.2s opacity linear 0.1s;
	font-size: 18px;
	max-height: ${(props) => (props.showContent ? helpers.rhythmDiv * 20 : 0)}px;
	opacity: ${(props) => (props.showContent ? 1 : 0)};
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

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		font-size: ${helpers.baseFontSize * 1.5}px;
	}
`;

const SolutionContent = styled.div`
	display: none;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		display: block;	
		max-width: 500px;
		width: 100%;
		transition: 0.2s height linear, 0.1s opacity linear;
		opacity: ${(props) => (props.showContent ? 1 : 0)};
		height: ${(props) => (props.showContent ? 300 : 0)}px;
		background-image: url('${props => props.solutionContent}');
		background-position: 50% 50%;
		background-size: cover;
		margin-bottom: ${helpers.rhythmDiv}px;
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
				<CardContent showContent={active}>{content}</CardContent>
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
