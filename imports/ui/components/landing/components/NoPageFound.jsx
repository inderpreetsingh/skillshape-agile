import React from "react";
import get from "lodash/get";
import { browserHistory } from "react-router";
import DocumentTitle from "react-document-title";
import PropTypes from "prop-types";
import styled from "styled-components";
import NotFound from "/imports/ui/components/landing/components/helpers/NotFound.jsx";

const NoPageFound = props => (
  <DocumentTitle title={get(props, "route.name", "Untitled")}>
    <NotFound />
  </DocumentTitle>
);

export default NoPageFound;
