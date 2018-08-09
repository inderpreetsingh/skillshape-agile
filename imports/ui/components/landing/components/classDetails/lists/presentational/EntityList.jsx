import React from "react";
import styled from "styled-components";

import { SlantedHeading } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";

import SearchEntity from "./SearchEntity.jsx";
import Entity from "./presentational/Entity.jsx";

const Wrapper = styled.div``;
const Entities = styled.div`
  display: flex;
`;
const EntityWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
`;

const EntityList = props => (
  <Wrapper>
    <SlantedHeading>
      {props.entityType} in class{" "}
      <SearchEntity searchedValue={props.searchedValue} />
    </SlantedHeading>
    <Entities>
      {props.data.map(obj => {
        <EntityWrapper>
          <Entity type={obj.type} name="Mr Panda" />
        </EntityWrapper>;
      })}
    </Entities>
  </Wrapper>
);

export default EntityList;
