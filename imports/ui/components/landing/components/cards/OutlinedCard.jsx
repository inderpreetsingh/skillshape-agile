import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { rhythmDiv, primaryColor } from '/imports/ui/components/landing/components/jss/helpers.js';

const CARD_WIDTH = 280;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	height: 380px;
	padding: ${rhythmDiv * 2}px;
	border-radius: 2px;
	border: 1px solid ${(props) => props.borderColor};
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
`;

const ButtonWrapper = styled.div`
	width: 100%;
	margin-bottom: ${rhythmDiv}px;
`;

const Content = Text.extend`
	text-align: center;
	font-size: 18px;
`;

const OutlinedCard = (props) => (
	<Wrapper borderColor={props.borderColor}>
		<Content>{props.content}</Content>
		<Buttons>
			<ButtonWrapper>
				<FormGhostButton
					fullWidth
					icon
					iconName={props.button1Icon}
					label={props.button1Label}
					onClick={props.onButton1Click}
				/>
			</ButtonWrapper>
			<ButtonWrapper>
				<FormGhostButton
					fullWidth
					icon
					iconName={props.button2Icon}
					label={props.button2Label}
					onClick={props.onButton2Click}
				/>
			</ButtonWrapper>
		</Buttons>
	</Wrapper>
);

OutlinedCard.propTypes = {
	content: PropTypes.string,
	borderColor: PropTypes.string,
	button1Icon: PropTypes.string,
	button2Icon: PropTypes.string,
	button1Label: PropTypes.string,
	button2Label: PropTypes.string,
	onButton1Click: PropTypes.func,
	onButton2Click: PropTypes.func
};

OutlinedCard.defaultProps = {
	borderColor: primaryColor
};

export default OutlinedCard;
