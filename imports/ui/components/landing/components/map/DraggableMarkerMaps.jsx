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

import { withMovingMarker } from "/imports/util";

const mapOptions = {
  zoom: 8,
  scrollwheel: true,
  minZoom: 1,
  center: { lat: -25.363, lng: 131.044 }
};

const MapContainer = styled.div`
  max-height: 400px;
`;

const ClassMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <MapContainer />
  }),
  withScriptjs,
  withGoogleMap,
  withMovingMarker
)(props => (
  <GoogleMap
    defaultZoom={mapOptions.zoom}
    defaultCenter={mapOptions.center}
    options={mapOptions}
    yesIWantToUseGoogleMapApiInternals
    draggable={props.draggable}
  >
    {props.isMarkerShown && <Marker position={props.locationData} />}
  </GoogleMap>
));

ClassMap.defaultProps = {
  isMarkerShown: PropTypes.bool
};

export default ClassMap;
