import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
// import SearchBar from 'material-ui-search-bar';
import { browserHistory, Link } from "react-router";
import MySearchBar from "./MySearchBar.jsx";
import { redirectUserBasedOnType } from "/imports/util";

import Logo from "./Logo.jsx";
import SideNav from "./SideNav.jsx";
import LoginButton from "./buttons/LoginButton.jsx";
import AddSchoolButton from "./buttons/AddSchoolButton.jsx";
import JoinButton from "./buttons/JoinButton.jsx";

import { withUserSchoolInfo } from "/imports/util";

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from "./jss/helpers.js";

/*Search Bar requires inline styles because of limitations of it using material-ui
rather than material ui next */
const MySearchBarWrapper = styled.div`
  margin-left: ${helpers.rhythmDiv}px;
  height: ${helpers.rhythmDiv * 4}px;
`;

const MySearchBarStyled = props => {
  return (
    <MySearchBarWrapper>
      <MySearchBar
        onChange={props.onSearch}
        onRequestSearch={props.onSearch}
        noCloseIcon
        itemScope
        itemType="http://schema.org/SearchAction"
        className="is-search-bar"
        {...props}
      />
    </MySearchBarWrapper>
  );
};

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${helpers.rhythmDiv * 2}px;
  width: 100%;
  background: white;
`;

const ActionArea = styled.div`
  ${helpers.flexCenter},;
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  @media screen and (max-width : ${helpers.tablet}px) {
    ${helpers.hide}
  }
`;

const LogoSearchSection = styled.div`
  ${helpers.flexCenter};
`;

const SideNavWrapper = styled.div`
  margin-left: ${helpers.rhythmDiv}px;
`;

const NavRightSection = styled.div`
  ${helpers.flexCenter};
`;

const LinksWrapper = styled.div`
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet}px) {
    display: none;
  }
`;

const TopBarLink = styled.a`
  display: inline-block;
  margin-right: ${helpers.rhythmDiv * 2}px;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  color: ${helpers.primaryColor};
  cursor: pointer;
  transition: color 0.1s linear;

  &:hover {
    color: ${helpers.textColor};
  }
`;

const BrandText = styled.h1`
  font-size: ${helpers.baseFontSize}px;
  margin: 0;
  font-weight: 600;
  line-height: 30px;
  color: ${helpers.danger};
`;

const MyLink = styled(Link)`
  display: flex;
`;

const LogoWrapper = styled.div`
  display: flex;
`;

const TopSearchBar = props => (
  <NavBarWrapper>
    <LogoSearchSection>
      {props.logoArea ||
        (props.showLogo ? (
          <LogoWrapper
            onClick={redirectUserBasedOnType(
              props.currentUser,
              props.isUserSubsReady
            )}
          >
            <Logo
              showLogo={props.showLogo}
              brandTextShown={false}
              width={32}
              height={32}
            />
            <BrandText>Skillshape</BrandText>
          </LogoWrapper>
        ) : null)}
      {/*<MySearchBarStyled {...props.searchBar}/> */}
    </LogoSearchSection>

    <NavRightSection>
      <LinksWrapper>
        {isEmpty(props.currentUser) && (
          <TopBarLink onClick={props.handleLogoClick}>
            SkillShape For Schools
          </TopBarLink>
        )}
        {/*<TopBarLink onClick={props.onSignUpLinkClick}>Sign Up</TopBarLink>
        <TopBarLink onClick={props.onLoginLinkClick}>Log In</TopBarLink>*/}
        <JoinButton label="Sign Up" {...props} />
        <LoginButton icon={false} {...props} />
      </LinksWrapper>
      <SideNavWrapper>
        <SideNav {...props} smallSize={true} />
      </SideNavWrapper>
    </NavRightSection>
  </NavBarWrapper>
);

TopSearchBar.propTypes = {
  logoArea: PropTypes.element,
  menuButton: PropTypes.element,
  searchBar: PropTypes.object,
  onSignUpLinkClick: PropTypes.func,
  onLoginLinkClick: PropTypes.func,
  onLogoClick: PropTypes.func
};

export default withUserSchoolInfo(TopSearchBar);
