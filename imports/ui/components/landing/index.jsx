import React, {Component,Fragment} from 'react';
import { debounce } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import {Element, scroller } from 'react-scroll'
import Sticky from 'react-sticky-el';

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
  position: relative;
`;

const FilterBarWrapper = styled.div`
  width: calc(20% - 20px);
  margin: ${helpers.rhythmDiv}px;
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

const MapOuterContainer = styled.div`
  width: 40%;
  display: block;
  position: relative;
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    width: 100%;
  }
`;

const MapContainer = styled.div`
  width: auto;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const WithMapCardsContainer = styled.div`
  width: 60%;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: 0;
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: none;
    width: 0;
    height: 0;
  }
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

const FooterOuterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  @media screen and (max-width : ${helpers.tablet + 100}px) {
    display: none;
    width: 0;
    height: 0;
  }
`;

const FooterWrapper = styled.div`
  width: 60%;
`;


const CenterCapsule = styled.div`
   font-size:12px;
   line-height:${helpers.baseFontSize}px;
   background:white;
   border-radius:400px;
   max-width:200px;
   color:${helpers.textColor};
   background:${helpers.panelColor};
   margin:auto;
   transform: translateY(-50%);
   text-transform:uppercase;
   letter-spacing:1px;
   box-shadow:2px 2px 3px rgba(0,0,0,0.1);
   text-align:center;
   padding:4px;
 `;


class Landing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mapView: false,
            sticky: false,
            cardsDataList: [cardsData, cardsData1],
            filters: {
                coords: null,
                skillCategoryClassLimit: {}
            },
        }
        this.onSearch = debounce(this.onSearch, 1000);
    }

    handleFixedToggle = (defaultPosition) => {
       const stickyPosition = !defaultPosition;
       console.log(this.state.sticky, defaultPosition);
       if(this.state.sticky != stickyPosition) {
         this.setState({
           sticky: stickyPosition
         });
       }

     }

    handleToggleMapView = () => {
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
                let coords = [];
                coords[0] = position.coords.latitude || config.defaultLocation[0];
                coords[1] = position.coords.longitude || config.defaultLocation[1];
                geocoder.geocode({'latLng': latlng}, (results, status) => {
                    let sLocation = "near by me";
                    let oldFilters = {...this.state.filters};
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0]) {
                        let place = results[0];
                        // coords.NEPoint = [place.geometry.bounds.b.b, place.geometry.bounds.b.f];
                        // coords.SWPoint = [place.geometry.bounds.f.b,place.geometry.bounds.f.f];
                        sLocation = results[0].formatted_address
                        oldFilters["coords"] = coords;
                      }
                    }
                    this.setState({
                      filters: oldFilters,
                      locationName: `your location`,
                      defaultLocation: sLocation,
                      isLoading: false,
                    })
                });
              // toastr.success("Showing classes around you...","Found your location");
              // // Session.set("coords",coords)
            })
        }
    }

    handleSeeMore = (categoyName) => {
      // Attach count with skill cateory name so that see more functionlity can work properly.
      let oldFilter = {...this.state.filters};
      let categoryFilter = oldFilter.skillCategoryClassLimit || {};
      categoryFilter[categoyName] = categoryFilter[categoyName] && categoryFilter[categoyName] + config.seeMoreCount || 2 * config.seeMoreCount;
      oldFilter.skillCategoryClassLimit = categoryFilter;
      this.setState({filters:oldFilter})
    }

    clearDefaultLocation = () => {
        let oldFilter = {...this.state.filters};
        oldFilter.coords = null;
        this.setState({defaultLocation: null,locationName: null, filters: oldFilter });
    }

    onSearch = (value) => {
        let oldFilters = {...this.state.filters};
        oldFilters.mainSearchText = value;
        this.setState({
            filters: oldFilters
        })
    }

    render() {
        console.log("Landing state -->>",this.state);
        return(
            <div>
                <Cover>
                    <BrandBar
                      currentUser={this.props.currentUser}
                    />
                    <SearchArea
                        onSearch={this.onSearch}
                        getMyCurrentLocation={this.getMyCurrentLocation}
                    />
                </Cover>

                <CenterCapsule> Browse using Filters ⤵ </CenterCapsule>

                 <div>
                    <Sticky stickyClassName={"filter-panel-sticked"} onFixedToggle={this.handleFixedToggle}>
                        <FilterPanel
                            clearDefaultLocation={this.clearDefaultLocation}
                            currentAddress={this.state.defaultLocation || this.state.locationName}
                            applyFilters={this.applyFilters}
                            filters={this.state.filters}
                            stickyPosition={this.state.sticky}
                        />
                   </Sticky>
                 </div>


                {/*<Element name="content-container" className="element">
                    <ClassTypeList
                        locationName={this.state.locationName}
                        mapView={this.state.mapView}
                        filters={this.state.filters}
                        handleSeeMore={this.handleSeeMore}
                        defaultLocation={this.state.defaultLocation}
                        clearDefaultLocation={this.clearDefaultLocation}
                        splitByCategory={true}
                    />
                </Element>*/}

                 <Element name="content-container" className="element">
                  <MainContentWrapper>
                    {this.state.mapView ?
                      (
                        <Fragment>
                          <MapOuterContainer>
                           <Sticky topOffset={-100} className="map-holder" stickyStyle={{transform: 'translateY(80px)', height: 'calc(100vh - 50px)'}}>
                              <ClassMap isMarkerShown />
                            </Sticky>
                          </MapOuterContainer>
                         <WithMapCardsContainer>
                             <CardsList mapView={this.state.mapView} title={'Yoga in Delhi'} name={'yoga-in-delhi'} cardsData={this.state.cardsDataList[0]} />
                             <CardsList mapView={this.state.mapView} title={'Painting in Paris'} name={'painting-in-paris'} cardsData={this.state.cardsDataList[1]} />
                         </WithMapCardsContainer>
                       </Fragment>
                     ) :
                   (<CardsContainer>

                      <CardsList mapView={this.state.mapView} title={'Yoga in Delhi'} name={'yoga-in-delhi'} cardsData={this.state.cardsDataList[0]} />
                      <CardsList mapView={this.state.mapView} title={'Painting in Paris'} name={'painting-in-paris'} cardsData={this.state.cardsDataList[1]} />
                   </CardsContainer>)}
                 </MainContentWrapper>
               </Element>

               {this.state.mapView ?
                  (<FooterOuterWrapper>
                    <FooterWrapper>
                      <Footer mapView={this.state.mapView}/>
                    </FooterWrapper>
                  </FooterOuterWrapper>
                  )
                  :
                  <Footer mapView={this.state.mapView}/>
              }

                <SwitchViewWrapper>
                    <SwitchIconButton onClick={this.handleToggleMapView}/>
                </SwitchViewWrapper>
            </div>
        )
    }
}
export default Landing;
