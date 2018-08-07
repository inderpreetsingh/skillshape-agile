import React from "react";
import styled from "styled-components";

import Header from "./header/index.jsx";
import ClassTimeInformation from "./classTimeInformation/index.jsx";
import MembersList from "./membersList/index.jsx";

const Wrapper = styled.div`
  overflow-x: hidden;
`;

const ClassDetails = props => (
  <Wrapper>
    <Header {...props.headerProps} />
    <ClassTimeInformation {...props.ClassTimeInformation} />
    <MembersList />
  </Wrapper>
);

export default ClassDetails;
