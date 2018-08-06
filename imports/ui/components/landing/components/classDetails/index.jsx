import React from "react";
import styled from "styled-components";

import Header from "./header/index.jsx";
import ClassTimeInformation from "./classTimeInformation/index.jsx";
import MembersList from "./membersList/index.jsx";

const Wrapper = styled.div``;

const ClassDetails = props => (
  <Wrapper>
    <Header />
    <ClassTimeInformation />
    <MembersList />
  </Wrapper>
);

export default ClassDetails;
