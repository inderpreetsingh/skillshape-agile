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
import Entity from "./Entity.jsx";

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  margin-bottom: ${rhythmDiv * 4}px;
`;

const ListHeading = styled.div`
  display: flex;
  @media screen and (max-width: ${mobile - 50}px) {
    flex-direction: column;
  }
`;

const Entities = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: ${mobile}px) {
    ${props =>
      props.entityType === "students" ? `flex-direction: column` : ""};
  }
`;
const EntityWrapper = styled.div`
  padding: ${rhythmDiv}px;
`;

const Title = SlantedHeading.extend`
  display: flex;

  @media screen and (max-width: ${mobile - 50}px) {
    margin-bottom: ${rhythmDiv}px;
  }
`;

const EntityList = props => (
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
    <Entities entityType={props.entityType}>
      {props.data &&
        props.data.map(obj => (
          <EntityWrapper type={obj.type}>
            <Entity viewType="instructorsView" type={obj.type} {...obj} />
          </EntityWrapper>
        ))}
    </Entities>
  </Wrapper>
);

export default EntityList;
