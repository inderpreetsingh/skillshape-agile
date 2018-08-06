import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "/imports/config";

import { Marker } from "react-google-maps";

// NOTE: By default the marker is draggable in this withMarker HOC.
export default (withMarker = WrappedComponent => {
  return class MarkerHOC extends Component {
    static defaultProps = {
      markerDraggable: true
    };

    constructor(props) {
      super(props);

      this.state = {
        draggable: true, // By default map is draggable
        myLocation: this._initializeLocation()
      };
    }

    _initializeLocation = nextProps => {
      const { locationData, myCurrentPosition } = nextProps || this.props;
      return {
        lat:
          locationData.lat ||
          myCurrentPosition[0] ||
          config.defaultLocationObject.lat,
        lng:
          locationData.lng ||
          myCurrentPosition[1] ||
          config.defaultLocationObject.lng
      };
    };

    componentWillReceiveProps = nextProps => {
      if (
        this.props.locationData.lat !== nextProps.locationData.lat ||
        this.props.locationData.lng !== nextProps.locationData.lng
      ) {
        this.setState(state => {
          return {
            ...state,
            myLocation: this._initializeLocation(nextProps)
          };
        });
      }
    };

    dragEnd = e => {
      // console.log(this.props.onDragEnd, "..........");
      debugger;
      console.group("mar dragger");
      console.log(e);
      console.groupEnd();
      this.setState({
        ...this.state,
        myLocation: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      });

      this.props.onDragEnd &&
        this.props.onDragEnd({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    };

    dragStart = (e, ar) => {
      debugger;
      console.group("mar dragger");
      console.log(e, ar);
      console.groupEnd();
      this.props.onDragStart &&
        this.props.onDragStart({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    };

    render() {
      // console.log(this.state,this.props,"=========== withMoving Marker.js")
      return (
        <WrappedComponent
          {...this.props}
          myLocation={this.state.myLocation}
          renderMarker={
            <Marker
              draggable={this.props.markerDraggable}
              position={this.state.myLocation}
              onDragStart={this.dragStart}
              onDragEnd={this.dragEnd}
            />
          }
        />
      );
    }
  };
});
