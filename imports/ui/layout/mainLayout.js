import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Header from '/imports/ui/components/header';
import Footer from '/imports/ui/components/footer';
import MVPSideBar from '/imports/ui/components/MVPSideBar';
import SideBar from '/imports/ui/components/sideBar';
import { checkDemoUser } from '/imports/util';
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
  }

  showSideBar = (currentUser) => {
    if(checkDemoUser(currentUser)) {
      return <SideBar {...this.props}/>
    } else {
      return <MVPSideBar {...this.props}/>
    }
  }

  render( ) {
    const { currentUser } = this.props;
    return (
      <div className="wrapper">
       { currentUser && this.showSideBar(currentUser)}
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
      <div className="wrapper perfectScroll">
        <Header {...this.props}/>
        <div className="content">
          <div className="container-fluid">
              <div className="row">
                  <div className="col-md-12">
                    {this.props.children}
                  </div>
              </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
    )
  }
}

export default createContainer(props => {
  const currentUser = Meteor.user();
  return { ...props, currentUser };
}, MainLayout);