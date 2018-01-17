import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import get from 'lodash/get';

import SignUpDialogBox from './dialogs/SignUpDialogBox.jsx';
import MenuIconButton from './buttons/MenuIconButton.jsx';
import SideNavItems from './SideNavItems.jsx';
import TermsOfServiceDialogBox from './dialogs/TermsOfServiceDialogBox.jsx';
import EmailConfirmationDialogBox from './dialogs/EmailConfirmationDialogBox';

class SideNav extends Component {
    state = {
        open: false,
        signUpDialogBox: false,
        termsOfServiceDialogBox: false,
        emailConfirmationDialogBox: false,
        userData: {},
    }
    handleDrawerState = (state) => {
        this.setState({open: state});
    }
    handleSignUpDialogBoxState = (state, userType) => {
        this.setState({signUpDialogBox: state, userData: { userType: userType}});
    }
    handleTermsOfServiceDialogBoxState = (state) => {
        this.setState({termsOfServiceDialogBox: state});
    }
    handleEmailConfirmationDialogBoxState = (state) => {
        this.setState({emailConfirmationDialogBox: state});
    }
    toggleDrawerState = () => {
        this.setState({open: !this.state.open});
    }
    handleSignUpSubmit = (payload, event) => {
        event.preventDefault();
        this.setState({
            termsOfServiceDialogBox: true,
            userData: {...this.state.userData, ...payload}
        });
    }
    handleAgreementSubmit = () => {
        this.setState({emailConfirmationDialogBox: true});
    }
    render() {
        const { currentUser } = this.props;
        console.log("SideNav state -->>>",this.state);
        return (
            <Fragment>
                {!currentUser && this.state.signUpDialogBox &&
                    <SignUpDialogBox
                        open={this.state.signUpDialogBox}
                        onModalClose={() => this.handleSignUpDialogBoxState(false)}
                        onSubmit={this.handleSignUpSubmit}
                    />
                }
                {
                    this.state.termsOfServiceDialogBox &&
                    <TermsOfServiceDialogBox
                        open={this.state.termsOfServiceDialogBox}
                        onModalClose={() => this.handleTermsOfServiceDialogBoxState(false)}
                        onAgreeButtonClick={this.handleAgreementSubmit}
                    />
                }
                {
                    this.state.emailConfirmationDialogBox &&
                    <EmailConfirmationDialogBox
                        open={this.state.emailConfirmationDialogBox}
                        schoolEmail={get(this.state, "userData.email")}
                        onModalClose={() => this.handleEmailConfirmationDialogBoxState(false)}
                        onDisAgreeButtonClick={() => this.handleEmailConfirmationDialogBoxState(false)}
                    />
                }
                <MenuIconButton handleClick={this.toggleDrawerState} />
                <SideNavItems
                    open={this.state.open}
                    handleDrawer={() => this.handleDrawerState(false)}
                    handleSignUpDialogBox={this.handleSignUpDialogBoxState}
                    {...this.props}
                    />
            </Fragment>
        )
    }
}

export default SideNav;