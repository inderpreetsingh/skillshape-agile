import React from "react";
import styled from "styled-components";

import {
  SlantedHeading,
  Capitalize
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import {
  rhythmDiv,
  mobile
} from "/imports/ui/components/landing/components/jss/helpers.js";

import SearchList from "./SearchList.jsx";
import MemberExpanded from "./MemberExpanded.jsx";
import Member from "./Member.jsx";

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  margin-bottom: ${rhythmDiv * 7}px;
`;

const ListHeading = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${mobile - 50}px) {
    flex-direction: row;
  }
`;

const MembersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${props => (props.entityType === "students" ? `flex-direction: column` : "")};

  @media screen and (min-width: ${mobile - 50}px) {
    flex-direction: row;
  }
`;

const MemberWrapper = styled.div`
  padding: ${rhythmDiv}px;
  ${props =>
    props.expanded
      ? `max-width: 500px;
          width: 100%;`
      : ""};
`;

const Title = SlantedHeading.extend`
  display: flex;
  margin-bottom: ${rhythmDiv}px;

  @media screen and (min-width: ${mobile - 50}px) {
    margin-bottom: 0;
  }
`;

const MembersList = props => {
  const expanded =
    props.viewType === "instructorsView" && props.entityType === "students";
  return (
    <Wrapper>
      <ListHeading>
        <Title>
          <Capitalize>{props.entityType}&nbsp;</Capitalize> in class
        </Title>
        <SearchList
          onChange={props.onSearchChange}
          searchedValue={props.searchedValue}
        />
      </ListHeading>
      <MembersGrid entityType={props.entityType}>
        {props.data &&
          props.data.map(obj => (
            <MemberWrapper expanded={expanded} type={obj.type}>
              {expanded ? (
                <MemberExpanded viewType={props.viewType} {...obj} />
              ) : (
                <Member viewType={props.viewType} {...obj} />
              )}
            </MemberWrapper>
          ))}
        {/* Adding add instructors box*/}
        {props.entityType === "teachers" &&
          props.viewType === "instructorsView" && (
            <MemberWrapper expanded={expanded} type={"instructor"}>
              <Member
                addInstructor
                onAddIconClick={props.onAddIconClick}
                type="instructor"
              />
            </MemberWrapper>
          )}
      </MembersGrid>
    </Wrapper>
  );
};

export default MembersList;
