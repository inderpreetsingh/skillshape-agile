import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import config from "/imports/util";
import { withMovingMarker } from "/imports/util";

const mapOptions = {
  zoom: 8,
  scrollwheel: true,
  minZoom: 1,
  center: { lat: -25.363, lng: 131.044 }
  //center: config.defaultLocationObject
};

const MapContainer = styled.div`
  max-height: 400px;
`;

const SchoolLocationMap = withMovingMarker(
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
        {...props}
      >
        {props.isMarkerShown && React.cloneElement(props.movingMarker)}
      </GoogleMap>
    );
  })
);

SchoolLocationMap.propTypes = {
  isMarkerShown: PropTypes.bool,
  dragMarker: PropTypes.bool,
  myLocation: PropTypes.object,
  googleMapURL: PropTypes.string,
  containerElement: PropTypes.element,
  mapElement: PropTypes.element,
  loadingElement: PropTypes.element
};

SchoolLocationMap.defaultProps = {
  isMarkerShown: true,
  dragMarker: true,
  myLocation: config.defaultLocation,
  googleMapURL:
    "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAUzsZloT4lEquePIL_uReXGwMYGqyL0NE&libraries=places",
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `400px` }} />,
  mapElement: <div style={{ height: `100%` }} />
};

export default SchoolLocationMap;
