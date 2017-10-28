import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Header from '/imports/ui/components/header';
import Footer from '/imports/ui/components/footer';
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

export default class MainLayout extends React.Component {
  constructor( props ) {
    super( props );
  }
  componentWillMount( ) {
  }

  render( ) {
    const { nav, content, footer } = this.props;
    return (
      <div className="wrapper">
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
        <Header/>
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
