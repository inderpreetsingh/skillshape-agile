import React from "react";
import styled from "styled-components";

import {
  SlantedHeading,
  Capitalize
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";

import SearchList from "./SearchList.jsx";
import Entity from "./Entity.jsx";

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
`;
const Entities = styled.div`
  display: flex;
`;
const EntityWrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
`;

const ListHeading = SlantedHeading.extend`
  display: flex;
`;

const EntityList = props => (
  <Wrapper>
    <ListHeading>
      <Capitalize>{props.entityType}</Capitalize> in class
      <SearchList searchedValue={props.searchedValue} />
    </ListHeading>
    <Entities>
      {props.data &&
        props.data.map(obj => (
          <EntityWrapper>
            <Entity type={obj.type} {...obj} />
          </EntityWrapper>
        ))}
    </Entities>
  </Wrapper>
);

export default EntityList;
