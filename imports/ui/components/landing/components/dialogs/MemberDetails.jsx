import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import AddSchoolMember from '/imports/ui/components/schoolMembers/AddSchoolMembers';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
    paddingBottom: `${helpers.rhythmDiv}px`,
  },
  dialogTitleRoot: {
    display: 'flex',
    fontFamily: `${helpers.specialFont}`,
  },
  dialogContent: {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    },
  },
  dialogAction: {
    width: '100%',
    margin: 0,
  },
  dialogActionsRoot: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  dialogActionsRootButtons: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv}px`,
    },
  },
  iconButton: {
    height: 'auto',
    width: 'auto',
  },
  formControlRoot: {
    marginBottom: `${helpers.rhythmDiv * 2}px`,
  },
};

const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;

const DialogTitleWrapper = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

class MemberDialogBox extends Component {
  render() {
    const {
      classes,
      open,
      fullScreen,
      onModalClose,
      renderStudentAddModal,
      view,
    } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="sign-up"
        classes={{ paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitleContainer>
            <DialogTitleWrapper>
              {view == 'classmates' ? 'Add New Member' : 'Add New Admin'}
            </DialogTitleWrapper>
            <IconButton
              color="primary"
              onClick={onModalClose}
              classes={{ root: classes.iconButton }}
            >
              <ClearIcon />
            </IconButton>
          </DialogTitleContainer>

          <DialogActions
            classes={{ root: classes.dialogActionsRoot, action: classes.dialogAction }}
          >
            <AddSchoolMember
              addNewMember={this.props.addNewMember}
              renderStudentModal={open}
              renderStudentAddModal={renderStudentAddModal}
            />
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

MemberDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  filterPanelProps: PropTypes.object,
  open: PropTypes.bool,
  errorText: PropTypes.string,
  unsetError: PropTypes.func,
};

export default withMobileDialog()(withStyles(styles)(MemberDialogBox));
