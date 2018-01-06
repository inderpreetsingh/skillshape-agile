import React, {Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import SecondaryButton from './SecondaryButton.jsx';
import LoginDialogBox from '../dialogs/LoginDialogBox.jsx';

class LoginButton extends Component {
    state = {
        loginModal : false
    }
    handleLoginModalState = (state) => {
        this.setState({
            loginModal: state
        })
    }
    
    render() {
        const {loginModal} = this.state;
        const {icon,fullWidth,iconName} = this.props;
        return( 
            <Fragment>
                <SecondaryButton fullWidth={fullWidth} icon={icon} iconName={iconName} onClick={() => this.handleLoginModalState(true)} label="Log In"/>   
                {loginModal && 
                <LoginDialogBox open={loginModal}  onModalClose={() => this.handleLoginModalState(false)} /> }
            </Fragment>
        )
    }
    
}

LoginButton.propTypes = {
    icon: PropTypes.bool,
    fullWidth: PropTypes.bool,
    iconName: PropTypes.string
}

LoginButton.defaultProps = {
    icon: false,
    fullWidth: false,
    iconName: "fingerprint"
}

export default LoginButton;