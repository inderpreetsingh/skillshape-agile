import React from "react";
import styled from "styled-components";
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import { rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";
const Wrapper = styled.header`
  background-image: url('${props => props.url}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  max-height: 400px;
  position: relative;
`;

const Notifcation = styled.div`
  position: absolute;
  top: 0;
`;

const ProfilePic = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: ${rhythmDiv * 2}px;
  left: ${rhythmDiv * 2}px;
  background-image: url('${props => props.url}');
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`;

const Header = props => (
  <Wrapper url={props.schoolCoverSrc}>
    <NotifcationWrapper>
      <Notifcation onPurchaseButtonClick={props.onPurchaseButtonClick} />
    </NotifcationWrapper>
    <ProfilePic url={props.profileCoverSrc} />
  </Wrapper>
);

export default Header;
