import React, { Component } from 'react';
import { Marker } from 'react-google-maps';
import config from '/imports/config';

export default (withMovingMarker = WrappedComponent => class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myLocation: this._initializeLocation(),
    };
  }

    _initializeLocation = (nextProps) => {
      const { locationData, myCurrentPosition } = nextProps || this.props;
      return {
        lat:
          (locationData && locationData.lat)
          || (myCurrentPosition && myCurrentPosition[0])
          || config.defaultLocationObject.lat,
        lng:
          (locationData && locationData.lng)
          || (myCurrentPosition && myCurrentPosition[1])
          || config.defaultLocationObject.lng,
      };
    };

    componentWillReceiveProps = (nextProps) => {
      if (this.props.locationData || nextProps.locationData) {
        if (
          (this.props.locationData && this.props.locationData.lat) !== nextProps.locationData.lat
          || (this.props.locationData && this.props.locationData.lng) !== nextProps.locationData.lng
        ) {
          this.setState(state => ({
            ...state,
            myLocation: this._initializeLocation(nextProps),
          }));
        }
      }
    };

    dragEnd = (e) => {
      this.setState({
        ...this.state,
        myLocation: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      });

      this.props.onDragEnd && this.props.onDragEnd({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    };

    dragStart = (e, ar) => {
      // debugger;
      this.props.onDragStart
        && this.props.onDragStart({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          myLocation={this.state.myLocation}
          renderMarker={(
            <Marker
              draggable={this.props.markerDraggable}
              position={this.state.myLocation}
              onDragStart={this.dragStart}
              onDragEnd={this.dragEnd}
            />
)}
        />
      );
    }
});
