import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import EntityList from "./presentational/EntityList.jsx";

class MembersList extends Component {
  state = {
    teachersFilterWith: "",
    studentsFilterWith: ""
  };

  render() {
    return (
      <Fragment>
        <EntityList
          entityType={"teachers"}
          searchedValue={this.state.teachersFilterWith}
        />
        <EntityList
          entityType={"students"}
          searchedValue={this.state.studentsFilterWith}
        />
      </Fragment>
    );
  }
}

MembersList.propTypes = {
  data: PropTypes.object
};

export default MembersList;
