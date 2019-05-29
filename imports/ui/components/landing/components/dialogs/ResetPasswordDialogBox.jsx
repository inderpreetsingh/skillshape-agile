import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel } from 'material-ui/Input';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';






const styles = theme => {
  return {
    dialogTitleRoot: {
        padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
        marginBottom: `${helpers.rhythmDiv * 2}px`,
      	'@media screen and (max-width : 500px)': {
        	padding: `0 ${helpers.rhythmDiv * 3}px`
        }
    },
    dialogContent: {
      	padding: `0 ${helpers.rhythmDiv * 3}px`,
      	flexShrink: 0,
      	'@media screen and (max-width : 500px)': {
        	minHeight: '150px'
      	}
    },
    dialogActionsRoot: {
      	padding: '0 8px',
      	display: 'flex',
      	flexDirection: 'column',
      	alignItems: 'flex-end',
      	justifyContent: 'flex-start'
    },
    dialogActions: {
      	width: '100%',
      	paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    iconButton: {
      	height: 'auto',
      	width: 'auto'
    }
  }
}

const DialogTitleWrapper = styled.div`
  	${helpers.flexHorizontalSpaceBetween}
  	font-family: ${helpers.specialFont};
  	width: 100%;
`;

const ErrorWrapper = styled.span`
 	color: red;
 	float: left;
`;

const DialogActionWrapper = styled.div`
  	display: flex;
  	flex-direction: column;
  	padding: 0 ${helpers.rhythmDiv * 3}px;
  	margin: 0;
  	margin-top: ${helpers.rhythmDiv}px;
  	width: 100%;
  	flex-shrink: 0;

  	@media screen and (max-width: ${helpers.mobile}px) {
    	flex-direction: column;
   	 	min-height: 100px
  	}
`;

const ResetPasswordButtonWrapper = styled.div`
  	margin: ${helpers.rhythmDiv}px 0;
  	float: right;
`;

const ResetPasswordDialogBox = (props) => (
  	<Dialog
    	fullScreen={props.fullScreen}
    	open={props.open}
    	onClose={props.onModalClose}
    	onRequestClose={props.onModalClose}
    	aria-labelledby="RecoverPassword"
    	itemScope
    	itemType="http://schema.org/CheckInAction"
  	>
  	{ props.loading && <ContainerLoader/>}
  	<MuiThemeProvider theme={muiTheme}>
    	<DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
      		<DialogTitleWrapper>
          		<span itemProp="name">Forgot your Password? Let's get you a new one</span>
          		<IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
            		<ClearIcon/>
          		</IconButton>
        	</DialogTitleWrapper>
    	</DialogTitle>

   		<DialogContent classes={{root : props.classes.dialogContent}}>
        	<form onSubmit={props.resetPasswordFormSubmit}>
            	<FormControl error={props.error.email} margin="dense" fullWidth aria-describedby="email-error-text">
              		<InputLabel htmlFor="email">Email Address</InputLabel>
		              <Input
		                autoFocus
		                id="email"
		                type="email"
		                value={props.email}
		                onChange={props.handleInputChange}
		                fullWidth
		               />
		               {
		                    props.error.email && <FormHelperText id="email-error-text">Invalid email address</FormHelperText>
		               }
		        </FormControl>
	            {
	              props.error.message && <ErrorWrapper>
	                { props.error.message }
	                </ErrorWrapper>
	            }
	            <ResetPasswordButtonWrapper>
	                <PrimaryButton
	                    type="submit"
	                    label="Submit"
	                    disabled={props.error.email}
	                    noMarginBottom
	                />
	            </ResetPasswordButtonWrapper>
        	</form>
    	</DialogContent>
    </MuiThemeProvider>
  </Dialog>
);

ResetPasswordDialogBox.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  handleInputChange: PropTypes.func,
  onModalClose: PropTypes.func,
}

export default withMobileDialog()(withStyles(styles)(ResetPasswordDialogBox));
