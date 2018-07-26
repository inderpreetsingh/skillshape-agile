import React, { Component } from "react";

export default (withMovingMarker = MapComponent => {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        draggable: true // By default map is draggable
      };
    }

    onChildMouseDown() {
      // set map no draggable
      this.setState({
        draggable: false
      });
    }

    onChildMouseUp() {
      this.setState({
        draggable: true
      });
    }

    onChildMouseMove(key, marker, newCoords) {
      // Change item data with new coordinates
      // you need set here own store and update function

      let { item } = marker;

      console.log(item, key, newCoords, "======");
      // let { PlacesStore } = this.props;
      //
      // this.forceUpdate();
    }

    render() {
      return <WrappedComponent {...this.state} />;
    }
  };
});
