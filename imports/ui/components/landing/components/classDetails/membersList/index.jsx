import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import EntityList from "./presentational/EntityList.jsx";
import { membersList } from "/imports/ui/components/landing/constants/classDetails";

class MembersList extends Component {
  state = {
    teachersFilterWith: "",
    studentsFilterWith: ""
  };

  render() {
    return (
      <Fragment>
        <EntityList
          data={membersList}
          entityType={"teachers"}
          searchedValue={this.state.teachersFilterWith}
        />
        <EntityList
          data={membersList}
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
