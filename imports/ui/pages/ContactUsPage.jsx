import React , {Fragment} from 'react';
import styled from 'styled-components';

import BrandBar from '../components/landing/components/BrandBar';
import Footer from '../components/landing/components/footer/index.jsx';

import ContactUsForm from '../components/landing/components/contactUs/ContactUsForm.jsx';
import ClassMap from '../components/landing/components/map/ClassMap.jsx';

import * as helpers from '../components/landing/components/jss/helpers.js';

const Title = styled.h1`
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  text-align: center;
  margin: 0;
  margin-top: ${helpers.rhythmDiv * 8}px;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

const FormMapWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: ${helpers.rhythmDiv * 4}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MapOuterContainer = styled.div`
  width: 600px;
  display: flex;
  justify-content: center;
`;

const MapContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: 400px;
`;

const ContactUs = () => (
  <Fragment>
    <BrandBar
      navBarHeight="70"
      positionStatic={true}
    />

    <Title>We would love to talk with you</Title>

    <FormMapWrapper>

      <ContactUsForm />

      <MapOuterContainer>
        <MapContainer>
          <ClassMap />
        </MapContainer>
      </MapOuterContainer>

    </FormMapWrapper>
    <Footer />
  </Fragment>
);

export default ContactUs;
