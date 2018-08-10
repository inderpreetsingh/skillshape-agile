import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import {
  Text,
  SubHeading,
  Capitalize
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import MemberExpanded from "./MemberExpanded.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  background: ${helpers.panelColor};
  display: flex;
  width: 100%;

  ${props =>
    props.type === "default"
      ? `width: 160px;
      height: 180px;`
      : ""};
`;

const Profile = styled.div`
  ${helpers.flexCenter};
  flex-direction: column;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: 0;

  ${props =>
    props.type === "default"
      ? `width: 100%; flex-grow: 1; flex-shrink: 0; padding-bottom: 0`
      : ""};
`;

const ProfilePic = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
  width: 100px;
  height: 100px;
  display: flex;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const StudentNotes = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  min-width: 0;
`;

const StudentNotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  height: 100%;
  border-radius: 5px;
`;

const Status = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  min-width: 0;
`;

/* prettier-ignore */

const ExpiresOn = Designation = Text.extend`
  font-style: italic;
  font-weight: 300;
`;

const Date = Text.extend`
  color: ${helpers.alertColor};
`;

const Member = props => {
  if (props.type === "student" && props.viewType === "instructorsView") {
    return <MemberExpanded {...props} />;
  }

  // This is the basic card returned for students in case the view
  // is not instructorsView && for teachers in both the cases.

  return (
    <Wrapper type="default">
      <Profile type="default">
        <ProfilePic src={props.profileSrc} />
        <Details>
          <SubHeading>{props.name}</SubHeading>
          {props.type !== "student" && <Text>{props.type}</Text>}
        </Details>
      </Profile>
    </Wrapper>
  );
};

Member.propTypes = {
  expanded: PropTypes.bool,
  showMoreOptions: PropTypes.bool,
  type: PropTypes.string //type can be student, teacher
};

export default Member;
