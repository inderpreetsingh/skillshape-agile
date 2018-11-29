import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import ClassTimeCover from "./presentational/ClassTimeCover.jsx";
import SelectPackagesDialogBox from "/imports/ui/components/landing/components/dialogs/SelectPackagesDialogBox.jsx";
// import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc } from "/imports/ui/components/landing/site-settings.js";


class ClassTimeCoverContainer extends Component {
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
    const { bgImg, logoImg, classTypeName, classTypeId, slug } = this.props;

    return (
      <Fragment>
        {this.state.selectPackagesDialogBoxState && (
          <SelectPackagesDialogBox
            open={this.state.selectPackagesDialogBoxState}
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
