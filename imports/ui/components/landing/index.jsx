import { debounce, isEmpty, get } from "lodash";
import React, { Component, lazy, Suspense, Fragment } from "react";
const DocumentTitle = lazy(() => import("react-document-title"));
import { browserHistory, withRouter } from "react-router";
import { Element, scroller } from "react-scroll";
const Sticky = lazy(() => import("react-stickynode"));
const BrandBar = lazy(() => import("./components/BrandBar.jsx"));
const FloatingChangeViewButton = lazy(() => import("./components/buttons/FloatingChangeViewButton.jsx"));
const FormGhostButton = lazy(() => import("./components/buttons/FormGhostButton.jsx"));
const ClassTypeList = lazy(() => import("./components/classType/classTypeList.jsx"));
const Cover = lazy(() => import("./components/Cover.jsx"));
const FiltersDialogBox = lazy(() => import("./components/dialogs/FiltersDialogBox.jsx"));
const FilterPanel = lazy(() => import("./components/FilterPanel.jsx"));
const Footer = lazy(() => import("./components/footer/index.jsx"));
const SearchArea = lazy(() => import("./components/SearchArea.jsx"));
const config = lazy(() => import("/imports/config"));
const Events = lazy(() => import("/imports/util/events"));
import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";
import * as helpers from "./components/jss/helpers.js";
import { withPopUp } from "/imports/util";
import styled from "styled-components";

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
  padding-top: 0;

  ${helpers.flexDirectionColumn} justify-content: space-between;
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
    display: ${props => (props.mapView ? "none" : "block")};
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

  @media screen and (max-width: ${helpers.tablet + 100}px) {
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
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 4px;
`;

const FilterPanelWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  left: 0;
  z-index: 5;
  // height: ${props => props.height}px;
  height: 0;
 `;

const FilterBarDisplayWrapper = styled.div`
  display: ${props => (props.sticky ? "block" : "none")};
  width: 100%;
`;

const ContactUsWrapper = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10%;
  z-index: 1500;
`;
const FilterApplied = styled.div`
  ${helpers.flexCenter} font-weight: 500;
  font-size: ${helpers.baseFontSize}px;
  padding: ${helpers.rhythmDiv}px;
  // border-bottom: solid 1px #dddd;

  @media screen and (max-width: 360px) {
    flex-direction: column;
  }
`;

const FilterAppliedDivs = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${props => props.marginRight}px;

  @media screen and (max-width: 360px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv}px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

// This is just an empty div introduced just in order to push
// down the list based on certain condition
const ClassTypeCardsPush = styled.div`
  width: 100%;
  height: ${props => props.height}px;
`;

const ClassTypeOuterWrapper = styled.div`
  padding-top: ${props => props.padding}px;
`;

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapView: false,
      sticky: false,
      isLoading: false,
      isCardsBeingSearched: false,
      filterPanelDialogBox: false,
      filters: {
        coords: null,
        skillCategoryClassLimit: {},
        applyFilterStatus: false
      },
      tempFilters: {}
    };
    this.handleLocationSearch = debounce(this.handleLocationSearch, 1000);
    this.handleSkillTypeSearch = debounce(this.handleSkillTypeSearch, 1000);
  }

  _getNormalizedLocation = addressComponents => {
    const addressComponentTypes = ["administrative_area_level_1", "country"];
    // While in the filter, we are checking for those address components,
    // which have administrative_area_level1 and country in there types
    const normalizedLocation = addressComponents
      .filter(address =>
        address.types.some(
          addressComponentType =>
            addressComponentTypes.indexOf(addressComponentType) >= 0
        )
      )
      .map(address => address.long_name)
      .join(", ");

    return normalizedLocation;
  };

  _handleGeoLocationError(err) {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        // if (err.message.indexOf("User denied") == 0) {
        //   return "GeoLocation services dont have permission/ or they need to be switched on in your device/browser settings";
        // } else
        if (err.message.indexOf("Only secure origins are allowed") == 0) {
          return "GeoLocation services will only work in case of secured origin (eg https)";
        }
        break;

      case err.TIMEOUT:
        return "Browser geolocation error Timeout.";
        break;

      case err.POSITION_UNAVAILABLE:
        return "Browser geolocation error unavailable.";
        break;
    }
  }


  _redirectBasedOnVisitorType = () => {
    const {
      currentUser,
      isUserSubsReady,
      previousLocationPathName,
      currentLocationPathName,
      location
    } = this.props;
    const visitorType = localStorage.getItem("visitorType");
    const visitorRedirected = JSON.parse(
      localStorage.getItem("visitorRedirected")
    );
    let query = get(location, 'query', {});
    if (isEmpty(query)) {
      if (!visitorRedirected && previousLocationPathName === "/") {
        if (
          isUserSubsReady &&
          currentUser &&
          currentUser.profile.userType === "School"
        ) {
          localStorage.setItem("visitorRedirected", true);
          browserHistory.push("/dashboard");
        } else if (
          isUserSubsReady &&
          currentUser &&
          currentUser.profile.userType !== "School"
        ) {
          localStorage.setItem("visitorRedirected", true);

        } else if (isUserSubsReady && !currentUser) {
          localStorage.setItem("visitorRedirected", true);
          if (visitorType === "school") {
            browserHistory.push("/skillshape-for-school");
          } else {

          }
        }
      } else {
        // Lets say we land on any link and from that we clicked on lets back to homepage
        if (
          (visitorRedirected && isUserSubsReady) ||
          (isUserSubsReady && previousLocationPathName !== "/")
        ) {

        }
      }
    }
  };

  componentWillMount() {
    this._redirectBasedOnVisitorType();
  }

  componentDidMount() {
    this._redirectBasedOnVisitorType();
    const visitorTypeValue = localStorage.getItem("visitorType");
    if(visitorTypeValue){
      let positionCoords = this.getUsersCurrentLocation();
      positionCoords.then(function (value) {
        localStorage.setItem("myLocation", JSON.stringify(value));
      });
    }
    if (this.props.location.query && this.props.location.query.claimRequest) {
      const { popUp } = this.props;
      if (this.props.location.query.schoolRegister) {
        Meteor.call(
          "claimSchoolRequest.approveSchoolClaimRequest",
          this.props.location.query.claimRequest,
          { rejected: true },
          (err, res) => {
            if (err) {
              popUp.appear("alert", { content: err.reason || err.message });
            } else if (res && res.message) {
              popUp.appear("success", { content: res.message });
            } else {
              Events.trigger("registerAsSchool", { userType: "School" });
            }
          }
        );
      } else if (this.props.location.query.approve) {
        Meteor.call(
          "claimSchoolRequest.approveSchoolClaimRequest",
          this.props.location.query.claimRequest,
          (err, res) => {
            if (err) {
              popUp.appear("alert", { content: err.reason || err.message });
            }
            if (res && res.message) {
              popUp.appear("success", { content: res.message });
            }
          }
        );
      } else if (this.props.location.query.redirectUrl) {
        Meteor.call(
          "claimSchoolRequest.approveSchoolClaimRequest",
          this.props.location.query.claimRequest,
          { rejected: true },
          () => {
            if (!this.props.currentUser) {
              // Let the admin user login if user is not login.
              Events.trigger("loginAsSchoolAdmin", {
                redirectUrl: this.props.location.query.redirectUrl
              });
            } else {
              // Otherwise redirect to school admin page
              browserHistory.push(this.props.location.query.redirectUrl);
            }
          }
        );
      } else if (this.props.location.query.keepMeSuperAdmin) {
        // Handle Keep me Super Admin case
        Meteor.call(
          "claimSchoolRequest.approveSchoolClaimRequest",
          this.props.location.query.claimRequest,
          { keepMeSuperAdmin: true },
          (err, res) => {
            if (err) {
              popUp.appear("alert", { content: err.reason || err.message });
            }
            if (res && res.message) {
              popUp.appear("success", { content: res.message });
            }
          }
        );
      } else if (this.props.location.query.makeRequesterSuperAdmin) {
        // Handle make requester Super Admin
        Meteor.call(
          "claimSchoolRequest.approveSchoolClaimRequest",
          this.props.location.query.claimRequest,
          { makeRequesterSuperAdmin: true },
          (err, res) => {
            if (err) {
              popUp.appear("alert", { content: err.reason || err.message });
            }
            if (res && res.message) {
              popUp.success("success", { content: res.message });
            }
          }
        );
      } else if (this.props.location.query.removeMeAsAdmin) {
        // Remove me as Super Admin
        Meteor.call(
          "claimSchoolRequest.approveSchoolClaimRequest",
          this.props.location.query.claimRequest,
          { removeMeAsAdmin: true },
          (err, res) => {
            if (err) {
              popUp.appear("alert", { content: err.reason || err.message });
            }
            if (res && res.message) {
              popUp.appear("success", { content: res.message });
            }
          }
        );
      }

    }
    else if (this.props.location.query && this.props.location.query.acceptInvite) {
      Events.trigger("acceptInvitationAsMember", {
        userData: this.props.location.query
      });

    }
  }

  componentDidUpdate() {
    // Have to manually set it , otherwise it resets automatically in mapView.
    this._redirectBasedOnVisitorType();
    document.title = "Skillshape";
  }

  // This is used to get subjects on the basis of subject category.
  inputFromUser = text => {
    // Do db call on the basis of text entered by user
    let skillCategoryIds = this.state.filters.skillCategoryIds;
    Meteor.call(
      "getSkillSubjectBySkillCategory",
      { skillCategoryIds: skillCategoryIds, textSearch: text },
      (err, res) => {
        if (res) {
          this.setState({ skillSubjectData: res || [] });
        }
      }
    );
  };

  setFilters = filters => {
    // console.info(filters, "------");
    this.setState(state => {
      return {
        ...state,
        filters
      };
    });
  };

  getUsersCurrentLocation = args => {
    const { popUp } = this.props;
    return new Promise((resolve, reject) => {
      let positionCoords = [];
      if (navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            let geolocate = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            let latlng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            let geocoder = new google.maps.Geocoder();
            positionCoords.push(
              position.coords.latitude || config.defaultLocation[0]
            );
            positionCoords.push(
              position.coords.longitude || config.defaultLocation[1]
            );
            resolve(positionCoords);
          },
          err => {
            const geolocationError = this._handleGeoLocationError(err);
            if (geolocationError) {
              popUp.appear("alert", { content: geolocationError });
            }
          }
        );
      } else {
        reject();
      }
    });
  };

  handleIsCardsSearching = searchingState => {
    this.setState(state => {
      return {
        ...state,
        isCardsBeingSearched: searchingState
      };
    });
  };

  handleStickyStateChange = status => {
    if (status.status === 2) {
      if (!this.state.sticky) {
        this.setState({
          sticky: true
        });
      }
    } else if (status.status === 0) {
      this.setState({
        sticky: false
      });
    }
  };

  handleToggleMapView = () => {
    let oldFilter = { ...this.state.filters };
    // This is done so that `Clear Filters` does not appear on click of list view.
    if (this.state.mapView) {
      oldFilter.NEPoint = [];
      oldFilter.SWPoint = [];
      // This is done to empty coords from URL on click of list view.
      browserHistory.push({ pathname: "" });
    }
    oldFilter.is_map_view = !this.state.mapView;
    this.setState({
      mapView: !this.state.mapView,
      filters: oldFilter
    });

    this.scrollTo();
    // scroller.scrollMore(10);
  };

  scrollTo(name) {
    scroller.scrollTo(name || "content-container", {
      duration: 800,
      delay: 0,
      offset: 5,
      smooth: "easeInOutQuart"
    });
  }

  getMyCurrentLocation = args => {
    const { popUp } = this.props;
      if (navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            let geolocate = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            let latlng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            let geocoder = new google.maps.Geocoder();
            let coords = [];
            coords[0] = position.coords.latitude || config.defaultLocation[0];
            coords[1] = position.coords.longitude || config.defaultLocation[1];
            geocoder.geocode({ latLng: latlng }, (results, status) => {
              let sLocation = "near by me";
              let oldFilters = { ...this.state.filters };
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  let place = results[0];
                  // coords.NEPoint = [place.geometry.bounds.b.b, place.geometry.bounds.b.f];
                  // coords.SWPoint = [place.geometry.bounds.f.b,place.geometry.bounds.f.f];
                  sLocation = results[0].formatted_address;
                  oldFilters["coords"] = coords;
                  oldFilters["locationName"] = this._getNormalizedLocation(
                    results[0].address_components
                  );
                  oldFilters["applyFilterStatus"] = true;
                }
              }
              this.setState({
                filters: oldFilters,
                //   locationName: `your location`,
                //   defaultLocation: sLocation,
                isLoading: false
              });
            });
            // Toggle map view on click of `Browse classes near by me`
            // if(!args) {
            if (!args.noMapView) this.handleToggleMapView();
            // }
            // toastr.success("Showing classes around you...","Found your location");
            // // Session.set("coords",coords)
          },
          err => {
            const geolocationError = this._handleGeoLocationError(err);
            if (geolocationError) {
              popUp.appear("alert", { content: geolocationError }, true, {
                autoClose: true,
                autoTimeout: 4000
              });
            }
          }
        );
      }
    
  };

  handleSeeMore = categoyName => {
    // Attach count with skill cateory name so that see more functionlity can work properly.
    let oldFilter = { ...this.state.filters };
    let categoryFilter = oldFilter.skillCategoryClassLimit || {};
    categoryFilter[categoyName] =
      (categoryFilter[categoyName] &&
        categoryFilter[categoyName] + config.seeMoreCount) ||
      2 * config.seeMoreCount;
    oldFilter.skillCategoryClassLimit = categoryFilter;
    this.setState({ filters: oldFilter });
  };

  handleLocationSearch = locationText => {
    this.setState({
      filters: {
        ...this.state.filters,
        locationText
      }
    });
  };

  handleSkillTypeSearch = (skillTypeText, updateKey1, updateKey2) => {
    this.setState({
      filters: {
        ...this.state.filters,
        skillTypeText
      }
    });
  };

  setSchoolIdFilter = ({ schoolId }) => {
    let oldFilters = { ...this.state.filters };
    oldFilters.schoolId = schoolId;
    this.setState({ filters: oldFilters });
  };

  handleFiltersDialogBoxState = state => {
    this.setState({
      filterPanelDialogBox: state
    });
  };

  resetLocationInput = () => {
    this.setState({
      ...this.state,
      filters: { ...this.state.filters, locationName: "", coords: null }
    });
  };

  onLocationChange = (location, updateKey1, updateKey2) => {
    let stateObj = {};
    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        coords: location.coords,
        locationName: location.fullAddress,
        applyFilterStatus: true,
        schoolId: null
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        coords: location.coords,
        locationName: location.fullAddress
      };
    }

    this.setState({ ...stateObj, locationName: false, defaultLocation: false });
  };

  locationInputChanged = (event, updateKey1, updateKey2) => {
    let stateObj = {};
    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        coords: null,
        locationName: event.target.value
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        coords: null,
        locationName: event.target.value
      };
    }

    this.setState(stateObj);
  };

  fliterSchoolName = (event, updateKey1, updateKey2) => {
    let stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        schoolName: event.target.value,
        applyFilterStatus: true,
        schoolId: null
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        schoolName: event.target.value
      };
    }

    this.setState(stateObj);
  };

  collectSelectedSkillCategories = (text, updateKey1, updateKey2) => {
    let stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        skillCategoryIds: text.map(ele => ele._id),
        defaultSkillCategories: text,
        applyFilterStatus: true
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        skillCategoryIds: text.map(ele => ele._id),
        defaultSkillCategories: text
      };
    }

    this.setState(stateObj);
  };

  collectSelectedSkillSubject = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter.skillSubjectIds = text.map(ele => ele._id);
    oldFilter.defaultSkillSubject = text;
    this.setState({ filters: oldFilter });
  };

  skillLevelFilter = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter.experienceLevel = text;
    this.setState({ filters: oldFilter });
  };

  filterGender = event => {
    let oldFilter = { ...this.state.filters };
    oldFilter.gender = event.target.value;
    this.setState({ filters: oldFilter });
  };

  filterAge = event => {
    let oldFilter = { ...this.state.filters };
    oldFilter.age = parseInt(event.target.value);
    this.setState({ filters: oldFilter });
  };

  perClassPriceFilter = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter._classPrice = text;
    this.setState({ filters: oldFilter });
  };

  pricePerMonthFilter = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter._monthPrice = text;
    this.setState({ filters: oldFilter });
  };

  removeAllFilters = (displayInitialPosition = false) => {
    this.setState(() => ({
      filters: {},
      tempFilters: {}
    }));
    if (displayInitialPosition) {
      this.getMyCurrentLocation();
    }
  };

  handleMemberInvitedDialogBoxState = state => {
    this.setState({ memberInvitedDialogBox: state });
  };

  renderFilterPanel = () => {
    return (
      <FilterPanel
        removeAllFilters={this.removeAllFilters}
        mapView={this.state.mapView}
        filters={this.state.filters}
        tempFilters={this.state.tempFilters}
        stickyPosition={this.state.sticky}
        handleToggleMapView={this.handleToggleMapView}
        handleShowMoreFiltersButtonClick={() =>
          this.handleFiltersDialogBoxState(true)
        }
        handleNoOfFiltersClick={() => this.handleFiltersDialogBoxState(true)}
        onLocationChange={this.onLocationChange}
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
    );
  };

  showAppliedTopFilter = () => {
    const filtersData = this.state.filters;
    for (var prop in filtersData) {
      if (!isEmpty(filtersData[prop])) {
        return this.showText("Clear All Filters", this.deleteFilterText);
      }
    }
    // const { locationText, skillTypeText } = this.state.filters;
    // // let appliedTopFilterText = "Showing result for "

    // let keyword;
    // if (locationText && skillTypeText) {
    //     text = `Showing result for ${skillTypeText} in ${locationText}`
    //     return this.showText(text, this.deleteFilterText);
    // } else if (locationText) {
    //     text = `Showing result in ${locationText}`
    //     return this.showText(text, this.deleteFilterText);
    // } else if (skillTypeText) {
    //     text = `Showing result for ${skillTypeText}`
    //     return this.showText(text, this.deleteFilterText);
    // }
  };
  showText = (text, cb) => {
    return (
      <FilterApplied>
        {/*<FilterAppliedDivs>
                    Filters in use.
                </FilterAppliedDivs>*/}
        <FilterAppliedDivs marginRight="16">
          <FormGhostButton
            fullWidth
            noMar360con
            iconName="close"
            label="Clear All Filters"
            onClick={cb}
          />

          {/*<div>
                        {text}
                    </div>
                    <Icon onClick={cb}>close</Icon>*/}
        </FilterAppliedDivs>
        <FilterAppliedDivs>
          <FormGhostButton
            darkGreyColor
            fullWidth
            noMarginBottom
            icon
            iconName="tune"
            label="View Filters"
            onClick={() => this.handleFiltersDialogBoxState(true)}
          />

          {/*<div style={{padding:8}}>
                    View Filters
                    </div>
                    <Button fab mini onClick={() => this.handleFiltersDialogBoxState(true)}>
                       <Icon>tune </Icon>
                    </Button>*/}
        </FilterAppliedDivs>
      </FilterApplied>
    );
  };
  // Delete `skillTypeText` and `locationText` from filters.
  deleteFilterText = () => {
    this.setState({
      filters: {},
      tempFilters: {},
      resetMainSearch: !this.state.resetMainSearch
    });
  };
  // showAppliedLocationFilter = () => {
  //     const { locationName } = this.state.filters;
  //     if (locationName) {
  //         text = `Showing classes near you (${locationName})`;
  //         return this.showText(text, this.clearDefaultLocationFilter);
  //     }
  // }

  clearDefaultLocationFilter = () => {
    stateObj = this.state.filters;
    stateObj.coords = null;
    stateObj.locationName = "";
    this.setState({ filters: stateObj });
  };

  handleFiltersDialogSaveButtonClick = () => {
    this.handleFiltersDialogBoxState(false);
    this.scrollTo();
  };

  checkIfAnyFilterIsApplied = () => {
    const { filters } = this.state;
    // debugger;
    if (isEmpty(filters)) {
      return false;
    } else {
      if (
        filters.skillTypeText ||
        filters.applyFilterStatus ||
        filters.locationName ||
        filters.experienceLevel
      )
        return true;
      else return false;
    }
  };

  getOuterWrapperPadding = () => {
    if (
      !this.state.mapView &&
      this.checkIfAnyFilterIsApplied() &&
      this.state.sticky
    ) {
      return 96; // Size of filter bar + buttons
    } else if (!this.state.mapView && this.checkIfAnyFilterIsApplied()) {
      return 96; // if any filter is applied
    } else if (!this.state.mapView && this.state.sticky) {
      // size without buttons..
      return 72;
    } else {
      return 0; // if no filter is applied
    }
  };

  render() {


    return (
      <Fragment>
        <Suspense fallback={<Preloader />}>
          <DocumentTitle title={this.props.route.name}>
            <div>
              {this.state.filterPanelDialogBox && (
                <FiltersDialogBox
                  open={this.state.filterPanelDialogBox}
                  onModalClose={() => this.handleFiltersDialogBoxState(false)}
                  filterPanelProps={{
                    isCardsBeingSearched: this.state.isCardsBeingSearched,
                    currentAddress: this.state.locationName,
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
                    collectSelectedSkillCategories: this
                      .collectSelectedSkillCategories,
                    collectSelectedSkillSubject: this.collectSelectedSkillSubject,
                    handleSkillTypeSearch: this.handleSkillTypeSearch,
                    skillTypeText: this.state.filters.skillTypeText,
                    handleFiltersDialogBoxState: this.handleFiltersDialogBoxState,
                    handleFiltersDialogSaveButtonClick: this
                      .handleFiltersDialogSaveButtonClick
                  }}
                />
              )}
              {/* Cover */}
              <CoverWrapper>
                <Cover
                  polytheneVerticalFlow
                  itemScope
                  itemType="http://schema.org/WPHeader"
                >
                  <BrandBar
                    positionStatic
                    currentUser={this.props.currentUser}
                    isUserSubsReady={this.props.isUserSubsReady}
                  />
                  <SearchArea
                    onLocationInputChange={this.handleLocationSearch}
                    onSkillTypeChange={this.handleSkillTypeSearch}
                    onFiltersButtonClick={() =>
                      this.handleFiltersDialogBoxState(true)
                    }
                    handleNoOfFiltersClick={() =>
                      this.handleFiltersDialogBoxState(true)
                    }
                    getMyCurrentLocation={this.getMyCurrentLocation}
                    onMapViewButtonClick={this.handleToggleMapView}
                    mapView={this.state.mapView}
                    locationInputChanged={this.locationInputChanged}
                    filters={this.state.filters}
                    resetLocationInput={this.resetLocationInput}
                    onLocationChange={this.onLocationChange}
                    currentFilterState={this.state.filters}
                    collectSelectedSkillCategories={
                      this.collectSelectedSkillCategories
                    }
                    collectSelectedSkillSubject={this.collectSelectedSkillSubject}
                    onSearchIconClick={() =>{
                      this.getMyCurrentLocation()
                      this.scrollTo()
                    }}
                  />
                </Cover>
              </CoverWrapper>

              {/* Filter Panel */}
              <FilterPanelWrapper>
                <Sticky innerZ={10} onStateChange={this.handleStickyStateChange}>
                  {this.state.mapView ? (
                    this.renderFilterPanel()
                  ) : (
                      <FilterBarDisplayWrapper sticky={this.state.sticky}>
                        {this.renderFilterPanel()}
                      </FilterBarDisplayWrapper>
                    )}
                </Sticky>
              </FilterPanelWrapper>

              {/*Cards List */}
              <Element
                name="content-container"
                className="element homepage-content"
              >
                {/* Applied Filters */}
                <ClassTypeCardsPush height={this.getOuterWrapperPadding()} />
                <ClassTypeOuterWrapper padding="0">
                  {!this.state.mapView &&
                    this.checkIfAnyFilterIsApplied() &&
                    this.showAppliedTopFilter()}
                  <ClassTypeList
                    landingPage={true}
                    handleIsCardsSearching={this.handleIsCardsSearching}
                    getMyCurrentLocation={this.getMyCurrentLocation}
                    defaultLocation={this.state.defaultLocation}
                    mapView={this.state.mapView}
                    filters={this.state.filters}
                    tempFilters={this.state.tempFilters}
                    handleSeeMore={this.handleSeeMore}
                    splitByCategory={true}
                    setSchoolIdFilter={this.setSchoolIdFilter}
                    appliedTopFilter={
                      this.checkIfAnyFilterIsApplied() &&
                      this.showAppliedTopFilter()
                    }
                    onSearchAgainButtonClick={this.setFilters}
                    removeAllFilters={this.removeAllFilters}
                    {...this.props}
                  />
                </ClassTypeOuterWrapper>
              </Element>
              {!this.state.mapView && <Footer mapView={this.state.mapView} />}
              {this.state.mapView && (
                <FloatingMapButtonWrapper>
                  <FloatingChangeViewButton
                    onListButtonClick={this.handleToggleMapView}
                  />
                </FloatingMapButtonWrapper>
              )}
            </div>
          </DocumentTitle>
        </Suspense>
      </Fragment>
    );
  }
}

export default withRouter(withPopUp(Landing));
