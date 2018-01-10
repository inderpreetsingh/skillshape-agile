import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import {Element, scroller } from 'react-scroll'

import Cover from './components/Cover.jsx';
import BrandBar from './components/BrandBar.jsx';
import SearchArea from './components/SearchArea.jsx';
import CardsList from './components/cards/CardsList.jsx';
import ClassMap from './components/map/ClassMap.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import ClassTypeList from './components/classType/classTypeList.jsx';
import SwitchIconButton from './components/buttons/SwitchIconButton.jsx';
import Footer from './components/footer/index.jsx';

import * as helpers from './components/jss/helpers.js';
import { cardsData, cardsData1} from './constants/cardsData.js';
import config from '/imports/config';

const MainContentWrapper = styled.div`
  display: flex;
`;

const FilterBarWrapper = styled.div`
  width: calc(20% - 20px);
  margin: 10px;
`;

// const CardsDisplaySectionWrapper = styled.section`
//   width: calc(100% - ${helpers.rhythmDiv}px);
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;

//   @media screen and (min-width : 0) and (max-width: ${helpers.tablet}px) {
//     width: 100%;
//   }
// `;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const CardsContainer = styled.div`
  width: 100%;
`;

const SwitchViewWrapper = styled.div`
  padding: ${helpers.rhythmDiv}px;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 20;
`;

class Landing extends Component {

    state = {
      mapView: false,
      cardsDataList : [cardsData,cardsData1],
      filters: {
        coords: config.defaultLocation,
      },
    }

    componentWillMount() {
        this.getMyCurrentLocation()
    }

    toggleMapView = () => {
      this.setState({
        mapView: !this.state.mapView
      });

      this.scrollTo();
    }

    scrollTo(name) {
      scroller.scrollTo(('content-container'|| name),{
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
    }
    applyFilters = (newfilters, locationName) => {
      let filters = this.state.filters || {};
      this.setState({filters: newfilters, locationName})
    }
    getMyCurrentLocation = () => {
        if(navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                let geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                let geocoder = new google.maps.Geocoder();
                let coords = {};
                // coords[0] = position.coords.latitude || config.defaultLocation[0];
                // coords[1] = position.coords.longitude || config.defaultLocation[1];
                geocoder.geocode({'latLng': latlng}, (results, status) => {
                    let sLocation = "near by me";
                    let oldFilters = {...this.state.filters};
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0]) {
                        let place = results[0];
                        coords.NEPoint = [place.geometry.bounds.b.b, place.geometry.bounds.b.f];
                        coords.SWPoint = [place.geometry.bounds.f.b,place.geometry.bounds.f.f];
                        sLocation = results[0].formatted_address
                        oldFilters["coords"] = coords;
                      }
                    }
                    this.setState({
                      filters: oldFilters,
                      locationName: "your_location",
                      isLoading: false,
                    })
                });
              // toastr.success("Showing classes around you...","Found your location");
              // // Session.set("coords",coords)
            })
        }
    }

    render() {
        console.log("Landing state -->>",this.state);
        return(
            <div>
                <Cover>
                    <SearchArea/>
                </Cover>
                <FilterPanel currentAddress={this.state.currentAddress} applyFilters={this.applyFilters} filters={this.state.filters} />
                <Element name="content-container" className="element">
                    <ClassTypeList
                        locationName={this.state.locationName}
                        mapView={this.state.mapView}
                        filters={this.state.filters}
                    />
                </Element>
                <SwitchViewWrapper>
                    <SwitchIconButton onClick={this.toggleMapView}/>
                </SwitchViewWrapper>
            </div>
        )
    }
}
export default Landing;