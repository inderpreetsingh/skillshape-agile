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

  handleSearchChange = type => e => {
    const value = e.target.value;
    this.setState(state => {
      return {
        ...state,
        [type]: value
      };
    });
  };

  getParticularEntityFromMembersList = entityType => {
    const { membersList } = this.props;
    const entities = membersList.filter(member => {
      if (typeof entityType == "string") return member.type == entityType;
      else return entityType.indexOf(member.type) !== -1;
    });
    // console.group("entities");
    // console.info(entities);
    // console.groupEnd();
    return entities;
  };

  render() {
    const { studentsList, instructorsList } = this.props;
    return (
      <Fragment>
        <EntityList
          searchedValue={this.state.teachersFilterWith}
          onSearchChange={this.handleSearchChange("teachersFilterWith")}
          data={
            this.getParticularEntityFromMembersList([
              "instructor",
              "assistant"
            ]) || instructorsList
          }
          entityType={"teachers"}
          searchedValue={this.state.teachersFilterWith}
        />
        <EntityList
          searchedValue={this.state.studentsFilterWith}
          onSearchChange={this.handleSearchChange("studentsFilterWith")}
          data={
            this.getParticularEntityFromMembersList("student") || studentsList
          }
          entityType={"students"}
          searchedValue={this.state.studentsFilterWith}
        />
      </Fragment>
    );
  }
}

MembersList.propTypes = {
  data: PropTypes.object,
  membersList: PropTypes.array
};

MembersList.defaultProps = {
  membersList: membersList
};

export default MembersList;
