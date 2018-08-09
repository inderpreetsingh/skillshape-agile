import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import EntityList from "./presentational/EntityList.jsx";

class Teachers extends Component {
  render() {
    return <EntityList entityType="teachers" />;
  }
}

Teachers.propTypes = {
  data: PropTypes.object
};

export default Teachers;
