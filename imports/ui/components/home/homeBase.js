import React from 'react';
import ListView from '/imports/ui/components/listView';
import { initializeMap } from '/imports/util';
import { Session } from 'meteor/session';

export default class HomeBase extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      gridView: true,
      mapView: false,
      scrollOnId: null,
      listClass: "col-lg-3 col-md-4", // for default list-view
      listContainerClass: "row",
      isLoading: true,
      currentAddress: null,
      filters: {
        coords: null
      },
    }
    this.onSearch = _.debounce(this.onSearch, 1000);
    this.onSearchTag = _.debounce(this.onSearchTag, 1000);
  }

  componentDidMount() {
    $(window).off('scroll');
    $('.main-panel').off('scroll');
    $('#UserMainPanel').off('scroll');
    $(window).scroll(this.fixedHeader);
    $('#UserMainPanel').scroll(this.fixedHeader)
    $('.main-panel').scroll(this.fixedHeader);
  }

  componentWillMount() {
    this.getMyCurrentLocation()
  }

  componentWillUnmount() {
    Session.set("pagesToload",1)
  }

  fixedHeader = () => {
    if (window.innerWidth>767){
      if ($("#UserMainPanel").scrollTop() >= 200) {
        $('#scr_affix').addClass('fixed-header');
        if($('.sidebar').length > 0)
          $('#scr_affix').css({'position': 'relative', 'top': ($("#UserMainPanel").scrollTop() - 100)+'px'});
      } else {
        $('#scr_affix').removeClass('fixed-header');
        $('#scr_affix').attr('style','')
      }
    }
  }

  getMyCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let geocoder = new google.maps.Geocoder();
      let coords = [];
      coords[0] = position.coords.latitude
      coords[1] = position.coords.longitude
      geocoder.geocode({'latLng': latlng}, (results, status) => {
        let sLocation = "near by me";
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            sLocation = results[0].formatted_address
            // Session.set("SLocation",results[0].formatted_address)
          } 
        }
        this.setState({
          filters: {coords: [52.3702157, 4.8951]},
          currentAddress: sLocation,
          isLoading: false,
        })
      });
      toastr.success("Showing classes around you...","Found your location");
      // Session.set("coords",coords)
    })
  }

  handleListView = () => {
    $("#view_list").addClass("btn-custom-active");
    $("#map_view").removeClass("btn-custom-active");
    this.setState({
      gridView: true,
      mapView: false,
      listClass: "col-lg-3 col-md-4",
      listContainerClass: "row",
      scrollOnId: null,
    })
  }

  handleMapView = () => {
    $("#map_view").addClass("btn-custom-active");
    $("#view_list").removeClass("btn-custom-active");
    this.setState({
      gridView: false,
      mapView: true,
      listClass: "col-lg-6 col-md-6",
      listContainerClass: "col-md-6 map-view-container",
      scrollOnId: "skillList",
    })
  }

  onSearch = (filterRef) => {
    let oldFilters = {...this.state.filters};
    console.log("onSearch fn oldFilters",oldFilters)
    
    oldFilters.textSearch = filterRef.schoolName.value;
    oldFilters.skill = filterRef.typeOfSkill.value;
    oldFilters._classPrice = filterRef._classPrice;
    oldFilters._monthPrice = filterRef._monthPrice
    oldFilters.coords = filterRef.coords;
    
    this.setState({filters: oldFilters})
  }

  onSearchTag = (tagValue) => {
    let oldFilters = {...this.state.filters};
    oldFilters.selectedTag = tagValue 
    
    // console.log("onSearchTag fn called",oldFilters)
    this.setState({filters: oldFilters})
  }
}
