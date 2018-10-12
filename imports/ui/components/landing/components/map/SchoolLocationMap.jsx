import PropTypes from "prop-types";
import React from "react";
import { GoogleMap, withGoogleMap } from "react-google-maps";
import styled from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import config, { withMarker } from "/imports/util";




const mapOptions = {
  zoom: 8,
  scrollwheel: true,
  minZoom: 1,
  center: { lat: -25.363, lng: 131.044 }
  //center: config.defaultLocationObject
};

const MapElement = styled.div`
  height: 100%;
  border-radius: 5px;
`;

const LoadingElement = styled.div`
  height: 100%;
`;

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
    // console.group("Google Map");
    // console.log("Google map rendering", props.myLocation);
    // console.groupEnd();
    return (
      <GoogleMap
        defaultOptions={{ ...props.defaultOptions }}
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
  defaultOptions: PropTypes.object,
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
  defaultOptions: {
    mapTypeControl: false
  },
  loadingElement: <LoadingElement />,
  containerElement: <MapContainer />,
  mapElement: <div style={{ height: "100%", borderRadius: "5px" }} />
};

export default SchoolLocationMap;
