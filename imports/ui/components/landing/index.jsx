import React, {Component,Fragment} from 'react';
import { debounce } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import {Element, scroller } from 'react-scroll'
import Sticky from 'react-stickynode';
import { browserHistory } from 'react-router';

import Cover from './components/Cover.jsx';
import BrandBar from './components/BrandBar.jsx';
import SearchArea from './components/SearchArea.jsx';
import CardsList from './components/cards/CardsList.jsx';
import ClassMap from './components/map/ClassMap.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import ClassTypeList from './components/classType/classTypeList.jsx';
import SwitchIconButton from './components/buttons/SwitchIconButton.jsx';
import FloatingMapButton from './components/buttons/FloatingMapButton.jsx';
import Footer from './components/footer/index.jsx';

import * as helpers from './components/jss/helpers.js';
import { cardsData, cardsData1} from './constants/cardsData.js';
import config from '/imports/config';
import Events from '/imports/util/events';

const MainContentWrapper = styled.div`
  display: flex;
  position: relative;
`;

const FilterBarWrapper = styled.div`
  width: calc(20% - 20px);
  margin: ${helpers.rhythmDiv}px;
`;

const MapOuterContainer = styled.div`
  width: 40%;
  display: block;
  position: relative;
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    width: 100%;
  }
`;

const MapContainer = styled.div`
  transform: translateY(75px);
  height: calc(100vh - 80px);
`;

const WithMapCardsContainer = styled.div`
  width: 60%;
  padding:${helpers.rhythmDiv * 2}px;
  padding-top: 0;

  ${helpers.flexDirectionColumn}
  justify-content: space-between;
  transform: translateY(80px);

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

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: ${props => props.mapView ? 'none' : 'block'};
  }
`;

const FloatingMapButtonWrapper = styled.div`
  padding: ${helpers.rhythmDiv}px;
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 20;
  display: none;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
  width: 100%;
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

    componentDidMount() {
      console.log("this.props.location.query in componentDidMount",this.props.location.query)
      if(this.props.location.query && this.props.location.query.claimRequest) {

        if(this.props.location.query.type != 'reject') {
          Meteor.call('approveSchoolClaimRequest',this.props.location.query.claimRequest);
        } else if(this.props.location.query.schoolRegister) {
            Meteor.call('approveSchoolClaimRequest',this.props.location.query.claimRequest,{rejected: true},()=> {
              Events.trigger("registerAsSchool",{userType: "School"})
            });
        } else if(this.props.location.query.redirectUrl) {
            Meteor.call('approveSchoolClaimRequest',this.props.location.query.claimRequest,{rejected: true},()=> {
                if(!this.props.currentUser) {
                  // Let the admin user login if user is not login.
                  Events.trigger("loginAsSchoolAdmin",{redirectUrl: this.props.location.query.redirectUrl});
                } else { // Otherwise redirect to school admin page
                  browserHistory.push(this.props.location.query.redirectUrl)
                }
            });
        }
      }
    }

    handleStickyStateChange = (status) => {
      console.log(status,"status..")
      if (status.status === 2) {
        this.setState({
           sticky: true
        });
      }else if(status.status === 0) {
        this.setState({
           sticky: false
        });
      }
    }

    handleToggleMapView = () => {
        let oldFilter = {...this.state.filters};
        oldFilter.is_map_view = !this.state.mapView;
        this.setState({
            mapView: !this.state.mapView,
            filters: oldFilter,
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

    setSchoolIdFilter = ({schoolId}) => {
        let oldFilters = {...this.state.filters};
        oldFilters.schoolId = schoolId;
        this.setState({filters: oldFilters})
    }

    render() {
        // console.log("Landing state -->>",this.state);
        console.log("Landing props -->>",this.props);
        console.log('Map view,,',this.state.mapView);
        console.log('this.state.cardsList',this.state.cardsDataList[0]);
        return(
            <div>
                {!this.state.mapView &&
                  (
                  <Fragment>
                  <Cover itemScope itemType="http://schema.org/WPHeader">
                    <BrandBar
                      currentUser={this.props.currentUser}
                    />
                    <SearchArea
                        onSearch={this.onSearch}
                        getMyCurrentLocation={this.getMyCurrentLocation}
                    />
                    </Cover>
                <CenterCapsule> Browse using Filters ⤵ </CenterCapsule>
                </Fragment>
              )}

                 <div>
                    {!this.state.mapView ?
                      (<Sticky innerZ={10} onStateChange={this.handleStickyStateChange} >
                      <FilterPanel
                          clearDefaultLocation={this.clearDefaultLocation}
                          currentAddress={this.state.defaultLocation || this.state.locationName}
                          applyFilters={this.applyFilters}
                          filters={this.state.filters}
                          stickyPosition={this.state.sticky}
                      />
                    </Sticky>)
                    : (

                      <FilterPanel
                          clearDefaultLocation={this.clearDefaultLocation}
                          currentAddress={this.state.defaultLocation || this.state.locationName}
                          applyFilters={this.applyFilters}
                          mapView={this.state.mapView}
                          filters={this.state.filters}
                          stickyPosition={this.state.sticky}
                      />
                    )}
                 </div>


                <Element name="content-container" className="element">
                    <ClassTypeList
                        locationName={this.state.locationName}
                        mapView={this.state.mapView}
                        filters={this.state.filters}
                        handleSeeMore={this.handleSeeMore}
                        defaultLocation={this.state.defaultLocation}
                        clearDefaultLocation={this.clearDefaultLocation}
                        splitByCategory={true}
                        setSchoolIdFilter={this.setSchoolIdFilter}
                        {...this.props}

                    />
                </Element>


                {/*
                 <Element name="content-container" className="element">
                  <MainContentWrapper>
                    {this.state.mapView ?
                      (
                        <Fragment>
                          <MapOuterContainer>
                            <Sticky top={0}>
                              <MapContainer>
                                <ClassMap isMarkerShown />
                              </MapContainer>
                            </Sticky>
                          </MapOuterContainer>
                         <WithMapCardsContainer>
                            <div>
                            <CardsList mapView={this.state.mapView} title={'Yoga in Delhi'} name={'yoga-in-delhi'} cardsData={this.state.cardsDataList[0]} />
                            <CardsList mapView={this.state.mapView} title={'Painting in Paris'} name={'painting-in-paris'} cardsData={this.state.cardsDataList[1]} />
                            </div>
                            <FooterOuterWrapper>
                              <FooterWrapper>
                                <Footer mapView={this.state.mapView}/>
                              </FooterWrapper>
                            </FooterOuterWrapper>
                         </WithMapCardsContainer>
                       </Fragment>
                     ) :
                   (<CardsContainer>

                      <CardsList mapView={this.state.mapView} title={'Yoga in Delhi'} name={'yoga-in-delhi'} cardsData={this.state.cardsDataList[0]} />
                      <CardsList mapView={this.state.mapView} title={'Painting in Paris'} name={'painting-in-paris'} cardsData={this.state.cardsDataList[1]} />
                   </CardsContainer>)}
                 </MainContentWrapper>
               </Element>*/}

               {!this.state.mapView && <Footer mapView={this.state.mapView}/>}

               {this.state.mapView && <FloatingMapButtonWrapper>
                  <FloatingMapButton
                    onListButtonClick={this.handleToggleMapView}
                    
                  />
               </FloatingMapButtonWrapper>}

                <SwitchViewWrapper mapView={this.state.mapView}>
                    <SwitchIconButton onClick={this.handleToggleMapView}/>
                </SwitchViewWrapper>
            </div>
        )
    }
}


export default Landing;
