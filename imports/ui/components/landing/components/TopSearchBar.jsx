import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import JoinButton from './buttons/JoinButton';
import LoginButton from './buttons/LoginButton';
// TODO: Automatic imports depending upon variables used - intellij
import * as helpers from './jss/helpers';
import Logo from './Logo';
import SideNav from './SideNav';
import { redirectUserBasedOnType, withUserSchoolInfo } from '/imports/util';

/* Search Bar requires inline styles because of limitations of it using material-ui
rather than material ui next */

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${helpers.rhythmDiv * 2}px;
  width: 100%;
  background: white;
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

const LogoWrapper = styled.div`
  display: flex;
`;

const TopSearchBar = props => (
  <NavBarWrapper>
    <LogoSearchSection>
      {props.logoArea
        || (props.showLogo ? (
          <LogoWrapper onClick={redirectUserBasedOnType(props.currentUser, props.isUserSubsReady)}>
            <Logo showLogo={props.showLogo} brandTextShown={false} width={32} height={32} />
            <BrandText>Skillshape</BrandText>
          </LogoWrapper>
        ) : null)}
      {/* <MySearchBarStyled {...props.searchBar}/> */}
    </LogoSearchSection>

    <NavRightSection>
      <LinksWrapper>
        {isEmpty(props.currentUser) && (
          <TopBarLink onClick={props.handleLogoClick}>SkillShape For Schools</TopBarLink>
        )}
        {/* <TopBarLink onClick={props.onSignUpLinkClick}>Sign Up</TopBarLink>
        <TopBarLink onClick={props.onLoginLinkClick}>Log In</TopBarLink> */}
        <JoinButton label="Sign Up" {...props} />
        <LoginButton icon={false} {...props} />
      </LinksWrapper>
      <SideNavWrapper>
        <SideNav {...props} smallSize />
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
  onLogoClick: PropTypes.func,
};

export default withUserSchoolInfo(TopSearchBar);
