import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ClassTimeCover from "./presentational/ClassTimeCover.jsx";
// import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { coverSrc } from "/imports/ui/components/landing/site-settings.js";

class ClassTimeCoverContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { bgImg, logoImg, classTypeName, classTypeId, slug } = this.props;
    return (
      <Fragment>
        <ClassTimeCover
          ctBgImg={bgImg}
          logoImg={logoImg}
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
