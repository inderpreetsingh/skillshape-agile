// import SearchBar from 'material-ui-search-bar';
import { red } from 'material-ui/colors';
import React, { Component } from 'react';
// Import Buttons
import LoginButton from './buttons/Login';
import MenuIconButton from './buttons/MenuIconButton';
import FilterCards from './FilterCards';
import Logo from './Logo';

class IsNavBar extends Component {
  render() {
    const { brandText, brandTagline } = this.props;
    return (
      <div className="wrapper">
        <header className="is-main-header">
          <div className="polythene">
            <div className="is-navbar">
              <div className="branding-area">
                <Logo
                  brandText={brandText}
                  brandTagline={brandTagline}
                  logoSrc="/public/logo.png"
                />
              </div>

              <div className="action-area">
                <div className="is-login-area">
                  <LoginButton />
                </div>
                <MenuIconButton />
              </div>
            </div>

            <div className="is-search-panel">
              {/* <SearchBar
                        className = 'is-search-bar'
                        hintText ='Yoga in Delhi...'
                        style={{
                          margin: '0 auto',
                          maxWidth: 400,
                          marginTop:'50px',
                        }}
                      /> */}
              <p className="or" style={{ color: red[900] }}>
                {' '}
                Or
                {' '}
              </p>
              <FindLocationButton itemScope itemType="http://schema.org/DiscoverAction" />
            </div>
          </div>
        </header>
        <FilterCards />
      </div>
    );
  }
}

export default IsNavBar;
