import React from "react";
import { browserHistory, IndexRoute, Route, Router } from "react-router";
import StripeConnectModal from "./../../ui/modal/stripeConnectModal";
import ResetPassword from "/imports/ui/components/account/resetPassword";
import VerifyEmail from "/imports/ui/components/account/verifyEmail";
import ClaimSchool from "/imports/ui/components/claimSchool";
import ClassTypeView from "/imports/ui/components/classTypeView";
import DashBoard from '/imports/ui/components/dashboard';
import ClassDetails from "/imports/ui/components/landing/ClassDetails.jsx";
import NoPageFound from "/imports/ui/components/landing/components/NoPageFound";
import NoResults from "/imports/ui/components/landing/components/NoResults";
import SchoolSuggestionsView from "/imports/ui/components/landing/components/schoolSuggestions/index.jsx";
import Landing from "/imports/ui/components/landing/index.jsx";
import School from "/imports/ui/components/landing/School.jsx";
import ManageUsers from "/imports/ui/components/manage-users";
import Optimization from '/imports/ui/components/optimization';
import PurchasePackage from '/imports/ui/components/purchasePackage';
import SchoolMemberView from "/imports/ui/components/schoolMembers";
// import MyCalender from '/imports/ui/components/users/myCalender';
import SchoolUpload from "/imports/ui/components/schoolUpload";
import SchoolView from "/imports/ui/components/schoolView";
import SkillShapeSchool from "/imports/ui/components/skillshape-school";
import ManageMyCalendar from "/imports/ui/components/users/manageMyCalendar";
import MyMedia from "/imports/ui/components/users/myMedia";
import MyProfile from "/imports/ui/components/users/myProfile";
import MySubscription from "/imports/ui/components/users/mySubscription";
import MyTransaction from "/imports/ui/components/users/myTransaction";
//layout
import AdminLayout from "/imports/ui/layout/adminLayout";
import EmbedLayout from "/imports/ui/layout/embedLayout";
import MainLayout from "/imports/ui/layout/mainLayout";
import PublicLayout from "/imports/ui/layout/publicLayout";
import AboutUs from "/imports/ui/pages/aboutUs";
//pages
import UnsubscribeUser from "/imports/ui/pages/UnsubscribeUser";
import { componentLoader } from "/imports/util";






export default (Routes = componentLoader(props => (
  <Router history={browserHistory}>
    <Route name="SkillShape" path="/" component={MainLayout}>
      <IndexRoute name="SkillShape" component={Landing} />
      <Route
        path="/classType/:classTypeName/:classTypeId"
        name="classtype"
        component={ClassTypeView}
      />
      <Route
        path="/skillshape-for-school"
        name="Skillshape-for-school"
        component={School}
      />
      <Route
        path="/classDetails/:classId"
        name="Class Details"
        component={ClassDetails}
      />
      <Route
        path="/unsubscribe"
        name="unsubscribe"
        component={UnsubscribeUser}
      />
      <Route
        path="/redirect-to-stripe"
        name="redirect-to-stripe"
        component={StripeConnectModal}
      />
      <Route
        path="/school-suggestions"
        name="SchoolSuggestionsView"
        component={SchoolSuggestionsView}
      />
      <Route
        path="/dashboard"
        name="Dashboard"
        component={DashBoard}
      />
      <Route path="/no-results" name="NoResults" component={NoResults} />

      <Route path="/" component={PublicLayout}>
        <Route path="/Aboutus" name="Aboutus" component={AboutUs} />
        <Route path="/profile/:id" name="MyProfile" component={MyProfile} />
        <Route path="/media/:id" name="MyMedia" component={MyMedia} />
        <Route path="/purchasePackage/:packageRequestId" name="Purchase Package" component={PurchasePackage} />
        <Route
          path="/mySubscription/:id"
          name="MySubscription"
          component={MySubscription}
        />
         <Route
          path="/myTransaction/:id"
          name="MyTransaction"
          component={MyTransaction}
        />
        
        <Route
          path="/schoolAdmin/:schoolId/edit"
          name="SchoolAdmin-Edit"
          getComponent={(nextState, cb) => {
            //set loading:true
            props.isLoading.show();
            import("/imports/ui/components/schoolView/editSchool").then(
              SchoolEditView => {
                // set loading false
                props.isLoading.hide();
                cb(null, SchoolEditView.default);
              }
            );
          }}
        />
        <Route path="/schools/:slug" name="SchoolView" component={SchoolView} />
        <Route
          path="/MyCalendar"
          name="MyCalendar"
          component={ManageMyCalendar}
        />
        <Route
          path="/reset-password/:token"
          name="ResetPassword"
          component={ResetPassword}
        />
        <Route path="/claimSchool(/:schoolName)" name="ClaimSchool" component={ClaimSchool} />
        <Route
          path="/verify-email/:token"
          name="VerifyEmail"
          component={VerifyEmail}
        />
        <Route
          path="/skillShape-school"
          name="SkillShapeSchool"
          component={SkillShapeSchool}
        />
      </Route>

      <Route path="/" component={AdminLayout}>
        <Route
          path="/SchoolUpload"
          name="SchoolUpload"
          component={SchoolUpload}
        />
        <Route
          path="/optimization"
          name="Optimization"
          component={Optimization}
        />
        <Route
          path="/schools/:slug/members"
          name="SchoolMemberView"
          getComponent={(nextState, cb) => {
            //set loading:true
            props.isLoading.show();
            import("/imports/ui/components/schoolView/editSchool").then(
              SchoolEditView => {
                // set loading false
                props.isLoading.hide();
                cb(null, SchoolEditView.default);
              }
            );
          }}
        />
        <Route
          path="/classmates"
          name="classmates"
          component={SchoolMemberView}
        />
        <Route
          path="/manage-users"
          name="Manage-Users"
          component={ManageUsers}
        />
      </Route>
      <Route path="/" component={EmbedLayout}>
        <Route
          path="/embed/schools/:slug/pricing"
          name="SchoolPriceView"
          getComponent={(nextState, cb) => {
            //set loading:true
            props.isLoading.show();
            import("/imports/ui/components/embed/schoolPriceView").then(
              SchoolPriceView => {
                // set loading false
                props.isLoading.hide();
                cb(null, SchoolPriceView.default);
              }
            );
          }}
        />
        <Route
          path="/embed/schools/:slug/classtype"
          name="EmbedClassTypeView"
          getComponent={(nextState, cb) => {
            //set loading:true
            props.isLoading.show();
            import("/imports/ui/components/embed/schoolClassTypeView").then(
              SchoolClassTypeView => {
                // set loading false
                props.isLoading.hide();
                cb(null, SchoolClassTypeView.default);
              }
            );
          }}
        />
        <Route
          path="/embed/schools/:slug/mediagallery"
          name="EmbedMediaGalleryView"
          getComponent={(nextState, cb) => {
            //set loading:true
            props.isLoading.show();
            import("/imports/ui/components/embed/schoolMediaGalleryView").then(
              SchoolMediaGalleryView => {
                // set loading false
                props.isLoading.hide();
                cb(null, SchoolMediaGalleryView.default);
              }
            );
          }}
        />
        <Route
          path="/embed/schools/:slug/mediaslider"
          name="EmbedMediaSliderView"
          getComponent={(nextState, cb) => {
            //set loading:true
            props.isLoading.show();
            import("/imports/ui/components/embed/schoolMediaSliderView").then(
              SchoolMediaSliderView => {
                // set loading false
                props.isLoading.hide();
                cb(null, SchoolMediaSliderView.default);
              }
            );
          }}
        />
        <Route
          path="/embed/schools/:slug/calendar"
          name="EmbedSchoolCalanderView"
          getComponent={(nextState, cb) => {
            //set loading:true
            props.isLoading.show();
            import("/imports/ui/components/embed/schoolCalenderView").then(
              EmbedSchoolCalanderView => {
                // set loading false
                props.isLoading.hide();
                cb(null, EmbedSchoolCalanderView.default);
              }
            );
          }}
        />
      </Route>
    </Route>
    <Route path="*" name="NoPageFound" component={NoPageFound} />
  </Router>
)));
