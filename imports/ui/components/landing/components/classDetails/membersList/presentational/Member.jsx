import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router";
import MemberExpanded from "./MemberExpanded.jsx";

import {
  Text,
  SubHeading,
  Capitalize
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";

import DropDownMenu from "/imports/ui/components/landing/components/form/DropDownMenu.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const menuOptions = [
  {
    name: "Evaluate",
    value: "evalute"
  },
  {
    name: "Remove Teacher",
    value: "remove_teacher"
  }
];

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
      ? `width: 100%; flex-grow: 1; flex-shrink: 0;`
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

const DetailsWrapper = styled.div`
  ${props =>
    props.type === "student"
      ? helpers.flexCenter
      : helpers.flexHorizontalSpaceBetween};
  align-items: flex-start;
  width: 100%;
  flex-shrink: 0;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${helpers.rhythmDiv}px;
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

const Member = props => {
  if (props.type === "student" && props.viewType === "instructorsView") {
    return <MemberExpanded {...props} />;
  }

  // This is the basic card returned for students in case the view
  // is not instructorsView && for teachers in both the cases.

  const onMenuItemClick = value => {
    console.log(value, "---", props.history);
    if (value === "remove_teacher") {
      props.history.push("/remove_teacher");
    } else {
      props.history.push("/some-random-link");
    }
  };

  return (
    <Wrapper type="default">
      <Profile type="default">
        <ProfilePic src={props.profileSrc} />
        <DetailsWrapper type={props.type}>
          <Details>
            <SubHeading fontSize="20">{props.name}</SubHeading>
            {props.type !== "student" && (
              <Text>
                <Capitalize>{props.type}</Capitalize>
              </Text>
            )}
          </Details>
          {props.viewType === "instructorsView" && (
            <DropDownMenu menuOptions={menuOptions} />
          )}
        </DetailsWrapper>
      </Profile>
    </Wrapper>
  );
};

Member.propTypes = {
  expanded: PropTypes.bool,
  showMoreOptions: PropTypes.bool,
  type: PropTypes.string //type can be student, teacher
};

export default withRouter(Member);