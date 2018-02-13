import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';

class MainLayout extends React.Component {

  constructor( props ) {
    super( props );
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