import React from "react";
import { browserHistory, IndexRoute, Route, Router } from "react-router";
import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";
import Landing from "/imports/ui/components/landing/index.jsx";
import EmbedLayout from "/imports/ui/layout/embedLayout";
//layout
import MainLayout from "/imports/ui/layout/mainLayout";
import { componentLoader } from "/imports/util";


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
    return this.state.Component ? (
      this.props.children(this.state.Component)
    ) : (
      <InitialRoutes />
    );
  }
}

export default (Routes = props => {
  // if (window.location.pathname == "/") {
  return (
    <DynamicImport load={() => import("./mainRoutes")}>
      {Component => (Component === null ? null : <Component {...props} />)}
    </DynamicImport>
  );
  // } else {
  //   return (
  //     <DynamicImport load={() => import("./mainRoutes")}>
  //       {Component => (Component === null ? null : <Component {...props} />)}
  //     </DynamicImport>
  //   );
  // }
});

const InitialRoutes = componentLoader(props => (
  <Router history={browserHistory}>
    <Route name="SkillShape" path="/" component={MainLayout}>
      <IndexRoute name="SkillShape" component={Landing} />
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
      <Route path="*" name="Please Wait" component={Preloader} />
    </Route>
  </Router>
));
