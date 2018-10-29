import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { MuiThemeProvider } from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import { withStyles } from 'material-ui/styles';

import LoginButton from '/imports/ui/components/landing/components/buttons/LoginButton.jsx';
import JoinButton from '/imports/ui/components/landing/components/buttons/JoinButton.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';

import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';

const DialogTitleWrapper = styled.div`
	${helpers.flexCenter} border-top: 5px solid ${(props) => props.color};
	width: 100%;
	padding: ${helpers.rhythmDiv * 2}px;
	position: relative;
	text-align: center;
`;

const Title = styled.h2`
	margin: 0;
	color: ${(props) => props.color};
	font-weight: 400;
	font-family: ${helpers.specialFont};
	font-size: ${helpers.baseFontSize * 2}px;
	line-height: 1;
`;

const Content = styled.p`
	margin: 0;
	font-size: 18px;
	line-height: 1;
	font-family: ${helpers.specialFont};
	text-align: center;
`;

const ButtonsWrapper = styled.div`
	${(props) => (props.rightAlign ? 'justify-content: flex-end' : '')};
  flex-wrap: wrap;
  /* prettier-ignore */
	${helpers.flexCenter}
`;

const ButtonWrapper = styled.div`
	margin-right: ${helpers.rhythmDiv}px;
	margin-bottom: ${helpers.rhythmDiv}px;
`;

const popUpBasicConfig = {
	warning: {
		color: helpers.warningColor,
		title: 'Uh Oh!',
		content: 'Something went wrong. Please try again',
		affirmateBtnText: 'Try Again'
	},
	alert: {
		color: helpers.alertColor,
		title: 'Error',
		content: 'It can cause serious issues. do you wanna continue ?',
		affirmateBtnText: 'Close'
	},
	inform: {
		color: helpers.black,
		title: 'One more step...',
		content: 'You need to have an account on skillshape, before you can perform this action',
		affirmateBtnText: 'Yes'
	},
	success: {
		color: helpers.primaryColor,
		title: 'Thank you!!',
		content: 'Your action is successfully completed',
		affirmateBtnText: 'Okay'
	}
};

const styles = () => {
	const stylesObject = {
		dialogRoot: {
			maxWidth: 600,
			width: '100%',
			overflow: 'hidden'
		},
		dialogActionRoot: {
			width: '100%',
			margin: 0,
			padding: helpers.rhythmDiv * 2
		},
		dialogAction: {
			width: '100%',
			display: 'flex'
		},
		dialogContent: {
			overflowY: 'visible',
			padding: `0 ${helpers.rhythmDiv * 2}px`
		},
		iconButton: {
			position: 'absolute',
			right: 0,
			top: 0,
			height: 'auto',
			width: 'auto'
		},
		ghostCommon: {
			fontFamily: helpers.specialFont,
			fontSize: helpers.baseFontSize,
			backgroundColor: 'transparent',
			border: '1px solid',
			borderColor: helpers.primaryColor,
			color: helpers.primaryColor,
			textTransform: 'none',
			'&:hover': {
				backgroundColor: helpers.primaryColor,
				color: 'white'
			}
		},
		['ghost.alert']: {
			color: popUpBasicConfig.alert.color,
			borderColor: popUpBasicConfig.alert.color,
			'&:hover': {
				backgroundColor: popUpBasicConfig.alert.color,
				color: 'white'
			}
		},
		['ghost.inform']: {
			color: popUpBasicConfig.inform.color,
			borderColor: popUpBasicConfig.inform.color,
			'&:hover': {
				backgroundColor: popUpBasicConfig.inform.color,
				color: 'white'
			}
		},
		['ghost.warning']: {
			color: popUpBasicConfig.warning.color,
			borderColor: popUpBasicConfig.warning.color,
			'&:hover': {
				backgroundColor: popUpBasicConfig.warning.color,
				color: 'white'
			}
		},
		['ghost.success']: {
			color: popUpBasicConfig.success.color,
			borderColor: popUpBasicConfig.success.color,
			'&:hover': {
				backgroundColor: popUpBasicConfig.success.color,
				color: 'white'
			}
		},
		warning: {
			color: popUpBasicConfig.warning.color
		},
		alert: {
			color: popUpBasicConfig.alert.color
		},
		inform: {
			color: popUpBasicConfig.inform.color
		},
		success: {
			color: popUpBasicConfig.success.color
		}
	};

	return stylesObject;
};

class SkillShapeDialogBox extends Component {
	getDefaultInformButtons = () => {
		return (
			<ButtonsWrapper>
				<JoinButton label="Sign Up" />
				<LoginButton icon={true} />
			</ButtonsWrapper>
		);
	};

	_getAffirmateButtonClasses = () => {
		const { type, defaultButtons, classes } = this.props;
		if (type == 'alert' && !defaultButtons) {
			return classes['ghostCommon'] + ' ' + classes['ghost.inform'];
		} else {
			return classes['ghostCommon'] + ' ' + classes[`ghost.${type}`];
		}
	};

	_getAffirmateButtonText = () => {
		const { type, defaultButtons, classes, affirmateBtnText } = this.props;
		if (affirmateBtnText) {
			return affirmateBtnText;
		}

		return defaultButtons && type === 'alert' ? 'Yes' : popUpBasicConfig[type].affirmateBtnText;
	};

	_getCancelButtonText = () => {
		const { cancelBtnText } = this.props;
		if (cancelBtnText) return cancelBtnText;
		return 'Cancel';
	};

	_getCancelButtonClasses = () => {
		const { type, defaultButtons, classes } = this.props;
		// debugger;
		if (type == 'alert') {
			return classes['ghostCommon'] + ' ' + classes['ghost.inform'];
		} else {
			return classes['ghostCommon'] + ' ' + classes[`ghost.${type}`];
		}
	};

	getDefaultButtons = (defaultButtons) => {
		const {
			RenderActions,
			type,

			onAffirmationButtonClick,
			onModalClose,
			onCloseButtonClick,
			classes,
			fromPackageListing
		} = this.props;
		return (
			<ButtonsWrapper rightAlign>
				{(type === 'warning' || defaultButtons) && (
					<ButtonWrapper>
						<Button onClick={onCloseButtonClick || onModalClose} className={this._getCancelButtonClasses()}>
							{this._getCancelButtonText()}
						</Button>
					</ButtonWrapper>
				)}
				<ButtonWrapper>
					<Button
						onClick={onAffirmationButtonClick || onModalClose}
						className={
							fromPackageListing ? (
								classes['ghostCommon'] + ' ' + classes[`ghost.success`]
							) : (
								this._getAffirmateButtonClasses()
							)
						}
					>
						{this._getAffirmateButtonText()}
					</Button>
				</ButtonWrapper>
			</ButtonsWrapper>
		);
	};

	applyCloseToRenderActions = (elements) => {
		const { onModalClose } = this.props;

		const createNewOnClickHandler = (oldClickHandler) => (e) => {
			onModalClose();
			oldClickHandler && oldClickHandler();
		};

		return React.Children.map(elements, (child) => {
			if (!React.isValidElement(child)) return child;

			const childProps = { ...child.props };
			if (React.isValidElement(child) && childProps.applyClose) {
				const newOnClickHandler = createNewOnClickHandler(childProps.onClick);
				childProps.onClick = newOnClickHandler;
			}

			if (childProps.children) {
				childProps.children = this.applyCloseToRenderActions(childProps.children);
			}

			return React.cloneElement(child, childProps);
			// element.props.onClick;
		});
	};

	getActionButtons = () => {
		const {
			type,
			defaultButtons,
			RenderActions,
			onAffirmationButtonClick,
			onModalClose,
			onCloseButtonClick
		} = this.props;
		if (RenderActions) {
			return this.applyCloseToRenderActions(RenderActions);
		} else {
			if (defaultButtons) {
				return this.getDefaultButtons(defaultButtons);
			} else if (type == 'inform') {
				return this.getDefaultInformButtons();
			} else if (type == 'alert' || type == 'success' || type == 'warning') {
				return this.getDefaultButtons();
			}
		}
	};

	render() {
		const {
			title,
			content,
			type,
			ghostButtons,
			classes,
			onModalClose,
			onAffirmationButtonClick,
			open
		} = this.props;
		return (
			<MuiThemeProvider theme={muiTheme}>
				<Dialog
					open={open}
					onClose={onModalClose}
					onRequestClose={onModalClose}
					aria-labelledby="skillshape-popup"
					classes={{ paper: classes.dialogRoot }}
				>
					<DialogTitleWrapper color={popUpBasicConfig[type].color}>
						<Title color={popUpBasicConfig[type].color}>{title || popUpBasicConfig[type].title}</Title>
						<IconButton onClick={onModalClose} className={classes.iconButton + ' ' + classes[type]}>
							<ClearIcon />
						</IconButton>
					</DialogTitleWrapper>

					<DialogContent classes={{ root: classes.dialogContent }}>
						<Content> {content || popUpBasicConfig[type].content} </Content>
					</DialogContent>

					<DialogActions
						classes={{
							root: classes.dialogActionRoot,
							action: classes.dialogAction
						}}
					>
						{this.getActionButtons()}
					</DialogActions>
				</Dialog>
			</MuiThemeProvider>
		);
	}
}

SkillShapeDialogBox.propTypes = {
	onModalClose: PropTypes.func,
	onAffirmationButtonClick: PropTypes.func,
	onCloseButtonClick: PropTypes.func,
	open: PropTypes.bool,
	title: PropTypes.string,
	content: PropTypes.string,
	type: PropTypes.string,
	RenderActions: PropTypes.element,
	affirmateBtnText: PropTypes.string,
	cancelBtnText: PropTypes.string,

	// default Buttons will make sure, both the Yes/No counter part will appear
	// without default buttons we only have the buttons in boxes according to the most
	// used functionality
	defaultButtons: PropTypes.bool
};

SkillShapeDialogBox.defaultProps = {
	onAffirmationButtonClick: () => {},
	defaultButtons: false
};

export default withStyles(styles)(SkillShapeDialogBox);
