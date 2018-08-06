import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import {
  Text,
  SubHeading
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  background: ${helpers.panelColor};
  width: 100%;
`;

const ProfilePic = styled.div`
  background-image: url(${props => props.src});
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

const StudentNotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  height: 100%;
  border-radius: 5px;
`;

const Status = styled.div``;

const ExpiresOn = Text.extend`
  font-style: italic;
  font-weight: 300;
`;

const Date = Text.extend`
  color: ${helpers.alertColor};
`;

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
    {type === "student" && (
      <Status>
        <PrimaryButton label="Checked In" icon iconName="arrow_drop_down" />
        {props.paymentInfo === "expired" ? (
          <Fragment>
            <Text>{"Payment Expired"}</Text>
            <PrimaryButton
              label="Accept Payment"
              onClick={props.onAcceptPayment}
            />
          </Fragment>
        ) : (
          <Fragment>
            <ExpiresOn>{props.paymentData.paymentType} expires on</ExpiresOn>
            <Date>{props.paymentData.expiryDate}</Date>
          </Fragment>
        )}
      </Status>
    )}
  </Wrapper>
);

Entity.propTypes = {
  expanded: PropTypes.bool,
  showMoreOptions: PropTypes.bool,
  type: PropTypes.string //type can be student, teacher
};

export default Entity;
