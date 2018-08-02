import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Header from "/imports/ui/components/landing/components/classDetails/header/Header.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc } from "/imports/ui/components/landing/site-settings.js";

class HeaderContainer extends Component {
  handlePurchaseButtonClick = () => {};
  render() {
    return Header.call(this);
  }
}

HeaderContainer.propTypes = {
  coverSrc: PropTypes.string,
  profileSrc: PropTypes.string
};

HeaderContainer.defaultProps = {
  coverSrc: coverSrc
};

export default HeaderContainer;
