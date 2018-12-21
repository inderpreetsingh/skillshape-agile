import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import ClassTimeCover from "./presentational/ClassTimeCover.jsx";

import { BuyPackagesDialogBox } from "/imports/ui/components/landing/components/dialogs/";
// import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc } from "/imports/ui/components/landing/site-settings.js";

class ClassTimeCoverContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      BuyPackagesDialogBoxState: false
    };
  }

  handleDialogBoxState = dialogState => () => {
    this.setState(state => {
      return {
        ...state,
        BuyPackagesDialogBoxState: dialogState
      };
    });
  };

  render() {
    const { bgImg, logoImg, classTypeName, classTypeId, slug } = this.props;
    const {
      buyPackagesBoxState
    } = this.state;
    return (
      <Fragment>
        {buyPackagesBoxState && (
          <BuyPackagesDialogBox
            packagesList={
              enrollmentPackags
            }
            open={buyPackagesBoxState}
            onModalClose={this.handleDialogBoxState(false)}
          />
        )}
        <ClassTimeCover
          ctBgImg={bgImg}
          logoImg={logoImg}
          onPurchaseButtonClick={this.handleDialogBoxState(true)}
          classTypeName={classTypeName}
          classTypeId={classTypeId}
          slug={slug}
        />
      </Fragment>
    );
  }
}

ClassTimeCoverContainer.propTypes = {
  bgImg: PropTypes.string,
  logoImg: PropTypes.string
};

ClassTimeCoverContainer.defaultProps = {
  bgImg: coverSrc,
  logoImg: coverSrc
};

export default ClassTimeCoverContainer;
