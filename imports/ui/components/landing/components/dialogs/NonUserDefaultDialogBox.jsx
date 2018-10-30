import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import JoinButton from '../buttons/JoinButton.jsx';
import LoginButton from '../buttons/LoginButton.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';






const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexGrow: 0,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogActionsRoot: {
      justifyContent: 'center',
      margin: 0
    },
    dialogRoot: {

    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    },
    
  }
}

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ContentWrapper = styled.p`
  margin: 0;
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
  text-align: center;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Bold = styled.span`
  font-weight: 500;
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;


const NonUserDefaultDialogBox = (props) => {
    return (
      <Dialog
        fullScreen={false}
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="join skillshape"
        classes={{paper: props.classes.dialogRoot}}
      >
      <MuiThemeProvider theme={muiTheme}>
        <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
          <DialogTitleWrapper>
              <Title>{props.title}</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
        </DialogTitle>

        <DialogContent classes={{root : props.classes.dialogContent}}>
          <ContentWrapper>{props.content || <span>Press <Bold>Login</Bold> if already a member, or <Bold>Sign up</Bold> to become a member.</span>}</ContentWrapper>
        </DialogContent>

        <DialogActions classes={{root: props.classes.dialogActionsRoot}}>
          <ButtonsWrapper>
            <ButtonWrapper>
              <LoginButton />
            </ButtonWrapper>
            <ButtonWrapper>
              <JoinButton label="Sign Up"/>
            </ButtonWrapper>
          </ButtonsWrapper>
        </DialogActions>

      </MuiThemeProvider>
    </Dialog>
    );
}


NonUserDefaultDialogBox.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  content: PropTypes.node
}

NonUserDefaultDialogBox.defaultProps = {
  title: 'Join us'
}

export default withMobileDialog()(withStyles(styles)(NonUserDefaultDialogBox));
