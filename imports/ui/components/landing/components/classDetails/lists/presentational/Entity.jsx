import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import {
  Text,
  SubHeading
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import * as helpers from "/imports/ui/components/landing/components/jss/";

const Wrapper = styled.div`
  background: ${helpers.panelColor};
`;

const ProfilePic = styled.div`
  background-image: url(${props.src});
  height: ${helpers.rhythmDiv * 8}px;
  width: ${helpers.rhythmDiv * 6}px;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: 0;
`;

const EntityDetails = styled.div`
  ${helpers.flexHorizontalSpaceBetween};
`;

const StudentNotes = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
`;

const StudentNotesContent = styled.textArea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  height: 100%;
  border-radius: 5px;
`;

const Status = styled.div``;

const Entity = props => (
  <Wrapper>
    <div>
      <ProfilePic src={props.imageSrc} />
      <EntityDetails>
        <SubHeading>{props.name}</SubHeading>
        {type !== "student" && <Text>{props.type}</Text>}
      </EntityDetails>
    </div>
    {type === "student" && (
      <StudentNotes>
        <StudentNotesContent>
          {props.studentNotes || "Notes about student here"}
        </StudentNotesContent>
      </StudentNotes>
    )}
  </Wrapper>
);

Entity.propTypes = {
  expanded: PropTypes.bool,
  showMoreOptions: PropTypes.bool,
  type: PropTypes.string //type can be student, teacher
};

export default Entity;
