import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Header from "./presentational/Header.jsx";
import { withImageExists } from "/imports/util";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc } from "/imports/ui/components/landing/site-settings.js";

const configObject = {
  originalImagePath: "classTypeCoverSrc"
};

class HeaderContainer extends Component {
  handlePurchaseButtonClick = () => {
    console.log("this purchase button clicked");
  };
  render() {
    const { classTypeCoverSrc, schoolCoverSrc } = this.props;

    return (
      <Header
        classTypeCoverSrc={classTypeCoverSrc}
        schoolCoverSrc={schoolCoverSrc}
        onPurchaseButtonClick={this.handlePurchaseButtonClick}
      />
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
