import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SignUpDialogBox from './dialogs/SignUpDialogBox.jsx';
import MenuIconButton from './buttons/MenuIconButton.jsx';
import SideNavItems from './SideNavItems.jsx';

class SideNav extends Component {
    state = {
        open: false,
        signUpDialogBox: false,
    }
    handleDrawerState = (state) => {
      this.setState({open: state});
    }
    handleSignUpDialogBoxState = (state) => {
        this.setState({signUpDialogBox: state});
    }
    toggleDrawerState = () => {
      this.setState({open: !this.state.open});
    }
    render() {
        const { currentUser } = this.props;
        return (
            <Fragment>
                {!currentUser && this.state.signUpDialogBox &&
                    <SignUpDialogBox
                    open={this.state.signUpDialogBox}
                    onModalClose={() => this.handleSignUpDialogBoxState(false)} />
                }
                <MenuIconButton handleClick={this.toggleDrawerState} />
                <SideNavItems
                    open={this.state.open}
                    handleDrawer={() => this.handleDrawerState(false)}
                    handleSignUpDialogBox={() => this.handleSignUpDialogBoxState(true)}
                    {...this.props}
                    />
            </Fragment>
        )
    }
}

export default SideNav;