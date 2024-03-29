import React from "react";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import styled from "styled-components";

import Logo from "./Logo.jsx";
import SideNav from "./SideNav.jsx";
import LoginButton from "./buttons/LoginButton.jsx";
import AddSchoolButton from "./buttons/AddSchoolButton.jsx";
import JoinButton from "./buttons/JoinButton.jsx";

import { withUserSchoolInfo, redirectUserBasedOnType } from "/imports/util/";

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from "./jss/helpers.js";

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: ${props => (props.navBarHeight ? props.navBarHeight + "px" : "auto")};
  z-index: 1299;
  position: ${props => (props.positionStatic ? "static" : "absolute")};
  ${props => props.position && `position: ${props.position};`}
  top: 0;
  background: ${props => props.navBgColor};
  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: ${helpers.rhythmDiv};
  }
`;

const ActionArea = styled.div`
  ${helpers.flexCenter},;
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  @media screen and (max-width : ${helpers.tablet + 100}px) {
    ${helpers.hide}
  }
`;

const NavBarInnerContent = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: ${helpers.rhythmDiv}px;
  z-index: 1;

  @media screen and (max-width: ${helpers.tablet}px) {
    :after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: ${props =>
    props.overlay ? helpers.overlayColor : "transparent"};
      z-index: -1;
    }
  }
`;

const BrandBar = props => (
  <NavBarWrapper
    position={props.position}
    positionStatic={props.positionStatic}
    navBarHeight={props.navBarHeight}
    navBgColor={props.navBgColor}
  >
    <NavBarInnerContent overlay={props.overlay}>
      {props.logoArea || (
        <Logo
          {...props.logoProps}
          showLogo={props.showLogo}
          onLogoClick={redirectUserBasedOnType(
            props.currentUser,
            props.isUserSubsReady
          )}
        />
      )}

      <ActionArea>
        {props.barButton ? (
          props.barButton
        ) : (
            <ButtonsWrapper>
              {isEmpty(props.currentUser) && <AddSchoolButton />}
              <JoinButton label="Sign Up" {...props} />
              <LoginButton icon={true} {...props} />
            </ButtonsWrapper>
          )}
        {props.menuButton ? (
          props.menuButton
        ) : (
            <SideNav {...props} {...props.menuButton} />
          )}
      </ActionArea>
    </NavBarInnerContent>
  </NavBarWrapper>
);

BrandBar.propTypes = {
  positionStatic: PropTypes.bool,
  logoArea: PropTypes.element,
  logoProps: PropTypes.object,
  barButton: PropTypes.element,
  menuButton: PropTypes.element,
  navBarHeight: PropTypes.string,
  position: PropTypes.string,
  overlay: PropTypes.bool,
  showLogo: PropTypes.bool
};

BrandBar.defaultProps = {
  positionStatic: false,
  navBgColor: "white",
  navBarHeight: "auto",
  overlay: false,
  showLogo: true
};

export default withUserSchoolInfo(BrandBar);
