import React from "react";
import {
  Router,
  Route,
  browserHistory,
  DefaultRoute,
  IndexRoute
} from "react-router";
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
