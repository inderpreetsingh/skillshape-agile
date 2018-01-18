import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SearchBar from 'material-ui-search-bar';

import Logo from './Logo.jsx';
import SideNav from './SideNav.jsx';
import LoginButton from './buttons/LoginButton.jsx';
import AddSchoolButton from './buttons/AddSchoolButton.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from './jss/helpers.js';

/*Search Bar requires inline styles because of limitations of it using material-ui
rather than material ui next */

const SearchBarStyled = (props) => {
  // console.log("SearchBarStyled-->>",props)
  return <SearchBar
      style={{
        root: {
          fontFamily: helpers.specialFont,
          fontSize: helpers.baseFontSize*2+'px',
          borderRadius: '50px',
          margin: '0 auto',
        },
        input: {
          padding: '7px 0 14px'
        }
      }}
    style={
      {
        borderRadius: '50px'
      }
    }
    onChange={props.onSearch}
    onRequestSearch={props.onSearch}
    itemScope
    itemType="http://schema.org/SearchAction"
    className = 'is-search-bar'
    hintText ='Yoga in Delhi...'
    />
  }


const NavBarWrapper = styled.div`
  display : flex;
  justify-content: space-between;
  padding: ${helpers.rhythmDiv}px;
  width: 100%;
  z-index: 1299;
  position: ${props => props.positionFixed ? 'fixed': 'absolute'};
  background: white;
  top: 0;
  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: ${helpers.rhythmDiv};
  }
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

const BrandBar = (props) => (
    <NavBarWrapper positionFixed={props.positionFixed}>
      {props.logoArea ? props.logoArea : <Logo smallBrandText />}

      <SearchBarStyled />

      {props.menuButton ? props.menuButton : <SideNav {...props}/> }
    </NavBarWrapper>
);

BrandBar.propTypes = {
  positionFixed: PropTypes.bool,
  logoArea: PropTypes.element,
  barButton: PropTypes.element,
  menuButton: PropTypes.element,
}

BrandBar.defaultProps = {
  positionFixed: false
}

export default BrandBar;
