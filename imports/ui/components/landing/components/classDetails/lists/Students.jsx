import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import EntityList from "./presentational/EntityList.jsx";

class Students extends Component {
  render() {
    return <EntityList entityType="students" />;
  }
}

Students.propTypes = {
  data: PropTypes.object
};

export default Students;
