import React from 'react';
import { Router, Route, browserHistory, DefaultRoute, IndexRoute } from 'react-router';
//layout
import MainLayout from '/imports/ui/layout/mainLayout';
import AdminLayout from '/imports/ui/layout/adminLayout';
import PublicLayout from '/imports/ui/layout/publicLayout';

//components
import Home from '/imports/ui/components/home';
import Landing from '/imports/ui/components/landing/index.jsx';
import ClassType from '/imports/ui/components/landing/ClassType.jsx';
import NoResults from '/imports/ui/components/landing/components/NoResults';
import ClassTypeView from '/imports/ui/components/classTypeView';
import School from '/imports/ui/components/landing/School.jsx';

import ResetPassword from '/imports/ui/components/account/resetPassword';
import MyProfile from '/imports/ui/components/users/myProfile';
import SchoolView from '/imports/ui/components/schoolView';
import DashView from '/imports/ui/components/schoolMembers';
import ClaimSchool from '/imports/ui/components/claimSchool';
import SchoolEditView from '/imports/ui/components/schoolView/editSchool';
import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar';
// import MyCalender from '/imports/ui/components/users/myCalender';
import SchoolUpload from '/imports/ui/components/schoolUpload';
// import SchoolPriceView from '/imports/ui/components/embed/schoolPriceView';
import VerifyEmail from '/imports/ui/components/account/verifyEmail';
import SkillShapeSchool from '/imports/ui/components/skillshape-school';
//pages
import AboutUs from '/imports/ui/pages/aboutUs';
import ContactUs from '/imports/ui/pages/contactUs';

import {componentLoader} from "/imports/util";

export default Routes = componentLoader((props) => (
  <Router history={browserHistory}>
    <Route path="/" component={MainLayout} >
      <IndexRoute component={Landing} />
      <Route path="/classtype" component={ClassType} />
      <Route path="/classType/:classTypeId" component={ClassTypeView} />
      <Route path="/skillshape-for-school" component={School} />

      <Route path="/no-results" component={NoResults} />

      <Route path="/" component={PublicLayout}>
        <Route path="/Aboutus" component={AboutUs} />
        <Route path="/Contactus" component={ContactUs} />
        <Route path="/profile/:id" component={MyProfile} />
        <Route path="/schoolAdmin/:schoolId/edit" getComponent={(nextState, cb) => {
          //set loading:true
          console.log("props",props)
          props.isLoading.show();
          import('/imports/ui/components/schoolView/editSchool').then((SchoolEditView) => {
              console.log("SchoolEditView",SchoolEditView)
              // set loading false
              props.isLoading.hide();
              cb(null, SchoolEditView.default);
            });
        }} />
        <Route path="/schools/:slug" component={SchoolView} />
        <Route path="/MyCalendar" component={ManageMyCalendar} />
        <Route path="/reset-password/:token" component={ResetPassword}/>
        <Route path="/claimSchool" component={ClaimSchool}/>
        <Route path="/verify-email/:token" component={VerifyEmail}/>
        <Route path="/claimSchool" component={ClaimSchool}/>
        <Route path="/skillShape-school" component={SkillShapeSchool}/>
      </Route>

      <Route path="/" component={AdminLayout}>
        <Route path="/SchoolUpload" component={SchoolUpload} />
        <Route path="/schools/:slug/members" component={DashView} />
        {/*<Route path="/schoolAdmin/:schoolId/edit" component={SchoolEditView} />*/}
      </Route>
    </Route>
  </Router>
));
