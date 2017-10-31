import React from 'react';
import { Router, Route, browserHistory, DefaultRoute, IndexRoute } from 'react-router';

//layout
import MainLayout from '/imports/ui/layout/mainLayout';

//components
import Home from '/imports/ui/components/home';
import ResetPassword from '/imports/ui/components/account/resetPassword';

//pages
import AboutUs from '/imports/ui/pages/aboutUs';
import ContactUs from '/imports/ui/pages/contactUs'

export default Routes = () => (
    <Router history={browserHistory}>
      <Route path="/" component={MainLayout} >
        <IndexRoute component={Home} />
        <Route path="/Aboutus" component={AboutUs} />
        <Route path="/Contactus" component={ContactUs} />
      	<Route path="/reset-password/:token" component={ResetPassword}/>
      </Route>
    </Router>
);
