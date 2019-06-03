import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import { ContainerLoader } from '/imports/ui/loading/container';

const styles = theme => ({
  dialogTitleRoot: {
    padding: `${helpers.rhythmDiv * 4}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
    marginBottom: `${helpers.rhythmDiv * 2}px`,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  dialogContent: {
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    marginBottom: helpers.rhythmDiv * 2,
    flexShrink: 0,
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    },
  },
  dialogActionsRoot: {
    justifyContent: 'center',
    margin: 0,
  },
  dialogRoot: {
    minHeight: 400,
  },
  iconButton: {
    height: 'auto',
    width: 'auto',
  },
});

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class SchoolSuggestionDialogBox extends Component {
  state = {
    isBusy: false,
  };

  componentDidMount = () => {};

  render() {
    const { props } = this;
    // console.log(props,"...");
    return (
      <Fragment>
        {this.state.isBusy && <ContainerLoader />}
        <Dialog
          fullScreen={false}
          open={props.open}
          onClose={props.onModalClose}
          onRequestClose={props.onModalClose}
          aria-labelledby="manage unsubscriptions"
          classes={{ paper: props.classes.dialogRoot }}
        >
          <MuiThemeProvider theme={muiTheme}>
            <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
              <DialogTitleWrapper>
                <Title>Add Your Valuable Suggestion !</Title>
                <IconButton
                  color="primary"
                  onClick={props.onModalClose}
                  classes={{ root: props.classes.iconButton }}
                >
                  <ClearIcon />
                </IconButton>
              </DialogTitleWrapper>
            </DialogTitle>

            <DialogContent classes={{ root: props.classes.dialogContent }} />
          </MuiThemeProvider>
        </Dialog>
      </Fragment>
    );
  }
}

SchoolSuggestionDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  title: PropTypes.string,
};

SchoolSuggestionDialogBox.defaultProps = {
  title: 'Pricing',
};

export default withMobileDialog()(withStyles(styles)(SchoolSuggestionDialogBox));
