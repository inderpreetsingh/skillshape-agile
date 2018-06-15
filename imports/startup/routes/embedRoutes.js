import React from "react";
import { Router, Route, browserHistory } from "react-router";

import EmbedLayout from "/imports/ui/layout/embedLayout";
import MainLayout from "/imports/ui/layout/mainLayout";
import { componentLoader } from "/imports/util";
export default (Routes = componentLoader(props => (
  <Router history={browserHistory}>
    <Route name="SkillShape" path="/" component={MainLayout}>
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
  </Router>
)));
