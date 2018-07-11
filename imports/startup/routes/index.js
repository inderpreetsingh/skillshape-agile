import React from "react";
import {
  Router,
  Route,
  browserHistory,
  DefaultRoute,
  IndexRoute
} from "react-router";
import { componentLoader } from "/imports/util";

//layout
import MainLayout from "/imports/ui/layout/mainLayout";
import AdminLayout from "/imports/ui/layout/adminLayout";
import PublicLayout from "/imports/ui/layout/publicLayout";

//components
import Home from "/imports/ui/components/home";
import Landing from "/imports/ui/components/landing/index.jsx";
import ClassType from "/imports/ui/components/landing/ClassType.jsx";
import NoResults from "/imports/ui/components/landing/components/NoResults";
import ClassTypeView from "/imports/ui/components/classTypeView";
import School from "/imports/ui/components/landing/School.jsx";
import SchoolSuggestions from "/imports/ui/components/landing/components/schoolSuggestions/index.jsx";
import NoPageFound from "/imports/ui/components/landing/components/NoPageFound";

import ResetPassword from "/imports/ui/components/account/resetPassword";
import MyProfile from "/imports/ui/components/users/myProfile";
import MyMedia from "/imports/ui/components/users/myMedia";
import MySubsciption from "/imports/ui/components/users/mySubscriptions";
import SchoolView from "/imports/ui/components/schoolView";
import SchoolMemberView from "/imports/ui/components/schoolMembers";
import ClaimSchool from "/imports/ui/components/claimSchool";
import SchoolEditView from "/imports/ui/components/schoolView/editSchool";
import ManageMyCalendar from "/imports/ui/components/users/manageMyCalendar";
// import MyCalender from '/imports/ui/components/users/myCalender';
import SchoolUpload from "/imports/ui/components/schoolUpload";
import VerifyEmail from "/imports/ui/components/account/verifyEmail";
import SkillShapeSchool from "/imports/ui/components/skillshape-school";
import ManageUsers from "/imports/ui/components/manage-users";

//pages
import AboutUs from "/imports/ui/pages/aboutUs";
import ContactUs from "/imports/ui/pages/contactUs";
import ContactUsPage from "/imports/ui/pages/ContactUsPage";
import UnsubscribeUser from "/imports/ui/pages/UnsubscribeUser";
import StripeConnectModal from "./../../ui/modal/stripeConnectModal";
import Financials from "/imports/ui/components/financials";

class DynamicImport extends React.Component {
  state = {
    Component: null
  };
  componentDidMount() {
    this.props.load().then(Component => {
      this.setState(() => ({
        Component: Component.default ? Component.default : Component
      }));
    });
  }
  render() {
    return this.props.children(this.state.Component);
  }
}

export default (Routes = componentLoader(props => {
  if (window.location.href.indexOf("embed") !== -1) {
    return (
      <DynamicImport load={() => import("./embedRoutes")}>
        {Component => (Component === null ? null : <Component {...props} />)}
      </DynamicImport>
    );
  } else {
    return (
      <DynamicImport load={() => import("./mainRoutes")}>
        {Component => (Component === null ? null : <Component {...props} />)}
      </DynamicImport>
    );
  }
}));
