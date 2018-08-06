import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Header from "./presentational/Header.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc } from "/imports/ui/components/landing/site-settings.js";

class HeaderContainer extends Component {
  handlePurchaseButtonClick = () => {};
  render() {
    const { classTypeCoverSrc, schoolCoverSrc } = this.props;

    return (
      <Header
        profileCoverSrc={classTypeCoverSrc}
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
