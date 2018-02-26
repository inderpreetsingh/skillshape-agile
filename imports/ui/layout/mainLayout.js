import React from 'react';
import get from 'lodash/get';
import { createContainer } from 'meteor/react-meteor-data';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import { toastrModal } from '/imports/util';
import TermsOfServiceDialogBox from '/imports/ui/components/landing/components/dialogs/TermsOfServiceDialogBox.jsx'

class MainLayout extends React.Component {

    constructor(props) {
        super( props );
        this.state = {
            memberInvitation: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("MainLayout componentWillReceiveProps",nextProps)
        let invite = get(nextProps, "location.query.acceptInvite");
        if(nextProps.currentUser && nextProps.isUserSubsReady && invite === "true" && this.state.memberInvitation) {
            this.acceptMemberInvitation(nextProps.location.query);
        }


    }

    componentDidUpdate() {
        const { currentUser, isUserSubsReady } = this.props
        let invite = get(this.props, "location.query.acceptInvite");
        console.log("MainLayout componentDidUpdate -->>",this.props)
        if(invite && !currentUser && isUserSubsReady) {
            Events.trigger("loginAsSchoolAdmin",{redirectUrl: this.props.location.search});
        }
    }

    acceptMemberInvitation = (invitationObj)=> {
        const { toastr } = this.props;
        console.log("Landing acceptMemberInvitation")
        Meteor.call("schoolMemberDetails.acceptInvitation", invitationObj, (err, res) => {
            console.log("acceptMemberInvitation res",res,err)
            if(err) {
                let errorText = err.error || err.reason || err.message;
                this.setState({memberInvitation: false},()=> {
                    toastr.error(errorText, "Error");
                })
            }

            if(res) {
                this.setState({memberInvitation: false},()=> {
                    toastr.success(
                        "You successfully accepted the invitation.",
                        "success"
                    );
                })
            }
        })
    }

    handleServiceAgreementClick = () => {
        Meteor.call('user.editUser',{doc:{term_cond_accepted:true},docId:this.props.currentUser._id});
    }

    showTermsOfServiceDialogBox = () => {

    }

    render( ) {
        const { currentUser, isUserSubsReady, classes} = this.props;
        return (
            <div>
                {React.cloneElement(this.props.children, { currentUser: currentUser, isUserSubsReady: isUserSubsReady })}
                {
                    currentUser &&
                    <TermsOfServiceDialogBox
                        open={!currentUser.term_cond_accepted}
                        onModalClose={() => alert("You can not cancel this service and agreement")}
                        onAgreeButtonClick={this.handleServiceAgreementClick}
                    />
                }
            </div>
        )
    }
}

export default createContainer(props => {
    const currentUser = Meteor.user();
    let userSubs = Meteor.subscribe("myInfo");
    let isUserSubsReady = userSubs.ready();
    return { ...props, currentUser, isUserSubsReady };
}, toastrModal(MainLayout));