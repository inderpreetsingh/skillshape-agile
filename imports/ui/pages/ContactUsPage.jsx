import React , {Fragment,Component} from 'react';
import styled from 'styled-components';
import {isEmpty} from 'lodash';

import { createMarkersOnMap } from '/imports/util';

import BrandBar from '/imports/ui/components/landing/components/BrandBar';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';

import ContactUsForm from '/imports/ui/components/landing/components/contactUs/ContactUsForm.jsx';
import ClassMap from '/imports/ui/components/landing/components/map/ClassMap.jsx';
import MapView from '/imports/ui/components/landing/components/map/mapView.jsx';
import SocialAccounts from '/imports/ui/components/landing/components/contactUs/SocialAccounts.jsx';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { siteAddress } from '/imports/ui/components/landing/site-settings.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  text-align: center;
  line-height: 1;
  margin: ${helpers.rhythmDiv * 8}px 0;
  padding: 0 ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 2}px;
  }
`;

const FormMapWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: ${helpers.rhythmDiv * 8}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    flex-direction: column;
    align-items: center;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding: 0;
  }
`;

const MapOuterContainer = styled.div`
  max-width: 600px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  padding-right: 0;
  width: 100%;
  ${helpers.flexCenter}
  flex-direction: column;

  @media screen and (max-width : ${helpers.tablet + 50}px) {
    padding: 0;
  }

  @media screen and (max-width: ${helpers.mobile + 50}) {
    min-width: 0;
  }
`;

const MapContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: 400px;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    max-width: 100%;
  }
`;

const ContentWrapper = styled.div`

`;

const MyMap = styled.div`
  width: 100%;
  height: 100%;
`;

class ContactUs extends Component {

  state = {
    userLocation: {},
  }

  getMyCurrentLocation = () => {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: siteAddress}, (results, status) => {
        let sLocation = "near by me";
        let userLocation = { };
        let coords = { };
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            userLocation = this._createUserLocationFromAddress(results[0].address_components);
            coords[0] = results[0].geometry.location.lat();
            coords[1] = results[0].geometry.location.lng();
          }
        }

        const newUserLocation = {
          ...userLocation,
          loc: coords,
          id: results[0].place_id
        }

        this.setState({ userLocation: newUserLocation});
    });
  }

  _createUserLocationFromAddress = (addressComponents) => {
    const localityComponents = ['street_number','route','sublocality','locality'];
    const COUNTRY = 'country';
    const CITY = 'administrative_area_level_1';

    let country = ``;
    let city = ``;
    let locality = ``;

    for(addressComponent of addressComponents) {

      if(addressComponent.types.indexOf(COUNTRY) != -1) {
        country += addressComponent.long_name;
      }else if(addressComponent.types.indexOf(CITY) != -1) {
        city += addressComponent.long_name;
      }else {
        localityComponents.forEach(component => {
          if(addressComponent.types.indexOf(component) != -1) {
            locality += addressComponent.long_name + (component === 'locality' ? '' : ', ');
          }
        });
      }
    }

    return {
      address : locality,
      city,
      country
    }

  }

  componentDidMount = () => {
    this.getMyCurrentLocation();
  }

  componentDidUpdate = () => {
    // console.info('component updating.............',this.state);
    if(!isEmpty(this.state.userLocation)) {
      createMarkersOnMap("contact-page-map", [this.state.userLocation]);
    }
  }

  render() {
    // console.info('--------------------------------------------------------',this.state, "------ contact us page");
    console.info('--- contact us page props --->',this.props, this.state);
    return(<Wrapper>

      {/* Brand Bar at Top */}
      <BrandBar navBarHeight="70" positionStatic={true}
        currentUser={this.props.currentUser}
        isUserSubsReady={this.props.isUserSubsReady}/>

      {/* Content section including form and map and social accounts*/}
      <ContentWrapper>
        <Title>We would love to talk with you</Title>

        <FormMapWrapper>
          <ContactUsForm />

          <MapOuterContainer>
            <MapContainer>
              <MyMap id="contact-page-map" />
            </MapContainer>

            <SocialAccounts />
          </MapOuterContainer>

        </FormMapWrapper>
      </ContentWrapper>

      {/* Footer */}
      <Footer />
    </Wrapper>);
  }
}

export default ContactUs;
