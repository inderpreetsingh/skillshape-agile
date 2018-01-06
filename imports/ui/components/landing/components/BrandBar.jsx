import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Logo from './Logo.jsx';
import SideNav from './SideNav.jsx';
import LoginButton from './buttons/LoginButton.jsx';
import AddSchoolButton from './buttons/AddSchoolButton.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from './jss/helpers.js';

const NavBarWrapper = styled.div`
  display : flex;
  justify-content: space-between;
  padding: ${helpers.rhythmDiv};
  width:100%;
  z-index:1299;
  position:fixed;
  background:white;
  
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
    <NavBarWrapper>
      {props.logoArea ? props.logoArea : <Logo />}
    
      <ActionArea>
        {props.barButton ? props.barButton 
        : 
        (<ButtonsWrapper>
          <AddSchoolButton />
          <LoginButton icon={true}/>
        </ButtonsWrapper>)}
        {props.menuButton ? props.menuButton : <SideNav /> }
      </ActionArea>
      
    </NavBarWrapper>
);

BrandBar.propTypes = {
  logoArea: PropTypes.element,
  barButton: PropTypes.element,
  menuButton: PropTypes.element,
}


export default BrandBar;