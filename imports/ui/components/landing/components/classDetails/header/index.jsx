import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Header from "./presentational/Header.jsx";
import SelectPackagesDialogBox from "/imports/ui/components/landing/components/dialogs/SelectPackagesDialogBox.jsx";
// import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc } from "/imports/ui/components/landing/site-settings.js";

class HeaderContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectPackagesDialogBoxState: false
    };
  }

  handleDialogBoxState = dialogState => () => {
    this.setState(state => {
      return {
        ...state,
        selectPackagesDialogBoxState: dialogState
      };
    });
  };

  render() {
    const { classTypeCoverSrc, schoolCoverSrc } = this.props;

    return (
      <Fragment>
        {this.state.selectPackagesDialogBoxState && (
          <SelectPackagesDialogBox
            open={this.state.selectPackagesDialogBoxState}
            onModalClose={this.handleDialogBoxState(false)}
          />
        )}
        <Header
          noPurchasedClasses={true}
          classTypeCoverSrc={classTypeCoverSrc}
          schoolCoverSrc={schoolCoverSrc}
          onPurchaseButtonClick={this.handleDialogBoxState(true)}
        />
      </Fragment>
    );
  }
}

HeaderContainer.propTypes = {
  classTypeCoverSrc: PropTypes.string,
  schoolCoverSrc: PropTypes.string
};

HeaderContainer.defaultProps = {
  classTypeCoverSrc: coverSrc,
  schoolCoverSrc: coverSrc
};

export default HeaderContainer;
