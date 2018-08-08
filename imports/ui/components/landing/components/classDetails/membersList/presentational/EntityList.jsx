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
const Entities = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: ${mobile}px) {
    flex-direction: column;
  }
`;
const EntityWrapper = styled.div`
  padding: ${rhythmDiv}px;
`;

const ListHeading = SlantedHeading.extend`
  display: flex;
  // height: 36px;
`;

const EntityList = props => (
  <Wrapper>
    <ListHeading>
      <Capitalize>{props.entityType}&nbsp;</Capitalize>
      in class
      <SearchList
        onChange={props.onSearchChange}
        searchedValue={props.searchedValue}
      />
    </ListHeading>
    <Entities>
      {props.data &&
        props.data.map(obj => (
          <EntityWrapper type={obj.type}>
            <Entity viewType="studentsView" type={obj.type} {...obj} />
          </EntityWrapper>
        ))}
    </Entities>
  </Wrapper>
);

export default EntityList;
