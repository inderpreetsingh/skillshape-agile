import React, {Component,Fragment} from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton.jsx';
import SignUpTypeDialogBox from '/imports/ui/components/landing/components/dialogs/SignUpTypeDialogBox.jsx';

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
        const { fullWidth, currentUser,iconName } = this.props;

    	return(
    		<Fragment>
            {
                isEmpty(currentUser) &&
                <SecondaryButton
                    noMarginBottom
                    fullWidth={fullWidth}
                    label={this.props.label}
                    icon={currentUser ? false : true}
                    iconName={'assignment_ind'}
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
