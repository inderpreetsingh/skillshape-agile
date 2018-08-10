import React from "react";
import styled from "styled-components";
import { withStyles } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import MoreVert from "material-ui-icons/MoreVert";
import Icon from "material-ui/Icon";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { formatDate } from "/imports/util/formatSchedule";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  iconButton: {
    color: "white",
    cursor: "pointer",
    height: 24,
    width: 24,
    fontSize: helpers.baseFontSize
  }
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  background: ${helpers.panelColor};
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (min-width: ${helpers.mobile - 100}px) {
    justify-content: space-between;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;

  @media screen and (min-width: ${helpers.mobile - 100}px) {
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

  @media screen and (min-width: ${helpers.mobile - 100}px) {
    display: none;
  }
`;

const HideOnSmall = styled.div`
  display: none;

  @media screen and (min-width: ${helpers.mobile - 100}px) {
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

  @media screen and (min-width: ${helpers.mobile - 100}px) {
    flex-direction: column;
    flex-wrap: none;
    justify-content: space-between;
    // align-items: space-between;
  }
`;

const PaymentDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  margin-right: ${helpers.rhythmDiv * 2}px;

  @media screen and (min-width: ${mobile - 100}px) {
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
  font-style: italic;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const getStatusColor = status => {
  return status == "checked in" ? helpers.caution : helpers.primaryColor;
};

const MemberExpanded = props => {
  return (
    <Wrapper>
      <InnerWrapper>
        <MemberDetails>
          <MemberDetailsInner>
            <MemberPic url={props.profileSrc} />
            <MemberStatus>
              <Text color="white">{props.name}</Text>
              <Text color={getStatusColor(props.status)}>{props.status}</Text>
            </MemberStatus>
          </MemberDetailsInner>

          <IconButton className={props.classes.iconButton}>
            <MoreVert />
          </IconButton>
        </MemberDetails>

        <ShowOnSmallScreen>
          <PaymentAndStatusDetails>
            {props.paymentData.paymentInfo === "expired" ? (
              <PaymentDetails>
                <Text color={helpers.alertColor}>Payment Expired</Text>
                <button className="black-button full-width">
                  Accept Payment
                </button>
              </PaymentDetails>
            ) : (
              <PaymentDetails>
                <PaymentExpires>Payment Expires on</PaymentExpires>
                <ExpiryDate>{formatDate(props.expiryDate)}</ExpiryDate>
              </PaymentDetails>
            )}
            <StatusDetails>
              <ButtonWrapper>
                <button className="primary-button full-width">Check in</button>
              </ButtonWrapper>
              <ButtonWrapper>
                <button className="caution-button full-width">Sign out</button>
              </ButtonWrapper>
            </StatusDetails>
          </PaymentAndStatusDetails>
        </ShowOnSmallScreen>

        <StudentNotes>
          <StudentNotesContent>{props.studentNotes}</StudentNotesContent>
        </StudentNotes>
      </InnerWrapper>

      <HideOnSmall>
        <PaymentAndStatusDetails>
          {props.paymentData.paymentInfo === "expired" ? (
            <PaymentDetails>
              <Text color={helpers.alertColor}>Payment Expired</Text>
              <ButtonWrapper>
                <button className="black-button">Accept Payment</button>
              </ButtonWrapper>
            </PaymentDetails>
          ) : (
            <PaymentDetails>
              <PaymentExpires>Payment Expires on</PaymentExpires>
              <ExpiryDate>
                {formatDate(props.paymentData.expiryDate)}
              </ExpiryDate>
            </PaymentDetails>
          )}
          <StatusDetails>
            <ButtonWrapper>
              <button className="primary-button full-width">Check in</button>
            </ButtonWrapper>
            <ButtonWrapper>
              <button className="caution-button full-width">Sign out</button>
            </ButtonWrapper>
          </StatusDetails>
        </PaymentAndStatusDetails>
      </HideOnSmall>
    </Wrapper>
  );
};

export default withStyles(styles)(MemberExpanded);
