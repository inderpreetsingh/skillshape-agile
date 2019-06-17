import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogContent, withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import FilterPanel from '../FilterPanel';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import AttachedAlert from '/imports/ui/components/landing/components/helpers/AttachedAlert';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
    paddingBottom: `${helpers.rhythmDiv}px`,
    position: 'relative',
    overflowY: 'auto',
  },
  dialogTitleRoot: {
    display: 'flex',
    fontFamily: `${helpers.specialFont}`,
  },
  dialogContentRoot: {
    width: '100%',
    padding: `${helpers.rhythmDiv}px 0 0 ${helpers.rhythmDiv}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  iconButton: {
    position: 'absolute',
    right: helpers.rhythmDiv,
    height: 'auto',
    width: 'auto',
  },
};

const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  width: calc(100% - ${helpers.rhythmDiv * 4}px);
  justify-content: space-between;
  padding: 0 ${helpers.rhythmDiv * 3}px;
  padding-right: 0;
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;

  @media screen and (max-width: ${helpers.mobile - 100}px) {
    flex-direction: column;
  }
`;

const DialogTitle = styled.h1`
  font-family: ${helpers.specialFont};
  font-weight: 500;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

class FiltersDialogBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterDialogBoxNoSearch: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.info(
    //   this.props.filterPanelProps,
    //   nextProps.filterPanelProps,
    //   "component will receive props....................."
    // );
    if (
      this.props.filterPanelProps.isCardsBeingSearched
      !== nextProps.filterPanelProps.isCardsBeingSearched
    ) {
      this.setState({
        filterDialogBoxNoSearch: false,
      });
    }
  }

  render() {
    const {
      classes,
      open,
      title,
      fullScreen,
      onModalClose,
      filterPanelProps,
      filtersForSuggestion,
      onGiveSuggestion,
    } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="filters-dialog-box"
        classes={{ paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitleContainer fullScreen={fullScreen}>
            <DialogTitle>{title}</DialogTitle>

            <AttachedAlert
              open={!filterPanelProps.isCardsBeingSearched && !this.state.filterDialogBoxNoSearch}
              direction="right"
              alertMsg="Search results updated"
            />
            <IconButton
              color="primary"
              onClick={onModalClose}
              classes={{ root: classes.iconButton }}
            >
              <ClearIcon />
            </IconButton>
          </DialogTitleContainer>

          <DialogContent
            classes={{
              root: classes.dialogContentRoot,
            }}
          >
            <FilterPanel
              {...filterPanelProps}
              filtersInDialogBox
              onModalClose={onModalClose}
              onGiveSuggestion={onGiveSuggestion}
              filtersForSuggestion={filtersForSuggestion}
            />
          </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

FiltersDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  filterPanelProps: PropTypes.object,
  filtersForSuggestion: PropTypes.bool,
  onGiveSuggestion: PropTypes.func,
  open: PropTypes.bool,
};

FiltersDialogBox.defaultProps = {
  title: 'Filter Content',
  onGiveSuggestion: () => {},
};

export default withMobileDialog()(withStyles(styles)(FiltersDialogBox));
