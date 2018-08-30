import React from "react";
import styled from "styled-components";
import { withStyles } from "material-ui/styles";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import SkillShapeButton from "/imports/ui/components/landing/components/buttons/SkillShapeButton.jsx";
import DropDownMenu from "/imports/ui/components/landing/components/form/DropDownMenu.jsx";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { formatDate } from "/imports/util/formatSchedule";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  iconButton: {
    color: "white"
  }
};

const menuOptions = [
  {
    name: "Evaluate",
    value: "evalute"
  },
  {
    name: "View Student",
    value: "view_student"
  }
];

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  background: ${helpers.panelColor};
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    justify-content: space-between;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 450px;
  width: 100%;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    max-width: 300px;
    margin-right: ${helpers.rhythmDiv * 4}px;
  }
`;

const StudentNotes = styled.div`
  display: flex;
  min-width: 0;
`;

const StudentNotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  width: 100%;
  height: 100px;
  border-radius: 5px;
`;

const ShowOnSmallScreen = styled.div`
  display: block;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    display: none;
  }
`;

const HideOnSmall = styled.div`
  display: none;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    display: flex;
    flex-shrink: 0;
  }
`;

const MemberDetails = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  background: ${helpers.black};
  padding: ${helpers.rhythmDiv}px;
`;

const MemberDetailsInner = styled.div`
  display: flex;
`;

const MemberPic = styled.div`
  height: 50px;
  width: 50px;
  background-image: url('${props => props.url}');
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;

const MemberStatus = styled.div``;

const PaymentAndStatusDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    flex-direction: column;
    flex-wrap: none;
    justify-content: space-between;
    margin-bottom: 0;
  }
`;

const PaymentDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  margin-right: ${helpers.rhythmDiv * 2}px;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    margin-right: 0;
  }
`;

const StatusDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const PaymentExpires = Text.extend`
  font-weight: 300;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ExpiryDate = Text.extend`
  font-weight: 300;
  color: ${helpers.alertColor};
  font-style: italic;
`;

const onMenuItemClick = value => {
  console.log(value, "---", props.history);
  if (value === "remove_teacher") {
    props.history.push("/remove_teacher");
  } else {
    props.history.push("/some-random-link");
  }
};

const getStatusColor = status => {
  if (status.checkedIn) {
    return helpers.primaryColor;
  }

  return helpers.caution;
};

const getStatusInfo = status => {
  if (status.checkedIn) {
    return "Checked In";
  } else if (!status.checkedIn && status.signedIn) {
    return "Signed In";
  }

  return "Signed Out";
};

const PaymentAndStatus = props => (
  <PaymentAndStatusDetails>
    {props.paymentData.paymentInfo === "expired" ? (
      <PaymentDetails>
        <Text color={helpers.alertColor}>Payment Expired</Text>
        <SkillShapeButton
          noMarginBottom
          danger
          fullWidth
          label="Accept Payment"
        />
      </PaymentDetails>
    ) : (
      <PaymentDetails>
        <PaymentExpires>Payment Expires on</PaymentExpires>
        <ExpiryDate>{formatDate(props.paymentData.expiryDate)}</ExpiryDate>
      </PaymentDetails>
    )}
    <StatusOptions {...props} />
  </PaymentAndStatusDetails>
);

const StatusOptions = props => (
  <StatusDetails>
    <ButtonWrapper>
      <PrimaryButton
        noMarginBottom
        fullWidth
        label={props.status.checkedIn ? "Check in" : "Check out"}
      />
    </ButtonWrapper>
    <ButtonWrapper>
      <SkillShapeButton
        noMarginBottom
        caution
        fullWidth
        label={props.status.signedIn ? "Sign out" : "Sign in"}
      />
    </ButtonWrapper>
  </StatusDetails>
);

const MemberExpanded = props => {
  return (
    <Wrapper>
      <InnerWrapper>
        <MemberDetails>
          <MemberDetailsInner>
            <MemberPic url={props.profileSrc} />
            <MemberStatus>
              <Text color="white" fontSize="18">
                {props.name}
              </Text>
              <Text color={getStatusColor(props.status)}>
                {getStatusInfo(props.status)}
              </Text>
            </MemberStatus>
          </MemberDetailsInner>

          <DropDownMenu
            onMenuItemClick={onMenuItemClick}
            menuButtonClass={props.classes.iconButton}
            menuOptions={menuOptions}
          />
        </MemberDetails>

        <ShowOnSmallScreen>
          <PaymentAndStatus {...props} />
        </ShowOnSmallScreen>

        <StudentNotes>
          <StudentNotesContent>{props.studentNotes}</StudentNotesContent>
        </StudentNotes>
      </InnerWrapper>

      <HideOnSmall>
        <PaymentAndStatus {...props} />
      </HideOnSmall>
    </Wrapper>
  );
};

export default withStyles(styles)(MemberExpanded);