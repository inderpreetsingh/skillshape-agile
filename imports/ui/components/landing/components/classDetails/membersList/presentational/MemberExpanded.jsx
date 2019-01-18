import React from "react";
import styled from "styled-components";
import { withStyles } from "material-ui/styles";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import SkillShapeButton from "/imports/ui/components/landing/components/buttons/SkillShapeButton.jsx";
import DropDownMenu from "/imports/ui/components/landing/components/form/DropDownMenu.jsx";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { formatDate } from "/imports/util/formatSchedule";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { get, isEmpty } from 'lodash';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { browserHistory, Link } from "react-router";
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
const styles = {
  iconButton: {
    color: "white",
    paddingLeft: rhythmDiv
  }
};
const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;

const menuOptions = [
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
  margin-right: ${helpers.rhythmDiv}px;
  background-image: url('${props => props.url}');
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;

const MemberStatus = styled.div``;

const PaymentAndStatusDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: space-between;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
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
  
  @media screen and (min-width: ${helpers.mobile - 50}px) {
  
  }
`;

const StatusDetails = styled.div`
  ${helpers.flexCenter}
  justify-content: space-between;
  
  @media screen and (min-width: ${helpers.mobile - 50}px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const StatusButton = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    display: block;
  }
`;

const Name = Text.extend`
  font-size: 18px;
  color: white;
  word-break: break-word;  
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

const onMenuItemClick = (value, slug) => {
  value = value.value;
  if (value === "view_student") {
    browserHistory.push(`/schools/${slug}/members`);
  }
};

const getStatusColor = status => {
  if (true) {
    return helpers.primaryColor;
  }

  return helpers.caution;
};

const getStatusInfo = status => {
  if (status == 'signIn') {
    return 'Signed In';
  } else if (status == 'signOut') {
    return 'Singed Out';
  }
  else if (status == 'checkIn') {
    return 'Checked In';
  }
  else if (status == 'checkOut') {
    return 'Check In';
  }
};

PaymentAndStatus = (props) => {
  let { alreadyPurchasedData: { epStatus, purchased, purchasedEP } } = props;
  if (props.purchaseData) {
    let { endDate, packageType, noClasses } = props.purchaseData;
    let text = packageType == 'MP' ? 'Monthly expires' : `${noClasses} ${noClasses > 1 ? 'Classes' : 'Class'} Remaining`
    return (<PaymentAndStatusDetails>
      <PaymentDetails>
        <PaymentExpires>{text}</PaymentExpires>
        <ExpiryDate>{formatDate(endDate)}</ExpiryDate>
      </PaymentDetails>
      <StatusOptions {...props} />
    </PaymentAndStatusDetails>
    )
  }
  if (epStatus && !isEmpty(purchased)) {
    return (<PaymentAndStatusDetails>
      <PaymentDetails>
        <SkillShapeButton
          noMarginBottom
          danger
          fullWidth
          label="Choose Packages"
          onClick={() => { props.updateStatus(2, props) }}
        />
      </PaymentDetails>
      <StatusOptions {...props} />
    </PaymentAndStatusDetails>
    )
  }
  return (<PaymentAndStatusDetails>
    <PaymentDetails>
      <Text color={helpers.alertColor}>No Package</Text>
      <SkillShapeButton
        noMarginBottom
        danger
        fullWidth
        label="Accept Payment"
        onClick={() => { props.onAcceptPaymentClick(true, props) }}
      />
    </PaymentDetails>
    <StatusOptions {...props} />
  </PaymentAndStatusDetails>)
}
reverseStatus = (status) => {
  if (status == 'signIn' || status == 'checkOut') {
    return 'Check In';
  }
  else {
    return 'Check Out';
  }
}
const StatusOptions = props => (
  <StatusDetails>
    <StatusButton>
      <PrimaryButton
        noMarginBottom
        fullWidth
        label={reverseStatus(props.status)}
        onClick={() => { props.updateStatus(1, props) }}
      />
    </StatusButton>
    <StatusButton>
      <SkillShapeButton
        noMarginBottom
        caution
        fullWidth
        label={"Sign Out"}
        onClick={() => { props.updateStatus(3, props) }}
      />
    </StatusButton>
  </StatusDetails>
);

const MemberExpanded = props => {
  const profile = props.profile;
  const profileSrc = get(profile, 'medium', get(profile, 'pic', config.defaultProfilePicOptimized))
  const name = `${get(profile, 'firstName', get(profile, 'name', 'Old Data'))} ${get(profile, 'lastName', "")}`
  const slug = get(props, "params.slug", null);
  let classTypeId = get(props.classData[0], 'classTypeId', null);
  let buyPackagesBoxState = props.buyPackagesBoxState;
  return (
    <Wrapper key={name}>

      <InnerWrapper>
        <MemberDetails>
          <MemberDetailsInner>
            <MemberPic url={profileSrc} />
            <MemberStatus>
              <Name>{name}</Name>
              <Text color={getStatusColor(props.status)}>
                {getStatusInfo(props.status)}
              </Text>
            </MemberStatus>
          </MemberDetailsInner>

          <DropDownMenu
            onMenuItemClick={(value) => { onMenuItemClick(value, slug) }}
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
