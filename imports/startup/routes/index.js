import React from "react";
import {
  Router,
  Route,
  browserHistory,
  DefaultRoute,
  IndexRoute
} from "react-router";
import styled from 'styled-components';

import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { componentLoader } from "/imports/util";

const PreloaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

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
    if(!this.state.Component) {
      return <PreloaderWrapper> <Preloader /> </PreloaderWrapper>
    }
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
