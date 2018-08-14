import React from "react";
import styled from "styled-components";

import Header from "./header/index.jsx";
import ClassTimeInformation from "./classTimeInformation/index.jsx";
import MembersList from "./membersList/index.jsx";
import TimeLine from "./timeline/index.jsx";

const Wrapper = styled.div`
  overflow: hidden;
`;

const ClassDetails = props => (
  <Wrapper>
    <Header {...props.headerProps} />
    <ClassTimeInformation {...props.ClassTimeInformation} />
    <TimeLine {...props.timeLineProps} />
    <MembersList />
  </Wrapper>
);

export default ClassDetails;
