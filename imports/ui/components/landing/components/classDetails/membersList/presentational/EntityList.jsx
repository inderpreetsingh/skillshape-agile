import React from "react";
import styled from "styled-components";

import { SlantedHeading } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";

import SearchList from "./SearchList.jsx";
import Entity from "./Entity.jsx";

const Wrapper = styled.div``;
const Entities = styled.div`
  display: flex;
`;
const EntityWrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
`;

const EntityList = props => (
  <Wrapper>
    <SlantedHeading>
      {props.entityType} in class
      <SearchList searchedValue={props.searchedValue} />
    </SlantedHeading>
    <Entities>
      {props.data &&
        props.data.map(obj => {
          <EntityWrapper>
            <Entity type={obj.type} name="Mr Panda" />
          </EntityWrapper>;
        })}
    </Entities>
  </Wrapper>
);

export default EntityList;
