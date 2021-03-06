import React, { Fragment } from "react";
import styled from "styled-components";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const InfoCapsule = styled.div`
  display: inline-flex;
  border-radius: 50px;
  background: ${helpers.lightTextColor};
  color: ${helpers.black};
  padding: ${helpers.rhythmDiv}px;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  margin-right: ${helpers.rhythmDiv}px;
  margin-top: 5px;
  margin-bottom: ${props => props.marginBottom || 0 }px;
  min-height: ${helpers.rhythmDiv * 4}px;
  line-height: 1;
`;

const CapsuleHead = styled.span`
  line-height: 1;
`;

const CapsuleText = styled.span`
  line-height: 1;
`;

const MetaInfo = props => (
  <InfoCapsule {...props}>
    <CapsuleHead><b>{props.title}</b></CapsuleHead>
    <CapsuleText style={{ marginLeft: "10px" }}> {props.data}</CapsuleText>
  </InfoCapsule>
);

export default MetaInfo;
