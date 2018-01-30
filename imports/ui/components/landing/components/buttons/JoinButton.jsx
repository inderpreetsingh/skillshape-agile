import React, {Component,Fragment} from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import SecondaryButton from './SecondaryButton.jsx';
import SignUpTypeDialogBox from '../dialogs/SignUpTypeDialogBox.jsx';

class JoinButton extends Component {

	constructor(props){
        super(props);
        this.state = {
            joinModal: false,
        }
    }

    openSignUpModal = (userType)=> {
        this.setState({joinModal: false},()=> {
            Events.trigger("registerAsSchool",{userType})
        });
    }

    render() {
        const { joinModal } = this.state;
        const { fullWidth, currentUser } = this.props;

    	return(
    		<Fragment>
            {
                isEmpty(currentUser) &&
                <SecondaryButton
                    noMarginBottom
                    fullWidth={fullWidth}
                    label={this.props.label}
                    onClick={()=> this.setState({joinModal: true})}
                />
            }
            {
                joinModal &&
                <SignUpTypeDialogBox
                    open={joinModal}
                    onModalClose={() => this.setState({joinModal: false})}
                    openSignUpModal={this.openSignUpModal}
                />
            }
            </Fragment>
    	)
    }
}

JoinButton.propTypes = {
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
}

JoinButton.defaultProps = {
    fullWidth: false,
}

export default JoinButton;