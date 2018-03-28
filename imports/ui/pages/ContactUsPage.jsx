import React , {Fragment} from 'react';
import styled from 'styled-components';

import BrandBar from '../components/landing/components/BrandBar';
import Footer from '../components/landing/components/footer/index.jsx';

import ContactUsForm from '../components/landing/components/contactUs/ContactUsForm.jsx';
import ClassMap from '../components/landing/components/map/ClassMap.jsx';

import SocialAccounts from '../components/landing/components/contactUs/SocialAccounts.jsx';

import * as helpers from '../components/landing/components/jss/helpers.js';

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


const ContactUs = () => (<Wrapper>
    <BrandBar
      navBarHeight="70"
      positionStatic={true}
    />

    <ContentWrapper>
      <Title>We would love to talk with you</Title>

      <FormMapWrapper>
        <ContactUsForm />

        <MapOuterContainer>
          <MapContainer>
            <ClassMap />
          </MapContainer>

          <SocialAccounts />
        </MapOuterContainer>

      </FormMapWrapper>
    </ContentWrapper>

    <Footer />

  </Wrapper>
);

export default ContactUs;
