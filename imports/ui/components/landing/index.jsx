import React, {Component,Fragment} from 'react';
import DocumentTitle from 'react-document-title';
import { debounce, isEmpty, get } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import {Element, scroller } from 'react-scroll';
import Sticky from 'react-stickynode';
import { browserHistory } from 'react-router';
import ip from 'ip';

import Cover from './components/Cover.jsx';
import BrandBar from './components/BrandBar.jsx';
import SearchArea from './components/SearchArea.jsx';
import CardsList from './components/cards/CardsList.jsx';
import ClassMap from './components/map/ClassMap.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import ClassTypeList from './components/classType/classTypeList.jsx';
import SwitchIconButton from './components/buttons/SwitchIconButton.jsx';
import FloatingChangeViewButton from './components/buttons/FloatingChangeViewButton.jsx';
import Footer from './components/footer/index.jsx';
import NoResults from './components/NoResults.jsx';

import PrimaryButton from './components/buttons/PrimaryButton.jsx';
import ContactUsFloatingButton from './components/buttons/ContactUsFloatingButton.jsx';
import FiltersDialogBox from './components/dialogs/FiltersDialogBox.jsx';

import * as helpers from './components/jss/helpers.js';
import { cardsData, cardsData1} from './constants/cardsData.js';
import config from '/imports/config';
import Events from '/imports/util/events';
import { toastrModal } from '/imports/util';

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
  display: flex;
  align-items: center;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: ${props => props.mapView ? 'none' : 'block'};
  }
`;

const MapViewText = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  margin-right: ${helpers.rhythmDiv}px;
  color: ${helpers.primaryColor};
  font-weight: 300;
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

const CoverWrapper = styled.div`
  position: relative;
  clip-path: ${helpers.clipPathCurve};

  @media screen and (max-width: ${helpers.tablet}px) {
    clip-path: ${helpers.clipPathCurve};
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    clip-path: ${helpers.clipPathCurve};
  }
`;

const CenterCapsule = styled.div`
   font-size: 12px;
   line-height: ${helpers.baseFontSize}px;
   background: white;
   border-radius: 400px;
   max-width: 200px;
   color: ${helpers.textColor};
   background: ${helpers.panelColor};
   margin: auto;
   transform: translateY(-50%);
   text-transform: uppercase;
   letter-spacing: 1px;
   box-shadow: 2px 2px 3px rgba(0,0,0,0.1);
   text-align: center;
   padding: 4px;
 `;

 const FilterPanelWrapper = styled.div`
  position: relative;
 `;

 const FilterBarDisplayWrapper = styled.div`
  display: ${props => props.sticky ? 'block' : 'none'};
  width: 100%;
 `;

 const ContactUsWrapper = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10%;
  z-index: 1500;
 `;

class Landing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mapView: false,
            sticky: false,
            filterPanelDialogBox: false,
            cardsDataList: [cardsData, cardsData1],
            filters: {
                coords: null,
                skillCategoryClassLimit: {},
                applyFilterStatus: false,
            },
            tempFilters: {},
        }
        this.handleLocationSearch = debounce(this.handleLocationSearch, 1000);
        this.handleSkillTypeSearch = debounce(this.handleSkillTypeSearch, 1000);
    }

    componentWillMount() {
        let url = `https://freegeoip.net/json/${ip.address()}`
        Meteor.http.get(url, (err, res)=> {
            console.log("freegeoip response -->>",res)
            if(res && !isEmpty(res.data)) {
                let oldFilters = {...this.state.filters};
                oldFilters.coords = [ res.data.latitude, res.data.longitude];
                this.setState({filters: oldFilters})
            }
        })
    }

    componentDidMount() {
      console.log("this.props.location.query in componentDidMount",this.props.location.query)
      if(this.props.location.query && this.props.location.query.claimRequest) {

        if(this.props.location.query.schoolRegister) {
            Meteor.call('school.approveSchoolClaimRequest',this.props.location.query.claimRequest,{rejected: true},()=> {
              Events.trigger("registerAsSchool",{userType: "School"})
            });
        } else if(this.props.location.query.approve) {
            Meteor.call('school.approveSchoolClaimRequest',this.props.location.query.claimRequest);
        } else if(this.props.location.query.redirectUrl) {
            Meteor.call('school.approveSchoolClaimRequest',this.props.location.query.claimRequest,{rejected: true},()=> {
                if(!this.props.currentUser) {
                  // Let the admin user login if user is not login.
                  Events.trigger("loginAsSchoolAdmin",{redirectUrl: this.props.location.query.redirectUrl});
                } else { // Otherwise redirect to school admin page
                  browserHistory.push(this.props.location.query.redirectUrl)
                }
            });
        } else if(this.props.location.query.keepMeSuperAdmin) { // Handle Keep me Super Admin case
           Meteor.call('school.approveSchoolClaimRequest',this.props.location.query.claimRequest,{keepMeSuperAdmin: true},()=> {
            });
        } else if(this.props.location.query.makeRequesterSuperAdmin) { // Handle make requester Super Admin
             Meteor.call('school.approveSchoolClaimRequest',this.props.location.query.claimRequest,{makeRequesterSuperAdmin: true},()=> {
            });
        } else if(this.props.location.query.removeMeAsAdmin) { // Remove me as Super Admin
             Meteor.call('school.approveSchoolClaimRequest',this.props.location.query.claimRequest,{removeMeAsAdmin: true},()=> {
            });
        }
      }
      if(this.props.location.query && this.props.location.query.acceptInvite) {
        Events.trigger("acceptInvitationAsMember",{userData: this.props.location.query});
      }
    }

    handleStickyStateChange = (status) => {
      console.log(status,"status..")
      if (status.status === 2) {
        if(!this.state.sticky) {
          this.setState({
            sticky: true
          });
        }
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
        // scroller.scrollMore(10);
    }

    scrollTo(name) {
      scroller.scrollTo((name || 'content-container'),{
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
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

    handleLocationSearch = (locationText) => {
        // console.log("handleLocationSearch -->>",locationText)
        this.setState({
            filters: {
                ...this.state.filters,
                locationText
            }
        })
    }

    handleSkillTypeSearch = (skillTypeText) => {
        // console.log("handleSkillTypeSearch -->>",skillTypeText);
        this.setState({
            filters: {
                ...this.state.filters,
                skillTypeText
            }
        })
    }

    setSchoolIdFilter = ({schoolId}) => {
        let oldFilters = {...this.state.filters};
        oldFilters.schoolId = schoolId;
        this.setState({filters: oldFilters})
    }

    handleFiltersDialogBoxState = (state) => {
        this.setState({
            filterPanelDialogBox: state
        })
    }

    onLocationChange = (location, updateKey1, updateKey2) => {
        let stateObj = {};

        if(updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                coords: location.coords,
                locationName: location.fullAddress,
                applyFilterStatus: true,
                schoolId: null,
            }
        }

        if(updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                coords: location.coords,
                locationName: location.fullAddress
            }
        }

        this.setState(stateObj);
    }

    locationInputChanged = (event, updateKey1, updateKey2) => {
        let stateObj = {};

        if(updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                coords: null,
                locationName: event.target.value
            }
        }

        if(updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                coords: null,
                locationName: event.target.value
            }
        }

        this.setState(stateObj);

    }

    fliterSchoolName = (event, updateKey1, updateKey2) => {
        let stateObj = {};

        if(updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                schoolName: event.target.value,
                applyFilterStatus: true,
                schoolId: null,
            }
        }

        if(updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                schoolName: event.target.value
            }
        }

        this.setState(stateObj);

    }

    collectSelectedSkillCategories = (text, updateKey1, updateKey2) => {
        let stateObj = {};

        if(updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                skillCategoryIds: text.map((ele) => ele._id),
                defaultSkillCategories: text,
                applyFilterStatus: true,
            }
        }

        if(updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                skillCategoryIds: text.map((ele) => ele._id),
                defaultSkillCategories: text
            }
        }

        this.setState(stateObj);

    }

    collectSelectedSkillSubject = (text) => {
        let oldFilter = {...this.state.filters}
        oldFilter.skillSubjectIds = text.map((ele) => ele._id);
        oldFilter.defaultSkillSubject = text
        this.setState({ filters: oldFilter})
    }

    skillLevelFilter = (text) => {
        let oldFilter = {...this.state.filters}
        oldFilter.experienceLevel = text;
        this.setState({filters: oldFilter})
    }


    filterGender = (event) => {
        let oldFilter = {...this.state.filters};
        oldFilter.gender = event.target.value;
        this.setState({filters:oldFilter})
    }

    filterAge =(event) => {
        let oldFilter = {...this.state.filters};
        oldFilter.age = parseInt(event.target.value);
        this.setState({ filters: oldFilter });
    }

    perClassPriceFilter = (text) => {
        let oldFilter = {...this.state.filters}
        oldFilter._classPrice = text;
        this.setState({ filters: oldFilter })
    }

    pricePerMonthFilter = (text) => {
        let oldFilter = {...this.state.filters}
        oldFilter._monthPrice = text;
        this.setState({ filters: oldFilter })
    }

    removeAllFilters = ()=> {
        this.setState({
            filters: {},
            tempFilters: {},
        })
    }

    handleMemberInvitedDialogBoxState = (state) => {
        this.setState({memberInvitedDialogBox: state});
    }

    renderFilterPanel = () => {
        return <FilterPanel
            currentAddress={this.state.defaultLocation || this.state.locationName}
            removeAllFilters={this.removeAllFilters}
            mapView={this.state.mapView}
            filters={this.state.filters}
            tempFilters={this.state.tempFilters}
            stickyPosition={this.state.sticky}
            handleToggleMapView={this.handleToggleMapView}
            handleShowMoreFiltersButtonClick={() => this.handleFiltersDialogBoxState(true)}
            handleNoOfFiltersClick={() => this.handleFiltersDialogBoxState(true)}
            onLocationChange={this.onLocationChange}
            locationName={this.state.locationName}
            locationInputChanged={this.locationInputChanged}
            fliterSchoolName={this.fliterSchoolName}
            filterAge={this.filterAge}
            filterGender={this.filterGender}
            skillLevelFilter={this.skillLevelFilter}
            perClassPriceFilter={this.perClassPriceFilter}
            pricePerMonthFilter={this.pricePerMonthFilter}
            collectSelectedSkillCategories={this.collectSelectedSkillCategories}
            collectSelectedSkillSubject={this.collectSelectedSkillSubject}
        />
    }

    render() {
        // console.log("Landing state -->>",this.state);
        console.log("Landing state -->>",this.state);
        console.log("Landing props -->>",this.props);
        return(
            <DocumentTitle title={this.props.route.name}>
                <div>
                <FiltersDialogBox
                    open={this.state.filterPanelDialogBox}
                    onModalClose={() => this.handleFiltersDialogBoxState(false)}
                    filterPanelProps={{
                        currentAddress: (this.state.defaultLocation || this.state.locationName),
                        removeAllFilters: this.removeAllFilters,
                        filters: this.state.filters,
                        tempFilters: this.state.tempFilters,
                        stickyPosition: this.state.sticky,
                        onLocationChange: this.onLocationChange,
                        locationName: this.state.locationName,
                        locationInputChanged: this.locationInputChanged,
                        fliterSchoolName: this.fliterSchoolName,
                        filterAge: this.filterAge,
                        filterGender: this.filterGender,
                        skillLevelFilter: this.skillLevelFilter,
                        perClassPriceFilter: this.perClassPriceFilter,
                        pricePerMonthFilter: this.pricePerMonthFilter,
                        collectSelectedSkillCategories: this.collectSelectedSkillCategories,
                        collectSelectedSkillSubject: this.collectSelectedSkillSubject,
                    }}
                />

              {/* Cover */}
             <CoverWrapper>
               <Cover itemScope itemType="http://schema.org/WPHeader">
               <BrandBar
                currentUser={this.props.currentUser}
               />
                <SearchArea
                    onLocationInputChange={this.handleLocationSearch}
                    onSkillTypeChange={this.handleSkillTypeSearch}
                    onFiltersButtonClick={() => this.handleFiltersDialogBoxState(true)}
                    getMyCurrentLocation={this.getMyCurrentLocation}
                    onMapViewButtonClick={this.handleToggleMapView}
                    mapView={this.state.mapView}
                />
                </Cover>
              </CoverWrapper>

              {/* Filter Panel */}
               <FilterPanelWrapper>
                  <Sticky innerZ={10} onStateChange={this.handleStickyStateChange}>
                    {this.state.mapView ? this.renderFilterPanel() :
                    <FilterBarDisplayWrapper sticky={this.state.sticky}>
                      {this.renderFilterPanel()}
                    </FilterBarDisplayWrapper>}
                  </Sticky>
               </FilterPanelWrapper>

              {/*Cards List */}
                <Element name="content-container" className="element homepage-content">
                    <ClassTypeList
                        locationName={this.state.locationName}
                        mapView={this.state.mapView}
                        filters={this.state.filters}
                        handleSeeMore={this.handleSeeMore}
                        defaultLocation={this.state.defaultLocation}
                        clearDefaultLocation={this.clearDefaultLocation}
                        splitByCategory={true}
                        setSchoolIdFilter={this.setSchoolIdFilter}
                        removeAllFilters={this.removeAllFilters}
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
               </Element>
               */}


               {!this.state.mapView && <Footer mapView={this.state.mapView}/>}

               {this.state.mapView && <FloatingMapButtonWrapper>
                  <FloatingChangeViewButton
                    onListButtonClick={this.handleToggleMapView}
                  />
               </FloatingMapButtonWrapper>}

               {/*
                <SwitchViewWrapper mapView={this.state.mapView}>
                  {this.state.mapView ?
                  (<FloatingChangeViewButton
                      cardsView={true}
                      onListButtonClick={this.handleToggleMapView} />)
                    :
                  (<FloatingChangeViewButton
                    cardsView={true}
                    label="MAP"
                    iconName="map"
                    onListButtonClick={this.handleToggleMapView} />)
                  }
                </SwitchViewWrapper>
              */}
              </div>
            </DocumentTitle>
        )
    }
}


export default Landing;
