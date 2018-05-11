import React from 'react';
import { Router, Route, browserHistory, DefaultRoute, IndexRoute } from 'react-router';
//layout
import MainLayout from '/imports/ui/layout/mainLayout';
import AdminLayout from '/imports/ui/layout/adminLayout';
import PublicLayout from '/imports/ui/layout/publicLayout';
import EmbedLayout from '/imports/ui/layout/embedLayout';

//components
import Home from '/imports/ui/components/home';
import Landing from '/imports/ui/components/landing/index.jsx';
import ClassType from '/imports/ui/components/landing/ClassType.jsx';
import NoResults from '/imports/ui/components/landing/components/NoResults';
import ClassTypeView from '/imports/ui/components/classTypeView';
import School from '/imports/ui/components/landing/School.jsx';
import NoPageFound from '/imports/ui/components/landing/components/NoPageFound';

import ResetPassword from '/imports/ui/components/account/resetPassword';
import MyProfile from '/imports/ui/components/users/myProfile';
import MyMedia from '/imports/ui/components/users/myMedia';
import SchoolView from '/imports/ui/components/schoolView';
import SchoolMemberView from '/imports/ui/components/schoolMembers';
import ClaimSchool from '/imports/ui/components/claimSchool';
import SchoolEditView from '/imports/ui/components/schoolView/editSchool';
import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar';
// import MyCalender from '/imports/ui/components/users/myCalender';
import SchoolUpload from '/imports/ui/components/schoolUpload';
import SchoolPriceView from '/imports/ui/components/embed/schoolPriceView';
import SchoolClassTypeView from '/imports/ui/components/embed/schoolClassTypeView';
import SchoolMediaGalleryView from '/imports/ui/components/embed/schoolMediaGalleryView';
import SchoolMediaSliderView from '/imports/ui/components/embed/schoolMediaSliderView';
import SchoolCalenderView from '/imports/ui/components/embed/schoolCalenderView';
import VerifyEmail from '/imports/ui/components/account/verifyEmail';
import SkillShapeSchool from '/imports/ui/components/skillshape-school';
import ManageUsers from '/imports/ui/components/manage-users';

//pages
import AboutUs from '/imports/ui/pages/aboutUs';
import ContactUs from '/imports/ui/pages/contactUs';
import ContactUsPage from '/imports/ui/pages/ContactUsPage';
import UnsubscribeUser from '/imports/ui/pages/UnsubscribeUser';

import {componentLoader} from "/imports/util";

export default Routes = componentLoader((props) => (
  <Router history={browserHistory}>
    <Route name="SkillShape" path="/" component={MainLayout} >
      <IndexRoute name="SkillShape" component={Landing} />
      <Route path="/classType-dev" name="classtype-dev" component={ClassType} />
      <Route path="/classType/:classTypeName/:classTypeId" name="classtype" component={ClassTypeView} />
      <Route path="/skillshape-for-school" name="Skillshape-for-school" component={School} />
      <Route path="/unsubscribe" name="unsubscribe" component={UnsubscribeUser} />
      <Route path="/contact-us" name="contact-us" component={ContactUsPage} />
      <Route path="/no-results" name="NoResults" component={NoResults} />

      <Route path="/" component={PublicLayout}>
        <Route path="/Aboutus" name="Aboutus" component={AboutUs} />
        <Route path="/Contactus" name="Contactus" component={ContactUs} />
        <Route path="/profile/:id" name="MyProfile" component={MyProfile} />
        <Route path="/media/:id" name="MyMedia" component={MyMedia} />
        <Route path="/schoolAdmin/:schoolId/edit" name="SchoolAdmin-Edit" getComponent={(nextState, cb) => {
          //set loading:true
          props.isLoading.show();
          import('/imports/ui/components/schoolView/editSchool').then((SchoolEditView) => {
              // set loading false
              props.isLoading.hide();
              cb(null, SchoolEditView.default);
            });
        }} />
        <Route path="/schools/:slug" name="SchoolView" component={SchoolView} />
        <Route path="/MyCalendar" name="MyCalendar" component={ManageMyCalendar} />
        <Route path="/reset-password/:token" name="ResetPassword" component={ResetPassword}/>
        <Route path="/claimSchool" name="ClaimSchool" component={ClaimSchool}/>
        <Route path="/verify-email/:token" name="VerifyEmail" component={VerifyEmail}/>
        <Route path="/skillShape-school" name="SkillShapeSchool" component={SkillShapeSchool}/>
      </Route>

      <Route path="/" component={AdminLayout}>
        <Route path="/SchoolUpload" name="SchoolUpload" component={SchoolUpload} />
        <Route path="/schools/:slug/members" name="SchoolMemberView" component={SchoolMemberView} />
        <Route path="/classmates" name="classmates" component={SchoolMemberView} />
        <Route path="/manage-users" name="Manage-Users" component={ManageUsers} />
      </Route>

      <Route path="/" component={EmbedLayout}>
        <Route path="/embed/schools/:slug/pricing" component={SchoolPriceView} />
        <Route path="/embed/schools/:slug/classtype" name="EmbedClassTypeView" component={SchoolClassTypeView} />
        <Route path="/embed/schools/:slug/mediagallery" name="EmbedMediaGalleryView" component={SchoolMediaGalleryView} />
        <Route path="/embed/schools/:slug/mediaslider" name="EmbedMediaSliderView" component={SchoolMediaSliderView} />
        <Route path="/embed/schools/:slug/calendar" name="EmbedSchoolCalanderView" component={SchoolCalenderView} />
      </Route>
    </Route>
    <Route path="*" name="NoPageFound" component={NoPageFound} />
  </Router>
));
