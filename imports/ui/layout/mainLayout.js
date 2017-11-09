import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Header from '/imports/ui/components/header';
import Footer from '/imports/ui/components/footer';
import MVPSideBar from '/imports/ui/components/MVPSideBar';
import SideBar from '/imports/ui/components/sideBar';
import { checkDemoUser } from '/imports/util';
import { initializeLayout } from '/imports/util/initializeLayout';
// var styles = {
//   rowstyle: {
//     display: 'table',
//     width: '100%'
//   },
//   colstyle: {
//     backgroundColor: '#2e4462',
//     display: 'table-cell',
//     float: 'none'
//   },
//   colnav: {
//     display: 'table-cell',
//     float: 'none'
//   }
// };


class MainLayout extends React.Component {

  constructor( props ) {
    super( props );
  }

  componentWillMount( ) {
  }

  componentDidMount() {
    $.material.init();
    initializeLayout()
  }

  showSideBar = (currentUser) => {
    if(checkDemoUser(currentUser))
      return <SideBar {...this.props}/>
    return <MVPSideBar {...this.props}/>
  }

  getMainPanelRef() {
    return this.mainPanelRef
  }
  render( ) {
    const { currentUser } = this.props;
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
      <div className="wrapper">
        { currentUser && this.showSideBar(currentUser)}
        <div ref={(ref)=> {this.mainPanelRef = ref}} className={className.mainClass} id={className.id}>
          <Header {...this.props}/>
          <div className={className.contentClass}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  {React.cloneElement(this.props.children, {"getMainPanelRef": this.getMainPanelRef.bind(this), currentUser: currentUser })}
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
          {/*
           {{{#if currentUser}}
                {{#if IsDemoUser}}
                  {{> sidebar}}
                {{else}}
                  {{> MVPSidebar}}
               {{/if}} }
                <div className="main-panel"  style="overflow-y: auto;">
                  {{Header}}
                  <div className="content no-padding" style="{{coming_soon_page_style}}">
                    <div className="container-fluid">
                      {{#unless currentUser.emails.[0].verified}}
                        <p className="alert alert-warning">You need to verify your email address before using Skillshape. <a href="#" className="resend-verification-link" style="color:blue">Resend verification link</a></p>
                      {{else}}
                        <div className="row">
                            <div className="col-md-12">
                              {{> yield}}
                            </div>
                        </div>
                        {{/unless}}
                    </div>
                  </div>
                  {{> Footer}}
                </div>
            {{else}}
      */}
      </div>
    )
  }
}

export default createContainer(props => {
  const currentUser = Meteor.user();
  return { ...props, currentUser };
}, MainLayout);