import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import MembersList from "./presentational/MembersList.jsx";
import { membersList } from "/imports/ui/components/landing/constants/classDetails";

class MembersListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachersFilterWith: "",
      studentsFilterWith: ""
    };
  }

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
        <MembersList
          viewType="instructorsView"
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
        <MembersList
          viewType={"instructorsView"}
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

MembersListContainer.propTypes = {
  data: PropTypes.object,
  membersList: PropTypes.array
};

MembersListContainer.defaultProps = {
  membersList: membersList
};

export default MembersListContainer;
