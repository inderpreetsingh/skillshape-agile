import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import SearchBar from 'material-ui-search-bar';
import MySearchBar from './MySearchBar.jsx';

import Logo from './Logo.jsx';
import SideNav from './SideNav.jsx';
import LoginButton from './buttons/LoginButton.jsx';
import AddSchoolButton from './buttons/AddSchoolButton.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from './jss/helpers.js';

/*Search Bar requires inline styles because of limitations of it using material-ui
rather than material ui next */
const MySearchBarWrapper = styled.div`
  margin-left: ${helpers.rhythmDiv}px;
  height: ${helpers.rhythmDiv * 4}px;
`;

const SearchBarStyled = (props) => {
  // console.log("SearchBarStyled-->>",props)
  return (<MySearchBarWrapper>
    <MySearchBar
      onChange={props.onSearch}
      onRequestSearch={props.onSearch}
      itemScope
      itemType="http://schema.org/SearchAction"
      className="is-search-bar" />
    </MySearchBarWrapper>)
}


const NavBarWrapper = styled.div`
  display : flex;
  justify-content: space-between;
  align-items: center;
  padding: ${helpers.rhythmDiv * 2}px;
  width: 100%;
  background: white;

`;

const ActionArea = styled.div`
  ${helpers.flexCenter},
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  @media screen and (max-width : ${helpers.tablet}px) {
    ${helpers.hide}
  }
`;

const LogoSearchSection = styled.div`
  ${helpers.flexCenter}
`;

const SideNavWrapper = styled.div`
  margin-left: ${helpers.rhythmDiv}px;
`;

const NavRightSection = styled.div`
  ${helpers.flexCenter}
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
  transition: color .1s linear;

  &:hover {
    color: ${helpers.textColor};
  }
`;

const TopSearchBar = (props) => (
  <NavBarWrapper >
    <LogoSearchSection>
      {props.logoArea ? props.logoArea :
      <Logo brandTextShown={false} width={32} height={32} />}
      <SearchBarStyled {...props.searchBar}/>
    </LogoSearchSection>

    <NavRightSection>
      <LinksWrapper>
        <TopBarLink>SkillShape For Schools</TopBarLink>
        <TopBarLink>Sign Up</TopBarLink>
        <TopBarLink>Log In</TopBarLink>
      </LinksWrapper>
      <SideNavWrapper>
        <SideNav {...props} smallSize={true}/>
      </SideNavWrapper>
    </NavRightSection>
  </NavBarWrapper>
);

TopSearchBar.propTypes = {
  logoArea: PropTypes.element,
  menuButton: PropTypes.element,
  searbBar: PropTypes.object,
}

TopSearchBar.defaultProps = {

}

export default TopSearchBar;
