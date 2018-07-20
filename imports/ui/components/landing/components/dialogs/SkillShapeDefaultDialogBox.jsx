import React,{Component,Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { MuiThemeProvider} from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import { withStyles } from 'material-ui/styles';

import LoginButton from '/imports/ui/components/landing/components/buttons/LoginButton.jsx';
import JoinButton from '/imports/ui/components/landing/components/buttons/JoinButton.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const DialogTitleWrapper = styled.div`
  ${helpers.flexCenter}
  border-top: 5px solid ${props => props.color};
  width: 100%;
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
  text-align: center;
`;


const Title = styled.h2`
  margin: 0;
  color: ${props => props.color};
  font-weight: 400;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  line-height: 1;
`;

const Tagline = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
  font-family: ${helpers.specialFont};
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
`;


const ButtonWrapper = styled.div`
  margin-right: ${helpers.rhythmDiv}px;

`;

const popUpBasicConfig = {
  warning: {
    color: helpers.warningColor,
    title: 'Uh Oh!',
    tagline: 'Something went wrong. Please try again',
    affimateBtnText: 'Try Again'
  },
  alert: {
    color: helpers.alertColor,
    title: 'Are you sure?',
    tagline: 'It can cause serious issues. do you wanna continue ?',
    affimateBtnText: "Yes"
  },
  inform: {
    color: helpers.black,
    title: 'One more step...',
    tagline: 'You need to have an account on skillshape, before you can perform this action',
  },
  success: {
    color: helpers.primaryColor,
    title: 'Thank you!!',
    tagline: 'Your action is successfully completed',
    affimateBtnText: 'Okay'
  }
}

const styles = {
    dialogRoot: {
      maxWidth: 450,
      width: '100%',
      overflow: 'hidden',
    },
    dialogAction: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: 0,
        padding: helpers.rhythmDiv * 2,
    },
    dialogContent: {
      overflowY: 'visible',
      padding: `0 ${helpers.rhythmDiv * 2}px`,
    },
    iconButton: {
      position: 'absolute',
      right: 0,
      top: 0,
      height: 'auto',
      width: 'auto'
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
}

class SkillShapeDefaultDialogBox extends Component {
    getDefaultInformButtons = () => {
      return (<ButtonsWrapper>
        <JoinButton label="Sign Up"/>
        <LoginButton icon={true} />
        </ButtonsWrapper>);
    }
    getDefaultButtons = () => {
      const {RenderActions, type, onAffirmationButtonClick, onModalClose, onCloseButtonClick, classes} = this.props;
      return (<ButtonsWrapper>
        <ButtonWrapper><Button onClick={onModalClose || onAffirmationButtonClick} className={classes[type]}>
        {popUpBasicConfig[type].affimateBtnText}
        </Button></ButtonWrapper>
        {(type === 'alert' || type === 'warning') &&
          <ButtonWrapper><Button onClick={onModalClose || onCloseButtonClick} color="primary">
            Cancel
          </Button></ButtonWrapper>}
        </ButtonsWrapper>);
    }

    cloneRecursive = (children) => {
      // return React.children.map(children, element =>
      //   const elementProps = {};
      //   if (React.isValidElement(child)) {
      //       childProps = {someNew: "propToAdd"};
      //   }
      //   if(element.props.children) {
      //     element = this.cloneRecursive(element.props.children)
      //   }
      //   element.props.onClick
      // )

    }

    getActionButtons = () => {
      const {RenderActions, type, onAffirmationButtonClick, onModalClose, onCloseButtonClick} = this.props;
      console.log(type,"type in the actions ...")
      if(RenderActions) {

        return React.cloneElement(RenderActions);
      }else {
        if(type == 'inform') {
          return this.getDefaultInformButtons();
        }else if (type == 'alert' || type == 'success' || type == 'warning') {
          return this.getDefaultButtons();
        }
      }
    }

    render() {
        const {
          title,
          tagline,
          type,
          classes,
          onModalClose,
          onAffirmationButtonClick,
          open } = this.props;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                  title="skillshape popup"
                  open={open}
                  onClose={onModalClose}
                  onRequestClose={onModalClose}
                  aria-labelledby="skillshape-popup"
                  classes={{paper: classes.dialogRoot}}
                >
                    <DialogTitleWrapper color={popUpBasicConfig[type].color}>
                      <Title color={popUpBasicConfig[type].color}>
                        {title || popUpBasicConfig[type].title}
                      </Title>
                      <IconButton onClick={onModalClose} className={classes.iconButton + ' ' + classes[type]}>
                        <ClearIcon />
                      </IconButton>
                    </DialogTitleWrapper>

                    <DialogContent classes={{root: classes.dialogContent}}>
                      <Tagline> {tagline || popUpBasicConfig[type].tagline} </Tagline>
                    </DialogContent>

                    <DialogActions classes={{root: classes.dialogAction}}>
                      {this.getActionButtons()}
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

SkillShapeDefaultDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  onAffirmationButtonClick: PropTypes.func,
  onCloseButtonClick: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  tagline: PropTypes.string,
  RenderActions: PropTypes.element
}

SkillShapeDefaultDialogBox.defaultProps = {
  onAffirmationButtonClick: () => {},
}

export default withStyles(styles)(SkillShapeDefaultDialogBox);
