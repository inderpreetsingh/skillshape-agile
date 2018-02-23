import React from 'react';
import get from 'lodash/get';
import { createContainer } from 'meteor/react-meteor-data';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';

class MainLayout extends React.Component {

    constructor( props ) {
        super( props );
    }

    componentDidUpdate() {
        const { currentUser, isUserSubsReady } = this.props
        let invite = get(this.props, "location.query.acceptInvite");
        console.log("componentDidUpdate -->>",this.props)
        if(invite && !currentUser && isUserSubsReady) {
            Events.trigger("loginAsSchoolAdmin",{redirectUrl: this.props.location.search});
        }
    }

    render( ) {
        const { currentUser, isUserSubsReady, classes} = this.props;
        return (
            <div>
                {React.cloneElement(this.props.children, { currentUser: currentUser, isUserSubsReady: isUserSubsReady })}
            </div>
        )
    }
}

export default createContainer(props => {
    const currentUser = Meteor.user();
    let userSubs = Meteor.subscribe("myInfo");
    let isUserSubsReady = userSubs.ready();
    return { ...props, currentUser, isUserSubsReady };
}, MainLayout);