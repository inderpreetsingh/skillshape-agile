import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Header from '/imports/ui/components/header';
// import Footer from '/imports/ui/components/footer';
import MVPSideBar from '/imports/ui/components/MVPSideBar';
import SideBar from '/imports/ui/components/sideBar';
import Grid from 'material-ui/Grid';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';

import { checkDemoUser, withStyles } from '/imports/util';
// import { initializeLayout } from '/imports/util/initializeLayout';
import withWidth from 'material-ui/utils/withWidth';


const styles = theme => ({
  content: {
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  }
});

class MainLayout extends React.Component {

  constructor( props ) {
    super( props );
  }

  componentWillMount( ) {
  }

  componentDidMount() {
  }

  showSideBar = (currentUser) => {
    if(checkDemoUser(currentUser))
      return <SideBar {...this.props}/>
    return <MVPSideBar {...this.props}/>
  }

  getMainPanelRef() {
    return this.mainPanelRef
  }

  checkEmailVerification = (currentUser) => {
    if(currentUser && currentUser.emails)
      return currentUser.emails[0].verified
    return true // when no user login to let them see home page
  }

  render( ) {
    console.log("Main layout props -->>",this.props);
    console.log("Main layout context -->>",this.context);
    const { currentUser, isUserSubsReady, classes} = this.props;
    let className = {
      mainClass: "wrapper perfectScroll main_wrapper",
      contentClass: "content",
      id: "UserMainPanel",
    }
    if(currentUser) {
      className.mainClass = "main-panel";
      className.contentClass = "content no-padding";
      className.id = "UserMainPanel";
    }
    return (
        <div ref={(ref)=> {this.mainPanelRef = ref}} className={className.mainClass} id={className.id}>
            <BrandBar {...this.props}/>
              {React.cloneElement(this.props.children, {"getMainPanelRef": this.getMainPanelRef.bind(this), currentUser: currentUser, isUserSubsReady: isUserSubsReady })}
              {/* <Header {...this.props}/>*/}
              {/*<div className={className.contentClass}>
                    <main className={classes.content}>
                        {
                          this.checkEmailVerification(currentUser) ? (
                            <div >
                            </div>
                          ) : (
                            <p>
                              You need to verify your email address before using Skillshape.
                              <a href="#" style={{color:'blue'}}>
                                Resend verification link
                              </a>
                            </p>
                          )
                        }
                    </main>

              </div>*/}
              {/*<Footer/>*/}
          <Footer />
        </div>
    )
  }
}

export default createContainer(props => {
  const currentUser = Meteor.user();
  let userSubs = Meteor.subscribe("myInfo");
  let isUserSubsReady = userSubs.ready();
  return { ...props, currentUser, isUserSubsReady };
}, withWidth()(withStyles(styles)(MainLayout)));