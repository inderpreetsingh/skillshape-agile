import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";

import config from "/imports/util";
import { withMarker } from "/imports/util";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const mapOptions = {
  zoom: 8,
  scrollwheel: true,
  minZoom: 1,
  center: { lat: -25.363, lng: 131.044 }
  //center: config.defaultLocationObject
};

const MapContainer = styled.div`
  height: 100%;
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    min-height: 300px;
    height: 100%;
  }
`;

const SchoolLocationMap = withMarker(
  withGoogleMap(props => {
    // const MovingMarker = props.movingMarker;
    console.group("Google Map");
    console.log("Google map rendering", props.myLocation);
    console.groupEnd();
    return (
      <GoogleMap
        defaultZoom={mapOptions.zoom}
        defaultCenter={props.myLocation}
        center={props.myLocation}
      >
        {props.isMarkerShown && React.cloneElement(props.renderMarker)}
      </GoogleMap>
    );
  })
);

SchoolLocationMap.propTypes = {
  isMarkerShown: PropTypes.bool,
  myLocation: PropTypes.object,
  googleMapURL: PropTypes.string,
  containerElement: PropTypes.element,
  mapElement: PropTypes.element,
  loadingElement: PropTypes.element
};

SchoolLocationMap.defaultProps = {
  isMarkerShown: true,
  myLocation: config.defaultLocation,
  googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${
    config.MAP_KEY
  }&libraries=places`,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <MapContainer />,
  mapElement: <div style={{ height: `100%` }} />
};

export default SchoolLocationMap;
